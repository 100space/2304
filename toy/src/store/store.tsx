import { createStore, applyMiddleware, AnyAction } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"
import { persistReducer, persistStore } from "redux-persist"
import thunk, { ThunkMiddleware } from "redux-thunk"
import storage from "redux-persist/lib/storage"
import { rootReducer, RootState } from "./rootReducer"

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["myAccountState", "savedAccountState"],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = createStore(
    persistedReducer,
    composeWithDevTools(applyMiddleware(thunk as ThunkMiddleware<RootState, AnyAction>))
)
export const persistor = persistStore(store)
