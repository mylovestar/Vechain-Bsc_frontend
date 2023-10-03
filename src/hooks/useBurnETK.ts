// import { useEthers } from "@usedapp/core";
import { toast } from "react-toastify";
import { getContracts } from "../utils/contracts";
import { useEffect, useState } from "react";
import Connex from '@vechain/connex'
import { getWeb3 } from "../utils/web3";
import { ethers } from "ethers";
import { abi as BTKToken } from "../abis/TokenBSC.json";
import { abi as Bridge } from "../abis/Bridge.json";
import { waitForReceipt } from "../utils/transaction";
import { abi as Token} from "../abis/artifacts/Token.json";
const useBurnETK = () => {
  // storing the contracts
  const [contractsData, setContractsData] = useState<any>();
  // const { account } = useEthers();

  useEffect(() => {
    const getContract = async () => {
      const data = await getContracts();
      setContractsData({
        bridge: data[2]
      });
    };
    getContract();
  }, []);

  const [userAddress, setAddress] = useState("")
  const [app, setApp] = useState<any>({
    connex: undefined,
    vendor: undefined,
  });

  useEffect(() => {
    const connex = new Connex({
      node: 'https://mainnet.veblocks.net/',
      network: 'main'
    })
    const vendor = new Connex.Vendor("main")
    setApp((prevState: any) => {
      return {
        ...prevState,
        connex: connex,
        vendor: vendor
      }
    })
  }, [])

  let token: any;
  const approveETKBurn = async (amount: string, address: string) => {
    const id = toast.success(`Approving in progress for ${amount} tokens`, {
      autoClose: 5000,
      closeOnClick: true,
      theme: "dark",
    });
    let approveTx;
    // let TokenContract: ethers.Contract;
    try {
      // TokenContract = new ethers.Contract(contractsData.bETX.options.address, BTKToken);
      const TokenContract = {
        address: '0x99763494A7B545f983ee9Fe02a3b5441c7EF1396',
        abi: Token
      }
      console.log("tokencontract", TokenContract);
      // token = contractsData.bETX.options.address;
      const approveABI = TokenContract.abi.find(methodABI => {
        return methodABI.name === "approve"
      });
      // approveTx = await TokenContract.abi.approve(
      //   "0xAa316f402C92efA8659A007f3f7142Caa63FdcE8", amount
      // );
      const approveMethod = app.connex.thor.account(TokenContract.address).method(approveABI);
      const clause = await approveMethod.asClause("0xc37792CEFAf5B4Cd86119E6a2beBc047B4C06313", getWeb3().utils.toWei(amount, "ether"));
      // await approveTx.wait();
      const tx = await app.connex.vendor
        .sign("tx", [clause])
        // .comment("approve 0 MVG to 0xc37792CEFAf5B4Cd86119E6a2beBc047B4C06313")
        .signer(address)
        .request()
      await waitForReceipt(app, tx)
      approveTx = tx.txid;
      toast.dismiss(id);
      toast.success(`Approved ${amount} tokens`, {
        autoClose: 1500,
        closeOnClick: true,
        theme: "dark",
      });
      return await burnETK(amount, address);
    } catch (err) {
      toast.dismiss(id);
      let message = (err as any).message;
      if ((err as any).code === 4001) {
        message = `Error in approving ${amount} tokens. Please try again!`;
      }
      toast.error(message, {
        autoClose: 1500,
        closeOnClick: true,
        theme: "dark",
      });
    }
  };

  const burnETK = async (amount: string, address: string) => {
    const id = toast.success(`Burning in progress for ${amount} tokens`, {
      autoClose: false,
      closeOnClick: true,
      theme: "dark",
    });
    // const BridgeContract = new ethers.Contract(contractsData.bridge.options.address, Bridge);
    const bridgeContract = {
      address: '0xc37792CEFAf5B4Cd86119E6a2beBc047B4C06313',
      abi: Bridge
    }
    let txHash;
    try {
      console.log('debug->etx burn', contractsData.bridge.options.address, Bridge)
      // txHash = await bridgeContract.etxBurn({ value: getWeb3().utils.toWei(amount, "ether") });
      const transferABI = bridgeContract.abi.find(methodABI => {
        return methodABI.name === "burn"
      });
      console.log('debug->transferABI', bridgeContract.abi, transferABI, address, userAddress)
      const transferMethod = app.connex.thor.account(bridgeContract.address).method(transferABI);
      const clause = await transferMethod.asClause(getWeb3().utils.toWei(amount, "ether"), "0x99763494A7B545f983ee9Fe02a3b5441c7EF1396");
      // await txHash.wait();
      const tx = await app.connex.vendor
        .sign("tx", [clause])
        // .comment("transfer 0 MVG to 0xc37792CEFAf5B4Cd86119E6a2beBc047B4C06313")
        .signer(address)
        .request()
      await waitForReceipt(app, tx)
      txHash = tx.txid;
      toast.dismiss(id);
      toast.success(`Burned ${amount} tokens`, {
        autoClose: 1500,
        closeOnClick: true,
        theme: "dark",
      });
      return txHash;
    } catch (err) {
      toast.dismiss(id);
      let message = (err as any).message;
      if ((err as any).code === 4001) {
        message = `Error in burning ${amount} tokens. Please try again!`;
      }
      toast.error(message, {
        autoClose: 1500,
        closeOnClick: true,
        theme: "dark",
      });
    }
  };

  return { approveETKBurn, burnETK };
};

export default useBurnETK;
