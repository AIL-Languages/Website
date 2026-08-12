"use client";

import { experienceStats } from "@/lib/director/data";
import { AnimatedCounter } from "@/components/director/AnimatedCounter";

export function ExperienceStats() {
  return (
    <ul className="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2">
      {experienceStats.map((stat, index) => (
        <li
          key={stat.id}
          className="rounded-2xl border border-[color:var(--border)] bg-card px-4 py-4 transition duration-300 hover:-translate-y-0.5 hover:border-ail-cyan/50"
          style={{ animationDelay: `${index * 60}ms` }}
        >
          <p className="font-display text-2xl font-bold text-ail-blue dark:text-ail-cyan">
            <AnimatedCounter
              value={stat.value}
              prefix={stat.prefix}
              suffix={stat.suffix}
            />
          </p>
          <p className="mt-1 text-xs font-medium leading-snug text-muted">
            {stat.label}
          </p>
        </li>
      ))}
    </ul>
  );
}
