import Typography, { TypographyProps } from "@mui/material/Typography";

export const OriginalProjectInfo = (props: TypographyProps) => {
  return (
    <Typography
      variant="body2"
      align="center"
      {...props}
      sx={[
        {
          color: "text.secondary",
        },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
      ]}
    >
      {"All rights reserved. Horizon is an original project."}

      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};
