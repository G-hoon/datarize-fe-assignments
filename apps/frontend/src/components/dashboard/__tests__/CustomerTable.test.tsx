import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useModalStore } from "@/hooks/useModalStore";
import * as api from "@/services/api";
import { CustomerTable } from "../CustomerTable";

// API 모킹
vi.mock("@/services/api");
vi.mock("@/hooks/useModalStore");

const mockCustomers = [
	{
		id: 1,
		name: "김철수",
		count: 5,
		totalAmount: 150000,
	},
	{
		id: 2,
		name: "이영희",
		count: 3,
		totalAmount: 80000,
	},
	{
		id: 3,
		name: "박민수",
		count: 7,
		totalAmount: 220000,
	},
];

describe("CustomerTable", () => {
	let queryClient: QueryClient;
	const mockShowModal = vi.fn();

	beforeEach(() => {
		queryClient = new QueryClient({
			defaultOptions: {
				queries: {
					retry: false,
				},
			},
		});

		vi.mocked(useModalStore).mockReturnValue({
			showModal: mockShowModal,
			hideModal: vi.fn(),
			currentModal: null,
			isOpen: false,
			currentModalId: null,
		});

		vi.mocked(api.fetchCustomers).mockResolvedValue(mockCustomers);
	});

	const renderComponent = (props = {}) => {
		return render(
			<QueryClientProvider client={queryClient}>
				<CustomerTable {...props} />
			</QueryClientProvider>,
		);
	};

	it("고객 목록을 렌더링한다", async () => {
		renderComponent();

		await waitFor(() => {
			expect(screen.getByText("김철수")).toBeInTheDocument();
			expect(screen.getByText("이영희")).toBeInTheDocument();
			expect(screen.getByText("박민수")).toBeInTheDocument();
		});

		expect(screen.getByText("150,000원")).toBeInTheDocument();
		expect(screen.getByText("80,000원")).toBeInTheDocument();
		expect(screen.getByText("220,000원")).toBeInTheDocument();
	});

	it("검색 기능이 작동한다", async () => {
		const user = userEvent.setup();
		renderComponent();

		await waitFor(() => {
			expect(screen.getByText("김철수")).toBeInTheDocument();
		});

		const searchInput = screen.getByPlaceholderText("고객명으로 검색...");
		await user.type(searchInput, "김철수");

		await waitFor(() => {
			expect(api.fetchCustomers).toHaveBeenCalledWith({ name: "김철수" });
		});
	});

	it("구매 금액으로 정렬할 수 있다", async () => {
		const user = userEvent.setup();
		renderComponent();

		await waitFor(() => {
			expect(screen.getByText("김철수")).toBeInTheDocument();
		});

		const sortButton = screen.getByText("총 구매 금액").closest("th");
		if (sortButton) {
			await user.click(sortButton);

			await waitFor(() => {
				expect(api.fetchCustomers).toHaveBeenCalledWith({ sortBy: "asc" });
			});
		}
	});

	it("고객 클릭 시 모달이 열린다", async () => {
		const user = userEvent.setup();
		renderComponent();

		await waitFor(() => {
			expect(screen.getByText("김철수")).toBeInTheDocument();
		});

		const customerRow = screen.getByText("김철수").closest("tr");
		if (customerRow) {
			await user.click(customerRow);

			expect(mockShowModal).toHaveBeenCalledWith({
				component: expect.any(Function),
				props: {
					customer: mockCustomers[0],
				},
			});
		}
	});

	it("에러 상태를 표시한다", async () => {
		const errorMessage = "데이터를 불러오는데 실패했습니다";
		vi.mocked(api.fetchCustomers).mockRejectedValue(new Error(errorMessage));

		renderComponent();

		await waitFor(() => {
			expect(screen.getByText(/오류가 발생했습니다/)).toBeInTheDocument();
		});
	});

	it("검색 결과가 없을 때 메시지를 표시한다", async () => {
		vi.mocked(api.fetchCustomers).mockResolvedValue([]);

		renderComponent();

		await waitFor(() => {
			expect(screen.getByText("등록된 고객이 없습니다")).toBeInTheDocument();
		});
	});

	it("제목을 커스텀할 수 있다", () => {
		const customTitle = "커스텀 고객 테이블";
		renderComponent({ title: customTitle });

		expect(screen.getByText(customTitle)).toBeInTheDocument();
	});
});
