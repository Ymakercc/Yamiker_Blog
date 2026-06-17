import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
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
      <Hero />
      <About />
      <BlogPreview />
      <Projects />
      <Contact />
      <Footer />
      <CommandPalette />
    </main>
  );
}
