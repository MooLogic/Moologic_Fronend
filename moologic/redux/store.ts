import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./features/theme/themeSlice";
import languageReducer from "./features/language/languageSlice";
import authReducer from "./features/auth/authSlice";
import cattleReducer from "./features/cattle/cattleSlice";
import diseaseReducer from "./features/disease/diseaseSlice";
import inseminationReducer from "./features/insemination/inseminationSlice";
import birthRecordReducer from "./features/birth-record/birthRecordSlice";
import alertReducer from "./features/alert/alertSlice";
import farmReducer from "./features/farm/farmSlice";
import { cattleApi } from "@/lib/service/cattleService";
import { inseminationApi } from "@/lib/service/inseminationService";
import { milkService } from "@/lib/service/milkService";
import { healthApi } from "@/lib/service/healthService";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    language: languageReducer,
    auth: authReducer,
    cattle: cattleReducer,
    disease: diseaseReducer,
    insemination: inseminationReducer,
    birthRecord: birthRecordReducer,
    alert: alertReducer,
    farm: farmReducer,
    [cattleApi.reducerPath]: cattleApi.reducer,
    [inseminationApi.reducerPath]: inseminationApi.reducer, // Add inseminationApi reducer
    [milkService.reducerPath]: milkService.reducer,
    [healthApi.reducerPath]: healthApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(cattleApi.middleware, inseminationApi.middleware, milkService.middleware, healthApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;