import { getSdk } from "@heliaxdev/namada-sdk/node";
import init from "@heliaxdev/namada-sdk/node-init";
import { BondProps, WrapperTxProps } from "@namada/types";
import BigNumber from "bignumber.js";

import {
  NODE_URL,
  NATIVE_TOKEN,
  SIGNING_KEY,
  CHAIN_ID,
  STORAGE_PATH,
} from "../common";

export const submitBond = async (): Promise<void> => {
  const wrapperTxProps: WrapperTxProps = {
    token: NATIVE_TOKEN,
    feeAmount: BigNumber(5),
    gasLimit: BigNumber(20_000),
    chainId: CHAIN_ID,
    publicKey:
      "tpknam1qzz3nvg5zjwdpk5z0x9ngkf7guv9qpqrtz0da7weenwl5766pkkgvvt689t",
  };
  const bondProps: BondProps = {
    source: "tnam1qqshvryx9pngpk7mmzpzkjkm6klelgusuvmkc0uz",
    validator: "tnam1qz4sdx5jlh909j44uz46pf29ty0ztftfzc98s8dx",
    amount: BigNumber(100),
  };

  try {
    const { cryptoMemory } = init();

    const sdk = getSdk(cryptoMemory, NODE_URL, STORAGE_PATH, NATIVE_TOKEN);

    const revealPkTx = await sdk.tx.buildRevealPk(wrapperTxProps);
    const signedRevealPkTx = await sdk.signing.sign(revealPkTx, SIGNING_KEY);
    const bondTx = await sdk.tx.buildBond(wrapperTxProps, bondProps);
    const signedBondTx = await sdk.signing.sign(bondTx, SIGNING_KEY);

    // Reveal the public key on chain if it hasn't previously been used
    await sdk.rpc.broadcastTx(signedRevealPkTx, wrapperTxProps);
    await sdk.rpc.broadcastTx(signedBondTx, wrapperTxProps);

    const balance = await sdk.rpc.queryBalance(
      "tnam1qz4sdx5jlh909j44uz46pf29ty0ztftfzc98s8dx",
      [NATIVE_TOKEN],
    );

    console.log("received balance: ", balance);

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
  }
};

submitBond();
