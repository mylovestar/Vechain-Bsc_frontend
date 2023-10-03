import { Contracts } from "./config";
import { getWeb3 } from "./web3";
import { BridgeBSC } from "../types/BridgeBSC";
import { BridgeMOONRIVER } from "../types/BridgeMOONRIVER";
import { TokenBSC } from "../types/TokenBSC";
import { TokenMOON } from "../types/TokenMOON";
import Web3 from "web3";

/**
 *
 * @param abi abi of the contract
 * @param address address of the contract
 * @param web3 instance of web3
 * @returns a contract based on the abi and address
 */
const contractGenerator = (abi: any, address: any, web3: Web3) =>
  new web3.eth.Contract(abi, address);

/**
 *
 * @returns the array for the contract for tokens and bridges
 */
export const getContracts = async () => {
  const web3 = getWeb3();
  const [etxB, bscB, bETX] = Contracts;
  const contractInstances = [
    contractGenerator(bETX.abi, bETX.address, web3) as unknown as TokenBSC,
    contractGenerator(bscB.abi, bscB.address, web3) as unknown as BridgeBSC,
    contractGenerator(etxB.abi, etxB.address, web3) as unknown as BridgeMOONRIVER,
  ];


  return contractInstances;
};
