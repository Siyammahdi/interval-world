"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { submitCreateProfile } from "@/app/actions/api";

/** Create A Profile — matches Figma auth card (node 57:2333). */
export function CreateProfilePage() {
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    const form = new FormData(event.currentTarget);
    try {
      await submitCreateProfile({
        memberNumber: String(form.get("memberNumber") ?? ""),
        phoneCode: String(form.get("phoneCode") ?? ""),
        phoneNumber: String(form.get("phoneNumber") ?? ""),
        userId: String(form.get("userId") ?? ""),
        email: String(form.get("email") ?? ""),
        password: String(form.get("password") ?? ""),
      });
      setDone(true);
    } catch {
      setError("Unable to create profile. Please check your details and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <main id="main-content" className="iw-auth-page">
        <div className="iw-auth-card iw-auth-card--create">
          <div className="iw-auth-card__intro">
            <h1 className="iw-auth-card__title">Profile Submitted</h1>
            <p>
              Thanks — your profile request was received and is pending review. You can sign in
              once membership setup is complete.
            </p>
          </div>
          <p className="iw-auth-switch">
            <Link href="/web/my/auth/loginPage">Back to Login</Link>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="iw-auth-page">
      <div className="iw-auth-card iw-auth-card--create">
        <div className="iw-auth-card__intro">
          <h1 className="iw-auth-card__title">Create A Profile</h1>
          <p>
            To create your Web profile and password, please enter your membership
            number and the telephone number that matches your membership record.
          </p>
        </div>

        <form className="iw-auth-form" onSubmit={handleSubmit} autoComplete="off">
          <div className="iw-auth-field">
            <label htmlFor="memberNumber">Member Number</label>
            <input
              id="memberNumber"
              name="memberNumber"
              type="text"
              required
              placeholder="Enter your membership number"
            />
          </div>

          <div className="iw-auth-phone-row">
            <div className="iw-auth-field iw-auth-field--code">
              <label htmlFor="phoneCode">Telephone</label>
              <select id="phoneCode" name="phoneCode" defaultValue="+1" aria-label="Country code">
                <option value="+1">+1</option>
                <option value="+44">+44</option>
                <option value="+61">+61</option>
                <option value="+52">+52</option>
                <option value="+81">+81</option>
              </select>
            </div>
            <div className="iw-auth-field iw-auth-field--phone">
              <label htmlFor="phoneNumber" className="iw-auth-label-spacer">
                &nbsp;
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                required
                placeholder="Phone Number"
              />
            </div>
          </div>

          <div className="iw-auth-field">
            <label htmlFor="userId">Set UserID</label>
            <input
              id="userId"
              name="userId"
              type="text"
              required
              placeholder="Choose a username"
            />
          </div>

          <div className="iw-auth-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Enter your email address"
            />
          </div>

          <div className="iw-auth-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Create a strong password"
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button type="submit" className="iw-auth-btn" disabled={submitting}>
            {submitting ? "Submitting…" : "Submit"}
          </button>
        </form>

        <div className="iw-auth-divider" aria-hidden="true">
          <span />
          <p>OR</p>
          <span />
        </div>

        <button type="button" className="iw-auth-google" disabled>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/ui/google-g.svg"
            alt=""
            width={32}
            height={32}
            className="iw-auth-google__icon"
          />
          <span>Sign up with Google</span>
        </button>

        <p className="iw-auth-switch">
          Already have a Profile?
          <Link href="/web/my/auth/loginPage">Login</Link>
        </p>
      </div>
    </main>
  );
}
