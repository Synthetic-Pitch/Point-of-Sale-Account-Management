
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";

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
            
            console.log(data);
            if(data.status === "login_successfully") {
                
                localStorage.setItem("uuid",data.uuid || "");
                navigate(data.redirect || "/");
            }
            if(data.status === "returning"){
                navigate(`${data.redirect || "/"}`)
            }
            return data;
        },
    });
};
