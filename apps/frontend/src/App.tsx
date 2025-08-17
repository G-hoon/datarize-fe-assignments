import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ModalRenderer } from "./components/ui/ModalRenderer";
import DashBoard from "./pages/DashBoard";

function App() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 5 * 60 * 1000, // 5분
				gcTime: 10 * 60 * 1000, // 10분
			},
		},
	});
	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter
				future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
			>
				<ModalRenderer />
				<Routes>
					<Route path="/" element={<DashBoard />} />
				</Routes>
			</BrowserRouter>
		</QueryClientProvider>
	);
}

export default App;
