import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as api from "@/services/api";
import { usePurchaseFrequency } from "../usePurchaseFrequency";

// API 모킹
vi.mock("@/services/api");

const mockPurchaseFrequency = [
	{ range: "0 - 20000", count: 15 },
	{ range: "20000 - 40000", count: 25 },
	{ range: "40000 - 60000", count: 18 },
];

describe("usePurchaseFrequency", () => {
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

	const wrapper = ({ children }: { children: React.ReactNode }) => {
		return React.createElement(
			QueryClientProvider,
			{ client: queryClient },
			children,
		);
	};

	it("구매 빈도 데이터를 성공적으로 가져온다", async () => {
		const { result } = renderHook(() => usePurchaseFrequency(), { wrapper });

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		expect(result.current.data).toEqual(mockPurchaseFrequency);
		expect(result.current.isLoading).toBe(false);
		expect(result.current.error).toBe(null);
	});

	it("날짜 범위 파라미터를 올바르게 처리한다", async () => {
		const dateRange = { from: "2024-01-01", to: "2024-01-31" };
		const { result } = renderHook(() => usePurchaseFrequency(dateRange), {
			wrapper,
		});

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		expect(api.fetchPurchaseFrequency).toHaveBeenCalledWith({
			from: "2024-01-01T00:00:00.000Z",
			to: "2024-01-31T00:00:00.000Z",
		});
	});

	it("날짜 범위가 없으면 전체 데이터를 가져온다", async () => {
		const { result } = renderHook(() => usePurchaseFrequency(), { wrapper });

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		expect(api.fetchPurchaseFrequency).toHaveBeenCalledWith(undefined);
	});

	it("시작일만 있는 경우를 처리한다", async () => {
		const dateRange = { from: "2024-01-01" };
		const { result } = renderHook(() => usePurchaseFrequency(dateRange), {
			wrapper,
		});

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		expect(api.fetchPurchaseFrequency).toHaveBeenCalledWith({
			from: "2024-01-01T00:00:00.000Z",
		});
	});

	it("종료일만 있는 경우를 처리한다", async () => {
		const dateRange = { to: "2024-01-31" };
		const { result } = renderHook(() => usePurchaseFrequency(dateRange), {
			wrapper,
		});

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		expect(api.fetchPurchaseFrequency).toHaveBeenCalledWith({
			to: "2024-01-31T00:00:00.000Z",
		});
	});

	it("에러가 발생하면 에러 상태를 반환한다", async () => {
		const errorMessage = "데이터를 불러오는데 실패했습니다";
		vi.mocked(api.fetchPurchaseFrequency).mockRejectedValue(
			new Error(errorMessage),
		);

		const { result } = renderHook(() => usePurchaseFrequency(), { wrapper });

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeInstanceOf(Error);
		expect(result.current.data).toBeUndefined();
	});

	it("로딩 상태를 올바르게 관리한다", async () => {
		vi.mocked(api.fetchPurchaseFrequency).mockImplementation(
			() => new Promise(() => {}),
		);

		const { result } = renderHook(() => usePurchaseFrequency(), { wrapper });

		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();
		expect(result.current.error).toBe(null);
	});

	it("날짜 범위 변경 시 새로운 쿼리를 실행한다", async () => {
		// 이 테스트를 위한 별도의 쿼리 클라이언트 생성
		const testQueryClient = new QueryClient({
			defaultOptions: {
				queries: {
					retry: false,
				},
			},
		});

		const testWrapper = ({ children }: { children: React.ReactNode }) => {
			return React.createElement(
				QueryClientProvider,
				{ client: testQueryClient },
				children,
			);
		};

		vi.mocked(api.fetchPurchaseFrequency).mockClear();

		const { result, rerender } = renderHook(
			({ dateRange }) => usePurchaseFrequency(dateRange),
			{
				wrapper: testWrapper,
				initialProps: { dateRange: { from: "2024-01-01", to: "2024-01-31" } },
			},
		);

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		expect(api.fetchPurchaseFrequency).toHaveBeenCalledWith({
			from: "2024-01-01T00:00:00.000Z",
			to: "2024-01-31T00:00:00.000Z",
		});

		// 날짜 범위 변경
		rerender({ dateRange: { from: "2024-02-01", to: "2024-02-29" } });

		await waitFor(() => {
			expect(api.fetchPurchaseFrequency).toHaveBeenCalledWith({
				from: "2024-02-01T00:00:00.000Z",
				to: "2024-02-29T00:00:00.000Z",
			});
		});

		expect(vi.mocked(api.fetchPurchaseFrequency)).toHaveBeenCalledTimes(2);
	});

	it("올바른 쿼리 키를 생성한다", async () => {
		const dateRange = { from: "2024-01-01", to: "2024-01-31" };
		const { result } = renderHook(() => usePurchaseFrequency(dateRange), {
			wrapper,
		});

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		// 쿼리 키는 React Query 내부에서 사용되므로 직접 테스트하기 어려움
		// 대신 API가 올바른 파라미터로 호출되는지 확인
		expect(api.fetchPurchaseFrequency).toHaveBeenCalledWith({
			from: "2024-01-01T00:00:00.000Z",
			to: "2024-01-31T00:00:00.000Z",
		});
	});
});
