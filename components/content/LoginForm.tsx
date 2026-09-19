"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/actions/auth";

/** Member Login — Figma Log in page (node 57:4594) */
export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, undefined as LoginState);

  return (
    <main id="main-content" className="iw-auth-page iw-auth-page--login">
      <div className="iw-auth-card iw-auth-card--login">
        <h1 className="iw-auth-card__title">Login</h1>

        <form className="iw-auth-form iw-auth-form--login" action={action} autoComplete="off">
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

          {state?.error ? (
            <p className="iw-auth-form__error" role="alert">
              {state.error}
            </p>
          ) : null}

          <button type="submit" className="iw-auth-btn" disabled={pending}>
            {pending ? "Signing in…" : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}
