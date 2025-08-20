import { Stack, Typography } from "@mui/material"
import { DataSample, CsvExampleTableWithDropdowns, JsonExamplePreview } from "./dataSample"

import * as React from "react"

import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"

import AddchartIcon from "@mui/icons-material/Addchart"
import FileUploadIcon from "@mui/icons-material/FileUpload"

interface SelectDataSourceProps {
    selectedData: string | null
    setSelected: (v: string | null) => void
    setLoadData: (v: boolean) => void
    setData: (v: unknown) => void
}

export const SelectDataSource = ({ selectedData, setSelected, setLoadData, setData }: SelectDataSourceProps) => {
    const [alignment, setAlignment] = React.useState(selectedData || null)
    const handleChange = (event: React.MouseEvent<HTMLElement>, newAlignment: string) => {
        setAlignment(newAlignment)
        if (newAlignment == null) setLoadData(false)
        setSelected(newAlignment)
    }
    return (
        <Stack direction={"column"} sx={{ padding: `2rem 0` }}>
            <Typography variant="h5" sx={{ fontSize: { xs: "0.95rem", sm: "1.25rem" }, mb: 1 }}>
                Select preffered data source
            </Typography>
            <ToggleButtonGroup
                color="success"
                value={alignment}
                exclusive
                onChange={handleChange}
                aria-label="Source"
                orientation="horizontal"
                sx={{
                    flexWrap: { xs: "wrap", sm: "nowrap" },
                    flexDirection: { xs: "column", sm: "row" },
                    gap: { xs: 1, sm: 0 },
                    alignItems: { xs: "stretch", sm: "center" },
                    width: "100%",
                    "@media (max-width:600px)": {
                        "& .MuiToggleButton-root": {
                            borderRadius: "999px",
                            border: "1px solid #e0e0e0",
                        },
                    },
                }}
            >
                <ToggleButton value="ExampleCSV" sx={{ width: { xs: "100%", sm: "auto" } }}>
                    <AddchartIcon />
                    <Typography sx={{ fontSize: { xs: "0.85rem", sm: "1rem" } }}>Example CSV</Typography>
                </ToggleButton>
                <ToggleButton value="ExampleJSON" sx={{ width: { xs: "100%", sm: "auto" } }}>
                    <AddchartIcon />
                    <Typography sx={{ fontSize: { xs: "0.85rem", sm: "1rem" } }}>Example JSON</Typography>
                </ToggleButton>
                <ToggleButton value="JSON" sx={{ width: { xs: "100%", sm: "auto" } }}>
                    <FileUploadIcon />
                    <Typography sx={{ fontSize: { xs: "0.85rem", sm: "1rem" } }}>JSON</Typography>
                </ToggleButton>
                <ToggleButton value="CSV" sx={{ width: { xs: "100%", sm: "auto" } }}>
                    <FileUploadIcon />
                    <Typography sx={{ fontSize: { xs: "0.85rem", sm: "1rem" } }}>CSV</Typography>
                </ToggleButton>
                <ToggleButton value="XLSX" sx={{ width: { xs: "100%", sm: "auto" } }}>
                    <FileUploadIcon />
                    <Typography sx={{ fontSize: { xs: "0.85rem", sm: "1rem" } }}>XLSX</Typography>
                </ToggleButton>
            </ToggleButtonGroup>
            {alignment == "ExampleCSV" && <CsvExampleTableWithDropdowns setData={setData} setLoadData={setLoadData} />}
            {alignment == "ExampleJSON" && <JsonExamplePreview setData={setData} setLoadData={setLoadData} />}
            {alignment == "JSON" && <DataSample type={"JSON"} setData={setData} setLoadData={setLoadData} />}
            {alignment == "CSV" && <DataSample type={"CSV"} setData={setData} setLoadData={setLoadData} />}
            {alignment == "XLSX" && <DataSample type={"XLSX"} setData={setData} setLoadData={setLoadData} />}
        </Stack>
    )
}
