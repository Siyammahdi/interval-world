import type { Metadata } from "next";
import { LoginForm } from "@/components/content/LoginForm";

export const metadata: Metadata = {
  title: "Member Login",
  description: "Sign in to your Interval International member account.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const { next } = await searchParams;
  return <LoginForm next={typeof next === "string" ? next : undefined} />;
}
