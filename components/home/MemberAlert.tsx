import Link from "next/link";
import { memberAlert } from "@/data/homepage";

export function MemberAlert() {
  return (
    <section className="mb-1 mt-5" aria-labelledby="member-alert-heading">
      <h1
        id="member-alert-heading"
        className="mb-2 text-[26px] font-normal leading-tight text-iw-blue"
      >
        {memberAlert.title}
      </h1>
      <p className="max-w-[900px] text-[12px] leading-[1.55] text-iw-navy">
        {memberAlert.bodyBefore}{" "}
        <strong>
          <Link
            href={memberAlert.linkHref}
            className="font-bold text-iw-blue hover:underline"
            title="Travel Advisories"
          >
            {memberAlert.linkLabel}
          </Link>
        </strong>{" "}
        {memberAlert.bodyAfter}
      </p>
    </section>
  );
}
