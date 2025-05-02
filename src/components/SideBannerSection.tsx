import { styled, Box, Typography } from "@mui/material";
import WomanWithClockimg from "../assets/woman-holding-clock.png";
const SideBannerSection = () => {
  const BannerSection = styled(Box)(({ theme }) => ({
    height: "calc(100vh - 40px)",
    width: "calc(100% - 500px)",
    padding: 100,
    background: theme.palette.mode === "light" ? "#F2F2F2" : "",
  }));
  return (
    <BannerSection position="relative" display={{ xs: "none", lg: "block" }}>
      <Typography fontSize={44} width={440} fontWeight={800}>
        Efficiently monitor your organization's Productivity with
        <Typography color="#5D22FF" fontSize={44} fontWeight={800}>
          Presence
        </Typography>
      </Typography>
      <Box
        component={"img"}
        src={WomanWithClockimg}
        alt=""
        width={"30vw"}
        position="absolute"
        bottom={0}
        right={20}
      />
    </BannerSection>
  );
};

export default SideBannerSection;
