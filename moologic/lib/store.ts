import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { healthApi } from "./service/healthService"
import { cattleApi } from "./service/cattleService"
import { userApi } from "./service/userService"
import { inseminationApi } from "./service/inseminationService"
import { milkApi } from "./service/milkService"
import { alertApi } from "./service/alertService"

export const store = configureStore({
  reducer: {
    [healthApi.reducerPath]: healthApi.reducer,
    [cattleApi.reducerPath]: cattleApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [inseminationApi.reducerPath]: inseminationApi.reducer,
    [milkApi.reducerPath]: milkApi.reducer,
    [alertApi.reducerPath]: alertApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      healthApi.middleware,
      cattleApi.middleware,
      userApi.middleware,
      inseminationApi.middleware,
      milkApi.middleware,
      alertApi.middleware,
    ]),
})

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch 