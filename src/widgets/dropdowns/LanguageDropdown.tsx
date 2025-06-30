import * as React from "react"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import ClickAwayListener from "@mui/material/ClickAwayListener"
import ButtonGroup from "@mui/material/ButtonGroup"
import { Box, Typography, useColorScheme } from "@mui/material"
import MenuItem from "@mui/material/MenuItem"
import MenuList from "@mui/material/MenuList"
import Button from "@mui/material/Button"
import Popper from "@mui/material/Popper"
import Paper from "@mui/material/Paper"
import Grow from "@mui/material/Grow"
import { useTranslation } from "react-i18next"

const languages = [
    { code: "en", name: "English", flag: "gb" },
    { code: "ru", name: "Русский", flag: "ru" },
    { code: "it", name: "Italiano", flag: "it" },
]

interface LanguageDropdownProps {
    selectedLanguage?: "en" | "ru" | "it"
    onChange?: (lang: "en" | "ru" | "it") => void
    isVerySmall?: boolean
}

export const LanguageDropdown = ({ selectedLanguage, onChange, isVerySmall }: LanguageDropdownProps) => {
    const { i18n } = useTranslation()
    const [open, setOpen] = React.useState(false)
    const anchorRef = React.useRef<HTMLDivElement>(null)
    const { mode } = useColorScheme()
    const isDark = mode === "dark"

    const currentLanguage = selectedLanguage || i18n.language
    const currentLangData = languages.find(
        (lang) => lang.code === currentLanguage || lang.code === currentLanguage.split("-")[0]
    )
    const selectedIndex = languages.findIndex((lang) => lang.code === currentLangData?.code) || 0

    const handleLanguageChange = (event: React.MouseEvent<HTMLLIElement, MouseEvent>, index: number) => {
        if (index === selectedIndex) {
            setOpen(false)
            return
        }
        const newLang = languages[index].code as "en" | "ru" | "it"
        if (onChange) {
            onChange(newLang)
        } else {
            i18n.changeLanguage(newLang).then(() => {
                localStorage.setItem("i18nextLng", newLang)
            })
        }
        setOpen(false)
    }

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen)
    }

    const handleClose = (event: Event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
            return
        }
        setOpen(false)
    }

    return (
        <Box sx={{ zIndex: 1 }}>
            <ButtonGroup
                variant="contained"
                ref={anchorRef}
                aria-label="Button group with a nested menu"
                sx={{
                    border: `none`,
                    boxShadow: `none`,
                    cursor: `pointer`,
                    ...(isVerySmall && {
                        minWidth: 32,
                        height: 28,
                    }),
                }}
                onClick={handleToggle}
            >
                <Button
                    variant="text"
                    disabled
                    sx={{
                        background: `var(${isDark ? "--mui-palette-secondary-dark" : "--mui-palette-primary-light"}) !important`,
                        border: `2px solid var(${isDark ? "--mui-palette-secondary-light" : "--mui-palette-secondary-dark"}) !important`,
                        boxShadow: `none`,
                        color: `var(--mui-palette-text-primary) !important`,
                        padding: isVerySmall ? "0 0.15rem" : `0 0.8rem`,
                        fontSize: isVerySmall ? "0.7rem" : undefined,
                    }}
                >
                    {currentLangData?.code.toUpperCase()}
                </Button>
                <Button
                    aria-controls={open ? "split-button-menu" : undefined}
                    aria-expanded={open ? "true" : undefined}
                    aria-haspopup="menu"
                    aria-label="select language"
                    size="small"
                    sx={{
                        background: `var(${isDark ? "--mui-palette-secondary-light" : "--mui-palette-secondary-dark"}) !important`,
                        border: `none`,
                        boxShadow: `none`,
                        color: `var(${isDark ? "--mui-palette-secondary-dark" : "--mui-palette-secondary-light"}) !important`,
                        padding: 0,
                        minWidth: isVerySmall ? 18 : undefined,
                    }}
                >
                    <ArrowDropDownIcon fontSize={isVerySmall ? "inherit" : "medium"} />
                </Button>
            </ButtonGroup>
            <Popper
                anchorEl={anchorRef.current}
                disablePortal
                open={open}
                role={undefined}
                sx={{
                    borderRadius: "var(--mui-shape-borderRadius)",
                    paddingTop: `7px`,
                    width: isVerySmall ? 60 : 100,
                }}
                transition
            >
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin: placement === "bottom" ? "center top" : "center bottom",
                        }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList id="split-button-menu" autoFocusItem sx={{ padding: `1rem 0` }}>
                                    {languages.map((lang, index) => (
                                        <MenuItem
                                            disabled={index === selectedIndex}
                                            key={lang.code}
                                            onClick={(event) => handleLanguageChange(event, index)}
                                            selected={index === selectedIndex}
                                            sx={{
                                                padding: isVerySmall ? "0.1rem 0.5rem" : "0.1rem 1rem",
                                                justifyContent: "space-evenly",
                                                minHeight: isVerySmall ? 28 : undefined,
                                            }}
                                        >
                                            <Typography
                                                color="textPrimary"
                                                variant="button"
                                                sx={{
                                                    marginRight: isVerySmall ? "0.5rem" : "1rem",
                                                    fontSize: isVerySmall ? "0.7rem" : undefined,
                                                }}
                                            >
                                                {lang.code.toUpperCase()}
                                            </Typography>
                                            <img
                                                loading="lazy"
                                                width={isVerySmall ? 12 : 16}
                                                height={isVerySmall ? 6 : 8}
                                                src={`https://flagcdn.com/w20/${lang.flag}.png`}
                                                alt=""
                                            />
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </Box>
    )
}
