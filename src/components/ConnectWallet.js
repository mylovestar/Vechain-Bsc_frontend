import React, { useState, useEffect } from "react";
import Input from "../components/Input";
import { useTokenBalance } from "@usedapp/core";
import { binance, etxinfinity, etxlogo, gooseicon, waveline, docs, mvglogo, linkbutton } from "../assets/index";
import styles from "../styles/container/BridgeContainer.module.scss";
import shorten from "../utils/shorten";
import ContractInteraction from '../components/ContractInteraction';
import Token from "../abis/artifacts/Token.json"

export default function ConnectWallet(props) {
  const [contract] = useState({
    address: '0x99763494A7B545f983ee9Fe02a3b5441c7EF1396',
    abi: Token.abi
  })

  const getAddress = async () => {
    props.vendor.sign("cert", {
      purpose: "identification",
      payload: {
        type: "text",
        content: "Please sign the certificate to show that you are who you claim to be"
      }
    })
      // .accepted(() => alert("accepted"))
      .request()
      .then((r) => {
        const address = r.annex.signer;
        props.onClick(address)
      })
      .catch((e) => console.log("error authentication:" + e.message));
  }

  const deleteAddress = async () => {
    props.onClick("")
  }

  const app = props.app

  const executeContractRead = async (methodName, ...methodArgs) => {
    const abi = contract.abi.find(methodABI => {
      return methodABI.name === methodName
    })

    const methodObj = app.connex.thor.account(contract.address).method(abi)
    const retval = await methodObj.call(...methodArgs)

    return retval.decoded[0]
  }

  const [selectToken, setSelectToken] = useState(mvglogo);
  const [inputValue, setInputValue] = React.useState("");
  const [account, setAccount] = useState("");
  const userAddress = props.address
  const [balance, setBalance] = useState("")
  useEffect(async () => {
    // reset balance on address change (logout then login)
    setBalance(await executeContractRead("balanceOf", userAddress))
  }, [userAddress])
  const setMax = async () => {
    if (balance !== undefined) {
      let value = (Number(balance) / (10 ** 18)).toString();
      setInputValue(value);
    } else {
      let value = (Number(0)).toString();
      setInputValue(value);
    }
  };

  useEffect(() => {
    props.setInputValue(inputValue)
  }, [inputValue])
  // let tokenaddress;
  // let balance = useTokenBalance(
  //   tokenaddress,
  //   account
  // );

  // let MVGBalance;

  return (
    <>
      {
        props.address ?
          <>
            <a href="https://explore.vechain.org/accounts/0xc37792CEFAf5B4Cd86119E6a2beBc047B4C06313">
              <p className={styles.linkAddress}>{shorten("0xc37792CEFAf5B4Cd86119E6a2beBc047B4C06313")} <img src={linkbutton} width="15px"></img></p>
            </a>
            <p style={{margin: "5px"}}>BRIDGE CONTRACT ON VECHAIN</p>
            <a href="https://explore.vechain.org/accounts/0x99763494A7B545f983ee9Fe02a3b5441c7EF1396">
              <p className={styles.linkAddress}>{shorten("0x99763494A7B545f983ee9Fe02a3b5441c7EF1396")} <img src={linkbutton} width="15px"></img></p>
            </a>
            <p style={{margin: "5px"}}>MVG TOKEN ON VECHAIN</p>
            <p className={styles.balances}>
              <ContractInteraction app={props.app}
                contract={contract}
                address={props.address} />
            </p>
            <div className={styles.buttonGroup}>
              <section className={styles.SellGroup}>
                <section
                  style={{ "background": "transparent", "border": "0px", "display": "flex", justifyContent: "center", marginRight: '5px' }}
                >
                  <div className={styles.SellReceive} >
                    <p className={styles.SellReceiveText}>MVG</p>
                    <img
                      src={selectToken}
                      className={styles.SellReceiveLogo}
                    />
                  </div>
                </section>
                <section className={styles.InputSection}>
                  <Input
                    placeholder="0.00"
                    label=""
                    type="number"
                    changeValue={setInputValue}
                    value={inputValue}
                  />
                  <section className={styles.BalanceMax}>
                    <section className={styles.ButtonSection}>
                      <button className={styles.MaxButton} onClick={setMax}>Max</button>
                    </section>
                  </section>
                </section>
              </section>
            </div>
            <div className={styles.walletAddress}>
              <p style={{ color: "#23a455" }}>{shorten(props.address)}</p>
              <p
                style={{ color: "red", textDecoration: "underline" }}
                onClick={deleteAddress} >
                Unlink
              </p>
            </div>
            <p className={styles.swapcardtokenheadline}>CONNECTED WALLET VIA <span className={styles.textcolorviolet}>SYNC2</span></p>
          </>
          :
          <p
            className={styles.connectWallet}
            onClick={getAddress} >
            CONNECT WALLET
          </p>
      }
    </>
  )
}