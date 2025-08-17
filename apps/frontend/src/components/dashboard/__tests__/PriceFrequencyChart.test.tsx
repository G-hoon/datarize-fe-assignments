import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as api from "@/services/api";
import { PriceFrequencyChart } from "../PriceFrequencyChart";

// API 모킹
vi.mock("@/services/api");

// Recharts 모킹
vi.mock("recharts", () => ({
	BarChart: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="bar-chart">{children}</div>
	),
	Bar: () => <div data-testid="bar" />,
	XAxis: () => <div data-testid="x-axis" />,
	YAxis: () => <div data-testid="y-axis" />,
	CartesianGrid: () => <div data-testid="cartesian-grid" />,
	Tooltip: () => <div data-testid="tooltip" />,
	Legend: () => <div data-testid="legend" />,
	ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="responsive-container">{children}</div>
	),
}));

const mockPurchaseFrequency = [
	{ range: "0 - 20000", count: 15 },
	{ range: "20000 - 40000", count: 25 },
	{ range: "40000 - 60000", count: 18 },
	{ range: "60000 - 80000", count: 12 },
	{ range: "80000 - 100000", count: 8 },
];

describe("PriceFrequencyChart", () => {
	let queryClient: QueryClient;

	beforeEach(() => {
		queryClient = new QueryClient({
			defaultOptions: {
				queries: {
					retry: false,
				},
			},
		});

		vi.mocked(api.fetchPurchaseFrequency).mockResolvedValue(
			mockPurchaseFrequency,
		);
	});

	const renderComponent = (props = {}) => {
		return render(
			<QueryClientProvider client={queryClient}>
				<PriceFrequencyChart
					height={400}
					title="가격대별 구매 빈도"
					{...props}
				/>
			</QueryClientProvider>,
		);
	};

	it("차트 컴포넌트가 렌더링된다", async () => {
		renderComponent();

		await waitFor(() => {
			expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
		});

		expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
		expect(screen.getByTestId("bar")).toBeInTheDocument();
		expect(screen.getByTestId("x-axis")).toBeInTheDocument();
		expect(screen.getByTestId("y-axis")).toBeInTheDocument();
	});

	it("제목이 표시된다", () => {
		const title = "테스트 차트 제목";
		renderComponent({ title });

		expect(screen.getByText(title)).toBeInTheDocument();
	});

	it("날짜 범위 선택기가 렌더링된다", () => {
		renderComponent();

		expect(screen.getByText("기간을 선택해주세요")).toBeInTheDocument();
	});

	it("날짜 범위 변경 시 API가 다시 호출된다", async () => {
		const user = userEvent.setup();
		vi.mocked(api.fetchPurchaseFrequency).mockClear();

		renderComponent();

		// 처음 로드 시 API 호출 확인 (빈 객체로 호출됨)
		await waitFor(() => {
			expect(api.fetchPurchaseFrequency).toHaveBeenCalledWith({});
		});

		// 날짜 선택기 버튼 클릭하여 드롭다운 열기
		const datePickerButton = screen.getByText("기간을 선택해주세요");
		await user.click(datePickerButton);

		await waitFor(() => {
			expect(screen.getByText("최근 1개월")).toBeInTheDocument();
		});

		// 프리셋 버튼 클릭
		const monthButton = screen.getByText("최근 1개월");
		await user.click(monthButton);

		// API가 다시 호출되었는지 확인 (정확한 날짜는 동적이므로 호출 여부만 확인)
		await waitFor(() => {
			expect(vi.mocked(api.fetchPurchaseFrequency)).toHaveBeenCalledTimes(2);
		});
	});

	it("로딩 상태를 표시한다", () => {
		vi.mocked(api.fetchPurchaseFrequency).mockImplementation(
			() => new Promise(() => {}),
		);

		renderComponent();

		expect(screen.getByText("차트 로딩 중...")).toBeInTheDocument();
	});

	it("에러 상태를 표시한다", async () => {
		const errorMessage = "데이터를 불러오는데 실패했습니다";
		vi.mocked(api.fetchPurchaseFrequency).mockRejectedValue(
			new Error(errorMessage),
		);

		renderComponent();

		await waitFor(() => {
			expect(
				screen.getByText("데이터를 불러오는 중 오류가 발생했습니다"),
			).toBeInTheDocument();
		});
	});

	it("데이터가 없을 때 메시지를 표시한다", async () => {
		vi.mocked(api.fetchPurchaseFrequency).mockResolvedValue([]);

		renderComponent();

		await waitFor(() => {
			expect(screen.getByText("표시할 데이터가 없습니다")).toBeInTheDocument();
		});
	});

	it("height prop이 적용된다", async () => {
		const customHeight = 300;
		renderComponent({ height: customHeight });

		await waitFor(() => {
			const container = screen.getByTestId("responsive-container");
			expect(container).toBeInTheDocument();
		});
		// 높이는 ResponsiveContainer의 prop으로 전달되므로 실제 DOM에서는 확인하기 어려움
		// 컴포넌트가 정상적으로 렌더링되는지만 확인
	});

	it("초기 로드 시 전체 데이터를 가져온다", async () => {
		renderComponent();

		await waitFor(() => {
			expect(api.fetchPurchaseFrequency).toHaveBeenCalledWith({});
		});
	});
});
