import Box from "@mui/material/Box";
import useResizeObserver from "@react-hook/resize-observer";
import * as d3 from "d3";
import * as GeoJSON from "geojson";
import React, {useEffect, useRef, useState} from "react";

interface AirQualityAnalysisWrapperProps {
	height: number;
	date: string;
	metric: string;
}

interface AirQualityAnalysisProps {
	height: number;
	width: number;
	containerRef: React.MutableRefObject<HTMLDivElement | null>;
	date: string;
	metric: string;
}

interface AirQualityRawDataProps {
	"Unique ID": string;
	"Indicator ID": string;
	"Name": string;
	"Measure": string;
	"Measure Info": string;
	"Geo Type Name": string;
	"Geo Join ID": string;
	"Geo Place Name": string;
	"Time Period": string;
	"Start_Date": string;
	"Data Value": string;
	"Message": string;
}

interface AirQualityDataProps {
	unique_id: number;
	indicator_id: number;
	name: string;
	measure: string;
	measure_info: string;
	geo_type_name: string;
	geo_join_id: number;
	geo_place_name: string;
	time_period: [Date, Date];
	start_date: Date;
	end_date: Date;
	data_value: number;
	message: string;
}

interface AirQualityDataIndexedProps {
	unique_id: number[];
	indicator_id: number[];
	name: string[];
	measure: string[];
	measure_info: string[];
	geo_type_name: string[];
	geo_join_id: number[];
	geo_place_name: string[];
	time_period: [Date, Date][];
	start_date: Date[];
	end_date: Date[];
	data_value: number[];
	message: string[];
}

interface SeparatedAirQualityDataIndexedProps {
	full: AirQualityDataIndexedProps;
	nitrogen: AirQualityDataIndexedProps;
	fine: AirQualityDataIndexedProps;
	boiler: AirQualityDataIndexedProps;
}

interface FeatureProperties {
	BOROUGH: string;
	OBJECTID: number;
	SHAPE_Area: number;
	SHAPE_Leng: number;
	UHFCODE: number;
	UHF_NEIGH: string;
}

const parseTimePeriod = (timePeriod: string): [Date, Date] => {
	// Handle patterns
	const yearMatch = /^\d{4}$/.exec(timePeriod);
	const annualAverageMatch = /^Annual Average (\d{4})$/.exec(timePeriod);
	const seasonYearMatch = /^(Summer|Winter|Spring|Fall) (\d{4})(?:-(\d{2}))?$/.exec(timePeriod);

	if (yearMatch) {
		const year = yearMatch[0];
		return [new Date(`01/01/${year}`), new Date(`12/31/${year}`)];
	}

	if (annualAverageMatch) {
		const year = annualAverageMatch[1];
		return [new Date(`12/01/${parseInt(year, 10) - 1}`), new Date(`11/30/${year}`)];
	}

	if (seasonYearMatch) {
		const season = seasonYearMatch[1];
		const startYear = seasonYearMatch[2];
		const endYear = seasonYearMatch[3] || startYear;
		const seasonDates: { Winter: [Date, Date]; Summer: [Date, Date]; Fall: [Date, Date]; Spring: [Date, Date] } = {
			Summer: [new Date(`06/01/${startYear}`), new Date(`08/31/${startYear}`)],
			Winter: [new Date(`12/01/${startYear}`), new Date(`02/28/${endYear}`)],
			Spring: [new Date(`03/01/${startYear}`), new Date(`05/31/${startYear}`)],
			Fall: [new Date(`09/01/${startYear}`), new Date(`11/30/${startYear}`)],
		};
		return seasonDates[season as keyof typeof seasonDates];
	}

	// Return undefined if no pattern matches
	return [new Date('2010'), new Date('2010')];
}

const dateInRange = (date: string, startDate: Date, endDate: Date) => {
	const dateDate = new Date(date);
	return (dateDate > startDate) && (dateDate < endDate);
}


const AirQualityAnalysis: React.FC<AirQualityAnalysisProps> = ({height, width, containerRef, date, metric}) => {
	const svgRef = useRef<SVGSVGElement | null>(null)
	const [data, setData] = useState<AirQualityDataProps[]>([]);
	const [dataIndexed, setDataIndexed] = useState<AirQualityDataIndexedProps>({
		unique_id: [],
		indicator_id: [],
		name: [],
		measure: [],
		measure_info: [],
		geo_type_name: [],
		geo_join_id: [],
		geo_place_name: [],
		time_period: [],
		start_date: [],
		end_date: [],
		data_value: [],
		message: [],
	})
	const [nitrogenDataIndexed, setNitrogenDataIndexed] = useState<AirQualityDataIndexedProps>({
		unique_id: [],
		indicator_id: [],
		name: [],
		measure: [],
		measure_info: [],
		geo_type_name: [],
		geo_join_id: [],
		geo_place_name: [],
		time_period: [],
		start_date: [],
		end_date: [],
		data_value: [],
		message: [],
	})
	const [boilerDataIndexed, setBoilerDataIndexed] = useState<AirQualityDataIndexedProps>({
		unique_id: [],
		indicator_id: [],
		name: [],
		measure: [],
		measure_info: [],
		geo_type_name: [],
		geo_join_id: [],
		geo_place_name: [],
		time_period: [],
		start_date: [],
		end_date: [],
		data_value: [],
		message: [],
	})
	const [fineDataIndexed, setFineDataIndexed] = useState<AirQualityDataIndexedProps>({
		unique_id: [],
		indicator_id: [],
		name: [],
		measure: [],
		measure_info: [],
		geo_type_name: [],
		geo_join_id: [],
		geo_place_name: [],
		time_period: [],
		start_date: [],
		end_date: [],
		data_value: [],
		message: [],
	})

	useEffect(() => {
		if (!svgRef.current || !data || !dataIndexed || dataIndexed.unique_id.length === 0 || !containerRef
			|| nitrogenDataIndexed.unique_id.length === 0 || boilerDataIndexed.unique_id.length === 0 ||
			fineDataIndexed.unique_id.length === 0) return;
		const geoUrl = "./assets/data/UHF_42_DOHMH_2009.geojson"; // Update the path to your file
		const svg = d3.select<SVGSVGElement, AirQualityDataProps>(svgRef.current)
			.attr("height", height)
			.attr("width", width)
			.attr("viewBox", [0, 0, width, height])
			.attr("style", "max-width: 100%; height: auto;")

		d3.json<GeoJSON.FeatureCollection<GeoJSON.Geometry, FeatureProperties>>(geoUrl).then((geoData) => {
			if (!geoData) return;

			const projection = d3.geoMercator().fitSize([width, height], geoData); // Adjust to your desired projection
			const path = d3.geoPath().projection(projection);
			const metricDateAQMap = data.filter(datum => datum.name.startsWith(metric) && dateInRange(date, datum.start_date, datum.end_date))

			let selectedDataIndex = nitrogenDataIndexed;
			let exponent = 1;
			if (metric === "Fine") {
				selectedDataIndex = fineDataIndexed;
			} else if (metric === "Boiler") {
				selectedDataIndex = boilerDataIndexed;
				exponent=0.25
			}
			// Define a color scale for air quality values
			const colorScale = d3.scalePow(d3.extent(selectedDataIndex.data_value) as [number, number], ["#23E538", "#E62261"]).exponent(exponent)

			const defs = svg.append("defs");
			const filter = defs.append("filter")
				.attr("id", "shadow")
				.attr("x", "-20%")
				.attr("y", "-20%")
				.attr("width", "140%")
				.attr("height", "140%");

			filter.append("feDropShadow")
				.attr("dx", 2)
				.attr("dy", 2)
				.attr("stdDeviation", 2)
				.attr("flood-color", "#000")
				.attr("flood-opacity", 0.75);

			// Bind GeoJSON features to paths
			svg.selectAll<SVGPathElement, GeoJSON.Feature<GeoJSON.Geometry, FeatureProperties>>("path")
				.data(geoData.features)
				.join("path")
				.attr("d", path)
				.attr("fill", (d) => {
					const geoId = Math.trunc(d.properties.UHFCODE || 0); // Adjust to your GeoJSON field
					const value = metricDateAQMap.find(datum => datum.geo_join_id === geoId)?.data_value
					return value !== undefined ? colorScale(value) : "#ccc"; // Default for missing data
				})
				.attr("stroke", "#000")
				.attr("stroke-width", .5)
				.on("mouseover", (_event, d) => {
					const thisId = d.properties?.["UHFCODE"] || 0;

					svg.selectAll<SVGPathElement, GeoJSON.Feature<GeoJSON.Geometry, FeatureProperties>>("path")
						.attr("filter", (p) => {
							return p.properties.UHFCODE === thisId
								? "url(#shadow)"
								: null
						})
						.attr("stroke-width", p => p.properties.UHFCODE === thisId ? 1.5 : 0.5)

				})

				.on("mouseout", () => {
					d3.selectAll("path")
						.attr("filter", null)
						.attr("stroke-width", .5); // Reset stroke width
				})
		})

	}, [dataIndexed, width, height, data, date, metric])

	useEffect(() => {
		// const url = "https://data.cityofnewyork.us/api/views/c3uy-2p5r/rows.csv?accessType=DOWNLOAD";
		const url = "./assets/data/Air_Quality.csv"
		d3.csv(url, ((d: AirQualityRawDataProps) => {
			return {
				unique_id: +d["Unique ID"],
				indicator_id: +d["Indicator ID"],
				name: d["Name"],
				measure: d["Measure"],
				measure_info: d["Measure Info"],
				geo_type_name: d["Geo Type Name"],
				geo_join_id: +d["Geo Join ID"],
				geo_place_name: d["Geo Place Name"],
				time_period: parseTimePeriod(d["Time Period"]),
				start_date: new Date(d["Start_Date"]),
				end_date: parseTimePeriod(d["Time Period"])[1],
				data_value: +d["Data Value"],
				message: d["Message"]
			}
		})).then(((res: AirQualityDataProps[]) => {
			// Ensure the data matches the expected structure
			setData(res)
			const dataIndexed = res.reduce<SeparatedAirQualityDataIndexedProps>(
				(acc, datum) => {
					acc.full.unique_id.push(datum.unique_id)
					acc.full.indicator_id.push(datum.indicator_id)
					acc.full.name.push(datum.name)
					acc.full.measure.push(datum.measure)
					acc.full.measure_info.push(datum.measure_info)
					acc.full.geo_type_name.push(datum.geo_type_name)
					acc.full.geo_join_id.push(datum.geo_join_id)
					acc.full.geo_place_name.push(datum.geo_place_name)
					acc.full.time_period.push(datum.time_period)
					acc.full.start_date.push(datum.start_date)
					acc.full.end_date.push(datum.end_date)
					acc.full.data_value.push(datum.data_value)
					acc.full.message.push(datum.message)
					if (datum.name.startsWith("Boiler")) {
						acc.boiler.unique_id.push(datum.unique_id)
						acc.boiler.indicator_id.push(datum.indicator_id)
						acc.boiler.name.push(datum.name)
						acc.boiler.measure.push(datum.measure)
						acc.boiler.measure_info.push(datum.measure_info)
						acc.boiler.geo_type_name.push(datum.geo_type_name)
						acc.boiler.geo_join_id.push(datum.geo_join_id)
						acc.boiler.geo_place_name.push(datum.geo_place_name)
						acc.boiler.time_period.push(datum.time_period)
						acc.boiler.start_date.push(datum.start_date)
						acc.boiler.end_date.push(datum.end_date)
						acc.boiler.data_value.push(datum.data_value)
						acc.boiler.message.push(datum.message)
					} else if (datum.name.startsWith("Nitrogen")) {
						acc.nitrogen.unique_id.push(datum.unique_id)
						acc.nitrogen.indicator_id.push(datum.indicator_id)
						acc.nitrogen.name.push(datum.name)
						acc.nitrogen.measure.push(datum.measure)
						acc.nitrogen.measure_info.push(datum.measure_info)
						acc.nitrogen.geo_type_name.push(datum.geo_type_name)
						acc.nitrogen.geo_join_id.push(datum.geo_join_id)
						acc.nitrogen.geo_place_name.push(datum.geo_place_name)
						acc.nitrogen.time_period.push(datum.time_period)
						acc.nitrogen.start_date.push(datum.start_date)
						acc.nitrogen.end_date.push(datum.end_date)
						acc.nitrogen.data_value.push(datum.data_value)
						acc.nitrogen.message.push(datum.message)
					} else if (datum.name.startsWith("Fine")) {
						acc.fine.unique_id.push(datum.unique_id)
						acc.fine.indicator_id.push(datum.indicator_id)
						acc.fine.name.push(datum.name)
						acc.fine.measure.push(datum.measure)
						acc.fine.measure_info.push(datum.measure_info)
						acc.fine.geo_type_name.push(datum.geo_type_name)
						acc.fine.geo_join_id.push(datum.geo_join_id)
						acc.fine.geo_place_name.push(datum.geo_place_name)
						acc.fine.time_period.push(datum.time_period)
						acc.fine.start_date.push(datum.start_date)
						acc.fine.end_date.push(datum.end_date)
						acc.fine.data_value.push(datum.data_value)
						acc.fine.message.push(datum.message)
					}
					return acc
				}, {
					full: {
						unique_id: [],
						indicator_id: [],
						name: [],
						measure: [],
						measure_info: [],
						geo_type_name: [],
						geo_join_id: [],
						geo_place_name: [],
						time_period: [],
						start_date: [],
						end_date: [],
						data_value: [],
						message: [],
					},
					nitrogen: {
						unique_id: [],
						indicator_id: [],
						name: [],
						measure: [],
						measure_info: [],
						geo_type_name: [],
						geo_join_id: [],
						geo_place_name: [],
						time_period: [],
						start_date: [],
						end_date: [],
						data_value: [],
						message: [],
					},
					fine: {
						unique_id: [],
						indicator_id: [],
						name: [],
						measure: [],
						measure_info: [],
						geo_type_name: [],
						geo_join_id: [],
						geo_place_name: [],
						time_period: [],
						start_date: [],
						end_date: [],
						data_value: [],
						message: [],
					},
					boiler: {
						unique_id: [],
						indicator_id: [],
						name: [],
						measure: [],
						measure_info: [],
						geo_type_name: [],
						geo_join_id: [],
						geo_place_name: [],
						time_period: [],
						start_date: [],
						end_date: [],
						data_value: [],
						message: [],
					}
				})
			setDataIndexed(dataIndexed.full);
			setNitrogenDataIndexed(dataIndexed.nitrogen)
			setBoilerDataIndexed(dataIndexed.boiler)
			setFineDataIndexed(dataIndexed.fine)
		}));
	}, []);

	return (
		<div ref={containerRef}>
			<svg ref={svgRef}/>
		</div>
	)
}

const AirQualityAnalysisWrapper: React.FC<AirQualityAnalysisWrapperProps> = ({height, date, metric}) => {
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
			<AirQualityAnalysis height={height} width={width} containerRef={containerRef} date={date} metric={metric}/>
		</Box>
	)

}

export default AirQualityAnalysisWrapper