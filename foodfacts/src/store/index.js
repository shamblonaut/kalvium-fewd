import { configureStore } from "@reduxjs/toolkit";

import savedReducer from "./savedSlice";

const store = configureStore({
  reducer: {
    saved: savedReducer,
  },
});

store.subscribe(() => {
  localStorage.setItem(
    "foodfacts",

    JSON.stringify(store.getState().saved.items),
  );
});

export default store;
