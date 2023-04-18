<!-- 4.tsnode -->

ts-node는 우리가 typescript를 코드로 작성하면, 확인하고 싶을 때마다
빌드하고, 확인하고... 를 반복하게 된다(개발 단계에서)
번거로운 빌드 작업을 줄이고 바로 즉각즉각 보기 위해서 사용하는 라이브러리가 있다.

# 관련 패키지 설치

```sh
npm init -y
npm install -D typescript tsc-alias

npm install -D ts-node

#매번 설정하기 번거롭기 때문에 글로벌로 설치해서 진행한다.
sudo npm install -g ts-node
```

# 소스코드와 tsconfig 작성하기

3번과 동일

# package.json 설정

```json
"dev": "ts-node --project tsconfig.json ./src/message"
```

# dev 를 실행

npm run dev를 진행하게 되면 빌드 파일은 안보이지만 실제로 빌드가 진행된 후에 보이는 것이다.

```sh
npm install -D tsconfig-paths
```

## nodemon

ts-node 처럼 설정파일을 옵션이 있는것을 설정파일로 따로 만들어서 할 수 있다.
nodemon.json 파일을 이용하여 설정할수 있다.

```sh
npm install -D nodemon
```

```json
{
    // 이 디렉토리 안에 있는 파일이 수정되면 재실행 하겠다.
    "watch": [""],
    // 어떤 확장자를 추적할 것인가?
    "ext": "ts",
    // 어떤 명령어를 실행할 것이니?
    "exec": "ts-node -r tsconfig-paths/register -p tsconfig.json ./src/message"
}
```
