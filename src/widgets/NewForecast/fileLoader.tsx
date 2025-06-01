import ExcelJS from "exceljs"

export const LoadXLSX = ({
    setData,
    setLoaddata
}) => {
    const loadFileXLSX = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const buffer = e.target.result;
                const workbook = new ExcelJS.Workbook();
                // For .xlsx files
                await workbook.xlsx.load(buffer);
                // For .xls files you would need a different parser
                // await workbook.xls.load(buffer);
                const excelData = {};

                workbook.eachSheet((worksheet, sheetId) => {
                    const rowData = [];

                    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
                        const rowObj = {};
                        row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
                            // Use header row (first row) as property names
                            if (rowNumber === 1) {
                                rowObj[`header_${colNumber}`] = cell.value;
                            } else {
                                const header = worksheet.getRow(1).getCell(colNumber).value;
                                if (header) {
                                    rowObj[header] = cell.value;
                                }
                            }
                        });

                        if (rowNumber !== 1) { // Skip header row in data
                            rowData.push(rowObj);
                        }
                    });
                    excelData[worksheet.name] = rowData;
                });

                setData(excelData);
                setLoaddata(true);
            } catch (error) {
                console.error('Error parsing Excel file:', error);
                setLoaddata(false);
            }
        };

        reader.readAsArrayBuffer(file);
    };

    return {
        loader: loadFileXLSX
    };
};

export const LoadCSV = ({
    setData,
    setLoaddata
}) => {
    const loadFileCSV = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const csvData = e.target.result;
                const lines = csvData.split('\n');
                if (lines.length === 0) {
                    setLoaddata(false);
                    return;
                }

                // Get headers from first line
                const headers = lines[0].split(',').map(header => header.trim());

                // Parse remaining lines
                const result = [];
                for (let i = 1; i < lines.length; i++) {
                    if (!lines[i].trim()) continue; // Skip empty lines
                    const currentLine = lines[i].split(',');
                    const obj = {};
                    for (let j = 0; j < headers.length; j++) {
                        obj[headers[j]] = currentLine[j] ? currentLine[j].trim() : '';
                    }
                    result.push(obj);
                }
                setData({ 'Sheet1': result });
                setLoaddata(true);
            } catch (error) {
                console.error('Error parsing CSV file:', error);
                setLoaddata(false);
            }
        };
        reader.readAsText(file);
    };

    return {
        loader: loadFileCSV
    };
};

export const LoadJSON = ({
    setData,
    setLoaddata
}) => {
    const loadFileJSON = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const jsonData = JSON.parse(e.target.result);
                setData({ 'Sheet1': jsonData });
                setLoaddata(true);
            } catch (error) {
                console.error('Error parsing JSON file:', error);
                setLoaddata(false);
            }
        };

        reader.onerror = () => {
            console.error('Error reading file');
            setLoaddata(false);
        };

        reader.readAsText(file);
    };

    return {
        loader: loadFileJSON
    };
};
