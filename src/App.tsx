import React from "react";
import styles from "./App.module.scss";
import BridgeContainer from "./container/BridgeContainer";

const App: React.FC = () => {
  return (
    <div className={styles.App}>
      <BridgeContainer />
    </div>
  );
};

export default App;