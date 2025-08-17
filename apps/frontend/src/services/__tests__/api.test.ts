import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	fetchCustomerPurchases,
	fetchCustomers,
	fetchPurchaseFrequency,
} from "../api";

// fetch 모킹
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("API 서비스", () => {
	beforeEach(() => {
		mockFetch.mockClear();
	});

	describe("fetchCustomers", () => {
		const mockCustomersResponse = [
			{ id: 1, name: "김철수", count: 5, totalAmount: 150000 },
			{ id: 2, name: "이영희", count: 3, totalAmount: 80000 },
		];

		it("고객 목록을 성공적으로 가져온다", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => mockCustomersResponse,
			});

			const result = await fetchCustomers();

			expect(mockFetch).toHaveBeenCalledWith(
				"http://localhost:4000/api/customers",
			);
			expect(result).toEqual(mockCustomersResponse);
		});

		it("정렬 파라미터와 함께 요청한다", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => mockCustomersResponse,
			});

			await fetchCustomers({ sortBy: "desc" });

			expect(mockFetch).toHaveBeenCalledWith(
				"http://localhost:4000/api/customers?sortBy=desc",
			);
		});

		it("이름 검색 파라미터와 함께 요청한다", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => mockCustomersResponse,
			});

			await fetchCustomers({ name: "김철수" });

			expect(mockFetch).toHaveBeenCalledWith(
				"http://localhost:4000/api/customers?name=%EA%B9%80%EC%B2%A0%EC%88%98",
			);
		});

		it("여러 파라미터와 함께 요청한다", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => mockCustomersResponse,
			});

			await fetchCustomers({ sortBy: "asc", name: "이영희" });

			expect(mockFetch).toHaveBeenCalledWith(
				"http://localhost:4000/api/customers?sortBy=asc&name=%EC%9D%B4%EC%98%81%ED%9D%AC",
			);
		});

		it("API 에러 시 예외를 던진다", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 500,
				statusText: "Internal Server Error",
				json: async () => ({ error: "서버 오류가 발생했습니다" }),
			});

			await expect(fetchCustomers()).rejects.toThrow(
				"서버 오류가 발생했습니다",
			);
		});

		it("네트워크 에러 시 예외를 던진다", async () => {
			mockFetch.mockRejectedValueOnce(new Error("Network Error"));

			await expect(fetchCustomers()).rejects.toThrow("Network Error");
		});
	});

	describe("fetchPurchaseFrequency", () => {
		const mockFrequencyResponse = [
			{ range: "0 - 20000", count: 15 },
			{ range: "20000 - 40000", count: 25 },
		];

		it("구매 빈도 데이터를 성공적으로 가져온다", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => mockFrequencyResponse,
			});

			const result = await fetchPurchaseFrequency();

			expect(mockFetch).toHaveBeenCalledWith(
				"http://localhost:4000/api/purchase-frequency",
			);
			expect(result).toEqual(mockFrequencyResponse);
		});

		it("날짜 범위 파라미터와 함께 요청한다", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => mockFrequencyResponse,
			});

			await fetchPurchaseFrequency({
				from: "2024-01-01T00:00:00.000Z",
				to: "2024-01-31T00:00:00.000Z",
			});

			expect(mockFetch).toHaveBeenCalledWith(
				"http://localhost:4000/api/purchase-frequency?from=2024-01-01T00%3A00%3A00.000Z&to=2024-01-31T00%3A00%3A00.000Z",
			);
		});

		it("시작일만 있는 경우 올바른 URL을 생성한다", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => mockFrequencyResponse,
			});

			await fetchPurchaseFrequency({ from: "2024-01-01T00:00:00.000Z" });

			expect(mockFetch).toHaveBeenCalledWith(
				"http://localhost:4000/api/purchase-frequency?from=2024-01-01T00%3A00%3A00.000Z",
			);
		});

		it("API 에러 시 예외를 던진다", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 400,
				statusText: "Bad Request",
				json: async () => ({ error: "잘못된 날짜 형식입니다" }),
			});

			await expect(fetchPurchaseFrequency()).rejects.toThrow(
				"잘못된 날짜 형식입니다",
			);
		});
	});

	describe("fetchCustomerPurchases", () => {
		const mockPurchasesResponse = [
			{
				date: "2024-01-15",
				product: "상품A",
				price: 50000,
				imgSrc: "https://example.com/image1.jpg",
			},
			{
				date: "2024-01-20",
				product: "상품B",
				price: 30000,
				imgSrc: "https://example.com/image2.jpg",
			},
		];

		it("고객 구매 내역을 성공적으로 가져온다", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => mockPurchasesResponse,
			});

			const result = await fetchCustomerPurchases(1);

			expect(mockFetch).toHaveBeenCalledWith(
				"http://localhost:4000/api/customers/1/purchases",
			);
			expect(result).toEqual(mockPurchasesResponse);
		});

		it("고객 ID가 null인 경우 예외를 던진다", async () => {
			await expect(fetchCustomerPurchases(null)).rejects.toThrow(
				"Customer ID is required",
			);
		});

		it("존재하지 않는 고객 ID로 요청 시 예외를 던진다", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 404,
				statusText: "Not Found",
				json: async () => ({ error: "고객을 찾을 수 없습니다" }),
			});

			await expect(fetchCustomerPurchases(999)).rejects.toThrow(
				"고객을 찾을 수 없습니다",
			);
		});

		it("API 에러 시 적절한 에러 메시지를 제공한다", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 500,
				statusText: "Internal Server Error",
				json: async () => ({}),
			});

			await expect(fetchCustomerPurchases(1)).rejects.toThrow(
				"HTTP 500: Internal Server Error",
			);
		});
	});
});
