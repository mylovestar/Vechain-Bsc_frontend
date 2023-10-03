import React, { useEffect, useState } from 'react';

type DropDownProps = {
    showDropDown: boolean;
    toggleDropDown: Function;
    walletConnection: Function;
};

const DropDown_Wallet: React.FC<DropDownProps> = ({
    walletConnection
}: DropDownProps): JSX.Element => {
    const [showDropDown, setShowDropDown] = useState<boolean>(false);
    const [accountData, setAccountData] = React.useState<any>(null);
    useEffect(() => {
        setShowDropDown(showDropDown);
    }, [showDropDown]);
    const onClickHandler = (): void => {
        walletConnection(undefined);
    };
    console.log(accountData, 'accountdata');
    return (
        <>
            <div className={showDropDown ? 'dropdown' : 'dropdown active'}>
                <p
                    onClick={(): void => {
                        onClickHandler();
                    }}
                    style={{ 'display': 'flex' }}
                >
                    Disconnect
                </p>
            </div>
        </>
    );
};

export default DropDown_Wallet;
