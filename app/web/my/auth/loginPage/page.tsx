import type { Metadata } from "next";
import { LoginForm } from "@/components/content/LoginForm";

export const metadata: Metadata = {
  title: "Member Login",
  description: "Sign in to your Interval International member account.",
};

export default function LoginPage() {
  return <LoginForm />;
}
