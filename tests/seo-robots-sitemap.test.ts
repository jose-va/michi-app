import assert from "node:assert/strict";
import { describe, it } from "node:test";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";

const BASE_URL = "https://michisushigranada.es";

describe("SEO robots.txt", () => {
  it("permite todo y declara el sitemap canónico apex", () => {
    const result = robots();
    assert.equal(result.sitemap, `${BASE_URL}/sitemap.xml`);
    const rules = Array.isArray(result.rules)
      ? result.rules
      : [result.rules];
    assert.equal(rules.length, 1);
    assert.equal(rules[0].userAgent, "*");
    assert.equal(rules[0].allow, "/");
  });

  it("bloquea rutas privadas, API y auth", () => {
    const result = robots();
    const rules = Array.isArray(result.rules)
      ? result.rules
      : [result.rules];
    const disallow = rules[0].disallow;
    const list = Array.isArray(disallow) ? disallow : [disallow];
    for (const path of [
      "/reservation/edit",
      "/reservation/preview",
      "/product/create",
      "/product/update",
      "/api/",
      "/auth",
    ]) {
      assert.ok(
        list?.includes(path),
        `disallow debe incluir ${path}`
      );
    }
  });
});

describe("SEO sitemap.xml", () => {
  it("contiene las 9 rutas públicas con base apex", () => {
    const entries = sitemap();
    assert.equal(entries.length, 9);
    const urls = entries.map((entry) => entry.url);
    for (const path of [
      "/",
      "/product",
      "/reservation",
      "/location",
      "/about",
      "/cancelar",
      "/aviso-legal",
      "/cookies",
      "/privacidad",
    ]) {
      assert.ok(urls.includes(`${BASE_URL}${path === "/" ? "/" : path}`));
    }
  });

  it("usa prioridades y frecuencias aprobadas", () => {
    const entries = sitemap();
    const byUrl = new Map(entries.map((entry) => [entry.url, entry]));
    assert.deepEqual(
      [byUrl.get(`${BASE_URL}/`)?.priority, byUrl.get(`${BASE_URL}/`)?.changeFrequency],
      [1, "weekly"]
    );
    assert.deepEqual(
      [byUrl.get(`${BASE_URL}/product`)?.priority, byUrl.get(`${BASE_URL}/product`)?.changeFrequency],
      [0.9, "weekly"]
    );
    assert.deepEqual(
      [byUrl.get(`${BASE_URL}/reservation`)?.priority, byUrl.get(`${BASE_URL}/reservation`)?.changeFrequency],
      [0.8, "monthly"]
    );
    assert.deepEqual(
      [byUrl.get(`${BASE_URL}/location`)?.priority, byUrl.get(`${BASE_URL}/location`)?.changeFrequency],
      [0.8, "monthly"]
    );
    assert.deepEqual(
      [byUrl.get(`${BASE_URL}/about`)?.priority, byUrl.get(`${BASE_URL}/about`)?.changeFrequency],
      [0.6, "monthly"]
    );
    assert.deepEqual(
      [byUrl.get(`${BASE_URL}/cancelar`)?.priority, byUrl.get(`${BASE_URL}/cancelar`)?.changeFrequency],
      [0.4, "monthly"]
    );
    for (const path of ["/aviso-legal", "/cookies", "/privacidad"]) {
      assert.deepEqual(
        [byUrl.get(`${BASE_URL}${path}`)?.priority, byUrl.get(`${BASE_URL}${path}`)?.changeFrequency],
        [0.3, "yearly"]
      );
    }
  });

  it("usa fecha fija y no incluye rutas privadas", () => {
    const entries = sitemap();
    for (const entry of entries) {
      assert.equal(entry.lastModified, "2026-11-05");
      assert.ok(entry.url.startsWith(BASE_URL));
    }
    const urls = entries.map((entry) => entry.url);
    for (const path of [
      "/reservation/edit",
      "/reservation/preview",
      "/product/create",
      "/product/update",
    ]) {
      assert.ok(!urls.some((url) => url.includes(path)));
    }
  });
});
