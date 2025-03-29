import { useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

import ukFlagUrl from "assets/svg/ukFlag.svg?url";
import ruFlagUrl from "assets/svg/ruFlag.svg?url";

const languages = [
  { code: "en", name: "English", flagUrl: ukFlagUrl },
  { code: "ru", name: "Русский", flagUrl: ruFlagUrl },
];

export const LanguageDropdown = () => {
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const currentLangData = languages.find((lang) => lang.code === currentLanguage);

  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small" sx={{ minWidth: 64 }}>
        <img
          src={currentLangData?.flagUrl}
          width={20}
          height={15}
          alt=""
          style={{ display: "block" }}
        />
        <Box component="span" sx={{ ml: 0.5, fontSize: "0.75rem" }}>
          {currentLanguage.toUpperCase()}
        </Box>
      </IconButton>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            selected={lang.code === currentLanguage}
            onClick={() => {
              setCurrentLanguage(lang.code);
              setAnchorEl(null);
            }}
            sx={{ pl: 2 }}
          >
            <img src={lang.flagUrl} width={20} height={15} alt="" style={{ marginRight: 12 }} />
            <Typography>{lang.name}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
