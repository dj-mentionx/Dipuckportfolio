"use client";

import { useState } from "react";
import { SITE } from "@/lib/site";

type WriteDeskProps = {
  onSigned?: () => void;
};

const empty = { name: "", email: "", company: "", improve: "" };

export function WriteDesk({ onSigned }: WriteDeskProps) {
  const [values, setValues] = useState(empty);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);

  function update(key: keyof typeof empty, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function copyMail() {
    await navigator.clipboard.writeText(SITE.person.email);
    setCopied(true);
    onSigned?.();
    window.setTimeout(() => setCopied(false), 1600);
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (values.name.trim().length < 2 || !values.email.includes("@") || values.improve.trim().length < 12) {
      setError("Name, a work email and a short note on what you want to move are required.");
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
      onSigned?.();
    } catch {
      setError("The brief did not send. Write the email. I will pick it up.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="write">
      <div className="write__direct">
        <p>Or write directly.</p>
        <button type="button" className="chapter__mail" onClick={copyMail}>
          {SITE.person.email}
          <span>{copied ? "copied" : "copy"}</span>
        </button>
        <a href={SITE.person.linkedin} target="_blank" rel="noreferrer">
          {SITE.person.linkedinLabel}
        </a>
      </div>

      {done ? (
        <div className="write__done">
          <p className="chapter__kicker">BRIEF IN</p>
          <p>Received. I will read it and write back.</p>
        </div>
      ) : (
        <form className="write__form" onSubmit={submit} noValidate>
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
          <label className="is-wide">
            What is not moving?
            <textarea rows={4} value={values.improve} onChange={(event) => update("improve", event.target.value)} required />
          </label>
          {error ? <p className="write__err">{error}</p> : null}
          <button type="submit" className="chapter__cta" disabled={pending}>
            {pending ? "Sending…" : "Send the brief"}
          </button>
        </form>
      )}
    </div>
  );
}
