import { configureStore } from "@reduxjs/toolkit";
import booksReducer from "./booksSlice";
import bookCheckoutReducer from "./bookCheckoutSlice";

const store = configureStore({
  reducer: {
    books: booksReducer,
    bookCheckout: bookCheckoutReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
