import { Stack, Typography } from "@mui/material"
import { DataSample, CsvExampleTableWithDropdowns, JsonExamplePreview } from "./dataSample"

import * as React from "react"

import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"

import AddchartIcon from "@mui/icons-material/Addchart"
import FileUploadIcon from "@mui/icons-material/FileUpload"

interface SelectDataSourceProps {
    selected_data: string | null
    setSelected: (v: string | null) => void
    setLoaddata: (v: boolean) => void
    setData: (v: unknown) => void
}

export const SelectDataSource = ({ selected_data, setSelected, setLoaddata, setData }: SelectDataSourceProps) => {
    const [alignment, setAlignment] = React.useState(selected_data || null)
    const handleChange = (event: React.MouseEvent<HTMLElement>, newAlignment: string) => {
        setAlignment(newAlignment)
        if (newAlignment == null) setLoaddata(false)
        setSelected(newAlignment)
    }
    return (
        <Stack direction={"column"} sx={{ padding: `2rem 0` }}>
            <Typography variant="h5">Select preffered data source</Typography>
            <ToggleButtonGroup color="success" value={alignment} exclusive onChange={handleChange} aria-label="Source">
                <ToggleButton value="ExampleCSV">
                    <AddchartIcon />
                    <Typography>Example CSV</Typography>
                </ToggleButton>
                <ToggleButton value="ExampleJSON">
                    <AddchartIcon />
                    <Typography>Example JSON</Typography>
                </ToggleButton>
                <ToggleButton value="JSON">
                    <FileUploadIcon />
                    <Typography>JSON</Typography>
                </ToggleButton>
                <ToggleButton value="CSV">
                    <FileUploadIcon />
                    <Typography>CSV</Typography>
                </ToggleButton>
                <ToggleButton value="XLSX">
                    <FileUploadIcon />
                    <Typography>XLSX</Typography>
                </ToggleButton>
            </ToggleButtonGroup>
            {alignment == "ExampleCSV" && <CsvExampleTableWithDropdowns setData={setData} setLoaddata={setLoaddata} />}
            {alignment == "ExampleJSON" && <JsonExamplePreview setData={setData} setLoaddata={setLoaddata} />}
            {alignment == "JSON" && <DataSample type={"JSON"} setData={setData} setLoaddata={setLoaddata} />}
            {alignment == "CSV" && <DataSample type={"CSV"} setData={setData} setLoaddata={setLoaddata} />}
            {alignment == "XLSX" && <DataSample type={"XLSX"} setData={setData} setLoaddata={setLoaddata} />}
        </Stack>
    )
}
