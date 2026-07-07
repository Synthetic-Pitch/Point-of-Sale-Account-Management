import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type ReconciliationDefaults = {
  created_at: string | null
  id: number | null
  small_cups: number | null
  medium_cups: number | null
  large_cups: number | null
  opening_cash: number | null
  opening_potatoes: number | null
  store: string | null
}

const initialDefaults: ReconciliationDefaults = {
  created_at: null,
  id: null,
  small_cups: null,
  medium_cups: null,
  large_cups: null,
  opening_cash: null,
  opening_potatoes: null,
  store: null,
}

interface YourState {
  appeal: string | null
  anotherField: number
  defaults: ReconciliationDefaults
}

interface YourActions {
  setAppeal: (value: string) => void
  setDefaults: (value: Partial<ReconciliationDefaults>) => void
  reset: () => void
}

type YourStore = YourState & YourActions

const useReconciliationStore = create<YourStore>()(
  persist(
    (set) => ({
      appeal: null,
      anotherField: 0,
      defaults: initialDefaults,
      setAppeal: (value) => set({ appeal: value }),
      setDefaults: (value) =>
        set((state) => ({
          defaults: {
            ...state.defaults,
            ...value,
          },
        })),
      reset: () =>
        set({
          appeal: null,
          anotherField: 0,
          defaults: initialDefaults,
        }),
    }),
    {
      name: 'reconciliation-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        appeal: state.appeal,
        defaults: state.defaults,
      }),
    }
  )
)

export default useReconciliationStore
