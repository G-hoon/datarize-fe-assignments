// API Response Types
export interface Customer {
	id: number;
	name: string;
	count: number;
	totalAmount: number;
}

export interface PurchaseFrequency {
	range: string;
	count: number;
}

// API Request Types
export interface FetchPurchaseFrequencyParams {
	from?: string;
	to?: string;
}

export interface FetchCustomersParams {
	sortBy?: "asc" | "desc";
	name?: string;
}

// API Response Wrapper Types
export interface ApiResponse<T> {
	data: T | null;
	error: string | null;
	loading: boolean;
}

export interface ApiError {
	message: string;
	status?: number;
	code?: string;
}
