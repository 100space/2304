<!-- 3. tsconfig -->

# tsconfig.json

왜 쓰는가?
옵션의 내용이 많다보니 그 옵션을 따로 파일로 뺴서 관리하자는 것이 큰 이유이다.

```json
{
    "compilerOptions": {},
    "include": []
}
```

-   compileOptions : TYpescript 파일을 컴파일 진행시 어떤형태로 컴파일을 진행할 것인지 속성을 정의하는 것인다.
-   include : 컴파일을 진행할 디렉토리를 지정할 수 있다. ex)./src
-   exclude: 컴파일을 진행하고 싶지 않은 파일/디렉토리를 지정할 수 있다. ex) .test.ts

## step 1. 관련 패키지 설치 및 소스코드 작성

```sh
npm init -y

# ts를 컴파일하기위해서 컴파일리를 설치함
npm install -D typescript
```

```ts
const message: string = "hello ts 3 dir"
console.log(message)
```

## step 2. tsconfig.json 설정

```json
{
    "compilerOptions": {
        "outDir": "./dist"
    },
    "include": ["src/**/*"],
    "exclude": []
}
```

-   "\*\*" : 디렉토리
-   "\*" : 파일

## step 3. package.json 설정

build 속성 추가

```json
 "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "build": "tsc"
    },
```

# 단위 테스트를 한다 가정했을 때.

```json
{
    "compilerOptions": {
        "outDir": "./dist"
    },
    "include": ["src/**/*"],
    "exclude": ["**/*.test.ts"] // 제외
}
```

빌드 할 떄 올바르게 만들기 위해서 반드시 dist 파일을 지우고 해야한다.

빌드는 삭제후 생성이 아니라 그저 생성일 뿐이다.

지우고 생성하는 설정도 있음

# compilerOptions

compilerOptions 안에 있는 가장 많이 쓰이는 속성

-   module : 모듈 시스템을 어떤걸 사용할지 지정한다 (commonJS, es6)
-   outDir : 어떤 디렉토리에 생성할 것이냐? "./dist"
-   target : 어떤 JS로 번들링 할꺼냐 ? "es6"
-   esModuleInterop : import 문법을 바꾸는 행위 (true)
-   strict : true ( ts를 쓰면 써야함... 안쓰면 ts를 쓰는 의미가 없는 느낌...?)
-   baseUrl : 모듈의 상대경로를 default 지정한다. "./src"
-   paths :별칭을 사용해서 경로를 지정한다. 어떠한 위치의 파일이 있더라도 별칭을 이용해서 지정해서 쓸 수 있다. 쉬운 import문을 사용할 수 있다.
    -   _baseUrl_ 을 기준으로 상대위치를 가져오는 매핑값 (경로를 변수처럼 사용한다.)

**esModuleInterop** : import \* as react from "react" -> import react from "react" 문법으로 바꾼다.

```json
{
    "compilerOptions": {
        "module": "CommonJS", // 번들링 되었을 때 commonJS로 한다는 뜻.
        "outDir": "./dist",
        "target": "ES6",
        "esModuleInterop": true,
        "strict": true,
        "baseUrl": "./src",
        "paths": {
            // @ 변수라 없어도 되지만 개발자끼리 정한 별칭이라는 약속
            // user앞에 baseUrl이 생략된거임
            "@user/*": ["user/*"]
        }
    },
    "include": ["src/*"],
    "exclude": ["**/*.test.ts"] // 제외
}
```

번들할 때 @user에 대한 부분은 번들링이되지 않는다
그래서 @에 대한 내용을 다시 컴파일 해야한다.
**tsc-alias**

## tsc-alias

별칭으로 사용했던 paths를 제대로 된 경로로 변경하여 준다.

```sh
npm install -D tsc-alias
```

```js
const user_service_1 = **importDefault(require("@user/service/user.service")); 가

const user_service_1 = **importDefault(require("./user/service/user.service")); 로 바뀜
```

참고: https://inpa.tistory.com/entry/TS-%F0%9F%93%98-%ED%83%80%EC%9E%85%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-tsconfigjson-%EC%84%A4%EC%A0%95%ED%95%98%EA%B8%B0-%EC%B4%9D%EC%A0%95%EB%A6%AC#esmoduleinterop
