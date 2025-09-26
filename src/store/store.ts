import { configureStore } from "@reduxjs/toolkit";
import todosSlice from "./todosSlice";


export const myStore = configureStore({
    reducer: {
        todo: todosSlice
    }
})

export type RootState = ReturnType<typeof myStore.getState>
export type RootDispatch = ReturnType<typeof myStore.dispatch>