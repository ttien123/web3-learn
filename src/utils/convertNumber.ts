import { ethers } from "ethers";

export const handleConvertToToken = (value: string) => {
    return ethers.formatUnits(value, 18);
}