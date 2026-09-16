import Link from "next/link";
import { Container } from "@/components/ui/Container";

/** Create Profile / Join — matches live /web/my/account/createProfileOrJoin */
export function CreateProfilePage() {
  return (
    <main id="main-content" className="iw-create-profile-page pb-10 pt-4">
      <Container>
        <div className="iw-create-profile">
          <h1>Welcome to Intervalworld.com</h1>

          <div className="box_rnd_1">
            <h2>Web Profile</h2>
            <p>
              If you&apos;re an Interval member, please create a Web Profile for easy access to all
              your membership benefits.
            </p>
            <p>
              <Link href="/web/my/account/lookupMember" className="button">
                Create Web Profile
              </Link>
            </p>
            <div className="clear_both" />
          </div>

          <div className="box_rnd_1">
            <h2>Become A Member</h2>
            <p>
              Get the most out of your vacation ownership - join Interval International today! If you
              own a vacation week(s) or points at a resort that is affiliated with Interval, you&apos;ll
              need your resort ownership information. If you&apos;ve received a mailer from us, it
              contains a Solicitation # which is unique to you and when entered will expedite your
              enrollment process. Welcome to Interval membership!
            </p>
            <p>
              For information regarding the Interval International Exchange Program, see{" "}
              <Link href="/web/cs/legal">Legal Information</Link>.
            </p>
            <p>
              <Link href="/web/my/account/chooseCountry" className="button" id="enrollment">
                Join Today
              </Link>
            </p>
            <div className="clear_both" />
          </div>
        </div>
      </Container>
    </main>
  );
}
