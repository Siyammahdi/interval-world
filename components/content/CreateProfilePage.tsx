"use client";

import Link from "next/link";
import { FormEvent } from "react";

/** Create A Profile — matches Figma auth card (node 57:2333). Visual only. */
export function CreateProfilePage() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
              placeholder="Choose a username"
            />
          </div>

          <div className="iw-auth-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email address"
            />
          </div>

          <div className="iw-auth-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Create a strong password"
            />
          </div>

          <button type="submit" className="iw-auth-btn">
            Submit
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
