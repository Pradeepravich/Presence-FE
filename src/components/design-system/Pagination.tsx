import {
  Box,
  Typography,
  styled,
  Pagination as MuiPagination,
} from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import Dropdown from "./Dropdown";

const StyledPagination = styled(MuiPagination)(() => ({
  "& .MuiPaginationItem-root": {
    fontWeight: 400,
  },
  "& .MuiPaginationItem-previousNext": {
    borderRadius: 4,
    backgroundColor: "#EEEEEE",
    margin: 8,
  },
  "& .MuiSvgIcon-root": { color: "black" },
}));

interface PaginationProps {
  page: number;
  pageSize: string;
  setPage: Dispatch<SetStateAction<number>>;
  setPageSize: Dispatch<SetStateAction<string>>;
  count: number;
}

const pageSizeOptions = [
  { value: "10", label: "10" },
  { value: "20", label: "20" },
  { value: "30", label: "30" },
  { value: "40", label: "40" },
  { value: "50", label: "50" },
];

const Pagination = ({
  page,
  pageSize,
  setPage,
  setPageSize,
  count,
}: PaginationProps) => {
  return (
    <Box display="flex" justifyContent="space-between" mt={1}>
      <StyledPagination
        count={Math.ceil(count / Number(pageSize))}
        size="small"
        page={Number(page)}
        onChange={(_, newPage) => setPage(newPage)}
      />
      <Box display="flex" gap={1} alignItems="center">
        <Typography variant="subtitle1">Showing</Typography>
        <Dropdown
          options={pageSizeOptions}
          value={pageSize}
          onChange={setPageSize}
        />
        <Typography variant="subtitle1">of</Typography>
        <Typography variant="body2" display="inline">
          {count}
        </Typography>
      </Box>
    </Box>
  );
};

export default Pagination;
