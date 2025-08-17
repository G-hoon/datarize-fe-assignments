import type { ComponentType } from "react";
import { create } from "zustand";

interface ModalInstance {
	id: string;
	component: ComponentType<unknown>;
	props: object;
	closeOnDimmedClick?: boolean;
}

interface ModalStore {
	currentModal: ModalInstance | null;
	isOpen: boolean;
	currentModalId: string | null;
	showModal: (modalConfig: Omit<ModalInstance, "id">) => string;
	hideModal: (fromPopState?: boolean) => void;
}

export const useModalStore = create<ModalStore>((set, get) => ({
	currentModal: null,
	isOpen: false,
	currentModalId: null,

	showModal: (modalConfig) => {
		const id = `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

		// 히스토리 상태 추가 (모달이 열릴 때)
		window.history.pushState(
			{ modalId: id, isModal: true },
			"",
			window.location.href,
		);

		set({
			currentModal: { ...modalConfig, id },
			isOpen: true,
			currentModalId: id,
		});
		return id;
	},

	hideModal: (fromPopState = false) => {
		const { currentModal } = get();

		if (!currentModal) return;

		// 모달 상태 먼저 클리어
		set({
			currentModal: null,
			isOpen: false,
			currentModalId: null,
		});

		// 뒤로가기가 아닌 직접 닫기일 경우에만 히스토리 항목 제거
		// 단, 현재 히스토리 상태가 모달인 경우에만
		if (!fromPopState) {
			const currentState = window.history.state;
			if (currentState?.isModal) {
				window.history.back();
			}
		}
	},
}));
