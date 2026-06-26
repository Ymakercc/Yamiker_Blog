import type { Metadata } from "next";
import ContentPage from "@/components/ContentPage";
import MonitorPanel from "@/components/MonitorPanel";

// Hidden, unlinked route. Not in nav; excluded from indexing. Visibility is
// by-URL only (per owner's choice), backed by noindex + robots /data/ rule.
export const metadata: Metadata = {
  title: "telemetry",
  description: "",
  robots: { index: false, follow: false },
};

export default function SysPanelPage() {
  return (
    <ContentPage>
      <MonitorPanel />
    </ContentPage>
  );
}
