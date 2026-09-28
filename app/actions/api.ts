"use server";

import { randomBytes, randomInt } from "node:crypto";
import type { CheckoutBooking } from "@/lib/checkout";

// Demo build: no backend. Checkout state lives in the URL; forms just acknowledge.

export async function createCheckoutSession(booking: CheckoutBooking) {
  return { id: `cs_${randomBytes(8).toString("hex")}`, resortId: booking.resortId, status: "draft" };
}

export async function patchCheckoutSession(
  id: string,
  guest: {
    checkInAs?: string;
    guestFirstName?: string;
    guestLastName?: string;
    guestEmail?: string;
    guestPhone?: string;
  },
) {
  return { id, ...guest, status: "draft" };
}

export async function confirmCheckoutSession(id: string) {
  return {
    id: `bk_${randomBytes(8).toString("hex")}`,
    sessionId: id,
    confirmationCode: `IW${String(randomInt(0, 100_000_000)).padStart(8, "0")}`,
    paymentStatus: "demo",
  };
}

export async function submitSupportEmail(payload: {
  memberNo: string;
  emailAddress: string;
  firstName: string;
  lastName: string;
  exchangeNumber: string;
  helpSubject: string;
  helpTopic: string;
  comment: string;
}) {
  return { ok: Boolean(payload.emailAddress) };
}

export async function submitCreateProfile(payload: {
  memberNumber: string;
  phoneCode: string;
  phoneNumber: string;
  userId: string;
  email: string;
  password: string;
}) {
  return { status: "pending", ok: Boolean(payload.userId) };
}
