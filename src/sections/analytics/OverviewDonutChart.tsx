import { Box } from "@mui/material";
import DonutChart from "../../components/charts/DonutChart";
import CardComponent from "../../components/design-system/Card";
import Description from "./Description";

interface Chartprops {
  data: number[];
  title?: string;
  description: string;
}
const OverviewDonutChart = ({ data, title, description }: Chartprops) => {
  return (
    <CardComponent
      sx={{
        p: 2,
        py: 1.5,
        minWidth: 0,
        "@media print": { width: "30%" },
        height: "calc(100vh - 215px)",
        overflowY: "auto",
        scrollbarGutter: "stable",
      }}
    >
      <Description title={title ?? ""}>{description}</Description>
      <Box mt={4} my={2}>
        <DonutChart data={data} legendPosition="column" />
      </Box>
    </CardComponent>
  );
};

export default OverviewDonutChart;
