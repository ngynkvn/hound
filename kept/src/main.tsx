import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import {
    QueryClient,
    QueryClientProvider,
    QueryClientConfig,
} from "react-query";
import { queryFn } from "./api";

const _config: QueryClientConfig = {
    defaultOptions: {
        queries: {
            queryFn: queryFn,
        },
    },
};
const queryClient = new QueryClient(_config);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    </React.StrictMode>
);
