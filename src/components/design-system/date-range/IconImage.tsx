import { Box } from "@mui/material";

interface IconImageProps {
  src: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
}

const IconImage = ({
  src,
  alt = "icon",
  width = 16,
  height = 16,
}: IconImageProps) => {
  return (
    <Box
      component="img"
      src={src}
      alt={alt}
      width={width}
      height={height}
      sx={{ display: "inline-block" }}
    />
  );
};

export default IconImage;
