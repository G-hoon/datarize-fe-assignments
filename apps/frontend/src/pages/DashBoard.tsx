import { CustomerTable } from "@/components/dashboard/CustomerTable";
import { PriceFrequencyChart } from "@/components/dashboard/PriceFrequencyChart";

export default function DashBoard() {
	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-7xl mx-auto space-y-8">
				{/* 가격대별 구매 빈도 차트 */}
				<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
					<PriceFrequencyChart height={400} title="가격대별 구매 빈도" />
				</div>

				{/* 고객 테이블 */}
				<div>
					<CustomerTable title="고객 구매 내역" />
				</div>
			</div>
		</div>
	);
}
