import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/auth/auth.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (gdm) =>
    gdm({
      serializableCheck: false, // network + non-serializable (AsyncStorage refs) safe here
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
// Export type so axios can get store instance
export type RootStore = typeof store;
