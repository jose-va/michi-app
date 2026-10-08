import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  AUTOPLAY_INTERVAL_MS,
  REDUCED_MOTION_QUERY,
  shouldAutoplay,
} from "../common/utils/home-autoplay";

const TOLERANCE_MS = 500;

const carouselSource = readFileSync(
  new URL("../common/components/ui/HomeCarousel.tsx", import.meta.url),
  "utf8",
);

function createFakeIntervalClock() {
  let time = 0;
  let nextHandle = 1;
  const intervals = new Map<
    number,
    { delay: number; next: number; callback: () => void }
  >();

  return {
    pending: () => intervals.size,
    setInterval(callback: () => void, delay: number) {
      const handle = nextHandle++;
      intervals.set(handle, { delay, next: time + delay, callback });
      return handle;
    },
    clearInterval(handle: number) {
      intervals.delete(handle);
    },
    tick(milliseconds: number) {
      const end = time + milliseconds;
      while (true) {
        let earliest: { handle: number; next: number } | undefined;
        for (const [handle, entry] of intervals) {
          if (entry.next <= end && (!earliest || entry.next < earliest.next)) {
            earliest = { handle, next: entry.next };
          }
        }
        if (!earliest) break;
        time = earliest.next;
        const entry = intervals.get(earliest.handle);
        if (!entry) continue;
        entry.next += entry.delay;
        entry.callback();
      }
      time = end;
    },
  };
}

function createMockApi() {
  return {
    calls: 0,
    scrollNext() {
      this.calls += 1;
    },
  };
}

interface AutoplayFlags {
  slideCount: number;
  hasPointer: boolean;
  hasFocus: boolean;
  prefersReducedMotion: boolean;
}

/** Replica fiel del efecto del componente: recrea el intervalo completo ante cada cambio. */
function mountAutoplayEffect(
  clock: ReturnType<typeof createFakeIntervalClock>,
  api: { scrollNext: () => void } | undefined,
  flags: AutoplayFlags,
) {
  let cleanup: (() => void) | undefined;
  const render = () => {
    cleanup?.();
    cleanup = undefined;
    if (
      !api ||
      !shouldAutoplay(
        flags.slideCount,
        flags.hasPointer,
        flags.hasFocus,
        flags.prefersReducedMotion,
      )
    ) {
      return;
    }
    const id = clock.setInterval(() => {
      api.scrollNext();
    }, AUTOPLAY_INTERVAL_MS);
    cleanup = () => clock.clearInterval(id);
  };
  render();
  return {
    update() {
      render();
    },
    unmount() {
      cleanup?.();
      cleanup = undefined;
    },
  };
}

test("avanza cada 5 segundos con tolerancia ±500 ms cuando está habilitado", () => {
  assert.equal(AUTOPLAY_INTERVAL_MS, 5000);
  assert.equal(shouldAutoplay(5, false, false, false), true);

  const clock = createFakeIntervalClock();
  const api = createMockApi();
  const effect = mountAutoplayEffect(clock, api, {
    slideCount: 5,
    hasPointer: false,
    hasFocus: false,
    prefersReducedMotion: false,
  });

  assert.equal(clock.pending(), 1);
  clock.tick(AUTOPLAY_INTERVAL_MS - TOLERANCE_MS - 1);
  assert.equal(api.calls, 0);
  clock.tick(TOLERANCE_MS + 1);
  assert.equal(api.calls, 1);
  clock.tick(AUTOPLAY_INTERVAL_MS);
  assert.equal(api.calls, 2);
  effect.unmount();
  assert.equal(clock.pending(), 0);
});

test("pausa con el puntero y reanuda solo con ambos cesados reiniciando 5 s completos", () => {
  const clock = createFakeIntervalClock();
  const api = createMockApi();
  const flags: AutoplayFlags = {
    slideCount: 5,
    hasPointer: false,
    hasFocus: false,
    prefersReducedMotion: false,
  };
  const effect = mountAutoplayEffect(clock, api, flags);

  clock.tick(2000);
  flags.hasPointer = true;
  effect.update();
  assert.equal(shouldAutoplay(5, true, false, false), false);
  assert.equal(clock.pending(), 0);
  clock.tick(8000);
  assert.equal(api.calls, 0);

  // Cesar solo el puntero no basta si el foco sigue dentro.
  flags.hasPointer = false;
  flags.hasFocus = true;
  effect.update();
  assert.equal(shouldAutoplay(5, false, true, false), false);
  assert.equal(clock.pending(), 0);
  clock.tick(5000);
  assert.equal(api.calls, 0);

  // Con ambos cesados reanuda con un intervalo completo, sin resto retenido.
  flags.hasFocus = false;
  effect.update();
  assert.equal(shouldAutoplay(5, false, false, false), true);
  clock.tick(AUTOPLAY_INTERVAL_MS - 1);
  assert.equal(api.calls, 0);
  clock.tick(1);
  assert.equal(api.calls, 1);
  effect.unmount();
});

test("movimiento reducido desactiva el autoplay con prioridad y al cesar reanuda 5 s completos", () => {
  assert.equal(shouldAutoplay(5, false, false, true), false);

  const clock = createFakeIntervalClock();
  const api = createMockApi();
  const flags: AutoplayFlags = {
    slideCount: 5,
    hasPointer: false,
    hasFocus: false,
    prefersReducedMotion: true,
  };
  const effect = mountAutoplayEffect(clock, api, flags);

  assert.equal(clock.pending(), 0);
  clock.tick(10000);
  assert.equal(api.calls, 0);

  flags.prefersReducedMotion = false;
  effect.update();
  assert.equal(clock.pending(), 1);
  clock.tick(AUTOPLAY_INTERVAL_MS - TOLERANCE_MS - 1);
  assert.equal(api.calls, 0);
  clock.tick(TOLERANCE_MS + 1);
  assert.equal(api.calls, 1);
  effect.unmount();
});

test("con 1 o 0 fotos no hay autoplay", () => {
  assert.equal(shouldAutoplay(1, false, false, false), false);
  assert.equal(shouldAutoplay(0, false, false, false), false);

  const clock = createFakeIntervalClock();
  const api = createMockApi();
  for (const slideCount of [1, 0]) {
    const effect = mountAutoplayEffect(clock, api, {
      slideCount,
      hasPointer: false,
      hasFocus: false,
      prefersReducedMotion: false,
    });
    assert.equal(clock.pending(), 0);
    clock.tick(10000);
    effect.unmount();
  }
  assert.equal(api.calls, 0);
  assert.match(carouselSource, /slideCount === 0/);
  assert.match(carouselSource, /return null/);
});

test("el componente usa setInterval 5 s con Embla y respeta matchMedia desde el arranque", () => {
  assert.equal(REDUCED_MOTION_QUERY, "(prefers-reduced-motion: reduce)");
  assert.match(carouselSource, /setInterval/);
  assert.match(carouselSource, /AUTOPLAY_INTERVAL_MS/);
  assert.match(carouselSource, /scrollNext/);
  assert.match(carouselSource, /clearInterval/);
  assert.match(carouselSource, /selectedScrollSnap/);
  assert.match(carouselSource, /REDUCED_MOTION_QUERY/);
  assert.match(carouselSource, /matchMedia/);
  assert.match(carouselSource, /addEventListener\("change"/);
});

test("no retiene tiempo restante ni expone avance manual programático", () => {
  for (const forbidden of [
    "home-carousel-controller",
    "advanceManually",
    "remainingDelay",
    "syncIndex",
    "deadline",
  ]) {
    assert.ok(
      !carouselSource.includes(forbidden),
      `HomeCarousel no debe contener ${forbidden}`,
    );
  }
});

test("el fallo de una foto no reinicia el intervalo", () => {
  const handler = carouselSource.match(
    /const handleImageError[\s\S]*?\n  \};/,
  );
  assert.ok(handler, "existe handleImageError");
  assert.ok(!handler[0].includes("Interval"));
  assert.ok(!handler[0].includes("scrollNext"));
});
