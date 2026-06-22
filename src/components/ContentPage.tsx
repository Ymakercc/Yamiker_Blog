import Footer from "./Footer";

/**
 * Shell for the standalone content routes (/about, /blog, /projects, /contact):
 * fills the viewport so the footer sits at the bottom, with the footer below
 * the section content. The home page does not use this — it is self-contained.
 */
export default function ContentPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
