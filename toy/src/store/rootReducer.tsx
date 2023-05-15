import { combineReducers } from "redux"
import { accountState } from "./currentAccount"
import { menuState } from "./menu"
import { myAccountState } from "./myAccounts"
import { savedAccountState } from "./savedAccount"

export const rootReducer = combineReducers({ menuState, accountState, myAccountState, savedAccountState })

export type RootState = ReturnType<typeof rootReducer>
//RootState 라는 타입을 만들어서 내보내주어야 한다는 것 입니다.
//이 타입은 추후 우리가 컨테이너 컴포넌트를 만들게 될 때 스토어에서 관리하고 있는 상태를 조회하기 위해서
//useSelector를 사용 할 때 필요로 합니다.
