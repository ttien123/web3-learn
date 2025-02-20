import { create } from 'zustand';

type State = {
    isLoadingSignContract: boolean;
    message: string;
};

type Actions = {
    setIsLoadingSignContract: (body: boolean) => void;
    setMessage: (body: string) => void;
    reset: () => void;
};

const initialState: State = {
    isLoadingSignContract: false,
    message: ''

};

const useStateSignContract = create<State & Actions>()((set) => ({
    ...initialState,
    setIsLoadingSignContract: (body) => set((state) => ({ isLoadingSignContract: (state.isLoadingSignContract = body) })),
    setMessage: (body) => set((state) => ({ message: (state.message = body) })),
    reset: () => {
        set(initialState);
    },
}));

export default useStateSignContract;
