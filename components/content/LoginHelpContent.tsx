"use client";

import { FormEvent, useState } from "react";
import { cn } from "@/lib/cn";

type SectionId = "cant-login" | "forgot-id" | "forgot-password" | "first-time";

const fieldClass =
  "h-12 w-full max-w-[290px] rounded border border-iw-border bg-white px-4 text-[14px] text-iw-ink outline-none focus:border-iw-link";

function Chevron({ open }: { open: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex h-3 w-3 shrink-0 text-iw-link transition-transform",
        open ? "rotate-90" : "rotate-0",
      )}
      aria-hidden
    >
      <svg viewBox="0 0 8 12" fill="none" className="h-full w-full">
        <path d="M1.5 1.5L6 6L1.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </span>
  );
}

/**
 * Log In Help — Figma Contact us (nodes 33:1576 / 33:1729)
 */
export function LoginHelpContent(_props?: { html?: string }) {
  const [open, setOpen] = useState<SectionId | null>("cant-login");
  const [notice, setNotice] = useState<string | null>(null);

  function toggle(id: SectionId) {
    setOpen((prev) => (prev === id ? null : id));
  }

  function onDemoSubmit(event: FormEvent) {
    event.preventDefault();
    setNotice(
      "This is a demo Contact Support form. Sign-in recovery is not connected to Interval systems yet.",
    );
  }

  return (
    <div className="iw-login-help flex w-full max-w-[827px] flex-col gap-4">
      <h2 className="m-0 text-[24px] font-medium text-iw-navy">Log In Help</h2>

      {notice ? (
        <p className="iw-login-help__notice" role="status">
          {notice}
        </p>
      ) : null}

      {/* Already a user */}
      <section className="rounded border border-iw-border bg-white px-4 py-4">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-4 text-left"
          aria-expanded={open === "cant-login"}
          onClick={() => toggle("cant-login")}
        >
          <span className="text-[20px] font-bold text-iw-link">
            Already an Interval International user and can&apos;t log in?
          </span>
          <Chevron open={open === "cant-login"} />
        </button>
        {open === "cant-login" ? (
          <div className="mt-2.5 space-y-3 text-[14px] leading-[1.7] text-iw-ink">
            <p>Follow these steps to log in:</p>
            <p>
              At the top of the homepage, enter your old Login ID or{" "}
              <strong>Membership number and Password</strong>, then click{" "}
              <strong>&quot;Sign In.&quot;</strong>
            </p>
            <p>
              You will be asked to create a new password. Your password must be a minimum of 8
              characters and contain at least 3 of the following: upper case letter, lower case
              letter, number, or special character. Passwords are case sensitive and must not
              contain spaces. Your password cannot match your Login ID.
            </p>
            <p>
              Once you have created your new password, you will be asked to create three security
              questions. In the future, we may ask you to answer one or more of three questions to
              verify your identity. Please provide answers that only you will know.
            </p>
            <p>
              After you have saved your security questions, you will have access to IntervalWorld.com
              and everything your membership has to offer.
            </p>
            <p>
              <strong>Note:</strong> If there is more than one owner on your Membership account, each
              owner can now create their own web profile including their individual Login ID and
              Password.
            </p>
          </div>
        ) : null}
      </section>

      {/* Forgot Login ID */}
      <section className="rounded border border-iw-border bg-white px-4 py-4">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-4 text-left"
          aria-expanded={open === "forgot-id"}
          onClick={() => toggle("forgot-id")}
        >
          <span className="text-[20px] font-bold text-iw-link">Forgot Login ID?</span>
          <Chevron open={open === "forgot-id"} />
        </button>
        {open === "forgot-id" ? (
          <div className="mt-2.5">
            <div className="mb-6 space-y-3 text-[14px] leading-[1.7] text-iw-ink">
              <p>
                Enter your first and last name, and email address that matches your membership
                record.
              </p>
              <p>
                Click on <strong>&quot;Continue&quot;</strong>
                <br />A pop-up window will appear with your Login ID.
              </p>
              <p>Please provide the following information.</p>
            </div>
            <form className="flex max-w-[612px] flex-col gap-4" onSubmit={onDemoSubmit}>
              <label className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between">
                <span className="shrink-0 text-[14px] text-iw-ink">First Name:</span>
                <input name="firstName" type="text" required className={fieldClass} />
              </label>
              <label className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between">
                <span className="shrink-0 text-[14px] text-iw-ink">Last Name:</span>
                <input name="lastName" type="text" required className={fieldClass} />
              </label>
              <label className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between">
                <span className="shrink-0 text-[14px] text-iw-ink">Email:</span>
                <input name="email" type="email" required className={fieldClass} />
              </label>
              <div className="sm:pl-[167px]">
                <button
                  type="submit"
                  className="inline-flex w-full max-w-[290px] items-center justify-center rounded-lg bg-iw-blue px-[42px] py-3 text-[17px] font-medium text-white hover:bg-iw-blue-dark"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        ) : null}
      </section>

      {/* Forgot Password */}
      <section className="rounded border border-iw-border bg-white px-4 py-4">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-4 text-left"
          aria-expanded={open === "forgot-password"}
          onClick={() => toggle("forgot-password")}
        >
          <span className="text-[20px] font-bold text-iw-link">Forgot Password</span>
          <Chevron open={open === "forgot-password"} />
        </button>
        {open === "forgot-password" ? (
          <div className="mt-2.5">
            <p className="mb-6 text-[14px] leading-[1.7] text-iw-ink">
              Please provide your Login ID and answer your security questions to reset your password.
            </p>
            <form className="flex max-w-[784px] flex-col gap-4" onSubmit={onDemoSubmit}>
              <label className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between">
                <span className="shrink-0 text-[14px] text-iw-ink">Login ID:</span>
                <span className="flex flex-wrap items-center gap-1">
                  <input name="loginId" type="text" required className={fieldClass} />
                  <span className="text-[14px] text-iw-ink">Need a Password hint?</span>
                </span>
              </label>
              <div className="sm:pl-[167px]">
                <button
                  type="submit"
                  className="inline-flex w-full max-w-[290px] items-center justify-center rounded-lg bg-iw-blue px-[42px] py-3 text-[17px] font-medium text-white hover:bg-iw-blue-dark"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        ) : null}
      </section>

      {/* First time */}
      <section className="rounded border border-iw-border bg-white px-4 py-4">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-4 text-left"
          aria-expanded={open === "first-time"}
          onClick={() => toggle("first-time")}
        >
          <span className="text-[20px] font-bold text-iw-link">
            First time visiting interval International?
          </span>
          <Chevron open={open === "first-time"} />
        </button>
        {open === "first-time" ? (
          <div className="mt-2.5 space-y-3 text-[14px] leading-[1.7] text-iw-ink">
            <p>
              If you&apos;re already an Interval International member, click &quot;Create Profile&quot;
              at the top of the homepage.
              <br />
              Then click &quot;Create Web Profile.&quot;
            </p>
            <p>
              Enter your Interval International member number and the phone number that matches your
              membership record.
              <br />
              Click &quot;Submit.&quot;
            </p>
            <p>
              Your Login ID must be a minimum of 5 characters, contain at least one letter, and have
              no spaces or special characters (with the exception of an underscore or a period). Enter
              a current email address and verify that it is correctly formatted. This is the address
              Interval will use for online transaction-related correspondence. You can also choose to
              receive special offers and email updates on this page.
            </p>
            <p>
              Your password must be a minimum of 8 characters and contain at least 3 of the following:
              upper case letter, lower case letter, number, or special character. Passwords are case
              sensitive and must not contain spaces. Your password cannot match your Login ID.
            </p>
            <p>
              After completing this information, click the &quot;Create Profile&quot; button and review
              your profile on the My Profile page.
            </p>
            <p>
              Note: If you&apos;re not yet an Interval International member, you can enroll by clicking
              &quot;Join Today&quot; on the Welcome page.
            </p>
          </div>
        ) : null}
      </section>
    </div>
  );
}
