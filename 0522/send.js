const Web3 = require("web3")
const web3 = new Web3("http://127.0.0.1:8545")

const abi = [
    [
        {
            inputs: [],
            name: "getValue",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [{ internalType: "uint256", name: "_value", type: "uint256" }],
            name: "setValue",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
        },
    ],
]

const dataCode = web3.eth.abi.encodeFunctionCall(
    {
        inputs: [{ internalType: "uint256", name: "_value", type: "uint256" }],
        name: "setValue",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    [10]
) //0x55241077000000000000000000000000000000000000000000000000000000000000000a : 0들은 의미없는 숫자이고, 구분자의 역할이다. 함수...000000...value

console.log(dataCode)
const tx = {
    from: "0xbA8136c2A5F91b2fb077768E6701dB77A40eCE06", // 실행할 사람 (가스를 소비할 사람)
    to: "0x670D634d285e34f8bE6af5b44c126BD3cB4E67AC", // CA값
    data: dataCode,
    gas: 500000,
    gasPrice: 20000000000,
}
web3.eth.sendTransaction(tx).then(console.log)
