import { getDetailedScheduleRows } from "@/common/utils/home-content";

export default function OpeningHours() {
  return (
    <dl className="space-y-2 text-xs">
      {getDetailedScheduleRows().map(({ days, services, status }) => (
        <div key={days}>
          <dt className="text-muted-foreground">{days}</dt>
          {status ? (
            <dd className="font-semibold text-red-700">{status}</dd>
          ) : (
            services
              .filter(({ label }) => label !== "Desayuno")
              .map(({ label, time }) => (
                <dd key={label} className="text-primary font-semibold brightness-150">
                  <span className="font-normal text-white">
                    {label}:{" "}
                  </span>
                  {time}
                </dd>
              ))
          )}
        </div>
      ))}
    </dl>
  );
}
