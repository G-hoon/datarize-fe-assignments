import dayjs from "dayjs";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import { useCustomerPurchases } from "@/hooks/useCustomerPurchases";
import type { Customer } from "@/types/api";
import ShimmerSkeleton from "../common/Skeleton/ShimmerSkeleton";

interface CustomerDetailModalProps {
	customer: Customer;
	onClose?: () => void;
}

/**
 * 고객 상세 정보 및 구매 내역을 표시하는 모달 컴포넌트
 */
export function CustomerDetailModal({
	customer,
	onClose,
}: CustomerDetailModalProps) {
	const { data, isLoading, error } = useCustomerPurchases(customer.id);
	const [isErrorImageLoad, setIsErrorImageLoad] = useState(false);
	const [isClosing, setIsClosing] = useState(false); // 닫기 애니메이션 상태 관리

	const formatDate = (dateString: string) => {
		return dayjs(dateString).format("YYYY년 M월 D일");
	};

	const formatPrice = (price: number) => {
		return `${price.toLocaleString("ko-KR")}원`;
	};

	const onErrorImageLoad = () => {
		setIsErrorImageLoad(true);
	};

	const handleClose = () => {
		setIsClosing(true);
	};

	const handleAnimationComplete = () => {
		if (isClosing) {
			onClose?.();
		}
	};

	const renderLoading = () => (
		<div className="space-y-4 w-full">
			<ShimmerSkeleton className="w-full h-[98px] border border-gray-200 rounded-lg" />
			<ShimmerSkeleton className="w-full h-[98px] border border-gray-200 rounded-lg" />
			<ShimmerSkeleton className="w-full h-[98px] border border-gray-200 rounded-lg" />
			<ShimmerSkeleton className="w-full h-[98px] border border-gray-200 rounded-lg" />
		</div>
	);

	const renderError = () => (
		<div className="text-center py-12">
			<div className="text-red-600 font-medium mb-2">
				구매 내역을 불러오는 중 오류가 발생했습니다
			</div>
			<div className="text-sm text-red-500">{error?.message}</div>
		</div>
	);

	const renderEmpty = () => (
		<div className="text-center py-12 text-gray-500">구매 내역이 없습니다</div>
	);

	const renderPurchaseList = () => {
		if (!data || data.length === 0) {
			return renderEmpty();
		}

		return (
			<div className="space-y-4 w-full">
				{data.map((purchase) => (
					<div
						key={`${purchase.date}-${purchase.product}-${purchase.price}-${purchase.imgSrc}`}
						className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
					>
						{/* 썸네일 */}
						<div className="flex-shrink-0">
							{purchase.imgSrc && !isErrorImageLoad ? (
								<img
									src={purchase.imgSrc}
									alt={purchase.product}
									className="w-16 h-16 object-cover rounded-md"
									onError={onErrorImageLoad}
								/>
							) : (
								<div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 text-xs">
									이미지 없음
								</div>
							)}
						</div>

						{/* 구매 정보 */}
						<div className="flex-1 min-w-0">
							<h4 className="font-medium text-gray-900 truncate">
								{purchase.product}
							</h4>
							<p className="text-sm text-gray-500 mt-1">
								{formatDate(purchase.date)}
							</p>
						</div>

						{/* 가격 */}
						<div className="flex-shrink-0">
							<span className="text-lg font-semibold text-gray-900">
								{formatPrice(purchase.price)}
							</span>
						</div>
					</div>
				))}
			</div>
		);
	};

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: 모달 컴포넌트
		// biome-ignore lint/a11y/useKeyWithClickEvents: 모달 컴포넌트
		<div
			className="md:items-center h-real-screen bg-opacity-50 flex w-screen items-end justify-center md:py-4"
			onClick={handleClose}
		>
			<motion.div
				role="dialog"
				className="md:w-[540px] md:rounded-[20px] flex max-h-[400px] md:max-h-[800px] w-screen flex-col gap-6 rounded-t-[20px] md:rounded-b-[20px] bg-white p-4 md:p-10"
				aria-modal="true"
				aria-labelledby="equipped-title-modal"
				initial={{ opacity: 0.5, y: "100%" }}
				animate={isClosing ? { opacity: 0, y: "100%" } : { opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: "100%" }}
				transition={{ ease: "easeOut", duration: 0.2 }}
				onAnimationComplete={handleAnimationComplete}
				onClick={(e) => e.stopPropagation()}
			>
				{/* 모달 헤더 */}
				<div className="flex items-center justify-between p-2 md:p-6 border-b border-gray-200">
					<h2 className="text-xl font-semibold text-gray-900">
						{customer.name} 고객 상세 정보
					</h2>
					<button
						type="button"
						onClick={onClose}
						className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
						aria-label="모달 닫기"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* 모달 콘텐츠 */}
				<div className="overflow-y-auto h-full w-full">
					<div className="p-2 md:p-6">
						{/* 고객 기본 정보 */}
						<div className="bg-gray-50 rounded-lg p-4 mb-6 w-full">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div>
									<span className="text-sm font-medium text-gray-500">
										고객 ID
									</span>
									<p className="text-lg font-semibold text-gray-900">
										{customer.id}
									</p>
								</div>
								<div>
									<span className="text-sm font-medium text-gray-500">
										총 구매 횟수
									</span>
									<p className="text-lg font-semibold text-gray-900">
										{customer.count.toLocaleString()}회
									</p>
								</div>
								<div>
									<span className="text-sm font-medium text-gray-500">
										총 구매 금액
									</span>
									<p className="text-lg font-semibold text-blue-600">
										{formatPrice(customer.totalAmount)}
									</p>
								</div>
							</div>
						</div>

						{/* 구매 내역 섹션 */}
						<div>
							<h3 className="text-lg font-semibold text-gray-900 mb-4">
								구매 내역
							</h3>

							{isLoading && renderLoading()}
							{error && renderError()}
							{!isLoading && !error && renderPurchaseList()}
						</div>
					</div>
				</div>
			</motion.div>
		</div>
	);
}
