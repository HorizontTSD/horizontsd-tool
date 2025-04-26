import * as XLSX from "xlsx";
import { ExcelInfo } from "@/types";

export const exportForecastToExcel = (excelInfo: ExcelInfo) => {
  if (!excelInfo?.data?.length) {
    console.error("No data to export");
    return;
  }

  const formattedData = excelInfo.data.map((item) => ({
    "Дата и время": new Date(item.datetime).toLocaleString(),
    "Прогноз LSTM": item.LSTM_predict,
    "Прогноз XGBoost": item.XGBoost_predict,
    "Прогноз Ensemble": item.ensemble_predict,
  }));

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(formattedData);

  const titleRows = [
    [`Прогноз нагрузки: ${excelInfo.sensorName} (${excelInfo.sensorId})`],
    [`Сгенерировано: ${new Date().toLocaleString()}`],
  ];

  XLSX.utils.sheet_add_aoa(worksheet, titleRows, { origin: "A1" });
  worksheet["!cols"] = [{ wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];

  XLSX.utils.book_append_sheet(workbook, worksheet, excelInfo.sensorName.slice(0, 31));

  XLSX.writeFile(
    workbook,
    `forecast_${excelInfo.sensorId}_${new Date().toISOString().slice(0, 10)}.xlsx`
  );
};
