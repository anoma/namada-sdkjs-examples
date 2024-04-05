import { getSdk } from "@namada/sdk/web";
import init from "@namada/sdk/web-init";
import BigNumber from "bignumber.js";

import {
  NODE_URL,
  NATIVE_TOKEN,
  SIGNING_KEY,
  CHAIN_ID,
  STORAGE_PATH,
} from "../common";

export const submitTransfer = async (): Promise<void> => {
  const txMsgValue = {
    token: NATIVE_TOKEN,
    feeAmount: BigNumber(5),
    gasLimit: BigNumber(20_000),
    chainId: CHAIN_ID,
    publicKey:
      "tpknam1qzz3nvg5zjwdpk5z0x9ngkf7guv9qpqrtz0da7weenwl5766pkkgvvt689t",
  };
  const transferMsgValue = {
    source: "tnam1qqshvryx9pngpk7mmzpzkjkm6klelgusuvmkc0uz",
    target: "tnam1qz4sdx5jlh909j44uz46pf29ty0ztftfzc98s8dx",
    token: NATIVE_TOKEN,
    amount: BigNumber(100),
    nativeToken: NATIVE_TOKEN,
  };

  try {
    const { cryptoMemory } = await init();
    const sdk = getSdk(cryptoMemory, NODE_URL, STORAGE_PATH, NATIVE_TOKEN);

    await sdk.tx.revealPk(SIGNING_KEY, txMsgValue);
    const encodedTx = await sdk.tx.buildTransfer(txMsgValue, transferMsgValue);
    const signedTx = await sdk.tx.signTx(encodedTx, SIGNING_KEY);

    await sdk.rpc.broadcastTx(signedTx);

    const balance = await sdk.rpc.queryBalance(
      "tnam1qz4sdx5jlh909j44uz46pf29ty0ztftfzc98s8dx",
      [NATIVE_TOKEN],
    );
    console.log("Balance:", balance);
  } catch (error) {
    console.error("Error:", error);
  }
};

submitTransfer();
