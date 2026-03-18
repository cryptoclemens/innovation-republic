import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Startup-Onboarding",
  description:
    "Tragen Sie Ihr Startup in das Innovation Republic Matching-System ein. Kostenlos und einfach.",
  robots: { index: true, follow: true },
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
