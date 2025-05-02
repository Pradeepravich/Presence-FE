import { LocationItem } from "../services/useGetLocationsApi";

export const buildTree = (locations: any[]) => {
  const locationMap: { [key: number]: LocationItem } = {};
  locations?.forEach((loc) => {
    locationMap[loc.id] = { ...loc, subLocations: [] };
  });
  const tree: LocationItem[] = [];
  locations?.forEach((loc) => {
    if (loc.parent === null) {
      tree.push(locationMap[loc.id]);
    } else if (locationMap[loc.parent]) {
      locationMap[loc.parent].subLocations!.push(locationMap[loc.id]);
    }
  });
  return tree;
};

export const getExtremeChildren = (locations: LocationItem[]) => {
  const parentIds = new Set(
    locations.map((loc) => loc.parent).filter((parent) => parent !== null)
  );

  const extremeChildren = locations.filter((loc) => !parentIds.has(loc.id));

  return extremeChildren;
};
