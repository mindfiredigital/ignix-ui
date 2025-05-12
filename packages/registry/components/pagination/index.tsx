import { useCallback, useMemo } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { Flex, Button, Text, FlexProps, ButtonProps } from "@radix-ui/themes";
import { useMediaQuery } from "react-responsive";
import styles from "./Pagination.module.css";

export interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (value: number) => void;
	color?: ButtonProps["color"];
	borderRadius?: ButtonProps["radius"];
	activeColor?: ButtonProps["color"];
	alignment?: FlexProps["justify"];
}

export function Pagination({
	currentPage,
	totalPages,
	onPageChange,
	color = "gray",
	borderRadius = "full",
	activeColor = "blue",
	alignment = "end",
}: PaginationProps): React.ReactNode {
	const isMobile = useMediaQuery({ maxWidth: 768 });

	const pageNumbers = useMemo(() => {
		const pn = [];
		const maxVisiblePages = 5;
		const maxAdjacentPages = isMobile ? 1 : 2;

		if (totalPages <= maxVisiblePages) {
			for (let i = 1; i <= totalPages; i++) {
				pn.push(i);
			}
		} else {
			if (currentPage <= maxAdjacentPages + 1) {
				for (let i = 1; i <= maxVisiblePages - 2; i++) {
					pn.push(i);
				}
				pn.push("...", totalPages);
			} else if (currentPage >= totalPages - maxAdjacentPages) {
				pn.push(1, "...");
				for (let i = totalPages - (maxVisiblePages - 3); i <= totalPages; i++) {
					pn.push(i);
				}
			} else {
				pn.push(1, "...");
				for (
					let i = currentPage - maxAdjacentPages;
					i <= currentPage + maxAdjacentPages;
					i++
				) {
					pn.push(i);
				}
				pn.push("...", totalPages);
			}
		}
		return pn;
	}, [currentPage, totalPages, isMobile]);

	const handlePageClick = useCallback(
		(page: string) => {
			if (page === "<") {
				onPageChange(currentPage - 1);
			} else if (page === ">") {
				onPageChange(currentPage + 1);
			} else if (page === "...") {
				return;
			} else {
				onPageChange(parseInt(page));
			}
		},
		[currentPage, onPageChange],
	);

	return (
		<Flex
			align="center"
			justify={alignment}
			gap={isMobile ? "1" : "2"}
		>
			<Button
				className={`${styles.button} ${styles.chevronButton} ${
					currentPage === 1 ? styles.disabledButton : ""
				}`}
				variant="soft"
				color={color}
				radius={borderRadius}
				onClick={() => handlePageClick("<")}
				disabled={currentPage === 1}
				size={isMobile ? "1" : "2"}
			>
				<ChevronLeftIcon height={isMobile ? "15px" : "20px"} />
			</Button>
			{pageNumbers.map((page, index) => (
				<Button
					key={index}
					className={`${styles.button} ${
						currentPage === page ? styles.activeButton : ""
					} ${page === "..." ? styles.disabledButton : ""}`}
					variant={currentPage === page ? "solid" : "soft"}
					color={currentPage === page ? activeColor : color}
					radius={borderRadius}
					onClick={() => handlePageClick(page + "")}
					disabled={page === "..."}
					size={isMobile ? "1" : "2"}
				>
					<Text
						className={styles.text}
						size={isMobile ? "1" : "2"}
					>
						{page}
					</Text>
				</Button>
			))}
			<Button
				className={`${styles.button} ${styles.chevronButton} ${
					currentPage === totalPages ? styles.disabledButton : ""
				}`}
				variant="soft"
				color={color}
				radius={borderRadius}
				onClick={() => handlePageClick(">")}
				disabled={currentPage === totalPages}
				size={isMobile ? "1" : "2"}
			>
				<ChevronRightIcon height={isMobile ? "15px" : "20px"} />
			</Button>
		</Flex>
	);
}
