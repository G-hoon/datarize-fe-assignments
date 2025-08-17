import { useQuery } from "@tanstack/react-query";
import { fetchCustomers } from "@/services/api";
import type { FetchCustomersParams } from "@/types/api";

/**
 * 고객 목록을 조회하는 커스텀 훅
 * @param params 검색 및 정렬 파라미터
 * @returns React Query 결과 객체
 */
export function useCustomers(params?: FetchCustomersParams) {
	return useQuery({
		queryKey: ["customers", params?.name, params?.sortBy],
		queryFn: () => fetchCustomers(params),
	});
}