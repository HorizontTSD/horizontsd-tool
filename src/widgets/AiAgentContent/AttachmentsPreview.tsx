import React from "react"
import { Box, Stack, IconButton } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import { AttachmentsPreviewProps } from "./types"

export const AttachmentsPreview: React.FC<AttachmentsPreviewProps> = ({ attachments, onRemove }) => {
    if (attachments.length === 0) return null

    return (
        <Stack direction="row" gap={1} sx={{ px: 2, pb: 1, flexWrap: "wrap" }}>
            {attachments.map((attachment) => (
                <Box
                    key={attachment.id}
                    sx={{ width: 72, height: 72, borderRadius: 1, overflow: "hidden", position: "relative" }}
                >
                    <img
                        src={attachment.url}
                        alt="attachment"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <IconButton
                        size="small"
                        sx={{
                            position: "absolute",
                            top: 2,
                            right: 2,
                            bgcolor: "background.paper",
                            "&:hover": { bgcolor: "background.paper" },
                        }}
                        onClick={() => onRemove(attachment.id)}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
            ))}
        </Stack>
    )
}
