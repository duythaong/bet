import fs from "fs";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

const numberOfAccounts = 10;

const accounts = []
for (let i = 0; i < numberOfAccounts; i++) {
  const privateKey = generatePrivateKey();
  const account = privateKeyToAccount(privateKey);
  accounts.push({
    privateKey,
    address: account.address,
  })
}

// save file
if (fs.existsSync("accounts.json")) {
  // copy old data to new file and write new data
  const oldAccounts = JSON.parse(fs.readFileSync("accounts.json").toString());
  fs.writeFileSync(`accounts-${Date.now()}.json`, JSON.stringify(oldAccounts, null, 2));
}
fs.writeFileSync("accounts.json", JSON.stringify(accounts, null, 2));