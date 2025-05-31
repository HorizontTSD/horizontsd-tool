import React from "react"
import { Box, Stack, Typography, OutlinedInput, Select, MenuItem, InputAdornment, Button } from "@mui/material"
import { CreateAlertFormValues } from "./types"

interface CreateAlertFormProps {
    values: CreateAlertFormValues
    onChange: (field: keyof CreateAlertFormValues, value: any) => void
    onSubmit: () => void
    onReset: () => void
    sensorsList: string[]
}

export const CreateAlertForm: React.FC<CreateAlertFormProps> = ({
    values,
    onChange,
    onSubmit,
    onReset,
    sensorsList,
}) => {
    return (
        <Box sx={{ width: 350, pr: 4 }}>
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    onSubmit()
                }}
            >
                <Stack spacing={2}>
                    <Typography variant="h6" fontWeight={700} mb={2}>
                        Create alert
                    </Typography>
                    <Select
                        value={values.selectedSensor || ""}
                        onChange={(e) => onChange("selectedSensor", e.target.value)}
                        size="small"
                        sx={{ height: 30, background: "white", borderRadius: 2 }}
                        fullWidth
                    >
                        {sensorsList.map((sensor) => (
                            <MenuItem key={sensor} value={sensor}>
                                {sensor}
                            </MenuItem>
                        ))}
                    </Select>
                    <OutlinedInput
                        fullWidth
                        value={values.atValue}
                        onChange={(e) => onChange("atValue", Number(e.target.value))}
                        sx={{ background: "white", color: "black",  borderRadius: `var(--mui-shape-borderRadius)`, height: 30 }}
                        size="small"
                        placeholder="At value"
                    />
                    <Stack direction="row" spacing={1} alignItems="center">
                        <OutlinedInput
                            fullWidth
                            value={values.betweenValue1}
                            onChange={(e) => onChange("betweenValue1", Number(e.target.value))}
                            sx={{ background: "white", color: "black",  borderRadius: `var(--mui-shape-borderRadius)`, height: 30, width: 80 }}
                            size="small"
                            placeholder="Between"
                        />
                        <Typography>-</Typography>
                        <OutlinedInput
                            fullWidth
                            value={values.betweenValue2}
                            onChange={(e) => onChange("betweenValue2", Number(e.target.value))}
                            sx={{ background: "white", color: "black",  borderRadius: `var(--mui-shape-borderRadius)`, height: 30, width: 80 }}
                            size="small"
                        />
                    </Stack>
                    <Select
                        value={values.refreshRate}
                        onChange={(e) => onChange("refreshRate", e.target.value)}
                        size="small"
                        sx={{ background: "white", color: "black",  borderRadius: `var(--mui-shape-borderRadius)`, height: 30, width: 120 }}
                    >
                        <MenuItem value="1h">1h</MenuItem>
                        <MenuItem value="6h">6h</MenuItem>
                        <MenuItem value="12h">12h</MenuItem>
                        <MenuItem value="24h">24h</MenuItem>
                    </Select>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <OutlinedInput
                            fullWidth
                            type="text"
                            value={values.from.replace("d", "")}
                            onChange={(e) => onChange("from", e.target.value.replace(/[^0-9\-]/g, "") + "d")}
                            sx={{ background: "white", color: "black",  borderRadius: `var(--mui-shape-borderRadius)`, width: 80, height: 30 }}
                            size="small"
                            endAdornment={<InputAdornment position="end">d</InputAdornment>}
                        />
                        <OutlinedInput
                            fullWidth
                            type="text"
                            value={values.to.replace("d", "")}
                            onChange={(e) => onChange("to", e.target.value.replace(/[^0-9\+]/g, "") + "d")}
                            sx={{ background: "white", color: "black",  borderRadius: `var(--mui-shape-borderRadius)`, width: 80, height: 30 }}
                            size="small"
                            endAdornment={<InputAdornment position="end">d</InputAdornment>}
                        />
                    </Stack>
                    <OutlinedInput
                        fullWidth
                        value={values.email}
                        onChange={(e) => onChange("email", e.target.value)}
                        sx={{ background: "white", color: "black",  borderRadius: `var(--mui-shape-borderRadius)`, height: 30 }}
                        size="small"
                        placeholder="Email*"
                    />
                    <OutlinedInput
                        fullWidth
                        value={values.telegram}
                        onChange={(e) => onChange("telegram", e.target.value)}
                        sx={{ background: "white", color: "black",  borderRadius: `var(--mui-shape-borderRadius)`, height: 30 }}
                        size="small"
                        placeholder="Telegram"
                    />
                    <OutlinedInput
                        fullWidth
                        multiline
                        minRows={3}
                        value={values.message}
                        onChange={(e) => onChange("message", e.target.value)}
                        sx={{ background: "white", color: "black", borderRadius: "16px", height: 132 }}
                        size="small"
                        placeholder="Message"
                    />
                    <Stack direction="row" spacing={2} mt={2}>
                        <Button variant="contained" color="primary" type="submit">
                            Create
                        </Button>
                        <Button variant="outlined" onClick={onReset}>
                            Reset
                        </Button>
                    </Stack>
                </Stack>
            </form>
        </Box>
    )
}
