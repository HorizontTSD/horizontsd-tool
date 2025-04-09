import { useMemo } from "react";
import { GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { CustomRow, MetricsTables } from "types";

export const useGridData = (metricsTables: MetricsTables | null, selectedModel: string | null) => {
  const rows: GridRowsProp<CustomRow> = useMemo(() => {
    if (!selectedModel || !metricsTables || !metricsTables[selectedModel]) return [];

    return metricsTables[selectedModel].map((item, index) => {
      const { datetime, ...otherFields } = item;
      return {
        id: index,
        datetime: new Date(datetime as number).toLocaleString(),
        ...otherFields,
      };
    });
  }, [metricsTables, selectedModel]);

  const columns: GridColDef[] = useMemo(() => {
    if (!selectedModel || !metricsTables || !metricsTables[selectedModel]?.[0]) return [];

    const columnKeys = Object.keys(metricsTables[selectedModel][0]);

    return columnKeys.map((key) => ({
      field: key,
      headerName: key,
      flex: 1,
      minWidth: 120,
      sortable: true,
    }));
  }, [selectedModel, metricsTables]);

  return { rows, columns };
};
