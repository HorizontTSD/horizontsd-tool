import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useColorScheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { marked } from "marked"
import temp from "@/shared/lib/data/temp.json";
import { Stack } from "@mui/material";
import { LoadCSV, LoadJSON, LoadXLSX } from "./fileLoader";

export const DataSample = ({
	type,
	setData,
	setLoaddata
}) => {
	const { mode, setMode } = useColorScheme()
	const isDark = mode === "dark"
	const bgPalette = ["var(--mui-palette-primary-light)", "var(--mui-palette-primary-dark)"]
	const bg = bgPalette[~~isDark]

	const loaders = {
		XLSX: LoadXLSX,
		CSV: LoadCSV,
		JSON: LoadJSON
	}

	const extensions = {
		XLSX: ".xlsx,.xls",
		CSV: ".csv",
		JSON: ".json"
	}

	if (type in loaders == false) return null
	if (type in extensions == false) return null

	const { loader } = loaders[type]({
		setData,
		setLoaddata
	});


	return (
		<Stack
			sx={{
				padding: `1rem`,
				overflow: `auto`,
				minHeight: `50%`
			}}
		>
			<input type="file" onChange={loader} accept={extensions[type]} />
		</Stack>
	);

};


export const MarkdownPreview = ({
	setData
}) => {
	const { mode, setMode } = useColorScheme()
	const isDark = mode === "dark"
	const bgPalette = ["var(--mui-palette-primary-light)", "var(--mui-palette-primary-dark)"]
	const bg = bgPalette[~~isDark]

	const [markdownInput, setMarkdownInput] = useState("```json\n" + JSON.stringify(temp, null, 2) + "\n```");
	const [renderedMarkdown, setRenderedMarkdown] = useState("");

	useEffect(() => {
		const renderMarkdown = async () => {
			const html = await marked.parse(markdownInput);
			setRenderedMarkdown(html);
			setData({ example: temp })

		};
		renderMarkdown();
	}, [markdownInput]);



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
					overflow: `auto`
				}}
				dangerouslySetInnerHTML={{ __html: renderedMarkdown }}
			/>
		</Box>
	)
}