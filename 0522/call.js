//배포해서 얻은 CA : 0x670D634d285e34f8bE6af5b44c126BD3cB4E67AC

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
        inputs: [],
        name: "getValue",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    []
)

console.log(dataCode)
