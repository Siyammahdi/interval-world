"use client";

import Image from "next/image";
import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/actions/auth";

/** Member Login — Figma Log in page (node 57:4594) */
export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, undefined as LoginState);

  return (
    <main id="main-content" className="iw-login">
      <div className="iw-login__card">
        <h1 className="iw-login__title">Login</h1>

        <form className="iw-login__form" action={action} autoComplete="off">
          <div className="iw-login__fields">
            <div className="iw-login__field">
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

            <div className="iw-login__field">
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
          </div>

          {state?.error ? (
            <p className="iw-login__error" role="alert">
              {state.error}
            </p>
          ) : null}

          <button type="submit" className="iw-login__submit" disabled={pending}>
            {pending ? "Signing in…" : "Login"}
          </button>
        </form>
      </div>

      <div className="iw-login__art" aria-hidden>
        <Image
          src="/images/figma/auth/login-bg.png"
          alt=""
          fill
          sizes="100vw"
          className="iw-login__art-img"
          priority
        />
      </div>
    </main>
  );
}
