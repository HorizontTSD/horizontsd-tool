import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Breadcrumbs, { breadcrumbsClasses } from "@mui/material/Breadcrumbs";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import { useTranslation } from "react-i18next";


const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars || theme).palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: "center",
  },
}));

export const NavbarBreadcrumbs = () => {

  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const lang = currentLanguage.toLowerCase();
  const { t } = useTranslation();

  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      <Typography variant="body1">{t("nav_bar.path.main_path")}</Typography>
      <Typography variant="body1" sx={{ color: "text.primary", fontWeight: 600 }}>
        {t("sidebar.menu.data_forecast")}
      </Typography>
    </StyledBreadcrumbs>
  );
};
