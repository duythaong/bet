import {
  createPublicClient,
  encodeFunctionData,
  getContract,
  http,
  parseUnits,
  encodeAbiParameters,
  keccak256,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";

import { ERC20ABI, ERC721ABI, GAMEABI } from "./abi";
import { readFileSync } from "fs";

const client = createPublicClient({
  transport: http(),
  chain: {
    id: 421614,
    name: "Arbitrum Sepolia",
    nativeCurrency: {
      decimals: 18,
      name: "ETH",
      symbol: "ETH",
    },
    rpcUrls: {
      default: {
        http: ["https://sepolia-rollup.arbitrum.io/rpc"],
      },
    },
  },
});

const accounts = JSON.parse(readFileSync("accounts.json").toString());

const MAX_INT = 115792089237316195423570985008687907853269984665640564039457584007913129639935n;

const erc20Contract = getContract({
  abi: ERC20ABI,
  address: "0x304F4A54Ec4D66107a58080869990d982b348b9C",
  client,
});

const erc721Contract = getContract({
  abi: ERC721ABI,
  address: "0x9aaa9404a86618FB084d4CD277d07fB9fd3C36a9",
  client,
});

const gameContract = getContract({
  abi: GAMEABI,
  address: "0x49f9D992310f194cB3F0019A6F13ca2f3Df9c52B",
  client,
});

const mintNFT = async (privateKey: `0x${string}`) => {
    const {
    maxFeePerBlobGas,
    maxFeePerGas,
    maxPriorityFeePerGas,
  } = await client.estimateFeesPerGas();

  const account = privateKeyToAccount(privateKey);
  const signedTx = await account.signTransaction({
    to: erc721Contract.address,
    data: encodeFunctionData({
      abi: ERC721ABI,
      functionName: "mint",
      args: [
        keccak256(
          encodeAbiParameters([{ type: "address" }], [account.address])
        ),
      ],
    }),
    type: "eip1559",
    chainId: 421614,
    gas: 300000n,
    maxFeePerBlobGas,
    maxFeePerGas,
    maxPriorityFeePerGas,
  });
  const txHash = await client.sendRawTransaction({
    serializedTransaction: signedTx,
  });

  await client.waitForTransactionReceipt({
    hash: txHash,
  });

  console.log(`Done mint NFT for ${account.address} ${txHash}`);
};

const approve = async (privateKey: `0x${string}`) => {
  const account = privateKeyToAccount(privateKey);
  const {
    maxFeePerBlobGas,
    maxFeePerGas,
    maxPriorityFeePerGas,
  } = await client.estimateFeesPerGas();

  const nonce = await client.getTransactionCount({
      address: account.address,
  });
  const signedTx = await account.signTransaction({
    to: erc20Contract.address,
    data: encodeFunctionData({
      abi: ERC20ABI,
      functionName: "approve",
      args: [
        gameContract.address,
        MAX_INT,
      ],
    }),
    nonce,
    type: "eip1559",
    chainId: 421614,
    gas: 300000n,
    maxFeePerBlobGas,
    maxFeePerGas,
    maxPriorityFeePerGas,
  });

  const txHash = await client.sendRawTransaction({
    serializedTransaction: signedTx,
  });

  await client.waitForTransactionReceipt({
    hash: txHash,
  });

  console.log(`Done approve for ${account.address} ${txHash}`);

}

const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// BET
const bet = async (privateKey: `0x${string}`) => {
  const account = privateKeyToAccount(privateKey);
  const {
    maxFeePerBlobGas,
    maxFeePerGas,
    maxPriorityFeePerGas,
  } = await client.estimateFeesPerGas();

  const nonce = await client.getTransactionCount({
      address: account.address,
  });

  const randomNumber = getRandomNumber(5000, 100000);
  const betSide = randomNumber % 2 === 0 ? "betHigh" : "betLow";
  const currentEpoch = await gameContract.read.currentEpoch([]);

  const signedTx = await account.signTransaction({
    to: gameContract.address,
    data: encodeFunctionData({
      abi: GAMEABI,
      functionName: betSide,
      args: [
        currentEpoch,
        parseUnits(randomNumber.toString(), 18),
      ],
    }),
    nonce,
    type: "eip1559",
    chainId: 421614,
    gas: 300000n,
    maxFeePerBlobGas,
    maxFeePerGas,
    maxPriorityFeePerGas,
  });

  const txHash = await client.sendRawTransaction({
    serializedTransaction: signedTx,
  });

  await client.waitForTransactionReceipt({
    hash: txHash,
  });

  // log user address and his bet side
  console.log(`Done bet for ${account.address} ${txHash} ${betSide} ${randomNumber}`);
}

// for (let i = 0; i < accounts.length; i++) {
//   await mintNFT(accounts[i].privateKey);
//   await approve(accounts[i].privateKey);
//   console.log("Done : ", i);
//   await new Promise((r) => setTimeout(r, 1000));
// }

for (let i = 0; i < accounts.length; i++) {
  await bet(accounts[i].privateKey);
}
