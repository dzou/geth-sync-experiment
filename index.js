const { ethers } = require("ethers");

// If you don't specify a //url//, Ethers connects to the default
// (i.e. ``http:/\/localhost:8545``)
const snapSyncProvider = new ethers.providers.JsonRpcProvider(
  "<placeholder, ask me>"
);

const fullSyncProvider = new ethers.providers.JsonRpcProvider(
  "<placeholder, ask me>"
);

const BLOCK_LIMIT = 6500000;

async function test() {
  for (let i = 0; i < BLOCK_LIMIT; i += 5000) {
    const blockData1 = await snapSyncProvider.getBlockWithTransactions(i);
    const blockData2 = await fullSyncProvider.getBlockWithTransactions(i);

    if (blockData1.transactions.length != blockData2.transactions.length) {
      console.log(
        "Different transaction counts ${blockData1} -- ${blockData2} : block ${i}."
      );
    }

    for (let tx of blockData2.transactions) {
      if (tx.from == null) {
        continue;
      }

      // Get the balance of the `from` address at +30000 blocks from present
      const balance_snap = await snapSyncProvider.getBalance(
        tx.from,
        i + 30000
      );
      const balance_full = await fullSyncProvider.getBalance(
        tx.from,
        i + 30000
      );

      if (!balance_full.eq(balance_snap)) {
        console.log("Block: " + i + " tx hash: " + tx.hash);
        console.log("Balance snap sync " + balance_snap);
        console.log("Balance full sync " + balance_full);
      }
    }

    console.log("Processed block " + i);
  }
}

test()
  .then()
  .catch((err) => console.log(err));
