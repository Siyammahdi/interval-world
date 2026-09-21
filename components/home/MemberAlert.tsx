import Link from "next/link";
import type { MemberAlert as MemberAlertData } from "@/lib/cms";

export function MemberAlert({ alert }: { alert: MemberAlertData }) {
  return (
    <div className="mx-auto max-w-[900px] text-center">
      <h2 className="text-[32px] font-medium leading-[1.3] tracking-[-0.42px] text-iw-navy md:text-[42px]">
        {alert.title}
      </h2>
      <p className="mt-2 text-[14px] leading-[1.7] text-iw-ink">
        {alert.bodyBefore}{" "}
        <Link
          href={alert.linkHref}
          className="font-bold text-iw-link underline decoration-[10.5%] underline-offset-2"
        >
          {alert.linkLabel}
        </Link>{" "}
        {alert.bodyAfter}
      </p>
    </div>
  );
}
