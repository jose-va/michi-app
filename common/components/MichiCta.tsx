import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/shadcn/components/button";
import { cn } from "@/lib/utils";

const base =
  "group gap-2 rounded-full font-semibold transition-all duration-300 ease-out " +
  "active:scale-95 focus-visible:ring-2 focus-visible:ring-michi-sake " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950 " +
  "motion-reduce:transition-none";

const variants = {
  hero:
  "min-h-11 px-5 text-sm md:min-h-14 md:px-9 md:text-lg " +
  "bg-michi-sake hover:bg-michi-sake! text-stone-950 " +
  "shadow-xl shadow-michi-sake/30 hover:-translate-y-0.5 hover:shadow-2xl " +
  "hover:shadow-michi-sake/50 hover:brightness-110",
  glass:
    "min-h-12 px-6 text-base md:min-h-14 md:px-9 md:text-lg " +
    "border border-white/20 bg-white/10 text-white " +
    "shadow-lg backdrop-blur hover:-translate-y-0.5 hover:bg-white/20",
  section:
    "min-h-12 px-7 text-base bg-michi-sake hover:bg-michi-sake! text-stone-950 " +
    "shadow-lg shadow-michi-sake/20 hover:-translate-y-0.5 " +
    "hover:shadow-michi-sake/40 hover:brightness-110",
};

type Props = {
  href: string;
  label: string;
  variant?: keyof typeof variants;
  arrow?: boolean;
  className?: string;
};

export function MichiCta({
  href,
  label,
  variant = "section",
  arrow = true,
  className,
}: Props) {
  return (
    <Button asChild size="lg" className={cn(base, variants[variant], className)}>
      <Link href={href}>
        {label}
        {arrow && (
          <ArrowRight
            aria-hidden
            className="size-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
          />
        )}
      </Link>
    </Button>
  );
}