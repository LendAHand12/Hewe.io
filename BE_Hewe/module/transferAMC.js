const Web3 = require("web3");
const { Web3: Web3New } = require("web3new");
const { writeLog } = require("./log");
const web3_v1_amchain = new Web3("https://node1.amchain.net/");
const web3New = new Web3New("https://node1.amchain.net/");

async function transferAMC(fromAddress, toAddress, transferAmount, my_privkey) {
  try {
    console.log(`Attempting to make transaction from ${fromAddress} to ${toAddress}`);
    console.log({ fromAddress, toAddress, transferAmount, my_privkey });

    // QUAN TRỌNG: phải dùng web3 bản cũ v1, rpc là amchain

    const createTransaction = await web3_v1_amchain.eth.accounts.signTransaction(
      {
        from: fromAddress,
        to: toAddress,
        value: web3New.utils.toWei(`${transferAmount}`, "ether"),
        gas: "54154",
      },
      my_privkey
    );

    console.log("sendAMC", createTransaction.rawTransaction);

    // Deploy transaction
    const createReceipt = await web3New.eth.sendSignedTransaction(createTransaction.rawTransaction);
    console.log(`Transaction successful with hash: ${createReceipt.transactionHash}`);

    return createReceipt.transactionHash;
  } catch (error) {
    console.log(error, "transferAMC");
    await writeLog(`${new Date().toISOString()} - transferAMC auto withdraw error: ${JSON.stringify(error)}`);
    return null;
  }
}

module.exports = { transferAMC };
