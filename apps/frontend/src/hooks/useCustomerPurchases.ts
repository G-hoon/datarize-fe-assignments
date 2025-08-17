import { useQuery } from "@tanstack/react-query";
import { fetchCustomerPurchases } from "@/services/api";

// 이미 쿼리된 고객 ID를 추적하는 Set
const queriedCustomerIds = new Set<number>();

/**
 * 특정 고객의 구매 내역을 조회하는 커스텀 훅
 * @param customerId 고객 ID
 * @returns React Query 결과 객체
 */
export function useCustomerPurchases(customerId: number | null) {
	return useQuery({
		queryKey: ["customer-purchases", customerId],
		queryFn: async () => {
			if (customerId && !queriedCustomerIds.has(customerId)) {
				// 최초 쿼리인 경우 1초 지연
				await new Promise((resolve) => setTimeout(resolve, 500));
				queriedCustomerIds.add(customerId);
			}
			return fetchCustomerPurchases(customerId);
		},
		enabled: !!customerId, // customerId가 있을 때만 쿼리 실행
	});
}
