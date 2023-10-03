// import { useEthers } from "@usedapp/core";
import { toast } from "react-toastify";
import { getContracts } from "../utils/contracts";
import { useEffect, useState } from "react";
import { getWeb3 } from "../utils/web3";
import { ethers } from "ethers";
import { abi as BTKToken } from "../abis/TokenBSC.json";
import { abi as Bridge } from "../abis/Bridge.json";

const useBurnBTK = () => {
  // storing the contracts
  const [contractsData, setContractsData] = useState<any>();
  // const { account } = useEthers();

  useEffect(() => {
    const getContract = async () => {
      const data = await getContracts();
      setContractsData({
        bETX: data[0],
        bridge: data[1]
      });
    };
    getContract();
  }, []);


  let token: any;
  const approveBTKBurn = async (signer: any, amount: string,) => {
    const id = toast.success(`Approving in progress for ${amount} tokens`, {
      autoClose: 5000,
      closeOnClick: true,
      theme: "dark",
    });

    let approveTx;
    let TokenContract: ethers.Contract;
    try {
      TokenContract = new ethers.Contract(contractsData.bETX.options.address, BTKToken, signer);
      token = contractsData.bETX.options.address;
      approveTx = await TokenContract.approve(
        contractsData.bridge.options.address,
        getWeb3().utils.toWei(amount, "ether")
      );
      await approveTx.wait();

      toast.dismiss(id);
      toast.success(`Approved ${amount} tokens`, {
        autoClose: 1500,
        closeOnClick: true,
        theme: "dark",
      });
      return await burnBTK(amount, signer);
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

  const burnBTK = async (amount: string, signer: any) => {
    const id = toast.success(`Burning in progress for ${amount} tokens`, {
      autoClose: false,
      closeOnClick: true,
      theme: "dark",
    });
    const BridgeContract = new ethers.Contract(contractsData.bridge.options.address, Bridge, signer);
    let txHash;
    try {
      txHash = await BridgeContract.burn(
        getWeb3().utils.toWei(amount, "ether"),
        token
      );
      await txHash.wait();
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

  return { approveBTKBurn, burnBTK };
};

export default useBurnBTK;
