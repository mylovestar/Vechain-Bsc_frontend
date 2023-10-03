import React, { useEffect, useState } from 'react';

type DropDownProps = {
chains: string[];
chainnames: string[];
showDropDown: boolean;
toggleDropDown_chain: Function;
chainSelection: Function;
};

const DropDown: React.FC<DropDownProps> = ({
    chains,
    chainnames,
    chainSelection
}: DropDownProps): JSX.Element => {
    const [showDropDown, setShowDropDown] = useState<boolean>(false);

    /**
     * Handle passing the chain name
     * back to the parent component
     *
     * @param chain  The selected chain
     */
    const onClickHandler = (chain: string): void => {
        chainSelection(chain);
    };

    useEffect(() => {
        setShowDropDown(showDropDown);
    }, [showDropDown]);


    return (
        <>
            <div className={showDropDown ? 'dropdown_ChainLeft' : 'dropdown_ChainLeft active'}>
                {chains.map(
                    (chain: string, index: number): JSX.Element => {
                        return (
                            <p
                                key={index}
                                onClick={(): void => {
                                    onClickHandler(chain);
                                }}
                                style={{ 'display': 'flex' }}
                            >
                                <img
                                    src={chain}
                                    style={{ width: "25px" }}
                                />
                                <p> &nbsp; {chainnames[index]}</p>
                            </p>
                        );
                    }
                )}
            </div>
        </>
    );
};

export default DropDown;
