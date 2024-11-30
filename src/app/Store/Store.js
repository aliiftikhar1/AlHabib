import { configureStore } from "@reduxjs/toolkit";
import reducer from './Slice'

export const Store = configureStore({
    reducer
})