# 설치 및 기본세팅

```sh
# v4
$ npm install @tanstack/react-query
# v4 devtools
$ npm installs @tanstack/react-query-devtools
```

최상위에 감싸서 사용한다.

react-query-devtools는 `process.env.NODE_ENV`가 development 일 때만 실행된다. 프로젝트 배포시에는 devtools 관련 코드를 지워주자.

```js
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

const queryClient = new QueryClient()
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
    <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
)
```

# useQuery

## 기본 문법

```js
/**
 * @param queryKey
 * @param queryFn
 * @param options 추가적인 옵션을 넣을 수 있
 *
 */

const result = useQuery(queryKeym queryFn, {options...})
// result.data, result.isLoading ...

const {data, isLoading, ...} = useQuery(queryKey, queryFn, {options...})
```

useQuery는 기본적으로 3개의 인자를 받는다.
첫 번째 인자가 queryKey(필수), 두 번째 인자가 queryFn(필수), 세 번째 인자가 options(optional)이다.

### queryKey

첫 번째 인자인 queryKey를 기용해서 캐싱된 데이터를 관리한다.
v4에서는 string[]타입으로 지정해야한다.
