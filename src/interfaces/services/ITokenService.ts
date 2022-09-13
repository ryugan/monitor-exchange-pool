import { BigNumberish } from 'ethers';
import { Address } from '../../types/Address';
import { Token } from '../../types/Token';

export interface ITokenService {

    /**
     * Initialize the service
    */
    init(): Promise<void>

    /**
     * Get token address
    */
    getTokenAddress(): Address;    

    /**
     * Get token name
    */
    getTokenName(): Token;

    /**
     * Get token decimals
    */
    getTokenDecimals(): BigNumberish;

    /**
     * Get token price
    */
    getPrice(): Promise<Number>
}