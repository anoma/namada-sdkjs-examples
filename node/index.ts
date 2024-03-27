import { getSdk } from "@namada/sdk/node";
import init from "@namada/sdk/node-init";
import BigNumber from "bignumber.js";

import { NODE_URL, NATIVE_TOKEN, SIGNING_KEY, CHAIN_ID } from "../common";

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
    const { cryptoMemory } = init();
    const sdk = await getSdk(cryptoMemory, NODE_URL, NATIVE_TOKEN);

    await sdk.tx.revealPk(SIGNING_KEY, txMsgValue);
    const encodedTx = await sdk.tx.buildTransfer(txMsgValue, transferMsgValue);
    const signedTx = await sdk.tx.signTx(encodedTx, SIGNING_KEY);

    await sdk.rpc.broadcastTx(signedTx);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(0);
  }
};

submitTransfer();
