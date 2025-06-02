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
import { milkApi } from "@/lib/service/milkService";
import { incomeExpenseApi } from "@/lib/service/incomeExpense";
import { financeOverviewApi } from '@/components/finance-overview';
import { incomeBreakdownApi } from '@/components/income-category-chart';
import { expenseBreakdownApi } from '@/components/expense-category-chart';
import { setupListeners } from '@reduxjs/toolkit/query';

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
    [inseminationApi.reducerPath]: inseminationApi.reducer,
    [milkApi.reducerPath]: milkApi.reducer,
    [incomeExpenseApi.reducerPath]: incomeExpenseApi.reducer,
    [financeOverviewApi.reducerPath]: financeOverviewApi.reducer,
    [incomeBreakdownApi.reducerPath]: incomeBreakdownApi.reducer,
    [expenseBreakdownApi.reducerPath]: expenseBreakdownApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(
      cattleApi.middleware,
      inseminationApi.middleware,
      milkApi.middleware,
      incomeExpenseApi.middleware,
      financeOverviewApi.middleware,
      incomeBreakdownApi.middleware,
      expenseBreakdownApi.middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;