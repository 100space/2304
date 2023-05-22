const Web3 = require("web3")
const web3 = new Web3("http://127.0.0.1:8545")

web3.eth.getBalance("0x2c2324950D1C3CCDfD356647cDB0e2d2EE6F10F6").then(console.log)
web3.eth
    .sendTransaction({
        from: "0x2c2324950D1C3CCDfD356647cDB0e2d2EE6F10F6",
        gas: "140000",
        data: "60806040523480156100115760006000fd5b505b5b610019565b61016b806100286000396000f3fe60806040523480156100115760006000fd5b506004361061003b5760003560e01c80632096525514610041578063552410771461005f5761003b565b60006000fd5b61004961007b565b60405161005691906100f2565b60405180910390f35b610079600480360381019061007491906100b7565b61008d565b005b6000600060005054905061008a565b90565b8060006000508190909055505b5056610134565b6000813590506100b081610119565b5b92915050565b6000602082840312156100ca5760006000fd5b60006100d8848285016100a1565b9150505b92915050565b6100eb8161010e565b82525b5050565b600060208201905061010760008301846100e2565b5b92915050565b60008190505b919050565b6101228161010e565b811415156101305760006000fd5b5b50565bfea2646970667358221220c75928a6f346e3c5636e8f04ee29fca18a73259622b3699440736fb9a77b021e64736f6c63430008000033",
    })
    .then(console.log)

web3.eth.getBalance("0x2c2324950D1C3CCDfD356647cDB0e2d2EE6F10F6").then(console.log)
