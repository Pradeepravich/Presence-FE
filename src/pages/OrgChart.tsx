import { useState, useCallback, useRef, useEffect } from "react";
import { Node, Edge, ReactFlow, Background, MarkerType } from "@xyflow/react";
import { useOrgChartApi } from "../services/useOrgChartApi";
import { Box, Stack, Typography } from "@mui/material";
import LayoutComponent, { IconButtonBase } from "../components/LayoutComponent";
import "@xyflow/react/dist/style.css";
import EmployeeNode from "../sections/org-chart/EmployeeNode";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useNavigate, useSearchParams } from "react-router-dom";
import EmployeeAutoComplete from "../sections/settings/EmployeeAutoComplete";
import { useGetUserApi } from "../services/useGetUserApi";
import { AutoCompleteMultipleOption } from "../components/design-system/AutoCompleteMultiple";
import Count, { CountProps } from "../sections/manage-locations/CountNode";
import LoadingOverlay from "../components/design-system/LoadingOverlay";

const nodeTypes = {
  employee: EmployeeNode,
  count: ({ data }: CountProps) => <Count data={data} isPlain />,
};

const OrgChart = () => {
  const { fetchOrgChartData, isLoading } = useOrgChartApi();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const navigate = useNavigate();
  const init = useRef(false);
  const activePathRef = useRef<string[]>([]);

  const [urlParams] = useSearchParams();

  const employeeId = urlParams.get("employeeId");

  const handleNodeClick = useCallback(
    async (parentId: number | null, level: number) => {
      const children = await fetchOrgChartData({ manager_id: parentId });

      const parentKey = parentId?.toString() || "root";
      activePathRef.current = activePathRef.current
        .slice(0, level - 1)
        .concat(parentKey);

      const newChildNodes: Node[] = [];
      const ySpacing = 120; // vertical spacing per node
      // Create nodes for each child, and if reportee_count > 0, add a count node
      children.forEach((child, i) => {
        const employeeNode: Node = {
          id: child.id.toString(),
          data: {
            ...child,
            label: child.name,
            level,
            onClick: () => handleNodeClick(child.id, level + 1),
          },
          position: { x: (level - 1) * 300, y: i * ySpacing },
          type: "employee",
        };
        newChildNodes.push(employeeNode);

        if (child.reportee_count > 0) {
          const countNode: Node = {
            id: `${child.id}-c`,
            data: { count: child.reportee_count, level },
            position: { x: (level - 1) * 300 + 200, y: i * ySpacing + 28 },
            type: "count",
          };
          newChildNodes.push(countNode);
        }
      });

      setNodes((prevNodes) => [
        ...prevNodes
          .filter((node) => (node.data.level as number) < level)
          .map((node) => ({
            ...node,
            data: {
              ...node.data,
              active: activePathRef.current.includes(node.id),
            },
          })),
        ...newChildNodes,
      ]);

      setEdges((prevEdges) => {
        const allEdges = [...prevEdges];

        // Create edges connecting the parent node to each employee,
        // and if applicable, add an edge from the employee to its count node.
        children.forEach((child) => {
          allEdges.push({
            id: `${parentKey}-${child.id}`,
            source: parentKey,
            target: child.id.toString(),
            type: "step",
          });
          if (child.reportee_count > 0) {
            allEdges.push({
              id: `${child.id}-${child.id}-c`,
              source: child.id.toString(),
              target: `${child.id}-c`,
              type: "step",
            });
          }
        });

        // Update edges styling based on active path
        const updatedEdges = allEdges.map((edge) => {
          const isActive =
            activePathRef.current.includes(edge.source) &&
            activePathRef.current.includes(edge.target);
          return {
            ...edge,
            style: {
              stroke: isActive ? "#3282B8" : "",
              strokeWidth: isActive ? 2 : 1,
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: isActive ? "#3282B8" : "",
            },
          };
        });
        return updatedEdges;
      });
      return children;
    },
    [fetchOrgChartData]
  );

  const { execute: fetchEmployee } = useGetUserApi();

  const getEmployeeTree = useCallback(
    (id: string) => {
      fetchEmployee({ id }).then((employee) => {
        const newNodes = [
          {
            id: employee.id.toString(),
            data: {
              ...employee,
              label: employee.name,
              level: 1,
            },
            position: { x: 0, y: 0 },
            type: "employee",
          },
        ];
        setNodes(newNodes);
        setEdges([]);
        handleNodeClick(employee.id, 2);
      });
    },
    [fetchEmployee, handleNodeClick]
  );

  useEffect(() => {
    if (employeeId) {
      getEmployeeTree(employeeId);
    } else if (!init.current) {
      handleNodeClick(null, 1).then((children) => {
        handleNodeClick(children[0].id, 2);
      });
      init.current = true;
    }
  }, [employeeId, getEmployeeTree, handleNodeClick]);

  const getSearchedEmployee = (val: AutoCompleteMultipleOption | null) => {
    if (val) getEmployeeTree(val.value);
    else handleNodeClick(null, 1);
  };

  return (
    <LayoutComponent>
      <Box component="section" p={3}>
        <Stack direction="row" alignItems="center" gap={2}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButtonBase onClick={() => navigate(-1)}>
              <KeyboardBackspaceIcon />
            </IconButtonBase>
            <Typography variant="h4">Organization Hierarchy</Typography>
          </Stack>
          <EmployeeAutoComplete getSearchedEmployee={getSearchedEmployee} />
        </Stack>
        <LoadingOverlay isLoading={isLoading} />
        <Box sx={{ height: "calc(100vh - 120px)", padding: 3 }}>
          <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes}>
            <Background />
          </ReactFlow>
        </Box>
      </Box>
    </LayoutComponent>
  );
};

export default OrgChart;
