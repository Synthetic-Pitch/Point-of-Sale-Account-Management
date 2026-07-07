import { useNavigate } from "react-router";
import useReconciliationStore  from "../stores/useReconciliation"
import { useEffect } from "react";
import type { ReconciliationDefaults } from "../stores/useReconciliation";
import {useConfirmReconciliation} from "../hooks/use_confirm_reconciliation"


type CounterField = Extract<
    keyof ReconciliationDefaults,
    "opening_potatoes" | "small_cups" | "medium_cups" | "large_cups"
>;

type CounterRowProps = {
    label: string;
    value: number;
    unit?: string;
    onDecrease: () => void;
    onIncrease: () => void;
};

const CounterRow = ({ label, value, unit, onDecrease, onIncrease }: CounterRowProps) => {
    return (
        <section className="w-full flex flex-col items-center text-3xl select-none">
            <p className="text-[#757575] py-2">{label}</p>
            <div className="flex justify-evenly items-center w-full max-w-80 py-4 relative">
                <button onClick={onDecrease}>&minus;</button>
                <span>{value}</span>
                <button onClick={onIncrease}>+</button>
                {unit && <span className="absolute right-[6%] text-sm">{unit}</span>}
            </div>
            <hr className="w-[80%] max-w-100 bg-black h-.3" />
        </section>
    );
};

const Reconciliation = () => {
    const navigate = useNavigate();
    const defaults = useReconciliationStore((state) => state.defaults); 
    const setDefaults = useReconciliationStore((state) => state.setDefaults);
    const confirmReconciliation = useConfirmReconciliation();
    const appeal = useReconciliationStore((state) => state.appeal);
    useEffect(()=>{
        if(defaults.store === null || defaults.created_at === null || defaults.id === null || defaults.small_cups === null || defaults.medium_cups === null || defaults.large_cups === null || defaults.opening_cash === null || defaults.opening_potatoes === null) {
        navigate("/");
    }
    },[defaults, navigate])

    const updateCounter = (field: CounterField, change: number) => {
        const currentValue = defaults[field] ?? 0;

        setDefaults({
            [field]: Math.max(0, currentValue + change),
        });
    };
    
    const handleConfirm = () => {
        if(defaults.opening_cash === null || defaults.opening_potatoes === null || defaults.small_cups === null || defaults.medium_cups === null || defaults.large_cups === null) {
            return;
        }

        confirmReconciliation.mutate({
            uuid: localStorage.getItem("uuid") ?? undefined,
            small_cups: defaults.small_cups,
            medium_cups: defaults.medium_cups,
            big_cups: defaults.large_cups,
            opening_potatoes: defaults.opening_potatoes,
            opening_cash: true,
            appeal:appeal || undefined
        });
    }

    const handleAppeal = () => {
        useReconciliationStore.getState().setAppeal("opening_cash");
    }
    return (
        <div className="min-h-dvh flex flex-col items-center justify-center font-poppins text-center text-2xl py-12">
            <p className="text-[#8b8b8b] text-3xl">verify opening cash</p>
            <p className="text-[#fe7e32] py-4 text-3xl">{defaults.opening_cash}</p>
            <hr className="w-[80%] max-w-100 bg-black h-.3" />
            <CounterRow
                label="startUp potatoes"
                value={defaults.opening_potatoes ?? 0}
                unit="kg"
                onDecrease={() => updateCounter("opening_potatoes", -1)}
                onIncrease={() => updateCounter("opening_potatoes", 1)}
            />
            <CounterRow
                label="small cups"
                value={defaults.small_cups ?? 0}
                onDecrease={() => updateCounter("small_cups", -1)}
                onIncrease={() => updateCounter("small_cups", 1)}
            />
            <CounterRow
                label="medium cups"
                value={defaults.medium_cups ?? 0}
                onDecrease={() => updateCounter("medium_cups", -1)}
                onIncrease={() => updateCounter("medium_cups", 1)}
            />
            <CounterRow
                label="large cups"
                value={defaults.large_cups ?? 0}
                onDecrease={() => updateCounter("large_cups", -1)}
                onIncrease={() => updateCounter("large_cups", 1)}
            />
            <button
                className="text-white bg-[#fe7e32] px-12 py-2 rounded-full my-8 text-2xl cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                disabled={confirmReconciliation.isPending}
                onClick={handleConfirm}
            >
                {confirmReconciliation.isPending ? "confirming..." : "confirm"}
            </button>
            {confirmReconciliation.isError && (
                <p className="text-sm text-red-500">{confirmReconciliation.error.message}</p>
            )}
            <button className="text-[#fe7e32]  px-6 py-1 rounded-full" onClick={handleAppeal}>appeal</button>
        </div>
    );
};

export default Reconciliation;
