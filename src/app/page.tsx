import Navbar from "@/components/Navbar";
import Portal from "@/components/Portal";
import About from "@/components/About";
import BlogPreview from "@/components/BlogPreview";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CommandPalette from "@/components/CommandPalette";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Portal />
      <About />
      <BlogPreview />
      <Projects />
      <Contact />
      <Footer />
      <CommandPalette />
    </main>
  );
}
