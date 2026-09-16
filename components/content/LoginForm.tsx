"use client";

import Link from "next/link";
import { useState } from "react";

/** Member Login — matches live /web/my/auth/loginPage (beach bg + modal) */
export function LoginForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <main id="main-content" className="iw-login-page">
      <div className="login-bg">
        <div className="box_rnd_1 login_container">
          <h1>Member Login</h1>

          {submitted ? (
            <div className="iw-login-demo-note">
              <p className="iw-login-demo-note__title">Demo only</p>
              <p>
                Sign-in is not connected to Interval systems yet. This screen is for client review of
                the frontend experience.
              </p>
              <Link href="/">Return to Home</Link>
            </div>
          ) : (
            <form
              name="loginForm"
              autoComplete="off"
              onSubmit={(event) => {
                event.preventDefault();
                setSubmitted(true);
              }}
            >
              <table className="formContainer">
                <tbody>
                  <tr>
                    <td className="label">
                      <label htmlFor="loginID">Login ID:</label>
                    </td>
                    <td>
                      <input
                        aria-label="Login ID"
                        id="loginID"
                        name="j_username"
                        type="text"
                        size={16}
                        maxLength={33}
                        className="inputField"
                        autoComplete="username"
                        required
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="label">
                      <label htmlFor="loginPassword">Password:</label>
                    </td>
                    <td>
                      <input
                        aria-label="Password"
                        id="loginPassword"
                        name="j_password"
                        type="password"
                        size={16}
                        maxLength={14}
                        className="inputField"
                        autoComplete="current-password"
                        required
                      />
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2}>
                      <input
                        id="rememberMe"
                        name="_spring_security_remember_me"
                        type="checkbox"
                        aria-label="Remember Me"
                        defaultChecked
                      />
                      <label htmlFor="rememberMe" className="rememberMe">
                        Remember Me
                      </label>
                      <input id="buttonlogin" className="button" type="submit" value="Sign In" />
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2}>
                      <Link href="/web/my/account/forgotSignInInfo">Login Help?</Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </form>
          )}

          <div className="createProfile-box">
            <Link href="/web/my/account/createProfileOrJoin">Create Profile or Join Today</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
