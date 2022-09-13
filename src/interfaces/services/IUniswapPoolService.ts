import { Address } from '../../types/Address';
import { Token } from '../../types/Token';

export interface IUniswapPoolService {
    /**
     * Initialise the service
    */
    init(): Promise<void>

    /**
     * Get pool name
    */
    getPoolName(): Token;

    /**
     * Get pool address
    */
    getPoolAddress(): Address;

    /**
     * Get token name 0
    */
    getTokenName0(): Token;

    /**
     * Get token name 1
    */
     getTokenName1(): Token;

    /**
     * Get standard price (for an amount of 1)
    */
    getStandardPrice(): Promise<Number>;

    /**
     * Get price for an amount
    */
    getPrice(inputAmount: number): Promise<Number>;
};