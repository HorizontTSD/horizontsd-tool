import * as React from "react"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import ClickAwayListener from "@mui/material/ClickAwayListener"
import ButtonGroup from "@mui/material/ButtonGroup"
import { Typography, useColorScheme } from "@mui/material"
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

export const LanguageDropdown = () => {
    const { i18n } = useTranslation()
    const [open, setOpen] = React.useState(false)
    const anchorRef = React.useRef<HTMLDivElement>(null)
    const { mode } = useColorScheme()
    const isDark = mode === "dark"

    const currentLanguage = i18n.language
    const currentLangData = languages.find(
        (lang) => lang.code === currentLanguage || lang.code === currentLanguage.split("-")[0]
    )
    const selectedIndex = languages.findIndex((lang) => lang.code === currentLangData?.code) || 0

    const handleLanguageChange = (event: React.MouseEvent<HTMLLIElement, MouseEvent>, index: number) => {
        if (index === selectedIndex) {
            setOpen(false)
            return
        }
        const newLang = languages[index].code
        i18n.changeLanguage(newLang).then(() => {
            localStorage.setItem("i18nextLng", newLang)
        })
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
        <React.Fragment>
            <ButtonGroup
                variant="contained"
                ref={anchorRef}
                aria-label="Button group with a nested menu"
                sx={{
                    border: `none`,
                    boxShadow: `none`,
                    cursor: `pointer`,
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
                        padding: `0 0.8rem`,
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
                        padding: `0`,
                    }}
                >
                    <ArrowDropDownIcon />
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
                    width: `100px`,
                    zIndex: 1,
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
                                            sx={{ padding: `0.1rem 1rem`, justifyContent: `space-evenly` }}
                                        >
                                            <Typography
                                                color="textPrimary"
                                                variant="button"
                                                sx={{ marginRight: `1rem` }}
                                            >
                                                {lang.code.toUpperCase()}
                                            </Typography>
                                            <img
                                                loading="lazy"
                                                width="16"
                                                height="8"
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
        </React.Fragment>
    )
}
