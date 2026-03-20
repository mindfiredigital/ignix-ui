import React, { useCallback, useState } from "react";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";
import {
  ActivityFeedPage,
  type ActivityEvent,
  type ActivityEventType,
  type ActivityFeedFilterState,
} from "@site/src/components/UI/activity-feed-page";

const EVENT_TYPES: ActivityEventType[] = [
  "authentication",
  "user",
  "security",
  "system",
  "billing",
  "order",
  "comment",
  "document",
  "schedule",
  "warning",
];

const makeDemoEvents = (count: number): ActivityEvent[] => {
  const now = new Date();

  const actors = [
    { name: "Alex Morgan", meta: "Admin" },
    { name: "Sara Kim", meta: "@sara" },
    { name: "Ignix System", meta: "Service" },
    { name: "Priya Patel", meta: "Support" },
    { name: "Diego Rivera", meta: "Billing" },
  ] as const;

  const templates: Record<
    ActivityEventType,
    { title: string; description: string; contextLabel?: string }
  > = {
    authentication: {
      title: "User signed in",
      description: "Successful login from a trusted device.",
    },
    user: {
      title: "New user invited",
      description: "An invitation was sent to join the workspace.",
    },
    security: {
      title: "Security policy updated",
      description: "MFA enforcement was enabled for all admins.",
    },
    system: {
      title: "System configuration changed",
      description: "Updated environment variables for the deployment.",
    },
    billing: {
      title: "Invoice paid",
      description: "Payment succeeded for the monthly subscription.",
      contextLabel: "Invoice #1024",
    },
    order: {
      title: "Order processed",
      description: "Order moved to the next stage in fulfillment.",
      contextLabel: "Order #8821",
    },
    comment: {
      title: "Comment added",
      description: "Left feedback on the latest deployment notes.",
      contextLabel: "Release notes",
    },
    document: {
      title: "Document updated",
      description: "Edited a shared SOP for onboarding.",
      contextLabel: "Onboarding SOP",
    },
    schedule: {
      title: "Maintenance scheduled",
      description: "Planned maintenance window was created.",
      contextLabel: "Sun 02:00–03:00",
    },
    warning: {
      title: "Unusual activity detected",
      description: "Multiple failed sign-in attempts were detected.",
      contextLabel: "IP flagged",
    },
  };

  return Array.from({ length: count }).map((_, idx) => {
    const type = EVENT_TYPES[idx % EVENT_TYPES.length] ?? "system";
    const actor = actors[idx % actors.length] ?? actors[0];
    const tpl = templates[type];

    const minutesAgo = idx * 37 + (idx % 7) * 13;
    const occurredAt = new Date(now.getTime() - minutesAgo * 60_000);

    return {
      id: `ev-${idx + 1}`,
      type,
      actor: {
        name: actor.name,
        meta: actor.meta,
      },
      occurredAt,
      title: tpl.title,
      description: `${tpl.description} (event ${idx + 1})`,
      contextLabel: tpl.contextLabel,
    };
  });
};

const DEMO_EVENTS: ActivityEvent[] = makeDemoEvents(64);

const ActivityFeedPageDemo: React.FC = () => {
  const codeString = `
import {
  ActivityFeedPage,
  type ActivityEvent,
  type ActivityFeedFilterState,
} from "@ignix-ui/activity-feed-page";

const events: ActivityEvent[] = [
  {
    id: "1",
    type: "authentication",
    actor: { name: "Alex Morgan", meta: "Admin" },
    occurredAt: new Date(),
    title: "User signed in",
    description: "Successful login from a trusted device.",
  },
  // ...more ActivityEvent rows
];

export function Example() {
  const [filter, setFilter] = useState<ActivityFeedFilterState>({
    type: null,
    query: "",
  });

  return (
    <ActivityFeedPage
      events={events}
      filterState={filter}
      onFilterChange={setFilter}
      pagingMode="pagination"
      pageSize={10}
    />
  );
}
`.trim();

  const [filter, setFilter] = useState<ActivityFeedFilterState>({
    type: null,
    query: "",
  });

  const handleFilterChange = useCallback((next: ActivityFeedFilterState) => {
    setFilter(next);
  }, []);

  return (
    <div className="mb-8 flex flex-col space-y-6">
      <Tabs>
        <TabItem value="preview" label="Preview" default>
          <div className="rounded-xl border border-slate-200 bg-slate-950 p-4 shadow-sm">
            <ActivityFeedPage
              events={DEMO_EVENTS}
              filterState={filter}
              onFilterChange={handleFilterChange}
              pagingMode="pagination"
              pageSize={10}
            />
          </div>
        </TabItem>
        <TabItem value="code" label="Code">
          <CodeBlock
            language="tsx"
            className="max-h-[520px] overflow-y-auto whitespace-pre-wrap text-sm"
          >
            {codeString}
          </CodeBlock>
        </TabItem>
      </Tabs>
    </div>
  );
};

export default ActivityFeedPageDemo;

