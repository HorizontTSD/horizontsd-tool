import { brand, gray } from "@/shared/theme/colors"

export const authCardSx = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90%", sm: 400 },
    maxWidth: 500,
    maxHeight: "90vh",
    overflow: "auto",
    outline: "none",
    borderRadius: 1,
    boxShadow: 24,
}

export const modalSx = {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
}

export const btn = {
    px: 0,
    height: 40,
    backgroundColor: brand[700],
    borderRadius: 0.5,
    color: gray[50],
    "&:hover": {
        backgroundColor: brand[600],
    },
}

export const btnReg = {
    px: 3,
    height: 40,
    backgroundColor: brand[700],
    borderRadius: 0.5,
    color: gray[50],
    "&:hover": {
        backgroundColor: brand[600],
    },
}
