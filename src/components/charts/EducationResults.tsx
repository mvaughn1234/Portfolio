import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React, {useEffect, useRef, useState} from 'react';
import Papa from 'papaparse';
import * as d3 from 'd3';
import {Card, CardContent} from '@mui/material';
import useResizeObserver from "@react-hook/resize-observer";

interface RawStudentData {
	"Study Hours": string;
	"Sleep Hours": string;
	"Socioeconomic Score": string;
	"Attendance (%)": string;
	"Grades": string;
}

interface StudentData {
	id: number;
	study_hours: number;
	sleep_hours: number;
	socioeconomic_score: number;
	attendance: number;
	grades: number;
}

interface EducationResultsProps {
	height: number;
	width: number;
	containerRef: React.MutableRefObject<HTMLDivElement | null>;
	xSwitch: "study_hours" | "sleep_hours";
}

interface EducationResultsWrapperProps {
	height: number;
	xSwitch: "study_hours" | "sleep_hours";
}

interface StudentDataIndexed {
	study_hours: number[];
	sleep_hours: number[];
	socioeconomic_score: number[];
	attendance: number[];
	grades: number[];
}

const EducationResults: React.FC<EducationResultsProps> = ({width, height, xSwitch, containerRef}) => {
	const svgRef = useRef<SVGSVGElement | null>(null)
	const [data, setData] = useState<StudentData[]>([]);
	const [dataIndexed, setDataIndexed] = useState<StudentDataIndexed>({
		study_hours: [],
		sleep_hours: [],
		socioeconomic_score: [],
		attendance: [],
		grades: []
	})
	const [tooltip, setTooltip] = useState<{ x: number; y: number; data: StudentData | null }>({
		x: 0,
		y: 0,
		data: null,
	});

	useEffect(() => {
		if (!svgRef.current || !dataIndexed || !(dataIndexed.study_hours.length > 0)) return;

		const margin = {top: 30, right: 50, bottom: 30, left: 50}
		console.log("data indexed: ", dataIndexed)
		const svg = d3.select<SVGSVGElement, StudentData>(svgRef.current)
			.attr('width', width)
			.attr('height', height)
			.attr("viewBox", [0, 0, width, height])
			.attr("style", "max-width: 100%; height: auto;");

		const xScale = d3
			.scaleLinear()
			.domain(d3.extent(dataIndexed[xSwitch]) as [number, number]).nice()
			.range([margin.left, width - margin.right])

		const yScale = d3
			.scaleLinear()
			.domain(d3.extent(dataIndexed.grades) as [number, number]).nice()
			.range([height - margin.bottom, margin.top])

		const seScale = d3
			.scaleLinear()
			.domain(d3.extent(dataIndexed.socioeconomic_score) as [number, number])
			.range([1, 3])

		const attendanceScale = d3
			.scaleLinear<string>()
			.domain(d3.extent(dataIndexed.attendance) as [number, number])
			.range(["#1e4393", "#ef871d"])

		if (svg.select(".scatter").empty()) {
			svg.append("g").attr("class", "scatter")
		}

		svg.select(".xAxis").remove();
		svg.select(".yAxis").remove();

		if (svg.select(".xAxis").empty()) {
			svg.append("g").attr("class", "xAxis")
				.attr("transform", `translate(0, ${height - margin.bottom})`)
				.call(d3.axisBottom(xScale).ticks(width / 80))
				.call(g => g.select(".domain").remove())
				.call(g => g.selectAll(".tick line").clone()
					.attr("y2", -(height - margin.bottom - margin.top))
					.attr("stroke-opacity", 0.1))
				.call(g => g.append("text")
					.attr("x", width - 4)
					.attr("y", -4)
					.attr("font-weight", "bold")
					.attr("text-anchor", "end")
					.attr("fill", "currentColor")
					.text(`${xSwitch === "study_hours" ? 'Hours Studied' : 'Hours Slept'}`))
		}

		if (svg.select(".yAxis").empty()) {
			svg.append("g").attr("class", "yAxis")
				.attr("transform", `translate(${margin.left}, 0)`)
				.call(d3.axisLeft(yScale).ticks(null))
				.call(g => g.select(".domain").remove())
				.call(g => g.selectAll(".tick line").clone()
					.attr("x2", (width - margin.left) - margin.right)
					.attr("stroke-opacity", 0.1))
				.call(g => g.select(".tick:last-of-type text").clone()
					.attr("x", 4)
					.attr("text-anchor", "start")
					.attr("font-weight", "bold")
					.text("Grades"))
		}

		svg.select(".scatter")
			.selectAll<SVGCircleElement, StudentData>("circle")
			.data(data, (d) => d.id)
			.join(
				enter => {
					const e = enter.append('circle')
						// .call(enter => enter.append("title").text(d => `Grades: ${d.grades}\nHours Studied: ${d.study_hours}\nHours Slept: ${d.sleep_hours}\nAttendance: ${d.attendance}\nSocioeconomic Score: ${d.socioeconomic_score}`))
						.attr("cx", d => xScale(d[xSwitch]))
						.attr("cy", d => yScale(d.grades))
						.attr("fill", d => attendanceScale(d.attendance))
						.attr("r", d => seScale(d.socioeconomic_score))
						.on('mouseenter', (event, d) => {
							if (containerRef.current) {
								const containerBounds = containerRef.current.getBoundingClientRect();
								const [x, y] = d3.pointer(event);
								setTooltip({x: x + containerBounds.left, y: y + containerBounds.top + 10, data: d});
							}
						})
						.on('mousemove', (event) => {
							if (containerRef.current) {
								const containerBounds = containerRef.current.getBoundingClientRect();
								const [x, y] = d3.pointer(event);
								setTooltip(prev => ({...prev, x: x + containerBounds.left, y: y + containerBounds.top + 10}));
							}
						})
						.on('mouseleave', () => {
							setTooltip({x: 0, y: 0, data: null});
						})
					return e;
				},
				update => {
					update
						.on('mouseenter', (event, d) => {
							if (containerRef.current) {
								const containerBounds = containerRef.current.getBoundingClientRect();
								const [x, y] = d3.pointer(event);
								setTooltip({x: x + containerBounds.left, y: y + containerBounds.top + 10, data: d});
							}
						})
						.on('mousemove', (event) => {
							if (containerRef.current) {
								const containerBounds = containerRef.current.getBoundingClientRect();
								const [x, y] = d3.pointer(event);
								setTooltip(prev => ({...prev, x: x + containerBounds.left, y: y + containerBounds.top + 10}));
							}
						})
						.on('mouseleave', () => {
							setTooltip({x: 0, y: 0, data: null});
						})
						.transition().duration(750)
						.attr("cx", d => xScale(d[xSwitch]))
						.attr("cy", d => yScale(d.grades))
						.attr("fill", d => attendanceScale(d.attendance))
						.attr("r", d => seScale(d.socioeconomic_score))

					// .select("title").text(d => `Grades: ${d.grades}\nHours Studied: ${d.study_hours}\nHours Slept: ${d.sleep_hours}\nAttendance: ${d.attendance}\nSocioeconomic Score: ${d.socioeconomic_score}`)
					return update
				},
				exit => {
					exit
						.remove()
					return exit
				}
			)

		const renderLegend = (
			svg: d3.Selection<SVGSVGElement, StudentData, null, undefined>,
			attendanceScale: d3.ScaleLinear<string, string>,
			width: number,
			height: number,
			margin: {
				top: number,
				bottom: number,
				left: number,
				right: number
			}) => {
			// Define the gradient for attendance
			const defs = (svg.select<SVGDefsElement>("defs.legendDefs").empty()
				? svg.append("defs").attr("class", "legendDefs")
				: svg.select("defs.legendDefs"));
			const gradientId = "attendanceGradient";
			let gradient = defs.select<SVGLinearGradientElement>(`#${gradientId}`)
			if (gradient.empty()) {
				gradient = defs.append("linearGradient")
					.attr("id", gradientId)
					.attr("x1", "0%")
					.attr("y1", "100%")
					.attr("x2", "0%")
					.attr("y2", "0%")
			}

			// Add color stops to the gradient
			gradient.selectAll("stop").remove();
			gradient.append("stop")
				.attr("offset", "0%")
				.attr("stop-color", attendanceScale(d3.min(dataIndexed.attendance) as number)); // Lowest attendance color
			gradient.append("stop")
				.attr("offset", "100%")
				.attr("stop-color", attendanceScale(d3.max(dataIndexed.attendance) as number)); // Highest attendance color

			// Add or update the legend group
			const legend = (svg.select(".legend").empty()
					? svg.append("g").attr("class", "legend")
					: svg.select(".legend")
			)

			// Add the gradient bar
			const legendHeight = 100; // Height of the gradient bar
			const legendWidth = 10;  // Width of the gradient bar
			const legendX = width - legendWidth / 2 - margin.right / 2; // Position on the right
			const legendY = height / 2 - legendHeight / 2; // Center vertically

			// Add or update the gradient bar
			let legendBar = legend.select<SVGRectElement>(".legend-bar");
			if (legendBar.empty()) {
				legendBar = legend.append("rect").attr("class", "legend-bar");
			}
			legendBar
				.attr("x", legendX)
				.attr("y", legendY)
				.attr("width", legendWidth)
				.attr("height", legendHeight)
				.style("fill", `url(#${gradientId})`);

			// Add or update the "Attendance" label
			let title = legend.select<SVGTextElement>(".legend-title");
			if (title.empty()) {
				title = legend.append("text").attr("class", "legend-title");
			}
			title
				.attr("x", legendX + 20) // Position to the left of the bar
				.attr("y", legendY + legendHeight / 2) // Center vertically with the bar
				.attr("dy", "0.35em") // Adjust vertical alignment
				.attr("text-anchor", "middle") // Align text to the end
				.attr("transform", `rotate(90, ${legendX + 20}, ${legendY + legendHeight / 2})`) // Rotate 90 degrees
				// .attr("transform", "rotate(0)")
				.attr("font-size", "12px")
				.attr("fill", "currentColor")
				.text("Attendance");

			// Add or update labels for high and low attendance
			let highLabel = legend.select<SVGTextElement>(".legend-high-label");
			if (highLabel.empty()) {
				highLabel = legend.append("text").attr("class", "legend-high-label");
			}

			highLabel
				.attr("x", legendX + legendWidth + 5) // Position to the right of the bar
				.attr("y", legendY) // Top of the bar
				.attr("dy", "0.35em")
				.attr("text-anchor", "start")
				.attr("font-size", "10px")
				.attr("fill", "currentColor")
				.text("High");

			let lowLabel = legend.select<SVGTextElement>(".legend-low-label");
			if (lowLabel.empty()) {
				lowLabel = legend.append("text").attr("class", "legend-low-label");
			}
			lowLabel
				.attr("x", legendX + legendWidth + 5) // Position to the right of the bar
				.attr("y", legendY + legendHeight) // Bottom of the bar
				.attr("dy", "0.35em")
				.attr("text-anchor", "start")
				.attr("font-size", "10px")
				.attr("fill", "currentColor")
				.text("Low");
		};

		renderLegend(svg, attendanceScale, width, height, margin);

	}, [dataIndexed, width, height, xSwitch]);

	useEffect(() => {
		// Define the file path (adjust if the CSV file is hosted elsewhere)
		const csvFilePath = 'src/data/predicted_student_performance.csv';

		// Fetch and parse the CSV
		Papa.parse(csvFilePath, {
			download: true,
			header: true, // Ensures the first row is used as keys
			skipEmptyLines: true,
			complete: (result) => {
				const rawData = result.data as RawStudentData[]; // Correctly access the data property
				console.log("raw data: ", rawData)
				const processedData = rawData.map((row, i) => ({
					id: i,
					study_hours: parseFloat(row["Study Hours"]),
					sleep_hours: parseFloat(row["Sleep Hours"]),
					socioeconomic_score: parseFloat(row["Socioeconomic Score"]),
					attendance: parseFloat(row["Attendance (%)"]) / 100,
					grades: parseFloat(row["Grades"]),
				}))
				const indexedData = processedData.reduce<StudentDataIndexed>(
					(acc, student) => {
						acc.study_hours.push(student.study_hours);
						acc.sleep_hours.push(student.sleep_hours);
						acc.socioeconomic_score.push(student.socioeconomic_score);
						acc.attendance.push(student.attendance);
						acc.grades.push(student.grades);
						return acc;
					},
					{
						study_hours: [],
						sleep_hours: [],
						socioeconomic_score: [],
						attendance: [],
						grades: [],
					}
				);
				setData(processedData); // Save parsed data into state
				setDataIndexed(indexedData)
			},
			error: (error) => {
				console.error('Error parsing CSV:', error);
			},
		});

	}, []);

	return (
		<div ref={containerRef}>
			<svg ref={svgRef}/>
			{tooltip.data && (
				<Card
					sx={(theme) => ({
						position: 'absolute',
						pointerEvents: 'none',
						backgroundColor: theme.palette.background.paper,
					})}
					style={{
						top: tooltip.y,
						left: tooltip.x,
					}}
				>
					<CardContent>
						<Typography variant="subtitle1">Grade: {tooltip.data.grades}</Typography>
						<Typography variant="body2">Hours Studied: {tooltip.data.study_hours}</Typography>
						<Typography variant="body2">Hours Slept: {tooltip.data.sleep_hours}</Typography>
						<Typography variant="body2">Attendance: {tooltip.data.attendance * 100}%</Typography>
						<Typography variant="body2">Socioeconomic Score: {tooltip.data.socioeconomic_score}</Typography>
					</CardContent>
				</Card>
			)}
		</div>
	);
}

const EducationResultsWrapper: React.FC<EducationResultsWrapperProps> = ({height, xSwitch}) => {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [width, setWidth] = useState<number>(300);

	useResizeObserver(containerRef, (entry) => {
		if (entry.contentBoxSize) {
			// contentBoxSize can vary by browser; fallback to getBoundingClientRect()
			setWidth(entry.contentRect.width);
		}
	});

	return (
		<Box
			style={{width: '100%'}}
		>
			<EducationResults height={height} xSwitch={xSwitch} width={width} containerRef={containerRef}/>
		</Box>
	)

}

export default EducationResultsWrapper