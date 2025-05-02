import { useState, useMemo, useCallback } from "react";
import { Position, ReactFlow, Node, Edge, Background } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Count, { CountProps } from "./CountNode";
import { Box, Typography } from "@mui/material";
import LocationNode from "./LocationNode";
import AddNewLocationNode from "./AddNewNode";
import { useAddLocationsApi } from "../../services/useAddLocationsApi";
import { useDeleteLocationApi } from "../../services/useDeleteLocationApi";
import useConfirm from "../../hooks/useConfirm";
import { enqueueSnackbar } from "notistack";

const nodeTypes = {
  count: ({ data }: CountProps) => <Count data={data} />,
  location: LocationNode,
  add: AddNewLocationNode,
};

interface Location {
  id: number;
  name: string;
  timezone: string;
  parent: number | null;
}

interface LocationEditorProps {
  locations: Location[];
  refresh: VoidFunction;
}

export const LocationEditor = ({ locations, refresh }: LocationEditorProps) => {
  const [selectedLevels, setSelectedLevels] = useState<(number | null)[][]>([
    [null], // Root level should track `null` parent locations
  ]);
  const { addLocation } = useAddLocationsApi();
  const { deleteLocation } = useDeleteLocationApi(false);
  const { confirm } = useConfirm();

  // Toggle a selected node, ensuring only one level + next level expands
  const toggleNode = (nodeId: number, level: number) => {
    setSelectedLevels((prev) => {
      const newLevels = [...prev.slice(0, level)]; // Keep previous levels intact
      if (newLevels[level]?.includes(nodeId)) {
        newLevels[level] = newLevels[level].filter((id) => id !== nodeId);
      } else {
        newLevels[level] = [nodeId]; // Only one expanded at a time in each level
        newLevels[level + 1] = []; // Ensure next level resets
      }
      return newLevels;
    });
  };

  // Get children of a location
  const getChildren = useCallback(
    (parentId: number | null) =>
      locations.filter((loc) => loc.parent === parentId),
    [locations]
  );

  // Recursive function to calculate total child count
  const calculateTotalCount = useCallback(
    (parentId: number): number => {
      const children = getChildren(parentId);
      return (
        children.length +
        children.reduce((sum, child) => sum + calculateTotalCount(child.id), 0)
      );
    },
    [getChildren]
  );

  const handleAddNewLocation = useCallback(
    (location: string, timezone: string, parentId: number | null) => {
      addLocation({
        name: location,
        is_deleted: false,
        parent: parentId,
        timezone,
      }).then(() => {
        refresh();
      });
    },
    [addLocation, refresh]
  );

  const handleDelete = useCallback(
    async (location: Location) => {
      const isDeleteConfirmed = await confirm({
        title: "Confirm Delete",
        content: (
          <div>
            <Typography>
              Are you sure you want to delete
              <Typography fontWeight="bold" display="inline-block">
                {location.name}?
              </Typography>
            </Typography>
            <Typography mt={2}>
              Deleting this Location will permanently remove all associated data
              and cannot be retrieved later
            </Typography>
          </div>
        ),
        confirmButtonText: "Yes, Delete",
        confirmColor: "error.main",
        cancelColor: "grey.300",
        cancelButtonText: "No, Cancel",
        width: "400px",
      });
      if (isDeleteConfirmed) {
        deleteLocation(location.id)
          .then(() => {
            refresh();
          })
          .catch((error) => {
            enqueueSnackbar(error.response.data.detail, { variant: "error" });
          });
      }
    },
    [confirm, deleteLocation, refresh]
  );

  // Memoized function to generate nodes dynamically
  const nodes: Node[] = useMemo(() => {
    const generatedNodes: Node[] = [];
    const ySpacing = 100;
    const xSpacing = 250;
    const startY = 100; // Always start from top

    // Add root node "All Locations"
    generatedNodes.push({
      id: "root",
      data: { label: "All Locations", active: true, id: 0 },
      position: { x: 0, y: startY },
      sourcePosition: Position.Right,
      type: "location",
    });

    const generateNodes = (
      parentId: number | null,
      x: number,
      yStart: number, // Ensure children start from top
      level: number
    ) => {
      const children = getChildren(parentId);
      let currentY = yStart; // Reset Y-position for each level

      children.forEach((location) => {
        const totalCount = calculateTotalCount(location.id);
        const isActive = selectedLevels[level]?.includes(location.id);

        // Create the main location node
        generatedNodes.push({
          id: `${location.id}`,
          data: {
            label: location.name,
            active: isActive,
            id: location.id,
            onClick: () => toggleNode(location.id, level),
            onDelete: () => {
              handleDelete(location);
            },
          },
          position: { x, y: currentY },
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
          type: "location",
        });

        // If not active, add a count node instead of children
        if (!isActive && totalCount > 0) {
          generatedNodes.push({
            id: `${location.id}-c`,
            data: { count: totalCount },
            position: { x: x + 120, y: currentY + 6 },
            targetPosition: Position.Left,
            type: "count",
          });
        }

        // Recursively generate child nodes only if active
        if (isActive) {
          generateNodes(location.id, x + xSpacing, startY, level + 1);
        }

        currentY += ySpacing;
      });

      // Add "Add New" node at the correct position with parentId in data
      const addNewId = `${parentId ?? "root"}-add`;
      generatedNodes.push({
        id: addNewId,
        data: {
          label: "Add",
          onAdd: (location: string, timezone: string) =>
            handleAddNewLocation(location, timezone, parentId),
        },
        position: { x, y: currentY },
        type: "add",
      });

      return addNewId;
    };

    generateNodes(null, 200, startY, 1); // Start from "All Locations" (id = null)
    return generatedNodes;
  }, [
    getChildren,
    calculateTotalCount,
    selectedLevels,
    handleDelete,
    handleAddNewLocation,
  ]);

  // Memoized function to generate edges dynamically, including edges for "Add New" nodes
  const edges: Edge[] = useMemo(() => {
    const generatedEdges: Edge[] = [];

    locations.forEach((location) => {
      if (
        location.parent === null ||
        selectedLevels.some((level) => level.includes(location.parent))
      ) {
        const parentNodeId =
          location.parent === null ? "root" : `${location.parent}`;
        generatedEdges.push({
          id: `e${parentNodeId}-${location.id}`,
          source: parentNodeId,
          target: `${location.id}`,
          type: "step",
        });
      }

      // Add edges for count nodes
      if (!selectedLevels.some((level) => level.includes(location.id))) {
        const totalCount = calculateTotalCount(location.id);
        if (totalCount > 0) {
          generatedEdges.push({
            id: `e${location.id}-${location.id}-c`,
            source: `${location.id}`,
            target: `${location.id}-c`,
            type: "step",
          });
        }
      }
    });

    // Add edges for "Add New" nodes
    nodes.forEach((node) => {
      if (node.type === "add") {
        const parentId = node.id.split("-")[0]; // Extract parent ID
        generatedEdges.push({
          id: `e${parentId}-${node.id}`,
          source: parentId,
          target: node.id,
          type: "step",
        });
      }
    });

    return generatedEdges;
  }, [calculateTotalCount, locations, selectedLevels, nodes]);

  return (
    <Box sx={{ height: "calc(100vh - 120px)" }}>
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes}>
        <Background />
      </ReactFlow>
    </Box>
  );
};
