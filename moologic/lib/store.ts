import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { healthApi } from "./service/healthService"
import { cattleApi } from "./service/cattleService"
import { userApi } from "./service/userService"
import { inseminationApi } from "./service/inseminationService"
import { milkApi } from "./service/milkService"
import { alertApi } from "./service/alertService"
import { incomeExpenseApi } from "./service/incomeExpense"
import { financeOverviewApi } from "../components/finance-overview"
import { expenseBreakdownApi } from "../components/expense-category-chart"
import { incomeBreakdownApi } from "../components/income-category-chart"
import { governmentDashboardApi } from "./service/governmentDashboard"

export const store = configureStore({
  reducer: {
    [healthApi.reducerPath]: healthApi.reducer,
    [cattleApi.reducerPath]: cattleApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [inseminationApi.reducerPath]: inseminationApi.reducer,
    [milkApi.reducerPath]: milkApi.reducer,
    [alertApi.reducerPath]: alertApi.reducer,
    [incomeExpenseApi.reducerPath]: incomeExpenseApi.reducer,
    [financeOverviewApi.reducerPath]: financeOverviewApi.reducer,
    [expenseBreakdownApi.reducerPath]: expenseBreakdownApi.reducer,
    [incomeBreakdownApi.reducerPath]: incomeBreakdownApi.reducer,
    [governmentDashboardApi.reducerPath]: governmentDashboardApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      healthApi.middleware,
      cattleApi.middleware,
      userApi.middleware,
      inseminationApi.middleware,
      milkApi.middleware,
      alertApi.middleware,
      incomeExpenseApi.middleware,
      financeOverviewApi.middleware,
      expenseBreakdownApi.middleware,
      incomeBreakdownApi.middleware,
      governmentDashboardApi.middleware,
    ]),
})

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch 