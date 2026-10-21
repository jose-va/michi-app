const OPENING_HOURS = [
  { days: "Lunes a sábado", time: "08:00–16:00 y 20:00–23:00" },
  { days: "Domingo", time: "Cerrado" },
] as const;

export default function OpeningHours() {
  return (
    <dl className="space-y-2 text-xs">
      {OPENING_HOURS.map(({ days, time }) => (
        <div key={days}>
          <dt className="text-muted-foreground">{days}</dt>
          <dd className="text-foreground/90">{time}</dd>
        </div>
      ))}
    </dl>
  );
}
