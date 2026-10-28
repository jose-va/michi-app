import { CONFIRMED_SCHEDULE } from "@/common/utils/home-content";

const OPENING_HOURS = [
  { days: CONFIRMED_SCHEDULE.monday.days, time: CONFIRMED_SCHEDULE.monday.hours.join(" y ") },
  {
    days: CONFIRMED_SCHEDULE.tuesdayToSaturday.days,
    time: CONFIRMED_SCHEDULE.tuesdayToSaturday.hours.join(" y "),
  },
  { days: CONFIRMED_SCHEDULE.sunday.days, time: CONFIRMED_SCHEDULE.sunday.status },
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
