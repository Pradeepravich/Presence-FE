import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  styled,
  TableSortLabel,
  Box,
  TableContainer,
  SxProps,
  Typography,
  useTheme,
} from "@mui/material";
import { Dispatch, ReactNode, SetStateAction, useCallback } from "react";
import LoadingOverlay from "./LoadingOverlay";
import InfiniteScrollList from "../InfiniteScrollList";

export interface Column<T> {
  field: keyof T;
  title: string | ReactNode;
  sortable: boolean;
  width?: number;
  component?: (row: T) => JSX.Element;
  sticky?: boolean;
  minWidth?: number;
}

interface GridTableProps<T extends { id: string | number }> {
  columns: Column<T>[];
  data: T[];
  width?: number;
  orderBy: keyof T;
  setOrderBy: Dispatch<SetStateAction<keyof T>>;
  order: "asc" | "desc";
  setOrder: Dispatch<SetStateAction<"asc" | "desc">>;
  handleSort: (column: keyof T) => void;
  isLoading?: boolean;
  sx?: SxProps;
  hasMore: boolean;
  loadMore: () => void;
  error: Error | null;
}

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  position: "sticky",
  top: 0,
  zIndex: 1000,
  backgroundColor: theme.palette.customColors[100],
  borderRadius: "4px",
  "& .MuiTableCell-root": {
    fontSize: "9px",
    fontWeight: 400,
    "& .MuiTypography-root": {
      fontSize: "9px",
      fontWeight: 400,
    },
  },
}));

const StyledTableBody = styled(TableBody)(({ theme }) => ({
  borderRadius: "4px",
  "& .MuiTableRow-root:nth-of-type(odd)": {
    backgroundColor:
      theme.palette.mode === "light" ? "rgba(236, 239, 241, 0.5)" : "#37383d",
  },
  "& .MuiTableRow-root:nth-of-type(even)": {
    backgroundColor: theme.palette.mode === "light" ? "#ffffff" : "#2f2f37",
  },
  "& .MuiTableCell-root": {
    fontSize: "11px",
    fontWeight: 400,
    "& .MuiTypography-root": {
      fontSize: "11px",
      fontWeight: 400,
    },
  },
}));

const GridTable = <T extends { id: string | number }>({
  columns,
  data,
  orderBy,
  order,
  handleSort,
  isLoading = false,
  sx,
  hasMore,
  loadMore,
  error,
}: GridTableProps<T>) => {
  const theme = useTheme();
  const getColumnStyles = useCallback(
    (sticky: boolean, minWidth?: number, header?: boolean, idx: number = 0) => {
      const styles: any = {};
      if (minWidth) styles.minWidth = minWidth;
      if (sticky) {
        styles.position = "sticky";
        styles.left = 0;
        styles.zIndex = 1;
        styles.backgroundColor = header
          ? theme.palette.mode === "light"
            ? "#ffffff"
            : "#3A3A41"
          : theme.palette.mode === "light"
          ? idx % 2 === 0
            ? "rgba(236, 239, 241, 0.2)"
            : "#ffffff"
          : idx % 2 === 0
          ? "#37383d"
          : "#2f2f37";
      }
      return styles;
    },
    [theme.palette.mode]
  );

  return (
    <Box position="relative">
      {isLoading && <LoadingOverlay isLoading={isLoading} />}
      <TableContainer sx={{ ...sx }}>
        <Table size="small">
          <StyledTableHead
            sx={{
              th: { py: "12px", px: "16px" },
              position: isLoading ? "inherit" : "sticky",
            }}
          >
            <TableRow>
              {columns.map(
                ({ field, title, sortable, width, sticky, minWidth }) => (
                  <TableCell
                    key={String(field)}
                    sx={{
                      ...getColumnStyles(sticky ?? false, minWidth, true),
                      width: width || "auto",
                    }}
                  >
                    {sortable ? (
                      <TableSortLabel
                        active={orderBy === field}
                        direction={orderBy === field ? order : "asc"}
                        onClick={() => handleSort(field)}
                      >
                        {title}
                      </TableSortLabel>
                    ) : (
                      title
                    )}
                  </TableCell>
                )
              )}
            </TableRow>
          </StyledTableHead>
          <StyledTableBody sx={{ td: { border: "none" } }}>
            <InfiniteScrollList
              hasMore={hasMore}
              isLoading={isLoading}
              loadMore={loadMore}
              error={error}
              isElementInTable
            >
              {data?.map((row, idx) => (
                <TableRow key={row?.id}>
                  {columns?.map((column, colIndex) => (
                    <TableCell
                      key={colIndex}
                      sx={getColumnStyles(
                        column.sticky ?? false,
                        column.minWidth,
                        false,
                        idx
                      )}
                    >
                      {column.component
                        ? column.component(row)
                        : String(row[column.field])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </InfiniteScrollList>
          </StyledTableBody>
        </Table>
      </TableContainer>
      {data.length === 0 && (
        <Typography align="center" my={4}>
          {isLoading ? "" : "No Items found"}
        </Typography>
      )}
    </Box>
  );
};

export default GridTable;
