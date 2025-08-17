import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useState } from "react";
import { useCustomers } from "@/hooks/useCustomers";
import { useDebounce } from "@/hooks/useDebounce";
import type { Customer } from "@/types/api";

type SortField = "id" | "totalAmount";
type SortOrder = "asc" | "desc";

interface CustomerTableProps {
	/** 테이블 제목 */
	title?: string;
}

/**
 * 고객 목록을 표시하는 테이블 컴포넌트
 * 검색, 정렬 기능을 포함합니다
 */
export function CustomerTable({ title = "고객 목록" }: CustomerTableProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [sortField, setSortField] = useState<SortField>("id");
	const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

	// 검색어 디바운스 (500ms)
	const debouncedSearchTerm = useDebounce(searchTerm, 500);

	// API 호출 - 구매 금액 정렬은 서버에서 처리
	const { data, isLoading, error } = useCustomers({
		...(debouncedSearchTerm && { name: debouncedSearchTerm }),
		...(sortField === "totalAmount" && { sortBy: sortOrder }),
	});

	console.log("data", data);

	/**
	 * 정렬 기준 변경 핸들러
	 */
	const handleSort = (field: SortField) => {
		if (sortField === field) {
			setSortOrder(sortOrder === "asc" ? "desc" : "asc");
		} else {
			setSortField(field);
			setSortOrder("asc");
		}
	};

	/**
	 * 클라이언트 사이드 정렬 (ID 정렬만 클라이언트에서 처리)
	 */
	const sortedCustomers = data?.data
		? sortField === "id"
			? [...data.data].sort((a, b) => {
					const result = a.id - b.id;
					return sortOrder === "asc" ? result : -result;
				})
			: data.data // 구매 금액 정렬은 서버에서 이미 처리됨
		: [];

	/**
	 * 정렬 아이콘 렌더링
	 */
	const getSortIcon = (field: SortField) => {
		if (sortField !== field) {
			return <ArrowUpDown className="w-4 h-4" />;
		}
		return sortOrder === "asc" ? (
			<ArrowUp className="w-4 h-4" />
		) : (
			<ArrowDown className="w-4 h-4" />
		);
	};

	/**
	 * 빈 상태 렌더링
	 */
	const renderEmptyState = () => (
		<tr>
			<td colSpan={4} className="px-6 py-12 text-center text-gray-500">
				{debouncedSearchTerm
					? `"${debouncedSearchTerm}"에 대한 검색 결과가 없습니다`
					: "등록된 고객이 없습니다"}
			</td>
		</tr>
	);

	/**
	 * 에러 상태 렌더링
	 */
	const renderErrorState = () => (
		<tr>
			<td colSpan={4} className="px-6 py-12 text-center text-red-500">
				데이터를 불러오는 중 오류가 발생했습니다: {error?.toString()}
			</td>
		</tr>
	);

	return (
		<div className="bg-white rounded-lg shadow">
			{/* 헤더 */}
			<div className="px-6 py-4 border-b border-gray-200">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<h2 className="text-xl font-semibold text-gray-900">{title}</h2>

					{/* 검색 입력 */}
					<div className="relative">
						<input
							type="text"
							placeholder="고객명으로 검색..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
						{isLoading && debouncedSearchTerm && (
							<div className="absolute right-3 top-1/2 transform -translate-y-1/2">
								<div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* 테이블 */}
			<div className="overflow-x-auto">
				<table className="w-full">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								고객 ID
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								고객명
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								총 구매 횟수
							</th>
							<th
								className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
								onClick={() => handleSort("totalAmount")}
							>
								<div className="flex items-center gap-1">
									총 구매 금액 {getSortIcon("totalAmount")}
								</div>
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200 relative">
						{isLoading && (
							<div className="px-6 py-24 min-h-[200px] h-full flex justify-center items-center absolute top-0 left-0 w-full z-10 bg-white/50">
								<div className="inline-block w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
							</div>
						)}
						{error && renderErrorState()}
						{!isLoading &&
							!error &&
							sortedCustomers.length === 0 &&
							renderEmptyState()}
						{!isLoading &&
							!error &&
							sortedCustomers.map((customer: Customer) => (
								<tr
									key={customer.id}
									className="hover:bg-gray-50 cursor-pointer transition-colors"
								>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{customer.id}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
										{customer.name}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{customer.count.toLocaleString()}회
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{customer.totalAmount.toLocaleString()}원
									</td>
								</tr>
							))}
					</tbody>
				</table>
			</div>

			{/* 결과 카운트 */}
			{!isLoading && !error && (
				<div className="px-6 py-4 border-t border-gray-200 text-sm text-gray-500">
					총 {sortedCustomers.length}명의 고객
				</div>
			)}
		</div>
	);
}
