/**
 * @fileoverview Live demo for the Detail View Page template in Docusaurus.
 * Preview uses composable `DetailViewPage.*` slots; the Code tab shows an `export function` example.
 */

import React, { useCallback, useMemo, useState } from "react";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";
import {
    DetailViewPage,
    type DetailRelatedItem,
    type DetailViewLabels,
    type StatusStyle,
} from "@site/src/components/UI/detail-view-page";

const FULL_LABELS: Required<DetailViewLabels> = {
    back: "Back",
    previous: "Previous",
    next: "Next",
    relatedHeading: "Related items",
    edit: "Edit",
    delete: "Delete",
    share: "Share",
    created: "Created",
    updated: "Updated",
    owner: "Owner",
    status: "Status",
    emptyRelated: "No related items yet.",
    loadingHint: "Loading item…",
};

const STATUS_STYLES: Record<string, StatusStyle> = {
    Published: {
        className:
            "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-inset ring-emerald-500/20",
        dotClassName: "bg-emerald-500",
    },
    Draft: {
        className:
            "bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-inset ring-amber-500/20",
        dotClassName: "bg-amber-500",
    },
};

const RELATED: DetailRelatedItem[] = [
    {
        id: "r1",
        title: "Data Table Pagination Pattern",
        description: "Offset and cursor pagination primitives.",
    },
    {
        id: "r2",
        title: "Dialog & Modal Guidelines",
        description: "Focus and stacking rules for overlays.",
    },
];

const composableCodeExample = [
    'import {',
    "  DetailViewPage,",
    "  type DetailRelatedItem,",
    "  type DetailViewLabels,",
    "  type StatusStyle,",
    '} from "@ignix-ui/detail-view-page";',
    "",
    "const labels: Required<DetailViewLabels> = {",
    '  back: "Back",',
    '  previous: "Previous",',
    '  next: "Next",',
    '  relatedHeading: "Related items",',
    '  edit: "Edit",',
    '  delete: "Delete",',
    '  share: "Share",',
    '  created: "Created",',
    '  updated: "Updated",',
    '  owner: "Owner",',
    '  status: "Status",',
    '  emptyRelated: "No related items yet.",',
    '  loadingHint: "Loading item…",',
    "};",
    "",
    "const statusStyles: Record<string, StatusStyle> = {",
    "  Published: {",
    "    className:",
    '      "bg-emerald-500/10 text-emerald-600 ring-1 ring-inset ring-emerald-500/20",',
    '    dotClassName: "bg-emerald-500",',
    "  },",
    "};",
    "",
    "const relatedItems: DetailRelatedItem[] = [",
    '  { id: "r1", title: "Related spec A", description: "Short summary." },',
    '  { id: "r2", title: "Related spec B", description: "Another link target." },',
    "];",
    "",
    "export function DetailViewComposableExample() {",
    "  return (",
    "    <DetailViewPage.Root>",
    "      <DetailViewPage.TopNav",
    "        labels={labels}",
    "        onBack={() => window.history.back()}",
    "        onPrevious={() => {}}",
    "        onNext={() => {}}",
    "        hasPrevious",
    "        hasNext",
    "      />",
    "",
    "      <DetailViewPage.Header",
    '        title="Button Component v2.4"',
    '        eyebrow="Library · Components"',
    '        subtitle="Composable slots let you reorder or omit regions without forking the template."',
    "        labels={labels}",
    "        onEdit={() => {}}",
    "        onShare={() => {}}",
    "        onDelete={() => {}}",
    "      />",
    "",
    "      <DetailViewPage.Metadata",
    '        createdAt="Apr 12, 2026"',
    '        updatedAt="Apr 18, 2026"',
    '        status="Published"',
    '        owner={{ name: "Aarav Mehta", initials: "AM" }}',
    "        statusStyles={statusStyles}",
    "        labels={labels}",
    "      />",
    "",
    "      <DetailViewPage.Content>",
    '        {"Summary line for the record.\\n\\nUse Content for prose or custom React nodes."}',
    "      </DetailViewPage.Content>",
    "",
    "      <DetailViewPage.RelatedList",
    "        items={relatedItems}",
    "        labels={labels}",
    '        onItemClick={(item) => console.log("open", item.id)}',
    "      />",
    "",
    "      <DetailViewPage.BottomNav",
    "        labels={labels}",
    "        onPrevious={() => {}}",
    "        onNext={() => {}}",
    "        hasPrevious",
    "        hasNext",
    "      />",
    "    </DetailViewPage.Root>",
    "  );",
    "}",
].join("\n");

/**
 * Interactive composable preview: sibling index + related navigation.
 * @returns Detail shell with live handlers for Storybook-style exploration.
 */
function ComposableDetailPreview() {
    const [index, setIndex] = useState(0);

    const titles = useMemo(
        () => ["Button Component v2.4", "Data Table Pagination Pattern"],
        []
    );

    const handlePrev = useCallback(() => {
        setIndex((i) => Math.max(0, i - 1));
    }, []);

    const handleNext = useCallback(() => {
        setIndex((i) => Math.min(titles.length - 1, i + 1));
    }, [titles.length]);

    return (
        <DetailViewPage.Root>
            <DetailViewPage.TopNav
                labels={FULL_LABELS}
                onBack={() => undefined}
                onPrevious={handlePrev}
                onNext={handleNext}
                hasPrevious={index > 0}
                hasNext={index < titles.length - 1}
            />

            <DetailViewPage.Header
                title={titles[index]}
                eyebrow="Library · Components"
                subtitle="Reorder TopNav, Metadata, Content, or RelatedList; inject your own data hooks per slot."
                labels={FULL_LABELS}
                onEdit={() => undefined}
                onShare={() => undefined}
                onDelete={() => undefined}
            />

            <DetailViewPage.Metadata
                createdAt="Apr 12, 2026"
                updatedAt="Apr 18, 2026"
                status="Published"
                owner={{ name: "Aarav Mehta", initials: "AM" }}
                statusStyles={STATUS_STYLES}
                labels={FULL_LABELS}
            />

            <DetailViewPage.Content>
                {`Summary for ${titles[index]}.

DetailViewPage.Content accepts a string (shown with preserved line breaks) or any ReactNode for custom blocks.`}
            </DetailViewPage.Content>

            <DetailViewPage.RelatedList
                items={RELATED}
                labels={FULL_LABELS}
                onItemClick={() => undefined}
            />

            <DetailViewPage.BottomNav
                labels={FULL_LABELS}
                onPrevious={handlePrev}
                onNext={handleNext}
                hasPrevious={index > 0}
                hasNext={index < titles.length - 1}
            />
        </DetailViewPage.Root>
    );
}

/**
 * Docusaurus demo: composable preview + documented code using a function return.
 */
export default function DetailViewPageDemo() {
    return (
        <div className="mb-8 flex flex-col space-y-6">
            <Tabs>
                <TabItem value="composable-preview" label="Composable preview" default>
                    <div className="mt-4 rounded-xl border border-slate-200 bg-background p-4 shadow-sm dark:border-slate-800">
                        <ComposableDetailPreview />
                    </div>
                </TabItem>
                <TabItem value="composable-code" label="Code">
                    <div className="mt-4">
                        <CodeBlock
                            language="tsx"
                            className="max-h-[520px] overflow-y-auto whitespace-pre-wrap text-sm"
                        >
                            {composableCodeExample}
                        </CodeBlock>
                    </div>
                </TabItem>
            </Tabs>
        </div>
    );
}
