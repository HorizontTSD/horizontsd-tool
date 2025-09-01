import { brand } from "@/shared/theme/colors"

export const btnExit = {
    backgroundColor: brand[500],
    color: "white",
    borderRadius: "8px",
    padding: "5px 10px",
    width: "100%",
    textTransform: "none",
    boxShadow: "0 2px 4px rgba(0, 127, 255, 0.2)",
    "&:hover": {
        backgroundColor: brand[600],
        boxShadow: "0 4px 8px rgba(0, 127, 255, 0.3)",
    },
}
