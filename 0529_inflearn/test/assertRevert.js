//에러 감지
module.exports = async (promise) => {
    try {
        await promise
        assert.fail("Expected revert not receied")
    } catch (e) {
        const revertFound = e.message.search("revert") >= 0
        assert(revertFound, `Expected 'revert', got ${e} instead `)
    }
}
