"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/actions/auth";

/** Member Login — matches Figma auth card (node 57:2575) */
export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, undefined as LoginState);

  return (
    <main id="main-content" className="iw-auth-page">
      <div className="iw-auth-card">
        <h1 className="iw-auth-card__title">Member Login</h1>

        <form className="iw-auth-form" action={action} autoComplete="off">
          <div className="iw-auth-field">
            <label htmlFor="loginID">Login ID</label>
            <input
              id="loginID"
              name="username"
              type="text"
              placeholder="Enter your login id"
              autoComplete="username"
              required
            />
          </div>

          <div className="iw-auth-field">
            <label htmlFor="loginPassword">Password</label>
            <input
              id="loginPassword"
              name="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          <div className="iw-auth-form__help">
            <Link href="/web/my/account/forgotSignInInfo">LOGIN HELP &gt;</Link>
          </div>

          {state?.error ? (
            <p className="iw-auth-form__error" role="alert">
              {state.error}
            </p>
          ) : null}

          <button type="submit" className="iw-auth-btn" disabled={pending}>
            {pending ? "Signing in…" : "Login"}
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
          Don&apos;t have a profile?
          <Link href="/web/my/account/createProfileOrJoin">Create a profile</Link>
        </p>
      </div>
    </main>
  );
}
