import { Contract, BigNumberish } from 'ethers';

import { Token } from '../types/Token';

export interface ITokenContract extends Contract {
    symbol(): Promise<Token>;
    decimals(): Promise<BigNumberish>;
};