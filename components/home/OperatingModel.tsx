"use client";

import { useState } from "react";
import { GROWTH_PROBLEMS } from "@/lib/archive";

export function OperatingModel() {
  const [active, setActive] = useState(GROWTH_PROBLEMS[0].id);
  const problem = GROWTH_PROBLEMS.find((item) => item.id === active) ?? GROWTH_PROBLEMS[0];

  return (
    <section id="operating-model" className="model">
      <div className="section-head">
        <p className="kicker">05 / THE OPERATING MODEL</p>
        <h2>Growth problems are rarely channel problems.</h2>
        <p className="lede">Choose the signal you are seeing. The system shows where I would investigate first.</p>
      </div>
      <div className="model__layout">
        <ul className="model__signals">
          {GROWTH_PROBLEMS.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className={item.id === active ? "is-on" : undefined}
                data-cursor="inspect"
                onClick={() => setActive(item.id)}
              >
                {item.title}
              </button>
            </li>
          ))}
        </ul>
        <div className="model__path" key={problem.id}>
          <p className="kicker">{problem.title.toUpperCase()}</p>
          <ol>
            {problem.steps.map((step) => (
              <li key={step.label}>
                <span>↓</span>
                {step.label}
              </li>
            ))}
            <li className="is-end">
              <span>↓</span>
              Measurable leaks found
            </li>
          </ol>
          <p className="model__end">{problem.conclusion}</p>
        </div>
      </div>
    </section>
  );
}
