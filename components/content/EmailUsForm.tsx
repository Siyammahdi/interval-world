"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import helpTopics from "@/data/email-help-topics.json";
import { cn } from "@/lib/cn";

type Subject = {
  id: number;
  label: string;
  topics: { label: string; value: string }[];
};

const subjects = helpTopics as Subject[];

type FormState = {
  memberNo: string;
  emailAddress: string;
  firstName: string;
  lastName: string;
  exchangeNumber: string;
  helpSubject: string;
  helpTopic: string;
  comment: string;
};

const initial: FormState = {
  memberNo: "",
  emailAddress: "",
  firstName: "",
  lastName: "",
  exchangeNumber: "",
  helpSubject: "",
  helpTopic: "",
  comment: "",
};

const fieldClass =
  "h-12 w-full rounded border border-iw-border bg-white px-4 text-[14px] text-iw-ink outline-none transition-colors focus:border-iw-link";

const labelClass = "mb-1 block text-[14px] leading-[1.7] text-iw-ink";

/** E-mail Us form — Figma Customer Support / Email US */
export function EmailUsForm() {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const topics = useMemo(() => {
    const id = Number(form.helpSubject);
    return subjects.find((s) => s.id === id)?.topics ?? [];
  }, [form.helpSubject]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "helpSubject") next.helpTopic = "";
      return next;
    });
  }

  function validate(): string[] {
    const next: string[] = [];
    if (!form.emailAddress.trim()) next.push("Please enter a valid email address.");
    if (!form.firstName.trim()) next.push("Please enter your first name.");
    if (!form.lastName.trim()) next.push("Please enter your last name.");
    if (!form.helpSubject) next.push("Please select a subject.");
    if (!form.helpTopic || form.helpTopic === "no selection") {
      next.push("Please select a topic.");
    }
    if (!form.comment.trim()) next.push("Please enter a description.");
    return next;
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (nextErrors.length) return;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="space-y-4 text-[20px] leading-normal">
        <p>
          Thank you. Your message has been recorded for this demo. On the live Interval site,
          Customer Support receives these requests and typically responds within 24 hours during
          normal business periods.
        </p>
        <p>
          If you need assistance involving immediate travel, please contact an Interval service
          representative via{" "}
          <Link href="/web/cs/offices" className="font-medium text-iw-link underline">
            Our Offices
          </Link>
          .
        </p>
        <button
          type="button"
          className="inline-flex w-full max-w-[284px] items-center justify-center rounded-lg bg-iw-blue px-[42px] py-3 text-[17px] font-medium text-white hover:bg-iw-blue-dark"
          onClick={() => {
            setSubmitted(false);
            setForm(initial);
          }}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      name="csform"
      onSubmit={onSubmit}
      noValidate
      className="flex w-full max-w-[791px] flex-col gap-8"
    >
      <p className="text-[20px] leading-normal text-iw-ink">
        If you have any questions, comments or concerns that you would like to share with us, please
        let us know. Your feedback is always welcome and appreciated. We are committed to
        continuously improving IntervalWorld.com.
      </p>

      {errors.length > 0 ? (
        <div
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-800"
          role="alert"
        >
          <p className="mb-1 font-medium">Required information missing:</p>
          <ul className="list-disc space-y-0.5 pl-5">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="memberNo" className={labelClass}>
              Member Number
            </label>
            <input
              id="memberNo"
              className={fieldClass}
              type="text"
              name="memberNo"
              maxLength={12}
              value={form.memberNo}
              onChange={(e) => update("memberNo", e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="emailAddress" className={labelClass}>
              E-mail Address*
            </label>
            <input
              id="emailAddress"
              className={fieldClass}
              type="email"
              name="emailAddress"
              required
              value={form.emailAddress}
              onChange={(e) => update("emailAddress", e.target.value)}
              aria-required="true"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className={labelClass}>
              First Name*
            </label>
            <input
              id="firstName"
              className={fieldClass}
              type="text"
              name="firstName"
              maxLength={25}
              required
              value={form.firstName}
              onChange={(e) => update("firstName", e.target.value)}
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="lastName" className={labelClass}>
              Last Name*
            </label>
            <input
              id="lastName"
              className={fieldClass}
              type="text"
              name="lastName"
              maxLength={25}
              required
              value={form.lastName}
              onChange={(e) => update("lastName", e.target.value)}
              aria-required="true"
            />
          </div>
        </div>

        <div className="sm:w-1/2 sm:pr-2">
          <label htmlFor="exchangeNumber" className={labelClass}>
            Exchange Number
          </label>
          <div className="flex items-center gap-1">
            <input
              id="exchangeNumber"
              className={cn(fieldClass, "flex-1")}
              type="text"
              name="exchangeNumber"
              maxLength={25}
              value={form.exchangeNumber}
              onChange={(e) => update("exchangeNumber", e.target.value)}
            />
            <span className="shrink-0 text-[12px] text-iw-muted">(if applicable)</span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="helpSubject" className={labelClass}>
              How may we help you?
            </label>
            <select
              id="helpSubject"
              name="helpSubject"
              className={fieldClass}
              value={form.helpSubject}
              onChange={(e) => update("helpSubject", e.target.value)}
              required
            >
              <option value="">Select Subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="helpTopic" className={cn(labelClass, "invisible")}>
              Topic
            </label>
            <select
              id="helpTopic"
              name="helpTopic"
              className={fieldClass}
              value={form.helpTopic}
              onChange={(e) => update("helpTopic", e.target.value)}
              required
              disabled={!form.helpSubject}
            >
              {!form.helpSubject ? (
                <option value="">Please select a subject first</option>
              ) : (
                topics.map((topic) => (
                  <option key={topic.value + topic.label} value={topic.value}>
                    {topic.label}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="comment" className={labelClass}>
            Description*
          </label>
          <textarea
            id="comment"
            name="comment"
            rows={6}
            required
            value={form.comment}
            onChange={(e) => update("comment", e.target.value)}
            aria-required="true"
            className="min-h-[156px] w-full rounded border border-iw-border bg-white px-4 py-3 text-[14px] text-iw-ink outline-none transition-colors focus:border-iw-link"
          />
        </div>
      </div>

      <p className="text-[20px] leading-normal text-iw-ink">
        Your comments are important. We will make every effort to respond to your message within the
        next 24 hours during normal business periods.
      </p>
      <p className="text-[20px] leading-normal text-iw-ink">
        If you need assistance involving immediate travel or with an upcoming trip, please contact an
        Interval service representative in your{" "}
        <Link href="/web/cs/offices" className="font-medium text-iw-link underline">
          local servicing office.
        </Link>
      </p>

      <button
        type="submit"
        name="submit"
        className="inline-flex w-full max-w-[284px] items-center justify-center rounded-lg bg-iw-blue px-[42px] py-3 text-[17px] font-medium text-white transition-colors hover:bg-iw-blue-dark"
      >
        Submit
      </button>
    </form>
  );
}
