import React, { useState, useEffect } from "react";
import Connex from '@vechain/connex'
import styles from "../styles/container/BridgeContainer.module.scss";
import { binance, etxinfinity, etxlogo, gooseicon, waveline, docs, mvglogo, linkbutton } from "../assets/index";
import Input from "../components/Input";
import Button from "../components/Button";
import useBurnETK from "../hooks/useBurnETK";
import { useTokenBalance } from "@usedapp/core";
import useBurnBTK from "../hooks/useBurnBTK";
import Axios from "../utils/axios";
import { toast } from "react-toastify";
import Web3 from "web3";
import { getWeb3 } from "../utils/web3";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
// import { useWalletModalToggle } from '../state/application/hooks';
import "react-toastify/dist/ReactToastify.min.css";
import { providerOptions } from "./../components/providerOptions";
import { Framework } from "@vechain/connex-framework";
import { Driver, SimpleNet } from "@vechain/connex-driver";
import WalletConnect from "@walletconnect/client";
import ConnectWallet from "../components/ConnectWallet"
import shorten from "../utils/shorten";
import Transfer from "../components/Transfer";
import { sign } from "crypto";
import Token from "../abis/artifacts/Token.json";
// import waitForReceipt from "../utils/transaction";

// import { useForm } from "react-hook-form";
// import Modal from "react-modal";
/**
 *
 * @returns the entire bridge container with embedded components and functionalities
 */

let bridgebalance: any;
let providers: ethers.providers.Web3Provider;
let signer: ethers.providers.JsonRpcSigner;
let repeatCall = 0;
let bnbAccountBalance: string | import("bn.js");
let ETXAccountBalance: string | import("bn.js");

const BridgeContainer: React.FC = () => {
  const [account, setAccount] = useState("");
  const [chainId, setChainId] = useState(0);
  const [provider, setProvider] = useState();
  const { ethereum } = window as any;

  const [selectToken, setSelectToken] = useState<string>(mvglogo);
  const [selectTokenName, setSelectTokenName] = useState<string>("MVG");
  const [selectFeeTokenName, setSelectFeeTokenName] = useState<string>("BNB");
  const [selectLeftChainName, setSelectLeftChainName] = useState<string>("BNB Chain");
  const [selectRightChainName, setSelectRightChainName] = useState<string>("VeChain");
  const [selectRightChainId, setSelectRightChainId] = useState<number>(100009);
  const [selectLeftChainId, setSelectLeftChainId] = useState<number>(56);
  const [selectLeftChain, setSelectLeftChain] = useState<string>(etxinfinity);
  const [selectRightChain, setSelectRightChain] = useState<string>(binance);
  const [address, setAddress] = useState("")


  const BSC_PROVIDER_URL = "https://bsc-dataseed.binance.org";
  const ETX_PROVDER_URL = "https://vethor-node.vechain.com";

  // const [accountData, setAccountData] = React.useState<any>(null); // storing account data
  // const { account, activateBrowserWallet } = useEthers();

  const web3Modal = new Web3Modal({
    cacheProvider: true,
    providerOptions,
    disableInjectedProvider: false,
  });

  const [app, setApp] = useState<any>({
    connex: undefined,
    vendor: undefined
  });

  // init vechain web3
  useEffect(() => {
    const connex = new Connex({
      node: 'https://mainnet.veblocks.net/',
      network: 'main'
    })
    const vendor = new Connex.Vendor("main")
    setApp({
      connex: connex,
      vendor: vendor
    })
  }, [])

  const [contract] = useState({
    address : '0x99763494A7B545f983ee9Fe02a3b5441c7EF1396',
    abi     : Token.abi
  })

  const connectWallet = async () => {
    try {
      let IsFirstLogin = localStorage.getItem("firstlogin");
      if (IsFirstLogin === "false") {
        const provider = await web3Modal.connect();
        const library = new ethers.providers.Web3Provider(provider);
        let accounts = await library.listAccounts();
        setProvider(provider);
        if (accounts) {
          setAccount(accounts[0]);
          setChainId((await library.getNetwork()).chainId);
        }
        if (selectLeftChain === "VeChain") {
          setChainId(100009);
        } else {
          bnbAccountBalance = await BSCweb3.eth.getBalance(accounts[0]);
          bnbAccountBalance = BSCweb3.utils.fromWei(bnbAccountBalance, 'ether');
          ETXAccountBalance = await ETXweb3.eth.getBalance(accounts[0]);
          ETXAccountBalance = ETXweb3.utils.fromWei(ETXAccountBalance, 'ether');
        }
        providers = new ethers.providers.Web3Provider(provider);
        signer = providers.getSigner();
      }
      else {
        await web3Modal.clearCachedProvider();
        setAccount("");
        setChainId(0);
        localStorage.setItem("firstlogin", "false");
        toast.warning("Please connect wallet again", {
          theme: "dark",
          autoClose: 5000,
          closeOnClick: true,
        });
      }
    } catch (error) {
    }
  };

  const disconnect = async () => {
    await web3Modal.clearCachedProvider();
    setAccount("");
    setChainId(0);
  };

  // const toggleWalletModal = useWalletModalToggle();

  // const switchRequestBSC = () => {
  //   return window.ethereum.request({
  //     method: "wallet_switchEthereumChain",
  //     params: [{ chainId: "0x38" }],
  //   });
  // };

  // const addChainRequestBSC = () => {
  //   return window.ethereum.request({
  //     method: "wallet_addEthereumChain",
  //     params: [
  //       {
  //         chainId: "0x38",
  //         chainName: "Smart Chain",
  //         rpcUrls: ["https://bsc-dataseed.binance.org"],
  //         blockExplorerUrls: ["https://bscscan.com/"],
  //         nativeCurrency: {
  //           name: "BNB",
  //           symbol: "BNB",
  //           decimals: 18,
  //         },
  //       },
  //     ],
  //   });
  // };
  // const switchRequestETX = () => {
  //   return window.ethereum.request({
  //     method: "wallet_switchEthereumChain",
  //     params: [{ chainId: "0x186a9" }],
  //   });
  // };

  // const addChainRequestETX = () => {
  //   return window.ethereum.request({
  //     method: "wallet_addEthereumChain",
  //     params: [
  //       {
  //         chainId: "0x186a9",
  //         chainName: "VeChain",
  //         rpcUrls: ["https://vethor-node.vechain.com"],
  //         blockExplorerUrls: ["https://explore.vechain.org/"],
  //         nativeCurrency: {
  //           name: "VET",
  //           symbol: "VET",
  //           decimals: 18,
  //         },
  //       },
  //     ],
  //   });
  // };

  React.useEffect(() => {
    const switchChain = async () => {
      if (selectLeftChainId === 100009) {
        if (window.ethereum) {
          try {
            // await switchRequestETX();
            // setChainId(100009);
            setSelectRightChainName("BNB Chain");
            setSelectRightChain(binance);
            if (account) {
              disconnect();
            }
          } catch (error: any) {
            if (error.code === 4902) {
              try {
                // await addChainRequestETX();
                // await switchRequestETX();
                // setChainId(100009);
                setSelectRightChainName("BNB Chain");
                setSelectRightChain(binance);
              } catch (addError) {
                console.log(error);
              }
            } else if (error.code === 4001) {
              setSelectFeeTokenName("MVG");
              setSelectLeftChainName("BNB Chain");
              setSelectLeftChain(binance);
              setSelectRightChainName("VeChain");
              setSelectRightChain(etxinfinity);
              setChainId(56);
            }
            console.log(error);
          }
        }
      } else {
        if (window.ethereum) {
          try {
            // await switchRequestBSC();
            setChainId(56);
            setSelectFeeTokenName("MVG");
            setSelectLeftChainName("VeChain");
            setSelectLeftChain(etxinfinity);
            setSelectRightChainName("BNB Chain");
            setSelectRightChain(binance);
            setSelectToken(mvglogo);
            setSelectTokenName("MVG");
            if (account) {
              disconnect();
            }
          } catch (error: any) {
            if (error.code === 4902) {
              try {
                // await addChainRequestBSC();
                // await switchRequestBSC();
                setChainId(56);
                setSelectRightChainName("VeChain");
                setSelectRightChain(etxinfinity);
              } catch (addError) {
                console.log(error);
              }
            } else if (error.code === 4001) {
              setSelectRightChainName("VeChain");
              setSelectRightChain(etxinfinity);
              setChainId(100009);
            }
            console.log(error);
          }
        }
      }
    };
    switchChain();
  }, [selectLeftChainId, selectRightChainId, ethereum]);

  const arrowSwapper = (): void => {
    setSelectLeftChainName(selectRightChainName);
    let LeftChain, LeftChainName, LeftChainId, RightChain, RightChainName, RightChainId, LeftChainFeeToken;
    if (selectRightChainName === "BNB Chain") {
      LeftChain = binance;
      LeftChainName = "BNB Chain";
      LeftChainFeeToken = "MVG";
      LeftChainId = 56;
      RightChain = etxinfinity;
      RightChainName = "VeChain";
      RightChainId = 100009;
    } else {
      LeftChain = etxinfinity;
      LeftChainName = "VeChain";
      LeftChainFeeToken = "MVG";
      LeftChainId = 100009;
      RightChain = binance;
      RightChainName = "BNB Chain";
      RightChainId = 56;
    }
    setSelectLeftChain(LeftChain);
    setSelectFeeTokenName(LeftChainFeeToken);
    setSelectLeftChainName(LeftChainName);
    setSelectLeftChainId(LeftChainId);
    setSelectRightChain(RightChain);
    setSelectRightChainName(RightChainName);
    setSelectRightChainId(RightChainId);
  };

  const { approveETKBurn } = useBurnETK();
  const { approveBTKBurn } = useBurnBTK();


  // storing the value for the input
  const [veInputValue, setVeInputValue] = React.useState<string>("");
  const [inputValue, setInputValue] = React.useState<string>("");

  let BSCweb3 = new Web3(new Web3.providers.HttpProvider(BSC_PROVIDER_URL));
  let ETXweb3 = new Web3(new Web3.providers.HttpProvider(ETX_PROVDER_URL));
  let BNBbalance;
  let ETXbalance;
  let tokenaddress;
  if (chainId === 56) {
    tokenaddress = '0xc45De8AB31140e9CeD1575eC53fFfFa1E3062576'
  }

  let balance = useTokenBalance(
    tokenaddress,
    account
  )

  Axios.post("/bridgebalance", {
    toChainId: selectRightChainId,
    token: selectTokenName
  })
    .then(res => {
      bridgebalance = res.data.balances;
    })
    .catch(error => {
      console.log(error);
    })



  const ETXBurnBscMint = async () => {
    var input;
    var bscBridgebalance;
    input = getWeb3().utils.toWei(veInputValue, "ether");
    bscBridgebalance = bridgebalance[0];

    BNBbalance = await BSCweb3.eth.getBalance(account);
    BNBbalance = BSCweb3.utils.fromWei(BNBbalance, 'ether');
    // console.log("values", input, bscBridgebalance, BNBbalance, bscBridgebalance?.toString(), address);
    try {
      if (Number(BNBbalance) > 0.01) {
        if (Number(bscBridgebalance) > Number(input)
          && bscBridgebalance?.toString() !== undefined) {
          const txHash = await approveETKBurn(veInputValue, address);
          console.log("txHash", txHash);
          toast.success("Minting for tokens in progress!", {
            theme: "dark",
            autoClose: 5000,
            closeOnClick: true,
          });
          await Axios.post("/mint-bsc", {
            txHash: txHash,
            accountConnected: account
          });
          toast.dismiss();
          toast.success(
            "Minted tokens successfully! Please check the token balance on BNB Chain",
            {
              theme: "dark",
              autoClose: 2000,
              closeOnClick: true,
            }
          );
        } else {
          toast.error('There’s not enough fund in the bridging contract address on BNB Chain networks.', {
            theme: "dark",
            autoClose: 2000,
            closeOnClick: true,
          }
          );
        }
      } else {
        toast.error('There’s not enough gas fee on Admin wallet.', {
          theme: "dark",
          autoClose: 2000,
          closeOnClick: true,
        }
        );
      }
    } catch (err) {
      toast.error((err as any).message, {
        theme: "dark",
        autoClose: 2000,
        closeOnClick: true,
      });
    }
  };

  const bscBurnETXMint = async () => {
    ETXbalance = await ETXweb3.eth.getBalance("0xaA3938b5728f84e04d996f553D556e840Cf250EB"); // admin wallet address
    ETXbalance = ETXweb3.utils.fromWei(ETXbalance, 'ether');
    try {
      var input;
      var ETXBridgebalance;
      input = getWeb3().utils.toWei(inputValue, "ether");
      ETXBridgebalance = bridgebalance[0];
      if (Number(ETXBridgebalance) > Number(input) && ETXBridgebalance?.toString() !== undefined) {
        if (Number(ETXbalance) > 0.01) {
          const txHash = await approveBTKBurn(signer, inputValue);
          toast.success("Minting for tokens in progress!", {
            theme: "dark",
            autoClose: 5000,
            closeOnClick: true,
          });
          await Axios.post("/mint-eth", {
            txHash: txHash.hash
          });
          toast.dismiss();
          toast.success(
            "Minted tokens successfully! Please check the token balance on VeChain",
            {
              theme: "dark",
              autoClose: 2000,
              closeOnClick: true,
            }
          );
        } else {
          toast.error('There’s not enough gas fee on Admin wallet.', {
            theme: "dark",
            autoClose: 2000,
            closeOnClick: true,
          }
          );
        }
      } else {
        toast.error('There’s not enough fund in the bridging contract address on VeChain networks.', {
          theme: "dark",
          autoClose: 2000,
          closeOnClick: true,
        }
        );
      }
    } catch (err) {
      toast.error((err as any).message, {
        theme: "dark",
        autoClose: 2000,
        closeOnClick: true,
      });
    }
  };

  const clickHandler = async () => {
    if (selectLeftChainName === "BNB Chain") {
      // if (chainId !== 56) {
      //   await ethereum.request({
      //     method: "wallet_switchEthereumChain",
      //     params: [{ chainId: `0x${Number(56).toString(16)}` }],
      //   });
      // }
      bscBurnETXMint();
    } else {
      // await ethereum.request({
      //   method: "wallet_switchEthereumChain",
      //   params: [{ chainId: `0x${Number(100009).toString(16)}` }],
      // });
      ETXBurnBscMint();
    }
    setInputValue("");
  };

  const setMaxValue = async () => {
    if (chainId === 56) {
      if (balance !== undefined) {
        let value = (Number(balance) / (10 ** 18)).toString();
        setInputValue(value);
      } else {
        let value = (Number(0)).toString();
        setInputValue(value);
      }
    } else {
      let value = (Number(ETXAccountBalance)).toString();
      setInputValue(value);
    }
  };



  return (
    <>
      <div className={styles.HeaderContainer}>
        <section className={styles.BalanceSection}>
          <img src={etxlogo} width="160px" alt="logo" />
        </section>
        {/* <section className={styles.ButtonContainer}>

          {!account ? (
            <Button clickHandler={connectWallet} >Connect Wallet</Button>
          ) : (
            <Button clickHandler={disconnect}>
              {`${account?.substring(0, 4)}...${account?.substring(
                account.length - 4
              )}`}
            </Button>
          )}
        </section> */}
        <section>
          <a href="https://docs.vechain.org/">
            <button style={{ background: "transparent", width: "150px", height: "55px", border: "1px solid", borderRadius: "13px", marginTop: "15px", marginRight: "40px", display: "flex" }}>
              <img src={docs} width="30px" style={{ padding: "8px", marginTop: "2px" }}></img>
              <p style={{ width: "68px", fontFamily: "Oswald", fontStyle: "normal", fontWeight: "300", fontSize: "28px", lineHeight: "41px", letterSpacing: "0.035em", marginTop: "5px", textUnderlineOffset: "" }}>DOCS</p>
            </button>
          </a>
        </section>
      </div>
      <section className={styles.BridgeBodyContainer} >
        <div className={styles.BridgeContainer}>
          <section className={styles.SwapSection}>
            <section className={styles.SwapSubSection}>
              {/* <p className={styles.SwapText}>From :</p> */}
              <button style={{ 'position': 'initial', 'display': 'flex', justifyContent: 'space-around' }}>
                <div className={styles.ChainFromTo}>
                  <div style={{ display: "flex", flexDirection: "column-reverse", justifyContent: "center", alignItems: "center" }}>
                    {
                      <ConnectWallet
                        setInputValue={setVeInputValue}
                        vendor={app.vendor}
                        address={address}
                        onClick={setAddress}
                        app={app} />
                    }
                    {selectLeftChain ?
                      <img src={selectLeftChain} style={{ width: "200px" }} />
                      : <h3>Select Chain</h3>}
                    &nbsp;
                    {selectLeftChain ?
                      <h3>{selectLeftChainName}</h3>
                      : <></>}
                  </div>
                </div>
              </button>
            </section>
            <section style={{ alignItems: "center", justifyContent: "center", display: "flex", flexDirection: "column" }}>
              {/* <a href="#"><img src={gooseicon} onClick={arrowSwapper} width="70px" style={{ marginBottom: "-15px" }}></img></a> */}
              <img src={gooseicon} width="70px" style={{ marginBottom: "-15px" }}></img>
              <img src={waveline} width="400px"></img>
              <div className={styles.Content}>
                <p>Receiving Amount</p>
                <p>
                  {Number(veInputValue) === 0 ?
                    0
                    : (Number(veInputValue) * 0.9995).toFixed(5)} MVG
                </p>
              </div>
              <div className={styles.Content}>
                <p>Fees</p>
                <p>
                  {Number(veInputValue) === 0 ? 0 : (Number(veInputValue) * 0.0005).toFixed(5)} {selectFeeTokenName}</p>
              </div>
            </section>
            <section className={styles.SwapSubSection}>
              {/* <p className={styles.SwapText}>To :</p> */}
              <button
                style={{ 'position': 'initial', 'display': 'flex', justifyContent: 'space-around' }}
              >
                <div className={styles.ChainFromTo}>
                  <div style={{ display: "flex", flexDirection: "column-reverse", justifyContent: "center", alignItems: "center" }}>
                    {
                      account !== "" ?
                        <div>
                          <p className={styles.swapcardtokenheadline}>CONNECTED WALLET VIA <span className={styles.textcolorpink}>METAMASK</span></p>
                          <div className={styles.walletAddress} style={{ margin: "auto" }}>
                            <p style={{ color: "#23a455" }}>{shorten(account)}</p>
                            <p style={{ color: "red", textDecoration: "underline" }} onClick={disconnect}>Unlink</p>
                          </div>
                          <div className={styles.buttonGroup}>
                            <section className={styles.SellGroup}>
                              <section
                                style={{ "background": "transparent", "border": "0px", "display": "flex", justifyContent: "center", marginRight: '5px' }}
                              >
                                <div className={styles.SellReceive} >
                                  <p className={styles.SellReceiveText}>MVG</p>
                                  {selectToken ?
                                    <img
                                      src={selectToken}
                                      className={styles.SellReceiveLogo}
                                    /> : <p>Select Token</p>}
                                </div>
                              </section>
                              <section className={styles.InputSection}>
                                {
                                  <>
                                    <Input
                                      placeholder="0.00"
                                      label=""
                                      type="number"
                                      changeValue={setInputValue}
                                      value={veInputValue}
                                    />
                                    {/* <section className={styles.BalanceMax}>
                                      <section className={styles.ButtonSection}>
                                        <button className={styles.MaxButton} onClick={setMaxValue}>Max</button>
                                      </section>
                                    </section> */}
                                  </>
                                }
                              </section>
                            </section>
                          </div>
                          <p className={styles.balances}>
                            Balance : &nbsp;
                            {
                              `${chainId !== 56 ?
                                (Number(ETXAccountBalance)).toFixed(2)
                                : (Number(balance) / (10 ** 18)).toFixed(2)
                              }`
                            }
                          </p>
                          <p style={{ margin: "10px", textAlign: "center" }}>MVG TOKEN ON BNB CHAIN</p>
                          <a href="https://bscscan.com/address/0xc45de8ab31140e9ced1575ec53ffffa1e3062576">
                            <p className={styles.linkAddress}>{shorten("0xc45de8ab31140e9ced1575ec53ffffa1e3062576")} <img src={linkbutton} width="15px"></img></p>
                          </a>
                          <p style={{ margin: "10px", textAlign: "center" }}>BRIDGE CONTRACT ON BNB CHAIN</p>
                          <a href="https://bscscan.com/address/0x2D0D5B2F1C637979Da7653Eb628BAbe79fc2a112">
                            <p className={styles.linkAddress}>{shorten("0x2D0D5B2F1C637979Da7653Eb628BAbe79fc2a112")} <img src={linkbutton} width="15px"></img></p>
                          </a>
                        </div>
                        : <p className={styles.connectWallet} onClick={connectWallet}>CONNECT WALLET</p>
                    }
                    {selectRightChain ?
                      <img
                        src={selectRightChain}
                        style={{ width: "200px" }}
                      /> : <h3>Select Chain</h3>}
                    &nbsp;
                    {selectRightChain ?
                      <h3>{selectRightChainName}</h3>
                      : <></>}
                  </div>
                </div>
              </button>
            </section>
          </section>
          <section className={styles.SwapButtonContainer}>
            <button onClick={clickHandler} className={styles.SwapButton} disabled={!veInputValue}>
              Transfer
            </button>
          </section>
        </div>
      </section>
    </>
  );
};

export default BridgeContainer;
