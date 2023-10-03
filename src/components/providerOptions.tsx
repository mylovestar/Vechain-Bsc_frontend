import WalletConnectProvider from "@walletconnect/web3-provider";

export const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      network: "binance",
      rpc: {
        56: "https://bsc-dataseed.binance.org",
        100009: "https://vethor-node.vechain.com",
        // ...
      },
    }
  }
};