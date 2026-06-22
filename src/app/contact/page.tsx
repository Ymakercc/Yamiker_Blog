import type { Metadata } from "next";
import Contact from "@/components/Contact";
import ContentPage from "@/components/ContentPage";

export const metadata: Metadata = {
  title: "联系",
  description: "与 Yamiker 取得联系。",
};

export default function ContactPage() {
  return (
    <ContentPage>
      <Contact />
    </ContentPage>
  );
}
