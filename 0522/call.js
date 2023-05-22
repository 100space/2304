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

web3.eth
    .call({
        // call Method는 가스가 소비되지 않는다.
        to: "0x670D634d285e34f8bE6af5b44c126BD3cB4E67AC",
        data: dataCode,
    })
    .then((data) => {
        //16진수로 나오기 때문에 변환하면 10진수로 변환한다.
        const result = web3.utils.toBN(data).toString(10)
        console.log(result)
    })
