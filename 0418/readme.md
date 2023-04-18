# TS 환경

# TypeScript

MS에서 만들었다.

장점 : 런타임 전에 오류를 찾을 수 있다.
생각보다 개발 속도가 빨라진다.(환경이 갖춰져 있을때..대외적으로 말하진 않았지만..)

단점 :

-   잔소리꾼 같은 존재이다. 뭔가를 만들기 위해서 JS에서 치지 않았던 내용들을 쳐야하는 경우가 있다.
-   런타임(실행시켜주는 환경)이 존재하지 않는다. : babel 같은 것을 이용하여 빌드 과정이 필요하다.
    -   런타임이 없기 때문에 에디터에 의존을 하게 된다.

# TypeScript 이해하기 Step.1

**타입스크립트는 런타임이 존재하지 않는다**

런타임이 존재하지 않는다는 뜻은 컴파일러가 존재한다와 같은 말이다. TS파일은 컴파일러를 이용하여 JS파일로 변환하여 사용한다.

```ts
// 정말 간단한 TS파일을 만들어 봤다.
// message.ts
const message: string = "TypeScript"
console.log(message)
```

-   1. "node message"로 실행

    **Error: Cannot find module '~~'**

    -   node는 기본적으로 확장자가 없으면 JS파일을 찾는다.

-   2. "node messagae.ts"로 실행
       **SyntaxError: Missing initializer in const declaration**

    -   const로 작성을 했을 때 초기값을 설정하지 않아서 생기는 오류이다.

-   3. "const"를 "let"으로 바꿔서 다시 실행
       **SyntaxError: Unexpected token ':'**
    -   타입을 지정하는 부분에서 ":" 기호를 판단하지 못해서 생기는 오류이다.

위에 과정으로 확인해본 결과 TS는 런타임이 없기 때문에 일반적인 방법으로 실행할 수 없다는 결론이 나온다.

# TypeScript 이해하기 Step.2

TS는 런타임이 없기 때문에 JS로 변환하여 실행시켜야 한다.
TS를 JS로 변환하는 방법은 크게 3가지가 있다.

-   Npm을 이용하여 컴파일러 설치하기

-   Babel을 통해서 typescript 관련 plugin 설정 후 변환 진행

-   webpack을 통해서 babel을 추가하고 plugin 설정 후 번들링해서 js 변환 진행

## typescript 컴파일러를 이용한 컴파일 방법

### 1. 관련 패키지 설치

```sh
$ npm install -D typescript
```

typescript 컴파일러를 설치한다. 컴파일러 설치를 하므로써 `tsc` 명령어를 통한 컴파일이 가능해진다.

### 2. 컴파일 진행하기

컴파일을 진행할 때, JS를 만드는 과정의 옵션을 설정할 수 있다.

```sh
$ tsc message.ts --outDir ./dist --target ES6
```

위의 명령어를 이용하여 dist폴더에 ES6 문법을 이용해서 컴파일된 JS파일이 생성이 된다.

### 3. package.json 설정하기

매번 변환할 때 위의 명령어를 쓰는 것이 번거롭기 때문에 package.json의 script에 설정하여서 간단하게 쓸 수 있다.

```json
// package.json

"scripts": {
        "build": "tec message.ts --outDir ./dist --target ES6"
    },
```

설정을 한 후에는 npm run build 명령어로 컴파일을 할 수 있다.

### 4. tsconfig.json 파일로 옵션 관리하기

설정할 때 위에 2가지 뿐 아니라 여러 옵션들이 있다.
이를 한 줄에 작성하면 가독성이 좋지 않기 때문에 tsconfig.json을 이용하여 옵션들을 파일로 빼서 작성할 수 있다.

```json
// tsconfig.json 예시
{
    "compilerOptions": {
        "outDir": "./dist",
        "target": "es6"
    }
}
```

기본적으로 컴파일 할 때 해당 디렉토리에서 tsconfig.json을 찾는데, 간혹 큰 프로젝트에서는 tsconfig 파일이 여러 개인 경우가 있다.

이런 경우 tsc 명령어를 작성할 때 --project 옵션을 이용하여 원하는 tsconfig.json파일의 경로를 지정할 수 있다.

```json
// 파일 이름이 tsconfig.json인 경우

"scripts": {
    "build": "tsc --project ./tsconfig.build.json"
}
```

### 5. 주의 : 기존 파일 지우기

컴파일을 여러번 하는 과정에서 기존에 컴파일 했던 파일이 남아있어서 최신 파일과 혼동을 일으킬 수 있다.

컴파일을 하는 과정에서 기존에 있던 파일을 모두 지우고 진행하는 것이 아닌 컴파일해서 파일을 생성해주는 것이 전부이기 때문에, 혹시 모를 기존 파일과의 혼동을 없애기 위해서 이전 버전의 컴파일된 파일 또는 디렉토리는 지운 후 다시 생성하여 최신버전을 유지할 수 있도록 하는 것이 좋다.

# TypeScript 이해하기 Step.3

## tsconfig.json

### tsconsfig.json 파일을 사용하는 이유?

-   tsc 명령어를 이용하여 컴파일을 할 때, 옵션의 내용이 많기 때문에 그 옵션을 따로 파일로 빼서 관리하는 것이 용이하기 때문이다.

### tsconfig.json의 대표적인 속성 3가지

-   compilerOptions
    -   컴파일 할 때, 어떤 형태로 컴파일을 진행할 것인지 속성을 정의하는 속성이다.
    -   ex) outDir, target ....
-   include
    -   컴파일을 할 때, 컴파일을 진행할 파일 및 디렉토리를 지정할 수 있다.
    -   ex) ./src
-   exclude:
    -   컴파일을 할 때 , 컴파일을 진행하지 않을 파일 및 디렉토리를 지정할 수 있다.
    -   ex) .test.ts

### 0. 패키지 및 소스코드(.ts)가 있을 때,

### 1. tsconfig.json 작성

-   src디렉토리에 단위 테스트를 위한 파일까지 있을 때, tsconfig.json 작성하는 방법은 아래와 같다.

```json
//tsconfig.json 예시
{
    "compilerOptions": {
        "outDir": "./dist"
    },
    "include": ["src/**/*"], // ** : 디렉토리, * :파일
    "exclude": ["**/*.test.ts"] // 제외
}
```

-   `src/**/*` : src 디렉토리와 그 하위 디렉토리에 있는 모든 TypeScript 파일이 컴파일에 포함한다.
-   `**/*.test.ts` : 모든 디렉토리에 .test.ts 파일을 제외한다.

### 2. package.json 작성

컴파일을 위한 속성을 tsconfig.json 파일로 따로 관리하기 때문에 package.json에서 script는 아래와 같이 속성을 빼고 간단하게 작성할 수 있다.

```json
//package.json 예시

 "scripts": {
        "build": "tsc"
    },
```

## compilerOptions 속성

typescript 컴파일러에 대한 다양한 설정을 지정할 수 있다.
tsconfig.json 파일에 포함되어 있으며 가장 많이 쓰이는 속성은 아래와 같다.

-   module : 모듈 시스템을 지정한다.
    -   Node용 commonJS, ECMAScript용 es6
-   outDir : 컴파일된 JS 파일이 출력될 디렉토리를 지정한다.
    -   ./dist
-   target : 컴파일된 JS 파일이 사용할 JS 버전을 지정한다.
    -   es6
-   esModuleInterop : import 문법을 바꾸는 속성
    -   import \* as react from "react" -> import react from "react" 문법으로 바꾼다.
    -   default: true
-   strict : 엄격 유형검사 (ts를 사용하면 보통 true로 사용한다.)
    -   default : true
-   baseUrl : 기본 url 지정한다. 복잡한 상대경로의 default를 지정할 수 있다ㅏ.
    -   ./src
-   paths : 어떠한 위치에 있어도 별칭을 이용해서 경로를 지정할 수 있다.
    -   _baseUrl_ 을 기준으로 상대위치를 가져오는 매핑값 (경로를 변수처럼 사용한다.)
    -   @

### tsconfig.json 예시

```json
//tsconfig.json 예시
{
    "compilerOptions": {
        "module": "commonjs", // 변환 할 때 commonjs 한다는 뜻.
        "outDir": "./dist",
        "target": "es6",
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

## paths로 지정한 별칭 번들링

### tsc-alias

별칭을 지정해서 사용했던 import문은 변환을 했을 때, 따로 변환이 없이 지정했던 별칭으로 나온다. 위의 tsconfig.json 예시를 이용한 컴파일의 경우

```js
const user_service_1 = __importDefault(require("@user/service/user.service"))
```

이런 식으로 컴파일이 되는데, 경로에 지정했던 별칭을 올바르게 불러오기 위해서 tsc-alias 패키지를 이용하여 경로를 제대로 표시할 수 있다.

```sh
npm install -D tsc-alias
```

이후 다시 컴파일을 하게되면 아래와 같이 정상적인 경로로 보여지게 된다

```js
const user_service_1 = __importDefault(require("./user/service/user.service"))
```

# TypeScript 이해하기 Step.4

## Node 환경에서 TypeScript 실행하기

여태까지의 과정은 TypeScript로 코드를 작성하고, 확인하고 싶을 떄 마다 컴파일하는 과정을 거쳤다. 그래서 개발단계에서 일부를 수정하고 확인을 하기 위해서는 다시 컴파일하고, 확인을 반복했다.

번거로운 컴파일 과정을 줄이고 Node 환경에서 직접 실행해서 확인하기 위해서 'ts-node' 라이브러리를 이용할 수 있다.

### 관련 패키지 설치

```sh
$ npm install -D ts-node
```

ts-node를 설치 후 ts-node 명령어를 사용할 수 있다.

### 소스코드와 tsconfig.json 작성

### package.json 설정

```json
"script":{
    "dev":"ts-node --project tsconfig.json ./src/message"
}
```

위의 설정을 통하여 'npm run dev' 명령어로 /src 디렉토리 안에 message.ts 파일을 실행할 수 있다.

ts-node는 "message.ts'파일을 즉석에서 컴파일하여 Node 환경에서 실행한다. 컴파일하는 과정이 있지만 빌드 파일로 보이지는 않는다.
그래서 빌드 과정에서 빠른 작업이 가능하다.

tsconfig.json에 paths 속성으로 별칭을 지정할 경우, 실행이 되지 않는데,
(Error: Cannot find module '@ ~~')
이는 올바른 경로로 불러오지 못하는 상황이기 때문이다. (step. 3와 동일한 상황)
그래서 "tsconfig-paths"를 이용하여 올바른 경로로 보여줄 수 있다.

```sh
npm install -D tsconfig-paths
```

설치를 한 후 다시 실행하여 확인해보면 별칭으로 인한 오류가 지워진다.

### tsc-alias 와 tsconfig-paths

tsc-alias 와 tsconfig-paths는 표면적으로 별칭을 실제 경로로 표시 될 수 있도록 도와주는 라이브러리로 비슷한 역할을 가지지만 약간의 차이점이 있다. tsc-alias의 경우에는 주로 빌드를 위한 컴파일하는 과정에서 필요한 것이고,
tsconfig-paths는 ts-node를 이용하여 컴파일을 하지 않고도 TS코드를 직접 실행할 때에 tsconfig.json 파일에 지정해 놓은 paths 속성을 올바른 경로로 바꿀 때 사용하는 패키지 이다.
