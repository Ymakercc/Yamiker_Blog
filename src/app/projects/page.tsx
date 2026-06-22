import type { Metadata } from "next";
import Projects from "@/components/Projects";
import ContentPage from "@/components/ContentPage";

export const metadata: Metadata = {
  title: "项目",
  description: "Yamiker 的项目作品集。",
};

export default function ProjectsPage() {
  return (
    <ContentPage>
      <Projects />
    </ContentPage>
  );
}
