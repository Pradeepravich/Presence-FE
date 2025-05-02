import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Box, Fab, styled, useTheme } from "@mui/material";
import { Delete } from "@mui/icons-material";

const LabelDisplay = styled(Box)(({ theme }) => ({
  width: 100,
  height: 36,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.25)",
  fontWeight: 600,
  fontSize: 11,
  backgroundColor: theme.palette.common.white,
  borderRadius: 4,
  cursor: "pointer",
  padding: "0 4px",
  position: "relative",
  "&:hover .MuiFab-root": {
    display: "inherit",
  },
}));

interface LocationNodeProps {
  data: {
    label: string;
    active: boolean;
    id: number;
    onClick: VoidFunction;
    onDelete: VoidFunction;
    color?: string; // Optional color prop
  };
}

const LocationNode = memo(({ data }: LocationNodeProps) => {
  const theme = useTheme();
  return (
    <>
      <Handle type="target" position={Position.Left} isConnectable={false} />
      <LabelDisplay
        onClick={data.onClick}
        sx={          
          {
            backgroundColor: data.active
              ? "#039BE5"
              : theme.palette.mode === "light" ? "#ffffff" : "#2F2F38", 

            color: data.active
              ? theme.palette.common.white
              : theme.palette.mode === "light" ? "#000000" : "#ffffff",              
          }
        }
      >
        {data.label}
        {!!data.id && (
          <Fab
            size="small"
            color="error"
            sx={{ position: "absolute", right: -5, top: -5, display: "none" }}
            onClick={(e) => {
              e.stopPropagation();
              data.onDelete();
            }}
          >
            <Delete sx={{ fontSize: 12 }} />
          </Fab>
        )}
      </LabelDisplay>
      <Handle type="source" position={Position.Right} isConnectable={false} />
    </>
  );
});

export default LocationNode;
