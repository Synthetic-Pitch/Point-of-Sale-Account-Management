import  {useMutation} from "@tanstack/react-query";

// THE ENDPOINT URL OF API & THE PROJECT URL
const LOGIN_URL =
    `${import.meta.env.VITE_SUPABASE_PROJECT_URL}/functions/v1/client_verify_inventory_reconciliation`;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

type ConfirmreconciliationRequest = {
    uuid?: string;
    small_cups?:number;
    medium_cups?:number;
    big_cups?:number;
    opening_cash?:boolean;
    appeal?:string;
    opening_potatoes?:number;
}

export const useConfirmReconciliation = () =>{
    return useMutation({
        mutationFn: async ({uuid,small_cups,medium_cups,big_cups,opening_potatoes,opening_cash,appeal}:ConfirmreconciliationRequest) => {
            const typedUuid = uuid?.trim();
            const response = await fetch(LOGIN_URL,{
                method: 'POST',
                headers: {
                    'Content-Type':'application/json',
                    apikey:SUPABASE_PUBLISHABLE_KEY
                },
                body:JSON.stringify({
                    uuid:typedUuid,
                    small_cups,
                    medium_cups,
                    big_cups,
                    opening_potatoes,
                    opening_cash,
                    appeal
                })
            })
            if(!response.ok) {
                throw new Error('Failed to confirm reconciliation')
            }
            const data = await response.json();
            console.log(data);
            
            return data;
        }
    })
}