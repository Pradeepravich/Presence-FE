import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Box, styled } from "@mui/material";

const CountDisplay = styled(Box)(({ theme }) => ({
  width: 24,
  height: 24,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.25)",
  fontWeight: 600,
  fontSize: 11,
  backgroundColor:
    theme.palette.mode === "light" ? theme.palette.common.white : "#2F2F38",
  color: theme.palette.text.primary,
}));

export interface CountProps {
  data: {
    count: number;
  };
  isPlain?: boolean;
}

const Count = memo(({ data, isPlain }: CountProps) => {
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={false}
        style={{ visibility: isPlain ? "hidden" : undefined }}
      />
      <CountDisplay>{data.count}</CountDisplay>
    </>
  );
});

export default Count;
