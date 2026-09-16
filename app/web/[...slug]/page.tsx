import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CreateProfilePage } from "@/components/content/CreateProfilePage";
import { LiveContentPage } from "@/components/content/LiveContentPage";
import { LoginForm } from "@/components/content/LoginForm";
import { getAllLivePagePaths, getLivePageByPath } from "@/data/live-pages";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

function pathFromSlug(slug: string[]) {
  return `/web/${slug.join("/")}`;
}

export function generateStaticParams() {
  return getAllLivePagePaths().map((path) => ({
    slug: path.replace(/^\/web\//, "").split("/"),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getLivePageByPath(pathFromSlug(slug));
  if (!page) return { title: "Page Not Found" };
  return {
    title: page.title,
    description: page.documentTitle || page.title,
  };
}

export default async function WebCatchAllPage({ params }: PageProps) {
  const { slug } = await params;
  const path = pathFromSlug(slug);

  if (path === "/web/my/auth/loginPage") {
    return <LoginForm />;
  }

  if (path === "/web/my/account/createProfileOrJoin") {
    return <CreateProfilePage />;
  }

  const page = getLivePageByPath(path);
  if (!page) notFound();
  return <LiveContentPage page={page} />;
}
