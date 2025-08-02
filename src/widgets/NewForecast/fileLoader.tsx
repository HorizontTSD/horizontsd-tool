import ExcelJS from "exceljs"

export const LoadXLSX = ({ setData, setLoadData }) => {
    const loadFileXLSX = async (event) => {
        const file = event.target.files[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = async (e) => {
            try {
                const buffer = e.target.result
                const workbook = new ExcelJS.Workbook()
                // For .xlsx files
                await workbook.xlsx.load(buffer)
                // For .xls files you would need a different parser
                // await workbook.xls.load(buffer);
                const excelData = {}

                workbook.eachSheet((worksheet, sheetId) => {
                    const rowData = []

                    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
                        const rowObj = {}
                        row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
                            // Use header row (first row) as property names
                            if (rowNumber === 1) {
                                rowObj[`header_${colNumber}`] = cell.value
                            } else {
                                const header = worksheet.getRow(1).getCell(colNumber).value
                                if (header) {
                                    rowObj[header] = cell.value
                                }
                            }
                        })

                        if (rowNumber !== 1) {
                            // Skip header row in data
                            rowData.push(rowObj)
                        }
                    })
                    excelData[worksheet.name] = rowData
                })

                setData(excelData)
                setLoadData(true)
            } catch (error) {
                console.error("Error parsing Excel file:", error)
                setLoadData(false)
            }
        }

        reader.readAsArrayBuffer(file)
    }

    return {
        loader: loadFileXLSX,
    }
}

export const LoadCSV = ({ setData, setLoadData }) => {
    const loadFileCSV = (event) => {
        const file = event.target.files[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const csvData = e.target.result
                const lines = csvData.split("\n")
                if (lines.length === 0) {
                    setLoadData(false)
                    return
                }

                // Get headers from first line
                const headers = lines[0].split(",").map((header) => header.trim())

                // Parse remaining lines
                const result = []
                for (let i = 1; i < lines.length; i++) {
                    if (!lines[i].trim()) continue // Skip empty lines
                    const currentLine = lines[i].split(",")
                    const obj = {}
                    for (let j = 0; j < headers.length; j++) {
                        obj[headers[j]] = currentLine[j] ? currentLine[j].trim() : ""
                    }
                    result.push(obj)
                }
                setData({ Sheet1: result })
                setLoadData(true)
            } catch (error) {
                console.error("Error parsing CSV file:", error)
                setLoadData(false)
            }
        }
        reader.readAsText(file)
    }

    return {
        loader: loadFileCSV,
    }
}

export const LoadJSON = ({ setData, setLoadData }) => {
    const loadFileJSON = (event) => {
        const file = event.target.files[0]
        if (!file) return

        const reader = new FileReader()

        reader.onload = (e) => {
            try {
                const jsonData = JSON.parse(e.target.result)
                setData({ Sheet1: jsonData })
                setLoadData(true)
            } catch (error) {
                console.error("Error parsing JSON file:", error)
                setLoadData(false)
            }
        }

        reader.onerror = () => {
            console.error("Error reading file")
            setLoadData(false)
        }

        reader.readAsText(file)
    }

    return {
        loader: loadFileJSON,
    }
}
