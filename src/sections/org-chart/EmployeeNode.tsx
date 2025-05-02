import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { OrgChartUser } from "../../services/useOrgChartApi";
import { Box, Stack, styled, Avatar, BoxProps } from "@mui/material";
import { statusIcons } from "../../utils/constants";
import { getDepartmentColor } from "../../utils/format";

interface EmployeeNodeProps {
  data: OrgChartUser & {
    label: string;
    active: boolean;
    onClick: VoidFunction;
    level: number;
  };
}

const NodeContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "active",
})<{ active?: boolean }>(({ active, theme }) => ({
  width: 180,
  height: 80,
  padding: theme.spacing(2),
  background: theme.palette.mode === "dark" ? "#2F2F38" : "white",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
  borderRadius: 8,
  outline: active ? "2px #3282B8 solid" : "none",
  outlineOffset: "-2px",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

const StatusIndicatorWrapper = styled(Box)({
  position: "absolute",
  left: 16,
  top: 39,
  width: 16,
  height: 16,
  background: "white",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const InfoContainer = styled(Stack)({
  width: 90,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "flex-start",
  gap: 4,
  overflow: "hidden",
});

const TextEllipsis = styled(Box)({
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  width: "100%",
});

const NameText = styled(TextEllipsis)(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "white" : "black",
  fontSize: 12,
  fontFamily: "Sora",
  fontWeight: 600,
}));

const PositionText = styled(TextEllipsis)(() => ({
  fontSize: 10,
  maxWidth: 70,
}));

// Extend BoxProps with department prop
interface DepartmentBadgeProps extends BoxProps {
  department: string;
}

// Styled component with department prop
const DepartmentBadge = styled(Box, {
  shouldForwardProp: (prop) => prop !== "department",
})<DepartmentBadgeProps>(({ theme, department }) => {
  const backgroundColor = getDepartmentColor(department);
  return {
    padding: theme.spacing(0.5),
    background: backgroundColor,
    borderRadius: 4,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#000",
  };
});

const EmployeeNode = memo(({ data }: EmployeeNodeProps) => {
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={false}
        style={{ visibility: "hidden" }}
      />
      <NodeContainer
        onClick={data.reportee_count !== 0 ? data.onClick : undefined}
        active={data.active}
      >
        <Box
          position="relative"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Avatar
            alt={data.name}
            src={data.profile_picture}
            sx={{ width: 48, height: 48 }}
          />
          <StatusIndicatorWrapper>
            <img
              src={statusIcons[data.status || "Available"]}
              alt={"alt"}
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
              }}
            />
          </StatusIndicatorWrapper>
        </Box>
        <InfoContainer>
          <NameText>{data.label}</NameText>
          <PositionText>{data.job_title}</PositionText>

          {data.department && (
            <DepartmentBadge department={data.department}>
              <PositionText>{data.department}</PositionText>
            </DepartmentBadge>
          )}
        </InfoContainer>
      </NodeContainer>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={false}
        style={{ visibility: "hidden" }}
        color="black"
      />
    </>
  );
});

export default EmployeeNode;
