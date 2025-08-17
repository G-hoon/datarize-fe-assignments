import { CustomerTable } from "@/components/dashboard/CustomerTable";
import { PriceFrequencyChart } from "@/components/dashboard/PriceFrequencyChart";

export default function DashBoard() {
	return (
		<div className="min-h-screen bg-gray-50 p-6 space-y-6">
			<h1 className="text-3xl font-bold text-gray-900">구매 데이터 대시보드</h1>

			{/* 가격대별 구매 빈도 차트 */}
			<PriceFrequencyChart height={400} />

			{/* 고객 구매 내역 테이블 */}
			<CustomerTable title="고객 구매 내역" />
		</div>
	);
}
