import { Address } from '../types/Address';
import { Gaz } from '../types/Gaz';

export interface IPoolImmutable {
    token0: Address;
    token1: Address;
    gaz: Gaz;
};