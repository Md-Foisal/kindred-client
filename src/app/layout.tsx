import "@fontsource-variable/bricolage-grotesque/wdth.css";
import "@fontsource-variable/instrument-sans";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Kindred | Community events near you",
    template: "%s | Kindred",
  },
  description: "Create, join and track social service events in your area.",
};

// sets the saved theme before paint so there is no white flash in dark mode
const themeScript = `
try {
  var t = localStorage.getItem("kindred-theme");
  if (!t) t = window.matchMedia("(prefers-color-scheme: dark)").matches ? "kindred-dark" : "kindred";
  document.documentElement.setAttribute("data-theme", t);
} catch (e) {}
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-theme="kindred" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-screen flex-col bg-base-100 text-base-content antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
