// @ts-nocheck
import { useState, useTransition } from "react";
import { TabButtons, TabPanel } from "../../content/docs/posts/_react-example-modules/ProjectTabs";

type Tab = "overview" | "activity" | "settings";

export function ProjectTabs() {
  const [tab, setTab] = useState<Tab>("overview");
  const [isPending, startTransition] = useTransition();

  function selectTab(nextTab: Tab) {
    startTransition(() => setTab(nextTab));
  }

  return (
    <>
      <TabButtons selected={tab} onSelect={selectTab} />
      {isPending && <span>Loading tab...</span>}
      <TabPanel tab={tab} />
    </>
  );
}
