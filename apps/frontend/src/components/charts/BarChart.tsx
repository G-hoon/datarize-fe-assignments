import {
	Bar,
	CartesianGrid,
	BarChart as RechartsBarChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

export interface BarChartData {
	range: string;
	count: number;
}

interface BarChartProps {
	data: BarChartData[];
	yAxisLabel?: string;
	height?: number;
	loading?: boolean;
}

/**
 * 가격대별 구매 빈도를 시각화하는 바 차트 컴포넌트
 * Recharts 라이브러리를 사용하여 반응형 차트를 제공합니다
 */
export function BarChart({
	data,
	yAxisLabel = "구매 건수",
	height = 400,
	loading = false,
}: BarChartProps) {
	if (loading) {
		return (
			<div
				className="flex items-center justify-center bg-gray-50 rounded-lg border"
				style={{ height }}
			>
				<div className="text-gray-500">차트 로딩 중...</div>
			</div>
		);
	}

	if (!data || data.length === 0) {
		return (
			<div
				className="flex items-center justify-center bg-gray-50 rounded-lg border"
				style={{ height }}
			>
				<div className="text-gray-500">표시할 데이터가 없습니다</div>
			</div>
		);
	}

	return (
		<div className="w-full">
			<div className="bg-white rounded-lg pt-4 border shadow-sm">
				<ResponsiveContainer width="100%" height={height}>
					<RechartsBarChart
						data={data}
						margin={{
							top: 20,
							right: 30,
							left: 20,
							bottom: 60,
						}}
					>
						<CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
						<XAxis
							dataKey="range"
							tick={{ fontSize: 12 }}
							angle={-45}
							textAnchor="end"
							height={80}
							interval={0}
						/>
						<YAxis
							tick={{ fontSize: 12 }}
							label={{
								value: yAxisLabel,
								angle: -90,
								position: "insideLeft",
							}}
						/>
						<Tooltip
							contentStyle={{
								backgroundColor: "#fff",
								border: "1px solid #ccc",
								borderRadius: "8px",
								fontSize: "12px",
							}}
							formatter={(value: number) => [`${value}건`, "구매 건수"]}
							labelFormatter={(label: string) => `가격대: ${label}`}
						/>
						<Bar
							dataKey="count"
							fill="#3b82f6"
							radius={[4, 4, 0, 0]}
							stroke="#2563eb"
							strokeWidth={1}
						/>
					</RechartsBarChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}
