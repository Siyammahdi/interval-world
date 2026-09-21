"use server";

import { cookies } from "next/headers";
import { AUTH_COOKIE } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import type { CheckoutBooking } from "@/lib/checkout";

export type CheckoutSessionResponse = {
  id: string;
  resortId: string;
  unit: string;
  earliestDate: string;
  latestDate: string;
  adults: number;
  children: number;
  vacationType: string;
  checkInAs: string;
  guestFirstName: string;
  guestLastName: string;
  guestEmail: string;
  guestPhone: string;
  pricing: Record<string, unknown>;
  status: string;
};

export type BookingResponse = {
  id: string;
  confirmationCode: string;
  paymentStatus: string;
  resortId: string;
  unit: string;
  pricing: Record<string, unknown>;
};

async function sessionId() {
  const jar = await cookies();
  return jar.get(AUTH_COOKIE)?.value ?? null;
}

export async function createCheckoutSession(booking: CheckoutBooking) {
  return apiFetch<CheckoutSessionResponse>("/api/checkout/sessions/", {
    method: "POST",
    sessionId: await sessionId(),
    body: JSON.stringify({
      resortId: booking.resortId,
      unit: booking.unit,
      earliestDate: booking.earliestDate,
      latestDate: booking.latestDate,
      adults: booking.adults,
      children: booking.children,
      vacationType: booking.vacationType,
      checkInAs: booking.checkInAs,
    }),
  });
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
  return apiFetch<CheckoutSessionResponse>(`/api/checkout/sessions/${id}/`, {
    method: "PATCH",
    sessionId: await sessionId(),
    body: JSON.stringify(guest),
  });
}

export async function confirmCheckoutSession(id: string) {
  return apiFetch<BookingResponse>(`/api/checkout/sessions/${id}/confirm/`, {
    method: "POST",
    sessionId: await sessionId(),
    body: JSON.stringify({}),
  });
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
  return apiFetch<{ id: number; ok: boolean }>("/api/support/email/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function submitCreateProfile(payload: {
  memberNumber: string;
  phoneCode: string;
  phoneNumber: string;
  userId: string;
  email: string;
  password: string;
}) {
  return apiFetch<{ id: number; status: string; ok: boolean }>("/api/profiles/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
