import { useCallback, useEffect, useId } from "react";
import { TriangleDownIcon, TriangleUpIcon } from "@radix-ui/react-icons";
import { Flex, Table as TableR, Theme, ThemeProps } from "@radix-ui/themes";
import { Pagination, PaginationProps } from "./pagination";
import { motion, useAnimation } from "framer-motion";
import styles from "./Table.module.css";

export type TableSortBy = "asc" | "desc";
export interface TableProps {
	headings: Array<{
		label: React.ReactNode;
		key: string;
		sort: TableSortBy;
	}>;
	data: Array<Record<string, React.ReactNode>>;
	applySort: (key: string, value: TableSortBy) => void;
	variant?: "surface" | "ghost";
	headingVariant?: "row" | "column";
}

const animationCount: Record<string, number> = {};

function TableColumnHeadings({
	headings,
	data,
	applySort,
	variant = "surface",
}: TableProps): React.ReactNode {
	const tableId = useId();
	animationCount[tableId] = 0;

	const handleSort: React.MouseEventHandler<HTMLElement> = useCallback(
		ev => {
			const target = ev.currentTarget;
			const key = target.getAttribute("data-key") as string;
			const currentSortValue = target.getAttribute(
				"data-sort-by",
			) as TableSortBy;

			applySort(key, currentSortValue === "asc" ? "desc" : "asc");
		},
		[applySort],
	);

	return (
		<TableR.Root
			variant={variant}
			size="2"
		>
			<TableR.Header>
				<TableR.Row>
					{headings.map(heading => (
						<TableR.ColumnHeaderCell
							key={heading.key}
							style={{ cursor: "pointer" }}
							data-key={heading.key}
							data-sort-by={heading.sort}
							onClick={handleSort}
						>
							<AnimatedContent
								tableId={tableId}
								changeKey={`${heading.label}_${heading.sort}`}
								content={
									<Flex
										gap="2"
										justify="between"
										align="center"
									>
										<span>{heading.label}</span>
										{heading.sort === "asc" ? (
											<TriangleUpIcon />
										) : (
											<TriangleDownIcon />
										)}
									</Flex>
								}
							/>
						</TableR.ColumnHeaderCell>
					))}
				</TableR.Row>
			</TableR.Header>

			<TableR.Body>
				{data.map((value, index) => (
					<TableR.Row
						className={`${styles.tableRowHover}`}
						key={index}
					>
						{headings.map(heading => (
							<TableR.Cell key={index + heading.key}>
								<AnimatedContent
									tableId={tableId}
									changeKey={value[heading.key]?.toString() ?? ""}
									content={value[heading.key]}
								/>
							</TableR.Cell>
						))}
					</TableR.Row>
				))}
			</TableR.Body>
		</TableR.Root>
	);
}

function TableRowHeadings({
	headings,
	data,
	applySort,
	variant = "surface",
}: TableProps): React.ReactNode {
	const tableId = useId();
	animationCount[tableId] = 0;

	const handleSort: React.MouseEventHandler<HTMLElement> = useCallback(
		ev => {
			const target = ev.currentTarget;
			const key = target.getAttribute("data-key") as string;
			const currentSortValue = target.getAttribute(
				"data-sort-by",
			) as TableSortBy;

			applySort(key, currentSortValue === "asc" ? "desc" : "asc");
		},
		[applySort],
	);

	return (
		<TableR.Root
			variant={variant}
			size="2"
		>
			<TableR.Body>
				{headings.map(heading => (
					<TableR.Row key={heading.key}>
						<TableR.ColumnHeaderCell
							style={{
								cursor: "pointer",
								borderRight: "1px solid var(--gray-a5)",
							}}
							data-key={heading.key}
							data-sort-by={heading.sort}
							onClick={handleSort}
						>
							<AnimatedContent
								tableId={tableId}
								changeKey={`${heading.label}_${heading.sort}`}
								content={
									<Flex
										gap="2"
										justify="between"
										align="center"
									>
										<span>{heading.label}</span>
										{heading.sort === "asc" ? (
											<TriangleUpIcon />
										) : (
											<TriangleDownIcon />
										)}
									</Flex>
								}
							/>
						</TableR.ColumnHeaderCell>
						{data.map((value, index) => (
							<TableR.Cell key={index + heading.key}>
								<AnimatedContent
									tableId={tableId}
									changeKey={value[heading.key]?.toString() ?? ""}
									content={value[heading.key]}
								/>
							</TableR.Cell>
						))}
					</TableR.Row>
				))}
			</TableR.Body>
		</TableR.Root>
	);
}

function AnimatedContent({
	content,
	changeKey,
	tableId,
}: {
	content: React.ReactNode;
	changeKey: string;
	tableId: string;
}): React.ReactNode {
	const controls = useAnimation();

	useEffect(() => {
		controls.set({ opacity: 0, transition: { duration: 0, delay: 0 } });
		controls.start({
			opacity: 1,
			transition: {
				duration: 0.5,
				delay: animationCount[tableId] * 0.03,
			},
		});
		animationCount[tableId]++;
	}, [changeKey, tableId, controls]);

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={controls}
		>
			{content}
		</motion.div>
	);
}

export function Table({
	accentColor,
	grayColor,
	panelBackground,
	scaling,
	radius,
	appearance,
	style,
	className,
	currentPage,
	totalPages,
	onPageChange,
	headingVariant = "column",
	...props
}: TableProps & {
	accentColor?: ThemeProps["accentColor"];
	grayColor?: ThemeProps["grayColor"];
	panelBackground?: ThemeProps["panelBackground"];
	scaling?: ThemeProps["scaling"];
	radius?: ThemeProps["radius"];
	appearance?: ThemeProps["appearance"];
	style?: React.CSSProperties;
	className?: string;
} & PaginationProps): React.ReactNode {
	const tableComponent =
		headingVariant === "row" ? (
			<TableRowHeadings {...props} />
		) : (
			<TableColumnHeadings {...props} />
		);

	return (
		<Theme
			style={style}
			className={className}
			accentColor={accentColor}
			grayColor={grayColor}
			panelBackground={panelBackground}
			scaling={scaling}
			radius={radius}
			appearance={appearance}
		>
			<Flex
				direction="column"
				align="center"
				justify="center"
				gap="2"
			>
				{tableComponent}
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={onPageChange}
				/>
				<div></div>
			</Flex>
		</Theme>
	);
}