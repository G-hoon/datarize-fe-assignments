import type {
	ApiError,
	ApiResponse,
	Customer,
	FetchCustomersParams,
	FetchPurchaseFrequencyParams,
	PurchaseFrequency,
} from "../types/api";

const BASE_URL = "http://localhost:4000/api";

/**
 * 에러 핸들링을 포함한 범용 API 호출 래퍼 함수
 * @param endpoint API 엔드포인트 경로
 * @returns API 응답 데이터와 에러, 로딩 상태를 포함한 객체
 */
async function apiCall<T>(endpoint: string): Promise<ApiResponse<T>> {
	try {
		const response = await fetch(`${BASE_URL}${endpoint}`);

		if (!response.ok) {
			const errorData: ApiError = {
				message: `HTTP ${response.status}: ${response.statusText}`,
				status: response.status,
			};
			return {
				data: null,
				error: errorData.message,
				loading: false,
			};
		}

		const data = await response.json();
		return {
			data,
			error: null,
			loading: false,
		};
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error occurred";
		return {
			data: null,
			error: errorMessage,
			loading: false,
		};
	}
}

/**
 * 구매 빈도 데이터를 조회합니다 (선택적 날짜 필터링 포함)
 * @param params 날짜 범위 필터 파라미터 (from, to)
 * @returns 가격대별 구매 빈도 데이터 배열
 */
export async function fetchPurchaseFrequency(
	params?: FetchPurchaseFrequencyParams,
): Promise<ApiResponse<PurchaseFrequency[]>> {
	const searchParams = new URLSearchParams();

	if (params?.from) {
		searchParams.append("from", params.from);
	}
	if (params?.to) {
		searchParams.append("to", params.to);
	}

	const endpoint = `/purchase-frequency${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
	return apiCall<PurchaseFrequency[]>(endpoint);
}

/**
 * 고객 목록을 조회합니다 (선택적 정렬 및 이름 필터링 포함)
 * @param params 정렬 기준과 이름 검색 파라미터
 * @returns 고객 데이터 배열
 */
export async function fetchCustomers(
	params?: FetchCustomersParams,
): Promise<ApiResponse<Customer[]>> {
	const searchParams = new URLSearchParams();

	if (params?.sortBy) {
		searchParams.append("sortBy", params.sortBy);
	}
	if (params?.name) {
		searchParams.append("name", params.name);
	}

	const endpoint = `/customers${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
	return apiCall<Customer[]>(endpoint);
}


/**
 * 초기 로딩 상태를 생성하는 헬퍼 함수
 * @returns 로딩 중 상태의 API 응답 객체
 */
export function createLoadingState<T>(): ApiResponse<T> {
	return {
		data: null,
		error: null,
		loading: true,
	};
}
