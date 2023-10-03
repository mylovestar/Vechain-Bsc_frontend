import React, { useEffect, useState } from 'react';
type DropDownProps = {
    tokens: string[];
    tokennames: string[];
    selectLeftChainName: string;
    showDropDownRight: boolean;
    toggleDropDownRight: Function;
    tokenSelection: Function;
};

const DropDown_token_Right: React.FC<DropDownProps> = ({
    tokens,
    tokennames,
    tokenSelection,
    selectLeftChainName
}: DropDownProps): JSX.Element => {
    const [showDropDownRight, setShowDropDownRight] = useState<boolean>(false);

    /**
     * Handle passing the token name
     * back to the parent component
     *
     * @param token  The selected token
     */
    const onClickHandler = (token: string): void => {
        tokenSelection(token);
    };
    useEffect(() => {
        setShowDropDownRight(showDropDownRight);
    }, [showDropDownRight]);

    let chainTokens;
    let chainTokenNames;
    if (selectLeftChainName === 'BSC' && tokens.length > 5) {  // tokens length
        chainTokens = tokens.splice(0, 1);
        chainTokenNames = tokennames.splice(0, 1);
    } else if(selectLeftChainName === 'Moonriver' && tokens.length > 5){
        chainTokens = tokens.splice(1, 1);
        chainTokenNames = tokennames.splice(1, 1);
    }
    return (
        <>
            <div className={showDropDownRight ? 'dropdown_right' : 'dropdown_right active'}>
                {tokens.map(
                    (token: string, index: number): JSX.Element => {
                        return (
                            <p
                                key={index}
                                onClick={(): void => {
                                    onClickHandler(token);
                                }}
                                style={{ 'display': 'flex' }}
                            >
                                <img
                                    src={token}
                                    style={{ width: "35px" }}
                                />
                                <p> &nbsp;{tokennames[index]}</p>
                            </p>
                        );
                    }
                )}
            </div>
        </>
    );
};

export default DropDown_token_Right;
