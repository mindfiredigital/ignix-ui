/**
 * AdvancedTable Demo for docs.
 *
 * Shows Base, Sortable, Filterable, Paginated, and Full variants
 * with sample rows and columns.
 */

import React, { useState } from "react";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";
import VariantSelector from "./VariantSelector";
import { AdvancedTable, type AdvancedTableRow } from "@site/src/components/UI/advanced-table";

const sampleColumns = [
  { key: "id", label: "ID", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: "email", label: "Email", sortable: true },
  { key: "role", label: "Role", sortable: true },
  { key: "status", label: "Status", sortable: false },
];

const sampleRows: AdvancedTableRow[] = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin", status: "Active" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", role: "Editor", status: "Invited" },
  { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "Viewer", status: "Active" },
  { id: 4, name: "Diana Prince", email: "diana@example.com", role: "Admin", status: "Suspended" },
  { id: 5, name: "Ethan Hunt", email: "ethan@example.com", role: "Editor", status: "Active" },
  { id: 6, name: "Fiona Gallagher", email: "fiona@example.com", role: "Viewer", status: "Pending" },
  { id: 7, name: "George Miller", email: "george@example.com", role: "Viewer", status: "Active" },
  { id: 8, name: "Hannah Lee", email: "hannah@example.com", role: "Admin", status: "Active" },
  { id: 9, name: "Ian Wright", email: "ian@example.com", role: "Editor", status: "Invited" },
  { id: 10, name: "Julia Roberts", email: "julia@example.com", role: "Viewer", status: "Active" },
  { id: 11, name: "Kevin Durant", email: "kevin@example.com", role: "Viewer", status: "Pending" },
  { id: 12, name: "Laura Palmer", email: "laura@example.com", role: "Admin", status: "Suspended" },
];

const modeOptions = ["full", "base", "sortable", "filterable", "paginated"];

const AdvancedTableDemo = () => {
  const [mode, setMode] = useState("full");

  const enableSorting = mode === "full" || mode === "sortable";
  const enableFiltering = mode === "full" || mode === "filterable";
  const enablePagination = mode === "full" || mode === "paginated";

  const codeString = `
<AdvancedTable
  rows={sampleRows}
  columns={sampleColumns}
  enableSorting={${enableSorting}}
  enableFiltering={${enableFiltering}}
  enablePagination={${enablePagination}}
/>
`;

  return (
    <div className="space-y-8 mb-8">
      <div className="flex flex-wrap gap-4 justify-start sm:justify-end">
        <div className="space-y-2">
          <VariantSelector
            variants={modeOptions}
            selectedVariant={mode}
            onSelectVariant={setMode}
            type="Mode"
          />
        </div>
      </div>

      <Tabs>
        <TabItem value="preview" label="Preview">
          <div className="p-6 border rounded-lg mt-4">
            <AdvancedTable
              rows={sampleRows}
              columns={sampleColumns}
              enableSorting={enableSorting}
              enableFiltering={enableFiltering}
              enablePagination={enablePagination}
            />
          </div>
        </TabItem>
        <TabItem value="code" label="Code">
          <div className="mt-4">
            <CodeBlock language="tsx" className="text-sm">
              {codeString}
            </CodeBlock>
          </div>
        </TabItem>
      </Tabs>
    </div>
  );
};

/** Base table only (no sort, filter, pagination). */
export const AdvancedTableBaseDemo = () => (
  <div className="p-6 border rounded-lg">
    <AdvancedTable
      rows={sampleRows}
      columns={sampleColumns}
      enableSorting={false}
      enableFiltering={false}
      enablePagination={false}
    />
  </div>
);

/** Sortable table only. */
export const AdvancedTableSortableDemo = () => (
  <div className="p-6 border rounded-lg">
    <AdvancedTable
      rows={sampleRows}
      columns={sampleColumns}
      enableSorting
      enableFiltering={false}
      enablePagination={false}
    />
  </div>
);

/** Filterable table only. */
export const AdvancedTableFilterableDemo = () => (
  <div className="p-6 border rounded-lg">
    <AdvancedTable
      rows={sampleRows}
      columns={sampleColumns}
      enableSorting={false}
      enableFiltering
      enablePagination={false}
    />
  </div>
);

/** Paginated table only. */
export const AdvancedTablePaginatedDemo = () => (
  <div className="p-6 border rounded-lg">
    <AdvancedTable
      rows={sampleRows}
      columns={sampleColumns}
      enableSorting={false}
      enableFiltering={false}
      enablePagination
    />
  </div>
);

/** Full-featured table. */
export const AdvancedTableFullDemo = () => (
  <div className="p-6 border rounded-lg">
    <AdvancedTable rows={sampleRows} columns={sampleColumns} />
  </div>
);

export default AdvancedTableDemo;
