import { BarChart } from "../components/charts/BarChart";

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
	return (
		<BarChart data={mockChartData} title="가격대별 구매 빈도" height={400} />
	);
}
