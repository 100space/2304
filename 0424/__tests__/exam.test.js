describe("exam1", () => {
    const objA = { name: "a" }
    const objB = { name: "a" }
    it("tobe()", () => {
        expect(objA).not.toBe(objB)
    })
    it("toEqual()", async () => {
        const mockReject = jest.fn().mockRejectedValue(new Error("Async error"))
        await mockReject() //
        // expect(objA).toEqual(objB)
    })
})
