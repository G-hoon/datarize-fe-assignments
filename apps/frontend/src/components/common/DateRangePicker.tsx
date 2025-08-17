import dayjs from "dayjs";
import { Calendar, ChevronDown } from "lucide-react";
import { useId, useState } from "react";

export interface DateRange {
	startDate: string | null;
	endDate: string | null;
}

interface DateRangePickerProps {
	value: DateRange;
	onChange: (dateRange: DateRange) => void;
	placeholder?: string;
	disabled?: boolean;
}

/**
 * 날짜 범위 선택 컴포넌트
 * 시작일과 종료일을 선택할 수 있습니다
 */
export function DateRangePicker({
	value,
	onChange,
	placeholder = "날짜를 선택해주세요",
	disabled = false,
}: DateRangePickerProps) {
	const [isOpen, setIsOpen] = useState(false);
	const pickerId = useId();
	const startDateId = useId();
	const endDateId = useId();

	const getTodayString = () => {
		return dayjs().format("YYYY-MM-DD");
	};

	const formatDateForDisplay = (dateString: string | null) => {
		if (!dateString) return "";
		return dayjs(dateString).format("YYYY년 M월 D일");
	};

	/**
	 * 선택된 날짜 범위를 표시용 텍스트로 변환
	 */
	const getDisplayText = () => {
		if (!value.startDate && !value.endDate) {
			return placeholder;
		}

		if (value.startDate && value.endDate) {
			return `${formatDateForDisplay(value.startDate)} ~ ${formatDateForDisplay(value.endDate)}`;
		}

		if (value.startDate) {
			return `${formatDateForDisplay(value.startDate)} ~`;
		}

		return `~ ${formatDateForDisplay(value.endDate)}`;
	};

	const handleStartDateChange = (date: string) => {
		const newValue = { ...value, startDate: date };
		// 시작일이 종료일보다 뒤인 경우 종료일을 시작일로 설정
		if (newValue.endDate && dayjs(date).isAfter(dayjs(newValue.endDate))) {
			newValue.endDate = date;
		}
		onChange(newValue);
	};

	const handleEndDateChange = (date: string) => {
		const newValue = { ...value, endDate: date };
		// 종료일이 시작일보다 앞인 경우 시작일을 종료일로 설정
		if (newValue.startDate && dayjs(date).isBefore(dayjs(newValue.startDate))) {
			newValue.startDate = date;
		}
		onChange(newValue);
	};

	const applyPreset = (preset: "today" | "week" | "month" | "all") => {
		const today = dayjs();
		let startDate: string | null = null;
		let endDate: string | null = null;

		switch (preset) {
			case "today": {
				startDate = endDate = today.format("YYYY-MM-DD");
				break;
			}
			case "week": {
				startDate = today.subtract(7, "day").format("YYYY-MM-DD");
				endDate = today.format("YYYY-MM-DD");
				break;
			}
			case "month": {
				startDate = today.subtract(1, "month").format("YYYY-MM-DD");
				endDate = today.format("YYYY-MM-DD");
				break;
			}
			case "all": {
				startDate = endDate = null;
				break;
			}
		}

		onChange({ startDate, endDate });
		setIsOpen(false);
	};

	const handleReset = () => {
		onChange({ startDate: null, endDate: null });
	};

	return (
		<div className="relative">
			{/* 날짜 선택 버튼 */}
			<button
				id={pickerId}
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				disabled={disabled}
				className={`
					w-full px-4 py-2 text-left border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
					${disabled ? "bg-gray-100 text-gray-400" : "bg-white text-gray-900 hover:bg-gray-50"}
					${isOpen ? "ring-2 ring-blue-500 border-transparent" : "border-gray-300"}
				`}
			>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Calendar className="w-4 h-4 text-gray-400" />
						<span
							className={
								value.startDate || value.endDate
									? "text-gray-900"
									: "text-gray-400"
							}
						>
							{getDisplayText()}
						</span>
					</div>
					<ChevronDown
						className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
					/>
				</div>
			</button>

			{/* 드롭다운 패널 */}
			{isOpen && (
				<div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
					<div className="p-4">
						{/* 프리셋 버튼들 */}
						<div className="grid grid-cols-2 gap-2 mb-4">
							<button
								type="button"
								onClick={() => applyPreset("today")}
								className="px-3 py-2 text-sm border border-gray-200 rounded hover:bg-gray-50"
							>
								오늘
							</button>
							<button
								type="button"
								onClick={() => applyPreset("week")}
								className="px-3 py-2 text-sm border border-gray-200 rounded hover:bg-gray-50"
							>
								최근 1주일
							</button>
							<button
								type="button"
								onClick={() => applyPreset("month")}
								className="px-3 py-2 text-sm border border-gray-200 rounded hover:bg-gray-50"
							>
								최근 1개월
							</button>
							<button
								type="button"
								onClick={() => applyPreset("all")}
								className="px-3 py-2 text-sm border border-gray-200 rounded hover:bg-gray-50"
							>
								전체 기간
							</button>
						</div>

						{/* 커스텀 날짜 선택 */}
						<div className="space-y-3">
							<div>
								<label
									htmlFor={startDateId}
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									시작일
								</label>
								<input
									id={startDateId}
									type="date"
									value={value.startDate || ""}
									onChange={(e) => handleStartDateChange(e.target.value)}
									max={getTodayString()}
									className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								/>
							</div>
							<div>
								<label
									htmlFor={endDateId}
									className="block text-sm font-medium text-gray-700 mb-1"
								>
									종료일
								</label>
								<input
									id={endDateId}
									type="date"
									value={value.endDate || ""}
									onChange={(e) => handleEndDateChange(e.target.value)}
									min={value.startDate || undefined}
									max={getTodayString()}
									className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								/>
							</div>
						</div>

						{/* 액션 버튼들 */}
						<div className="flex justify-between mt-4 pt-3 border-t border-gray-200">
							<button
								type="button"
								onClick={handleReset}
								className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-200 border border-gray-700 rounded-md"
							>
								초기화
							</button>
							<button
								type="button"
								onClick={() => setIsOpen(false)}
								className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-white hover:text-blue-600 border border-blue-700 rounded-md"
							>
								확인
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
