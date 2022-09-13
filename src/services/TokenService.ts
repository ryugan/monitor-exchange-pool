import { BigNumberish } from 'ethers';
import { Address } from '../types/Address';
import { Token } from '../types/Token';

import { ITokenContract } from '../interfaces/contrats/ITokenContract';
import { ITokenService } from '../interfaces/services/ITokenService';

export class TokenService implements ITokenService {

    private tokenContract: ITokenContract;

    private tokenName: Token;
    private tokenDecimals: BigNumberish;

    /**
     * Creates an instance of UniswapPoolService.
    */
    public constructor(tokenContract: ITokenContract) {
        this.tokenContract = tokenContract;
    }

    /**
     * Initialize the service
    */
    public async init(): Promise<void> {
        this.tokenName = await this.tokenContract.symbol();
        this.tokenDecimals = await this.tokenContract.decimals();
    }

    /**
     * Get token address
    */
    public getTokenAddress(): Address {
        return this.tokenContract.address;
    }

    /**
     * Get token name
    */
     public getTokenName(): Token {
        return this.tokenName;
     }

    /**
     * Get token decimals
    */
    public getTokenDecimals(): BigNumberish {
        return this.tokenDecimals;
    }
 
    /**
     * Get token price
    */
    public async getPrice(): Promise<Number> {
        return 0; // TODO via l'unité
    }
}