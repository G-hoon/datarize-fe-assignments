import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as api from "@/services/api";
import type { FetchCustomersParams } from "@/types/api";
import { useCustomers } from "../useCustomers";

// API 모킹
vi.mock("@/services/api");

const mockCustomers = [
	{ id: 1, name: "김철수", count: 5, totalAmount: 150000 },
	{ id: 2, name: "이영희", count: 3, totalAmount: 80000 },
];

describe("useCustomers", () => {
	let queryClient: QueryClient;

	beforeEach(() => {
		queryClient = new QueryClient({
			defaultOptions: {
				queries: {
					retry: false,
				},
			},
		});

		vi.mocked(api.fetchCustomers).mockResolvedValue(mockCustomers);
	});

	const wrapper = ({ children }: { children: React.ReactNode }) => {
		return React.createElement(
			QueryClientProvider,
			{ client: queryClient },
			children,
		);
	};

	it("고객 데이터를 성공적으로 가져온다", async () => {
		const { result } = renderHook(() => useCustomers(), { wrapper });

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		expect(result.current.data).toEqual(mockCustomers);
		expect(result.current.isLoading).toBe(false);
		expect(result.current.error).toBe(null);
	});

	it("파라미터와 함께 API를 호출한다", async () => {
		const params: FetchCustomersParams = { sortBy: "desc", name: "김철수" };
		const { result } = renderHook(() => useCustomers(params), { wrapper });

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		expect(api.fetchCustomers).toHaveBeenCalledWith(params);
	});

	it("파라미터가 없으면 undefined로 API를 호출한다", async () => {
		const { result } = renderHook(() => useCustomers(), { wrapper });

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		expect(api.fetchCustomers).toHaveBeenCalledWith(undefined);
	});

	it("에러가 발생하면 에러 상태를 반환한다", async () => {
		const errorMessage = "데이터를 불러오는데 실패했습니다";
		vi.mocked(api.fetchCustomers).mockRejectedValue(new Error(errorMessage));

		const { result } = renderHook(() => useCustomers(), { wrapper });

		await waitFor(() => {
			expect(result.current.isError).toBe(true);
		});

		expect(result.current.error).toBeInstanceOf(Error);
		expect(result.current.data).toBeUndefined();
	});

	it("로딩 상태를 올바르게 관리한다", async () => {
		// 무한 대기 Promise로 로딩 상태 유지
		vi.mocked(api.fetchCustomers).mockImplementation(
			() => new Promise(() => {}),
		);

		const { result } = renderHook(() => useCustomers(), { wrapper });

		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toBeUndefined();
		expect(result.current.error).toBe(null);
	});

	it("파라미터 변경 시 새로운 쿼리를 실행한다", async () => {
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

		vi.mocked(api.fetchCustomers).mockClear();

		const params: FetchCustomersParams = { sortBy: "asc" };

		const { result, rerender } = renderHook(
			({ params }) => useCustomers(params),
			{
				wrapper: testWrapper,
				initialProps: { params },
			},
		);

		await waitFor(() => {
			expect(result.current.isSuccess).toBe(true);
		});

		expect(api.fetchCustomers).toHaveBeenCalledWith({ sortBy: "asc" });

		// 파라미터 변경
		rerender({ params: { sortBy: "desc" as const } });

		await waitFor(() => {
			expect(api.fetchCustomers).toHaveBeenCalledWith({
				sortBy: "desc" as const,
			});
		});

		expect(vi.mocked(api.fetchCustomers)).toHaveBeenCalledTimes(2);
	});
});
