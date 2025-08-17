import { useState } from "react";
import { BarChart } from "@/components/charts/BarChart";
import {
	type DateRange,
	DateRangePicker,
} from "@/components/common/DateRangePicker";
import { CustomerTable } from "@/components/dashboard/CustomerTable";

// 테스트 목업 데이터
const mockChartData = [
	{ range: "0 - 20000", count: 15 },
	{ range: "20000 - 30000", count: 23 },
	{ range: "30000 - 40000", count: 18 },
	{ range: "40000 - 50000", count: 12 },
	{ range: "50000 - 60000", count: 8 },
	{ range: "60000 - 70000", count: 5 },
	{ range: "70000 - 80000", count: 3 },
	{ range: "80000 - 90000", count: 2 },
	{ range: "90000 - 100000", count: 1 },
	{ range: "100000+", count: 1 },
];

export default function DashBoard() {
	const [dateRange, setDateRange] = useState<DateRange>({
		startDate: null,
		endDate: null,
	});

	const handleDateRangeChange = (newDateRange: DateRange) => {
		setDateRange(newDateRange);
		// TODO: 실제 API 호출시 날짜 범위 필터링 로직 구현
		console.log("선택된 날짜 범위:", newDateRange);
	};

	const title = `가격대별 구매 빈도 ${dateRange.startDate || dateRange.endDate ? "(필터 적용됨)" : ""}`;

	return (
		<div className="min-h-screen bg-gray-50 p-6 space-y-6">
			<h1 className="text-3xl font-bold text-gray-900">구매 데이터 대시보드</h1>

			{/* 차트 섹션 */}
			<div className="bg-white rounded-lg shadow p-6">
				<div className="flex justify-between items-center mb-4">
					{title && (
						<h3 className="text-lg font-semibold mb-4 text-gray-800">
							{title}
						</h3>
					)}
					<DateRangePicker
						value={dateRange}
						onChange={handleDateRangeChange}
						placeholder="분석할 기간을 선택해주세요"
					/>
				</div>
				<BarChart data={mockChartData} height={400} />
			</div>

			<CustomerTable title="고객 구매 내역" />
		</div>
	);
}
