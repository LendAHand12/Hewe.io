// input: amount, addressRevecied, myAddress (địa chỉ ví gửi), privateKeyMyAddress (private key của ví gửi)
const Web3 = require("web3");
const { network } = require("../constants/index");
const RPC =
  network == 97
    ? `https://go.getblock.asia/b9f5e3691862406d8d4decff4a568364`
    : `https://go.getblock.asia/b9f5e3691862406d8d4decff4a568364`;
const web3 = new Web3(RPC);
const web3Hewe = new Web3("https://node1.amchain.net/");

const CUSTOM_CHAIN_NAME = network == 97 ? "BSC Testnet Chain" : "BSC Mainnet Chain";

var Common = require("ethereumjs-common").default;
const USDT = require("../contracts/USDT.json");
const HEWE = require("../contracts/HEWE.json");
const usdtInstance = new web3.eth.Contract(USDT.abi, USDT.networks[network].address);
const heweInstance = new web3Hewe.eth.Contract(HEWE.abi, HEWE.networks[999999].address);
const Tx = require("ethereumjs-tx").Transaction;
const { writeLog } = require("./log");

async function transferToken(contract, contractAddress, myAddress, destAddress, transferAmount, my_privkey) {
  try {
    var count = await web3.eth.getTransactionCount(myAddress);
    var rawTransaction = {
      from: myAddress,
      nonce: "0x" + count.toString(16),
      gasPrice: web3.utils.toHex(1500000000),
      gasLimit: web3.utils.toHex(210000),
      to: contractAddress,
      value: "0x0",
      data: contract.methods.transfer(destAddress, transferAmount).encodeABI(),
      chainId: network,
    };
    var privKey = Buffer.from(my_privkey, "hex");
    var BSC_FORK = Common.forCustomChain(
      "mainnet",
      {
        name: CUSTOM_CHAIN_NAME,
        networkId: network,
        chainId: network,
        url: RPC,
      },
      "istanbul"
    );
    var tx = new Tx(rawTransaction, { common: BSC_FORK });

    tx.sign(privKey);
    var serializedTx = tx.serialize();
    console.log(`Attempting to send signed tx:  ${serializedTx.toString("hex")}`);
    var receipt = await web3.eth.sendSignedTransaction("0x" + serializedTx.toString("hex"));
    console.log(`Receipt info:  ${JSON.stringify(receipt, null, "\t")}`);
    const balance = await contract.methods.balanceOf(myAddress).call();
    console.log(`Balance after send: ${balance}`);

    return receipt;
  } catch (error) {
    console.log(error, "transferToken");
    await writeLog(`${new Date().toISOString()} - transferToken: ${JSON.stringify(error)}`);
    return null;
  }
}

async function transferToken2(contract, contractAddress, myAddress, destAddress, transferAmount, my_privkey) {
  try {
    var count = await web3Hewe.eth.getTransactionCount(myAddress);
    var rawTransaction = {
      from: myAddress,
      nonce: "0x" + count.toString(16),
      gasPrice: web3Hewe.utils.toHex(1500000000),
      gasLimit: web3Hewe.utils.toHex(210000),
      to: contractAddress,
      value: "0x0",
      data: contract.methods.transfer(destAddress, transferAmount).encodeABI(),
      chainId: 999999,
    };
    var privKey = Buffer.from(my_privkey, "hex");
    var BSC_FORK = Common.forCustomChain(
      "mainnet",
      {
        name: "AmChain",
        networkId: 999999,
        chainId: 999999,
        url: "https://node1.amchain.net/",
      },
      "istanbul"
    );
    var tx = new Tx(rawTransaction, { common: BSC_FORK });

    tx.sign(privKey);
    var serializedTx = tx.serialize();
    console.log(`Attempting to send signed tx:  ${serializedTx.toString("hex")}`);
    var receipt = await web3Hewe.eth.sendSignedTransaction("0x" + serializedTx.toString("hex"));
    console.log(`Receipt info:  ${JSON.stringify(receipt, null, "\t")}`);
    const balance = await contract.methods.balanceOf(myAddress).call();
    console.log(`Balance after send: ${balance}`);

    return receipt;
  } catch (error) {
    console.log(error, "transferToken");
    await writeLog(`${new Date().toISOString()} - transferToken: ${JSON.stringify(error)}`);
    return null;
  }
}

const callTransferToken = async (amount, addressRevecied, myAddress, privateKeyMyAddress) => {
  try {
    const amountTokenNetwork = amount * 10 ** 18;

    const result = await transferToken(
      usdtInstance,
      USDT.networks[network].address,
      myAddress,
      addressRevecied,
      amountTokenNetwork.toLocaleString("fullwide", { useGrouping: false }),
      privateKeyMyAddress
    );
    if (!result) return null;
    return result;
  } catch (error) {
    return null;
  }
};

const callTransferHewe = async (amount, addressRevecied, myAddress, privateKeyMyAddress) => {
  try {
    const amountTokenNetwork = amount * 10 ** 18;

    const result = await transferToken2(
      heweInstance,
      HEWE.networks[999999].address,
      myAddress,
      addressRevecied,
      amountTokenNetwork.toLocaleString("fullwide", { useGrouping: false }),
      privateKeyMyAddress
    );
    if (!result) return null;
    return result;
  } catch (error) {
    return null;
  }
};

module.exports = { callTransferToken, callTransferHewe };
