import { Contract } from 'ethers';

import { Address } from '../../types/Address';
import { Gaz } from '../../types/Gaz';

export interface IPoolContract extends Contract {
    token0(): Promise<Address>;
    token1(): Promise<Address>;
    fee(): Promise<Gaz>;
};