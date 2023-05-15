# Setting

## 프로젝트 생성

```shell
npx create-react-app bitcoin_wallet --template typescript
```

## 패키지 설치

```shell
npm install react-router-dom redux redux-thunk redux-persist react-redux axios styled-components@latest
```

## React Typescript Path Alias 설정

[참고](https://leego.tistory.com/entry/React-CRA%EC%97%90%EC%84%9C-Path-alias-%EC%84%A4%EC%A0%95%ED%95%98%EA%B8%B0)

```shell
npm install @craco/craco tsconfig-paths-webpack-plugin
```

tsconfig.paths.json

설정할 경로 지정

```json
{
    "compilerOptions": {
        "baseUrl": "src",
        "paths": {
            "@pages/*": ["pages/*"],
            "@routes/*": ["routes/*"]
        }
    }
}
```

tsconfig.json

extends 추가

```json
{
    "compilerOptions": {
        "target": "es5",
        "lib": ["dom", "dom.iterable", "esnext"],
        "allowJs": true,
        "skipLibCheck": true,
        "esModuleInterop": true,
        "allowSyntheticDefaultImports": true,
        "strict": true,
        "forceConsistentCasingInFileNames": true,
        "noFallthroughCasesInSwitch": true,
        "module": "esnext",
        "moduleResolution": "node",
        "resolveJsonModule": true,
        "isolatedModules": true,
        "noEmit": true,
        "jsx": "react-jsx"
    },
    "include": ["src"],
    "extends": "./tsconfig.paths.json" // 추가
}
```

craco.config.js

craco 설정 파일 생성

```js
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin")

module.exports = {
    plugins: [
        {
            plugin: {
                overrideWebpackConfig: ({ webpackConfig }) => {
                    webpackConfig.resolve.plugins.push(new TsconfigPathsPlugin({}))
                    return webpackConfig
                },
            },
        },
    ],
}
```

package.json

scripts 수정

```json
  "scripts": {
    "start": "craco start",
    "build": "craco build",
    "test": "craco test",
    "eject": "craco eject"
  },
```

## Jest Alias 설정

[참고](https://cloudless.blog/post/React%20Typescript%20Jest%20%ED%99%98%EA%B2%BD%EC%97%90%EC%84%9C%20craco%EB%A5%BC%20%EC%9D%B4%EC%9A%A9%ED%95%9C%20path%20alias%20%EC%84%A4%EC%A0%95)

craco.config.js

plugins 밑에 추가

```js
 jest: {
    configure: {
      moduleNameMapper: { "^@(pages|routes)/(.+)$": "<rootDir>/src/$1/$2" },
    },
  },
```
