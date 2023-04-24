//user.controller
describe("user controller 검증", () => {
    console.log("hello")
    it("create()함수 잘 실행되는가?", () => {
        //req.body
        //service 메서드 잘 작동하는지
        //res.send res.json 내가 원한느 객체가 잘 들어가는지?
    })
    test("create() 메서드 예외 처리가 잘되는가", () => {
        //req.body 강제로 다른값을 만들어서
        // service 메서드 호출을 강제로 에러 터트림
        // catch 문으로 잘 빠지는
        // next 함수가 잘 작동하는지
    })
})
