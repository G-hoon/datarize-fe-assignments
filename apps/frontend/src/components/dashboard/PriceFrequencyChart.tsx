import { useState } from "react";
import { BarChart } from "@/components/charts/BarChart";
import {
	type DateRange,
	DateRangePicker,
} from "@/components/common/DateRangePicker";
import { usePurchaseFrequency } from "@/hooks/usePurchaseFrequency";
import type { PurchaseFrequency } from "@/types/api";

interface PriceFrequencyChartProps {
	title?: string;
	height?: number;
}

/**
 * 가격 범위별 구매 빈도를 시각화하는 대시보드 컴포넌트
 * DateRangePicker와 BarChart를 결합하여 날짜별 필터링이 가능한 차트를 제공합니다
 */
export function PriceFrequencyChart({
	title = "가격대별 구매 빈도",
	height = 400,
}: PriceFrequencyChartProps) {
	const [dateRange, setDateRange] = useState<DateRange>({
		startDate: null,
		endDate: null,
	});

	// React Query를 사용한 데이터 패칭 (날짜 범위가 변경되면 자동으로 재요청)
	const { data, isLoading, error } = usePurchaseFrequency({
		...(dateRange.startDate && { from: dateRange.startDate }),
		...(dateRange.endDate && { to: dateRange.endDate }),
	});

	const processChartData = (rawData: PurchaseFrequency[]) => {
		return rawData.map((item) => ({
			range: item.range,
			count: item.count,
		}));
	};

	// 처리된 차트 데이터
	const chartData = data ? processChartData(data) : [];

	return (
		<div className="bg-white rounded-lg shadow">
			{/* 헤더 */}
			<div className="px-6 py-4 border-b border-gray-200">
				<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
					<h2 className="text-xl font-semibold text-gray-900">{title}</h2>

					{/* 날짜 범위 선택기 */}
					<div className="w-full lg:w-80">
						<DateRangePicker
							value={dateRange}
							onChange={setDateRange}
							placeholder="기간을 선택해주세요"
							disabled={isLoading}
						/>
					</div>
				</div>
			</div>

			{/* 차트 영역 */}
			<div className="p-6">
				{error && (
					<div
						className="flex flex-col items-center justify-center bg-red-50 rounded-lg border border-red-200"
						style={{ height }}
					>
						<div className="text-red-600 text-center">
							<div className="font-medium mb-2">
								데이터를 불러오는 중 오류가 발생했습니다
							</div>
							<div className="text-sm text-red-500">{error?.toString()}</div>
						</div>
					</div>
				)}
				{!error && (
					<BarChart
						data={chartData}
						loading={isLoading}
						height={height}
						yAxisLabel="구매 건수"
					/>
				)}
			</div>

			{/* 통계 정보 */}
			{!isLoading && !error && chartData.length > 0 && (
				<div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
					<div className="flex flex-wrap gap-4 text-sm text-gray-600">
						<div>
							<span className="font-medium">총 구매 건수:</span>{" "}
							<span className="text-gray-900">
								{chartData
									.reduce((sum, item) => sum + item.count, 0)
									.toLocaleString()}
								건
							</span>
						</div>
						<div>
							<span className="font-medium">가격 범위:</span>{" "}
							<span className="text-gray-900">{chartData.length}개 구간</span>
						</div>
						{(dateRange.startDate || dateRange.endDate) && (
							<div>
								<span className="font-medium">기간:</span>{" "}
								<span className="text-gray-900">
									{dateRange.startDate && dateRange.endDate
										? `${dateRange.startDate} ~ ${dateRange.endDate}`
										: dateRange.startDate
											? `${dateRange.startDate} ~`
											: `~ ${dateRange.endDate}`}
								</span>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
