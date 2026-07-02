
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import useReconciliationStore  from "../stores/useReconciliation"
import type { ReconciliationDefaults } from "../stores/useReconciliation";

const LOGIN_URL =
    `${import.meta.env.VITE_SUPABASE_PROJECT_URL}/functions/v1/client_admin_login`;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

type LoginRequest = {
    username?: string;
    password?: string;
    branch?: string;
    uuid?: string;
};

type LoginResponse = {
    redirect?: string;
    uuid?: string;
    status?: string;
    role?:string;
    default_store?: Partial<ReconciliationDefaults>;
};

export const useLogin = () => {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: async ({ username, password, branch, uuid }: LoginRequest) => {
            const typedUuid = uuid?.trim();
            const storedUuid = localStorage.getItem("uuid")?.trim();
            const loginUuid = typedUuid || storedUuid;

            const response = await fetch(LOGIN_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    apikey: SUPABASE_PUBLISHABLE_KEY,
                },
                body: JSON.stringify({
                    username,
                    password,
                    branch,
                    ...(loginUuid ? { uuid: loginUuid } : {}),
                }),
            });

            const data: LoginResponse = await response.json();
            
            if (!response.ok) {
                throw new Error("Login failed");
            }
            
            console.log(data.default_store);
            if(data.status === "login_successfully") {
                if (data.default_store) {
                    useReconciliationStore.getState().setDefaults(data.default_store);
                }
                localStorage.setItem("uuid",data.uuid || "");
                navigate(data.redirect || "/");
            }
            if(data.status === "returning"){
                useReconciliationStore.getState().setSomeField(data.role || "");
                if (data.default_store) {
                    useReconciliationStore.getState().setDefaults(data.default_store);
                }
                navigate(`${data.redirect || "/"}`)
            }
            return data;
        },
    });
};
