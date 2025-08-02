import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { useColorScheme } from "@mui/material/styles"
import { useEffect, useState } from "react"
import { marked } from "marked"
import temp from "@/shared/lib/data/temp.json"
import { Stack } from "@mui/material"
import { LoadCSV, LoadJSON, LoadXLSX } from "./fileLoader"
import tempCsvRaw from "@/shared/lib/data/temp.csv?raw"
import tempJson from "@/shared/lib/data/moroccoEnergyData.json"
import { DataGrid } from "@mui/x-data-grid"
import { useTranslation } from "react-i18next"

interface ExamplePreviewProps {
    setData: (v: unknown) => void
    setLoadData?: (v: boolean) => void
}

export const DataSample = ({
    type,
    setData,
    setLoadData,
}: {
    type: string
    setData: (v: unknown) => void
    setLoadData?: (v: boolean) => void
}) => {
    const loaders = {
        XLSX: LoadXLSX,
        CSV: LoadCSV,
        JSON: LoadJSON,
    }

    const extensions = {
        XLSX: ".xlsx,.xls",
        CSV: ".csv",
        JSON: ".json",
    }

    if (!(type in loaders)) return null
    if (!(type in extensions)) return null

    const { loader } = loaders[type]({
        setData,
        setLoadData,
    })

    return (
        <Stack
            sx={{
                padding: `1rem`,
                overflow: `auto`,
                minHeight: `50%`,
            }}
        >
            <input type="file" onChange={loader} accept={extensions[type]} />
        </Stack>
    )
}

export const MarkdownPreview = ({ setData, setLoadData }: ExamplePreviewProps) => {
    const { mode, setMode } = useColorScheme()
    const isDark = mode === "dark"
    const bgPalette = ["var(--mui-palette-primary-light)", "var(--mui-palette-primary-dark)"]
    const bg = bgPalette[~~isDark]

    const [markdownInput, setMarkdownInput] = useState("```json\n" + JSON.stringify(temp, null, 2) + "\n```")
    const [renderedMarkdown, setRenderedMarkdown] = useState("")

    useEffect(() => {
        const renderMarkdown = async () => {
            const html = await marked.parse(markdownInput)
            setRenderedMarkdown(html)
            setData({ example: temp })
            setLoadData && setLoadData(true)
        }
        renderMarkdown()
    }, [markdownInput])

    return (
        <Box sx={{ mt: 1 }}>
            <Typography variant="h6" gutterBottom>
                Rendered Output:
            </Typography>
            <Box
                sx={{
                    border: "1px solid #ccc",
                    padding: `0rem 1rem`,
                    borderRadius: 1,
                    color: `var(--mui-palette-text-primary)`,
                    backgroundColor: bg,
                    maxHeight: `400px`,
                    overflow: `auto`,
                }}
                dangerouslySetInnerHTML={{ __html: renderedMarkdown }}
            />
        </Box>
    )
}

export const CsvExamplePreview = ({ setData, setLoaddata }: ExamplePreviewProps) => {
    const { t } = useTranslation("common")
    const [csvData, setCsvData] = useState<any[]>([])
    const [headers, setHeaders] = useState<string[]>([])
    useEffect(() => {
        const lines = tempCsvRaw.split("\n").filter(Boolean) // Загружаем все строки
        const [header, ...rows] = lines
        const headersArr = header.split(",")
        setHeaders(headersArr)
        const data = rows.map((row: string) => {
            const values = row.split(",")
            const obj: Record<string, string> = {}
            headersArr.forEach((h: string, i: number) => (obj[h] = values[i]))
            return obj
        })
        setCsvData(data)
        setData({ example: data })
        setLoaddata && setLoaddata(true)
    }, [])

    return (
        <Box sx={{ mt: 1 }}>
            <Typography variant="h6" gutterBottom>
                {t("widgets.newForecast.exampleCsv")}:
            </Typography>
            <Box sx={{ overflowX: "auto", maxHeight: 400 }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            {headers.map((header) => (
                                <th key={header}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {csvData.map((row, idx) => (
                            <tr key={idx}>
                                {headers.map((header) => (
                                    <td key={header}>{row[header]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Box>
        </Box>
    )
}

export const JsonExamplePreview = ({ setData, setLoadData }: ExamplePreviewProps) => {
    const { t } = useTranslation("common")
    useEffect(() => {
        setData({ example: tempJson })
        setLoadData && setLoadData(true)
    }, [])
    return (
        <Box sx={{ mt: 1 }}>
            <Typography variant="h6" gutterBottom>
                {t("widgets.newForecast.exampleJson")}:
            </Typography>
            <pre style={{ maxHeight: 400, overflow: "auto", background: "#f5f5f5", padding: 8 }}>
                {JSON.stringify(tempJson, null, 2)}
            </pre>
        </Box>
    )
}

// Функция для нормализации данных: преобразует числовые строки в числа
function normalizeCsvData(data: any[]) {
    return data.map((row) => {
        const newRow: any = {}
        for (const key in row) {
            if (key !== "Datetime" && row[key] !== "" && row[key] !== null && !isNaN(row[key])) {
                newRow[key] = Number(row[key])
            } else {
                newRow[key] = row[key]
            }
        }
        return newRow
    })
}

export const CsvExampleTableWithDropdowns = ({
    setData,
    setLoadData,
}: {
    setData?: (v: unknown) => void
    setLoadData?: (v: boolean) => void
}) => {
    const { t } = useTranslation("common")
    // CSV данные (пример)
    const [csvRows, setCsvRows] = useState<any[]>([])
    const [columns, setColumns] = useState<any[]>([])
    const [csvText, setCsvText] = useState("")
    useEffect(() => {
        const lines = tempCsvRaw.split("\n").filter(Boolean) // Загружаем все строки
        setCsvText(lines.join("\n"))
        const [header, ...rows] = lines
        const headersArr = header.split(",")
        setColumns(headersArr.map((key: string) => ({ field: key, headerName: key, flex: 1, minWidth: 120 })))
        // Формируем массив объектов для передачи в setData
        const data = rows.map((row: string) => {
            const values = row.split(",")
            const obj: any = {}
            headersArr.forEach((h: string, i: number) => {
                obj[h] = values[i]
            })
            return obj
        })
        const normalizedData = normalizeCsvData(data)
        setCsvRows(normalizedData.map((row, idx) => ({ ...row, id: idx })))
        if (setData) setData(normalizedData)
        if (setLoadData) setLoadData(true)
    }, [])
    // Функция для чередования строк
    const getRowClassName = (params: any) => (params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd")
    return (
        <Box sx={{ mt: 1 }}>
            <Typography variant="h6" gutterBottom>
                {t("widgets.newForecast.exampleCsv")}:
            </Typography>
            <Box
                sx={{
                    height: 700,
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
            >
                <DataGrid
                    rows={csvRows}
                    columns={columns}
                    density="compact"
                    pageSizeOptions={[25, 50, 100, 200]}
                    initialState={{ pagination: { paginationModel: { pageSize: 100, page: 0 } } }}
                    disableColumnResize
                    getRowClassName={getRowClassName}
                    pagination
                    paginationMode="client"
                />
            </Box>
        </Box>
    )
}
