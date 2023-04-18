<!-- 2. execution -->

# TypeScript 실행

1. typescript 컴파일러 설치
2. babel을 통해서 plugin을 typescript 관련 된것을 설정 후 변환 진행
3. webpack 통해서 babel을 추가하고 plugin 넣고, 번들링해서 js 변환

하지만 결국 3가지 모두 변환해서 써야한다.

리액트에서 ts를 하기 위해서는 webpack을 지정해야한다. 꼭 해볼것...

## Typescript 컴파일러 설치

typescript 컴파일러 설치해야한다.

```sh
$ npm init -y

# 컴파일러를 설치한 것이다...
$ npm install -D typescript

# tsc
# tsc 명령어를 쓸 수 있다.
```

이후 package.json 파일 수정

```json
"scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "build": "tec message.ts --outDir ./dist --target ES6"
    },
```

--target ES6을 이용하여
TS 문서로 변환 하여 준다.,.

빌드 된 파일이 있으면 빌드를 지우고 진행해야 오류가 덜하다..

설정부분만 파일로 따로 분리한다.( tsconfig.json)

빌드를 진행할 때 기본적으로 설정파일의 이름이 'tsconfig.json'을 추적하지만 상황에 따라서 이름이 바뀌는 경우도 있는데
이때는 package.json에서 추적할 수 있도록 지정해주어야한다.
