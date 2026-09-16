import Link from "next/link";

export default function NotFound() {
  return (
    <main className="px-4 py-16 text-center">
      <h1 className="mb-3 text-[28px] text-iw-blue">Page not found</h1>
      <p className="mb-6 text-[13px] text-iw-navy">
        That page is not part of this demo yet. Try the main navigation or return home.
      </p>
      <Link href="/" className="text-iw-blue hover:underline">
        Back to Home
      </Link>
    </main>
  );
}
