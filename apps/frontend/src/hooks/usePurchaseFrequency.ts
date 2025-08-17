import { useQuery } from "@tanstack/react-query";
import { fetchPurchaseFrequency } from "@/services/api";
import type { FetchPurchaseFrequencyParams } from "@/types/api";

/**
 * YYYY-MM-DD 형식의 날짜를 ISO 8601 형식으로 변환
 * @param dateString YYYY-MM-DD 형식의 날짜 문자열
 * @returns ISO 8601 형식의 날짜 문자열
 */
function formatDateToISO(dateString: string): string {
	// YYYY-MM-DD를 ISO 8601 형식으로 변환 (하루의 시작 시간으로)
	return `${dateString}T00:00:00.000Z`;
}

/**
 * 구매 빈도 데이터를 조회하는 커스텀 훅
 * @param params 날짜 범위 필터 파라미터
 * @returns React Query 결과 객체
 */
export function usePurchaseFrequency(params?: FetchPurchaseFrequencyParams) {
	// 날짜 형식을 ISO 8601로 변환하여 API 호출
	const formattedParams: FetchPurchaseFrequencyParams | undefined = params
		? {
				...(params.from && { from: formatDateToISO(params.from) }),
				...(params.to && { to: formatDateToISO(params.to) }),
		}
		: undefined;

	return useQuery({
		queryKey: ["purchase-frequency", params?.from, params?.to],
		queryFn: () => fetchPurchaseFrequency(formattedParams),
	});
}