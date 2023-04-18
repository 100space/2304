<!-- 1.runtime -->

# TypeScript Runtime

**message.ts**

```ts
const message: string = "typescript"
console.log(messagae)
```

1. 확장자를 안붙이면 : node는 기본적으로 확장자가 없으면 JS 파일을 찾는다.

2. 확장자를 붙였지만 상수만 읽고 값을 읽지 못해서
   SyntaxError: Missing initializer in const declaration
   에러가 발생했다.

3. let으로 바꾸어서 실행을 하면
   SyntaxError: Unexpected token ':'
   에러가 발생한다.
