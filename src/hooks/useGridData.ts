import { useMemo } from "react";
import { GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { CustomRow, MetricsTables } from "types";

export const useGridData = (metricsTables: MetricsTables | null, selectedModel: string | null) => {
  const rows: GridRowsProp<CustomRow> = useMemo(() => {
    if (!selectedModel || !metricsTables || !metricsTables[selectedModel]) return [];

    return metricsTables[selectedModel].map((item, index) => {
      const { Time, ...otherFields } = item;
      return {
        id: index,
        Time: new Date(Time as number)
          .toLocaleString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })
          .replace(",", ""),
        ...otherFields,
      };
    });
  }, [metricsTables, selectedModel]);

  const columns: GridColDef[] = useMemo(() => {
    if (!selectedModel || !metricsTables || !metricsTables[selectedModel]?.[0]) return [];

    const columnKeys = Object.keys(metricsTables[selectedModel][0]);

    return columnKeys.map((key) => ({
      field: key,
      headerName: key === "Time" ? "Дата и время" : key,
      flex: 1,
      minWidth: 120,
      sortable: true,
      ...(key === "Time" && {
        sortComparator: (v1, v2) => {
          return new Date(v1).getTime() - new Date(v2).getTime();
        },
      }),
    }));
  }, [selectedModel, metricsTables]);

  return { rows, columns };
};
