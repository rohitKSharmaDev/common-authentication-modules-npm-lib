import React from "react";
import { Select, MenuItem, Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";

const langSelectOptions = [
  { label: "English", value: "en" },
  { label: "Arabic", value: "ar" },
];

const LangSelector = ({i18n, onChangeLocalization}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const handleChange = (event) => {
    const newLang = event.target.value;
    onChangeLocalization(newLang);
  };

  return (
    <Select
      value={i18n || "en"}
      onChange={handleChange}
      autoWidth
      renderValue={(value) => {
        const selectedLang = langSelectOptions.find(
          (lang) => lang.value === value
        );
        return (
          <Box display="flex">
            <LanguageIcon fontSize="small" />
            {!isSmallScreen && <>&nbsp; <Typography variant="body1">{selectedLang?.label || ""}</Typography></>}
          </Box>
        );
      }}
    >
      {langSelectOptions.map((lang) => (
        <MenuItem value={lang.value} key={lang.value}>
          {lang.label}
        </MenuItem>
      ))}
    </Select>
  );
};

export default LangSelector;