import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import { useModalStore } from "@/hooks/useModalStore";

export function ModalRenderer() {
	const { currentModal, hideModal } = useModalStore();
	const location = useLocation();
	const isHandlingPopState = useRef(false);

	const prevLocation = useRef(location);

	// popstate 이벤트 감지 (기존 코드와 동일)
	useEffect(() => {
		const handlePopState = (event: PopStateEvent) => {
			if (isHandlingPopState.current) return;
			isHandlingPopState.current = true;

			const isModalState = event.state?.isModal;
			if (currentModal && !isModalState) {
				hideModal(true);
			}

			setTimeout(() => {
				isHandlingPopState.current = false;
			}, 0);
		};

		window.addEventListener("popstate", handlePopState);
		return () => {
			window.removeEventListener("popstate", handlePopState);
		};
	}, [currentModal, hideModal]);

	// 브라우저 History 변경 시 모달 닫기
	useEffect(() => {
		if (
			prevLocation.current.pathname !== location.pathname ||
			prevLocation.current.search !== location.search
		) {
			if (!isHandlingPopState.current && currentModal) {
				hideModal(false);
			}
		}

		prevLocation.current = location;
	}, [location, currentModal, hideModal]);

	if (!currentModal) return null;

	const {
		component: ModalComponent,
		props,
		closeOnDimmedClick = true,
	} = currentModal;

	const handleDimmedClick = () => {
		if (closeOnDimmedClick) {
			hideModal(false);
		}
	};

	return createPortal(
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/** biome-ignore lint/a11y/noStaticElementInteractions: dimmed background for modal */}
			<div
				className="pointer-events-auto absolute inset-0 bg-black opacity-70"
				onClick={handleDimmedClick}
				aria-label="dimmed"
				role="presentation"
			/>
			{/** biome-ignore lint/a11y/useKeyWithClickEvents: modal container with click handler */}
			<div
				className="relative z-10"
				onClick={(e) => e.stopPropagation()}
				role="dialog"
				aria-modal="true"
			>
				<ModalComponent
					{...props}
					isOpen={true}
					onClose={() => hideModal(false)}
				/>
			</div>
		</div>,
		document.body,
	);
}
