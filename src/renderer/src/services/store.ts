import { composeWithDevTools } from "@redux-devtools/extension"
import { combineReducers, legacy_createStore as createStore, applyMiddleware, Middleware, compose } from "redux"
import { thunk } from "redux-thunk"
import { AUTH_LOGIN_ACTION, USER_LOGOUT } from "./constants/auth.constant"
import { UserLoginReducer } from "./reducers/auth.reducer"
import { MODAL_ACTION } from "./constants/modal.constant"
import { ModalReducer } from "./reducers/modal.reducer"
import { StrategyReducer } from "./reducers/strategies.reducer"
import { STRATEGY_ACTION } from "./constants/strategies.constant"

const middleware: Middleware[] = [thunk]

const appReducer = combineReducers({
  authorization: UserLoginReducer,
  strategies: StrategyReducer,
  modal: ModalReducer,
})

type APP_ACTION = AUTH_LOGIN_ACTION | MODAL_ACTION | STRATEGY_ACTION

const rootReducer = (state: ReturnType<typeof appReducer> | undefined, action: APP_ACTION): ReturnType<typeof appReducer> => {
  if (action.type == USER_LOGOUT.USER_LOGOUT_COMPLETE) {
    return appReducer(undefined, action)
  }
  return appReducer(state, action)
}

let composeEnhancers = compose

if (process.env.NODE_ENV != 'production') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || composeWithDevTools
}

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(...middleware)))


export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch
export default store
