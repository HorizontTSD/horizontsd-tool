import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {
	useCallback, useEffect, useMemo, useReducer, useRef, useState
} from "react";

import {
	Column,
	Table,
	ColumnDef,
	useReactTable,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	flexRender,
	RowData,
} from '@tanstack/react-table'

declare module '@tanstack/react-table' {
	interface TableMeta<TData extends RowData> {
		updateData: (rowIndex: number, columnId: string, value: unknown) => void
	}
}

import './dataTable.css'
import { Divider, Stack, Typography } from "@mui/material";


import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';



type TableData = {
	[key: string]: number | string
};


export default function BasicSelect({
	list,
	selected,
	setSelected
}) {
	const [value, setValue] = React.useState(selected || "");

	const handleChange = (event: SelectChangeEvent) => {
		setValue(event.target.value as string);
		setSelected(event.target.value as string)
	};

	return (
		<Box sx={{ minWidth: 120 }}>
			<FormControl fullWidth>
				<InputLabel id="simple-select-label">Select</InputLabel>
				<Select
					labelId="simple-select-label"
					id="simple-select"
					value={value}
					label="select"
					onChange={handleChange}
				>
					{
						list.map((e, i) => {
							return (
								<MenuItem key={i} value={e}>{e}</MenuItem>
							)
						})
					}
				</Select>
			</FormControl>
		</Box>
	);
}

function Filter({
	column,
	table,
}: {
	column: Column<TableData, any>
	table: Table<TableData>
}) {
	const firstValue = table
		.getPreFilteredRowModel()
		.flatRows[0]?.getValue(column.id)

	const columnFilterValue = column.getFilterValue()

	return typeof firstValue === 'number' ? (
		<div className="flex space-x-2">
			<input
				type="number"
				value={(columnFilterValue as [number, number])?.[0] ?? ''}
				onChange={e =>
					column.setFilterValue((old: [number, number]) => [
						e.target.value,
						old?.[1],
					])
				}
				placeholder={`Min`}
				className="w-24 border shadow rounded"
			/>
			<input
				type="number"
				value={(columnFilterValue as [number, number])?.[1] ?? ''}
				onChange={e =>
					column.setFilterValue((old: [number, number]) => [
						old?.[0],
						e.target.value,
					])
				}
				placeholder={`Max`}
				className="w-24 border shadow rounded"
			/>
		</div>
	) : (
		<input
			type="text"
			value={(columnFilterValue ?? '') as string}
			onChange={e => column.setFilterValue(e.target.value)}
			placeholder={`Search...`}
			className="w-36 border shadow rounded"
		/>
	)
}

// Give our default column cell renderer editing superpowers!
const defaultColumn: Partial<ColumnDef<TableData>> = {
	cell: ({ getValue, row: { index }, column: { id }, table }) => {
		const initialValue = getValue()
		// We need to keep and update the state of the cell normally
		const [value, setValue] = useState(initialValue)

		// When the input is blurred, we'll call our table meta's updateData function
		const onBlur = () => {
			table.options.meta?.updateData(index, id, value)
		}

		// If the initialValue is changed external, sync it up with our state
		useEffect(() => {
			setValue(initialValue)
		}, [initialValue])

		return (
			<input
				value={value as string}
				onChange={e => setValue(e.target.value)}
				onBlur={onBlur}
			/>
		)
	},
} as const

function useSkipper() {
	const shouldSkipRef = useRef(true)
	const shouldSkip = shouldSkipRef.current

	// Wrap a function with this to skip a pagination reset temporarily
	const skip = useCallback(() => {
		shouldSkipRef.current = false
	}, [])

	useEffect(() => {
		shouldSkipRef.current = true
	})

	return [shouldSkip, skip] as const
}

export const DataTable = ({
	data: original,
	selected_axis,
	setSelected_axis
}) => {
	const [XY, setXY] = useState(selected_axis)
	// Use makeForecastData to initialize data
	const [data, setData] = useState(original)
	// const refreshData = () => setData(() => makeForecastData(1000))
	// Function to add a new row
	const handleAddRow = useCallback(() => {
		setData(old => [
			...old,
			// Create a new row with the same structure as original data
			Object.fromEntries(
				Object.keys(original[0]).map(key => [key, ""]) // Initialize with empty values
			)
		]);
	}, [setData]);

	// Function to remove the last row
	const handleRemoveRow = useCallback(() => {
		setData(old => old.slice(0, -1));
	}, [setData]);

	const columns = useMemo<ColumnDef<TableData>[]>(
		() => Object.keys(original[0]).map((key) => ({
			accessorKey: key,
			header: key.toUpperCase(),
			footer: props => props.column.id,
		})),
		[original]
	)

	const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper()

	const table = useReactTable({
		data,
		columns,
		initialState: { pagination: { pageSize: 10, pageIndex: 0 } },
		defaultColumn,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		autoResetPageIndex,
		meta: {
			updateData: (rowIndex, columnId, value) => {
				skipAutoResetPageIndex()
				setData(old =>
					old.map((row, index) => {
						if (index === rowIndex) {
							return {
								...old[rowIndex]!,
								[columnId]: value,
							}
						}
						return row
					})
				)
			},
		},
		debugTable: false,
	})

	const headers = Object.keys(original[0]).flat()

	return (
		<Stack
			sx={{
				padding: `1rem 0`,
				overflow: `auto`,
			}}
		>
			<Divider sx={{ margin: `1rem 0` }} />
			<Typography variant="h6" marginBottom={2}>Select X (time) and Y (forecast value) axis</Typography>
			<Stack direction={"row"} spacing={1}>

				<BasicSelect
					list={headers.filter(v => v != XY[1])}
					selected={XY[0]}
					setSelected={(value) => {
						setXY([value, XY[1]])
						setSelected_axis([value, XY[1]])
					}}
				/>
				<BasicSelect
					list={headers.filter(v => v != XY[0])}
					selected={XY[1]}
					setSelected={(value) => {
						setXY([XY[0], value])
						setSelected_axis([XY[0], value])
					}}
				/>
			</Stack>
			<Divider sx={{ margin: `1rem 0` }} />
			<Typography variant="h6" marginBottom={2}>Previev of data</Typography>
			<Box sx={{
				padding: `0.5rem 0`,
				overflowY: `auto`,
			}}>
				<table className="data-table" style={{
				}} >
					<thead >
						{table.getHeaderGroups().map(headerGroup => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map(header => {
									return (
										<th key={header.id} colSpan={header.colSpan} >
											{header.isPlaceholder ? null : (
												<Box>
													{flexRender(
														header.column.columnDef.header,
														header.getContext()
													)}
													{header.column.getCanFilter() ? (
														<div>
															<Filter column={header.column} table={table} />
														</div>
													) : null}
												</Box>
											)}
										</th>
									)
								})}
							</tr>
						))}
					</thead>
					<tbody>
						{table.getRowModel().rows.map(row => {
							return (
								<tr key={row.id}>
									{row.getVisibleCells().map(cell => {
										return (
											<td key={cell.id}>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)}
											</td>
										)
									})}
								</tr>
							)
						})}
					</tbody>
				</table>
			</Box>

			<Stack>
				<Stack direction={"row"} sx={{ padding: `0.5rem`, justifyContent: `space-between` }}>
					<Stack spacing={1} direction={"row"}>
						<Button
							variant="contained" color="info"
							className="border rounded p-1"
							onClick={() => table.setPageIndex(0)}
							disabled={!table.getCanPreviousPage()}
						>
							{'<<'}
						</Button >
						<Button
							variant="contained" color="info"
							className="border rounded p-1"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							{'<'}
						</Button>
						<Button
							variant="contained" color="info"
							className="border rounded p-1"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							{'>'}
						</Button>
						<Button
							variant="contained" color="info"
							className="border rounded p-1"
							onClick={() => table.setPageIndex(table.getPageCount() - 1)}
							disabled={!table.getCanNextPage()}
						>
							{'>>'}
						</Button>
					</Stack>
					<Stack spacing={1} direction={"row"}>
						<Button variant="contained" color="info" onClick={handleAddRow} sx={{ mr: 2 }}>
							Add Row
						</Button>
						<Button variant="outlined" onClick={handleRemoveRow}>
							Remove Last Row
						</Button>
					</Stack>
				</Stack>
				<Stack>
					<Stack direction={"row"} spacing={1}>
						<Typography variant="caption">
							Go to page:
						</Typography>
						<input
							type="number"
							min="1"
							max={table.getPageCount()}
							defaultValue={table.getState().pagination.pageIndex + 1}
							onChange={e => {
								const page = e.target.value ? Number(e.target.value) - 1 : 0
								table.setPageIndex(page)
							}}
							className="border p-1 rounded w-16"
						/>
						<select
							value={table.getState().pagination.pageSize}
							onChange={e => {
								table.setPageSize(Number(e.target.value))
							}}
						>
							{[10, 20, 50].map(pageSize => (
								<option key={pageSize} value={pageSize}>
									Show {pageSize}
								</option>
							))}
						</select>
					</Stack>
					<Stack direction={"row"} spacing={0.5}>
						<Typography variant="caption">Page</Typography>
						<Typography variant="caption">
							{table.getState().pagination.pageIndex + 1}
						</Typography>
						<Typography variant="caption">
							of{' '}
						</Typography>
						<Typography variant="caption">
							{table.getPageCount()}
						</Typography>
					</Stack>
				</Stack>
			</Stack>
		</Stack>
	)
}
