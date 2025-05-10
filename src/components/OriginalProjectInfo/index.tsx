import Typography, { TypographyProps } from "@mui/material/Typography";
import { useTranslation } from "react-i18next";

export const OriginalProjectInfo = (props: TypographyProps) => {

  const { t } = useTranslation();
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
      {t("footer.text")}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};
