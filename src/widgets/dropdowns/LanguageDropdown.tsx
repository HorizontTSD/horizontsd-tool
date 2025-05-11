import { useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";

const languages = [
  { code: "en", name: "English", },
  { code: "ru", name: "Русский", },
  { code: "it", name: "Italiano", },
];

export const LanguageDropdown = () => {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const currentLanguage = 'en-US' //i18n.language;

  const currentLangData = languages.find(
    (lang) => lang.code === currentLanguage || lang.code === currentLanguage.split("-")[0]
  );

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode).then(() => {
      localStorage.setItem("i18nextLng", langCode);
    });
    setAnchorEl(null);
  };
  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small" sx={{ minWidth: 64 }}>
        {/* {currentLangData?.flagUrl &&
          <img
            src={currentLangData?.flagUrl}
            width={20}
            height={15}
            alt=""
            style={{ display: "block" }}
          />
        } */}

        <Box component="span" sx={{ ml: 0.5, fontSize: "0.75rem" }}>
          {currentLanguage.toUpperCase()}
        </Box>
      </IconButton>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            selected={lang.code === currentLanguage}
            onClick={() => handleLanguageChange(lang.code)}
            sx={{
              pl: 2,
              py: 1,
              "&.Mui-selected": {
                backgroundColor: "action.selected",
                "&:hover": {
                  backgroundColor: "action.selected",
                },
              },
            }}
          >
            {/* <img src={lang.flagUrl} width={20} height={15} alt="" style={{ marginRight: 12 }} /> */}
            <Typography>{lang.name}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
