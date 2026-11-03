import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What Kindred stores about you and how it is used.",
};

const sections = [
  {
    heading: "What we store",
    text: "Your name, email address and profile photo, from the register form or from Google or GitHub when you sign in with them. We also store the events you create and the events you join.",
  },
  {
    heading: "How we use it",
    text: "Only to run Kindred: to sign you in, show your profile, and list your events. Your name and email are saved with the events you create or join.",
  },
  {
    heading: "Who we share it with",
    text: "We do not sell your data or share it for advertising. It is stored with MongoDB Atlas and the site is hosted on Vercel.",
  },
  {
    heading: "Cookies",
    text: "We use a session cookie to keep you signed in, and we save your light or dark theme choice in your browser.",
  },
  {
    heading: "Removing your data",
    text: "You can delete the events you created from Manage Events. To remove your account, open an issue on the project's GitHub repository.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHeader title="Privacy policy" subtitle="What Kindred stores about you and how it is used." />
      <div className="mx-auto max-w-3xl space-y-8 px-4 py-16">
        {sections.map((s) => (
          <section key={s.heading}>
            <h2 className="text-xl font-bold">{s.heading}</h2>
            <p className="mt-2 leading-relaxed text-base-content/80">{s.text}</p>
          </section>
        ))}
        <p>
          <a
            href="https://github.com/Md-Foisal/kindred-client/issues"
            className="link"
            target="_blank"
            rel="noreferrer"
          >
            Project repository issues
          </a>
        </p>
      </div>
    </>
  );
}
