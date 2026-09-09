"use client";

import { useState } from "react";
import { CONTACT } from "@/lib/archive";

const empty = {
  name: "",
  email: "",
  company: "",
  website: "",
  improve: "",
  bottleneck: CONTACT.bottlenecks[0],
  budget: CONTACT.budgets[2],
  collaboration: CONTACT.collaboration[1],
};

export function ContactForm() {
  const [values, setValues] = useState(empty);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);

  function update(key: keyof typeof empty, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (!values.name.trim() || !values.email.includes("@") || values.improve.trim().length < 12) {
      setError("Name, a work email and a short note on what you want to improve are required.");
      return;
    }
    setPending(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("send failed");
      setDone(true);
    } catch {
      setError("The signal did not send. Write directly and I will pick it up.");
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div className="brief__success">
        <p className="kicker">TRANSMISSION</p>
        <h2>Signal received.</h2>
        <p>I will review the system and get back to you.</p>
      </div>
    );
  }

  return (
    <form className="brief" onSubmit={submit} noValidate>
      <label>
        Name
        <input value={values.name} onChange={(event) => update("name", event.target.value)} required />
      </label>
      <label>
        Work email
        <input type="email" value={values.email} onChange={(event) => update("email", event.target.value)} required />
      </label>
      <label>
        Company
        <input value={values.company} onChange={(event) => update("company", event.target.value)} />
      </label>
      <label>
        Website
        <input value={values.website} onChange={(event) => update("website", event.target.value)} />
      </label>
      <label className="is-wide">
        What are you trying to improve?
        <textarea rows={5} value={values.improve} onChange={(event) => update("improve", event.target.value)} required />
      </label>
      <label>
        Current biggest growth bottleneck
        <select value={values.bottleneck} onChange={(event) => update("bottleneck", event.target.value)}>
          {CONTACT.bottlenecks.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>
      <label>
        Monthly paid media budget range
        <select value={values.budget} onChange={(event) => update("budget", event.target.value)}>
          {CONTACT.budgets.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>
      <fieldset className="is-wide">
        <legend>Preferred collaboration type</legend>
        <div className="brief__choices">
          {CONTACT.collaboration.map((item) => (
            <label key={item} className="brief__choice">
              <input
                type="radio"
                name="collaboration"
                checked={values.collaboration === item}
                onChange={() => update("collaboration", item)}
              />
              {item}
            </label>
          ))}
        </div>
      </fieldset>
      {error ? <p className="brief__error">{error}</p> : null}
      <button type="submit" className="btn" data-cursor="start-brief" disabled={pending}>
        {pending ? "SENDING…" : "SEND SIGNAL"}
      </button>
    </form>
  );
}
