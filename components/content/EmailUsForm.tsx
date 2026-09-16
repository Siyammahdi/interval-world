"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import helpTopics from "@/data/email-help-topics.json";

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

/** E-mail Us form — matches live /web/cs?a=80 fields + subject/topic cascade */
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
      <div className="iw-email-form">
        <h1>E-mail</h1>
        <p>
          Thank you. Your message has been recorded for this demo. On the live Interval site,
          Customer Support receives these requests and typically responds within 24 hours during
          normal business periods.
        </p>
        <p>
          If you need assistance involving immediate travel, please contact an Interval service
          representative via{" "}
          <Link href="/web/cs/offices">Our Offices</Link>.
        </p>
        <button type="button" className="button" onClick={() => { setSubmitted(false); setForm(initial); }}>
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className="iw-email-form" name="csform" onSubmit={onSubmit} noValidate>
      <h1>E-mail</h1>
      <p>
        If you have any questions, comments or concerns that you would like to share with us, please
        let us know. Your feedback is always welcome and appreciated. We are committed to
        continuously improving IntervalWorld.com.
      </p>
      <p>
        <small>(*) = required fields</small>
      </p>

      {errors.length > 0 ? (
        <div className="iw-email-form__errors" role="alert">
          <h2>Required information missing:</h2>
          <ul>
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <table className="iw-email-form__table" cellPadding={2} cellSpacing={0}>
        <tbody>
          <tr>
            <td>
              <label htmlFor="memberNo">
                <strong>Member Number:</strong>
              </label>
            </td>
            <td>
              <label htmlFor="emailAddress">
                <strong>*E-mail Address:</strong>
              </label>
            </td>
          </tr>
          <tr>
            <td>
              <input
                id="memberNo"
                className="textfield"
                type="text"
                name="memberNo"
                size={12}
                maxLength={12}
                value={form.memberNo}
                onChange={(e) => update("memberNo", e.target.value)}
                aria-label="Member Number"
              />
            </td>
            <td>
              <input
                id="emailAddress"
                className="textfield"
                type="email"
                name="emailAddress"
                size={30}
                required
                value={form.emailAddress}
                onChange={(e) => update("emailAddress", e.target.value)}
                aria-label="Email Address"
                aria-required="true"
              />
            </td>
          </tr>
          <tr>
            <td>
              <label htmlFor="firstName">
                <strong>*First Name:</strong>
              </label>
            </td>
            <td>
              <label htmlFor="lastName">
                <strong>*Last Name:</strong>
              </label>
            </td>
          </tr>
          <tr>
            <td>
              <input
                id="firstName"
                className="textfield"
                type="text"
                name="firstName"
                size={19}
                maxLength={25}
                required
                value={form.firstName}
                onChange={(e) => update("firstName", e.target.value)}
                aria-label="First Name"
                aria-required="true"
              />
            </td>
            <td>
              <input
                id="lastName"
                className="textfield"
                type="text"
                name="lastName"
                size={19}
                maxLength={25}
                required
                value={form.lastName}
                onChange={(e) => update("lastName", e.target.value)}
                aria-label="Last Name"
                aria-required="true"
              />
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <label htmlFor="exchangeNumber">
                <strong>Exchange Number:</strong>
              </label>
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <input
                id="exchangeNumber"
                className="textfield"
                type="text"
                name="exchangeNumber"
                size={20}
                maxLength={25}
                value={form.exchangeNumber}
                onChange={(e) => update("exchangeNumber", e.target.value)}
                aria-label="Exchange Number"
              />
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <strong>How may we help you?</strong>
            </td>
          </tr>
          <tr>
            <td>
              <label htmlFor="helpSubject">
                <strong>*Subject:</strong>
              </label>
            </td>
            <td>
              <label htmlFor="helpTopic">
                <strong>*Topic:</strong>
              </label>
            </td>
          </tr>
          <tr>
            <td>
              <select
                id="helpSubject"
                name="helpSubject"
                aria-label="Select Help Subject"
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
            </td>
            <td>
              <select
                id="helpTopic"
                name="helpTopic"
                aria-label="Select Help Topic"
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
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <label htmlFor="comment">
                <strong>*Description:</strong>
              </label>
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <textarea
                id="comment"
                name="comment"
                cols={55}
                rows={5}
                required
                value={form.comment}
                onChange={(e) => update("comment", e.target.value)}
                aria-required="true"
              />
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <p>
                Your comments are important. We will make every effort to respond to your message
                within the next 24 hours during normal business periods.
              </p>
              <p>
                If you need assistance involving immediate travel or with an upcoming trip, please
                contact an Interval service representative in your local servicing{" "}
                <Link href="/web/cs/offices">office</Link>.
              </p>
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <input className="button" type="submit" value="Submit" name="submit" />
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  );
}
