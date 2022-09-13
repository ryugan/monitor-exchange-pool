import { ethers, Contract, BigNumber, BigNumberish } from 'ethers';
import Quoter from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json';

import { getProvider, getContract, getTokenContract, getABI, getPoolImmutables } from '../helpers/contractHelper';

import { ABI } from '../types/ABI';
import { Address } from '../types/Address';
import { Token } from '../types/Token';

import { IUniswapPoolService } from '../interfaces/services/IUniswapPoolService';
import { IPoolContract } from '../interfaces/contrats/IPoolContract';
import { ITokenContract } from '../interfaces/contrats/ITokenContract';
import { IPoolImmutable } from '../interfaces/IPoolImmutable';

const quoterAddress = '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6'; // Contrat de devis des prix
const provider = getProvider();

export class UniswapPoolService implements IUniswapPoolService {

    private poolContract: IPoolContract
    private tokenName0: Token
    private tokenName1: Token
    private tokenDecimals0: BigNumberish
    private tokenDecimals1: BigNumberish
   
    /**
     * Get token address 0
    */
    private async getTokenAddress0(): Promise<Address> {
        return await this.poolContract.token0();
    }
    
    /**
     * Get token address 1
    */
    private async getTokenAddress1(): Promise<Address> {
        return await this.poolContract.token1();
    }

    /**
     * Get token contract 0
    */
    private async getTokenContract0(): Promise<ITokenContract> {
        const tokenAddress0 = await this.getTokenAddress0();
        const tokenAbi0: ABI = await getABI(tokenAddress0);
        return getTokenContract(tokenAddress0, tokenAbi0, provider);
    }

    /**
     * Get token contract 1
    */
    private async getTokenContract1(): Promise<ITokenContract> {
        const tokenAddress1 = await this.getTokenAddress1();
        const tokenAbi1: ABI = await getABI(tokenAddress1);

        return getTokenContract(tokenAddress1, tokenAbi1, provider);
    }

    /**
     * Get input amount (with this token 0 decimals)
    */
    private getInputAmount(inputAmount: number): BigNumber {
        return ethers.utils.parseUnits(inputAmount.toString(), this.tokenDecimals0);
    }

    /**
     * Get ouput amount (with this token 1 decimals)
    */
    private async getOuputAmount(inputAmount: number): Promise<Number> {
        const quoterContract: Contract = getContract(quoterAddress, Quoter.abi, provider);
        const immutables: IPoolImmutable = await getPoolImmutables(this.poolContract);
        const amountIn: BigNumber = this.getInputAmount(inputAmount);
        const quotedAmountOut: BigNumberish = await quoterContract.callStatic.quoteExactInputSingle(immutables.token0, immutables.token1, immutables.gaz, amountIn, 0);

        return parseFloat(ethers.utils.formatUnits(quotedAmountOut, this.tokenDecimals1));
    }

    /**
     * Creates an instance of UniswapPoolService.
     */
    public constructor(poolContract: IPoolContract) {
        this.poolContract = poolContract;
    }

    /**
     * Initialise the service
    */
    public async init(): Promise<void> {
        const tokenContract0 = await this.getTokenContract0();
        const tokenContract1 = await this.getTokenContract1();
        this.tokenName0 = await tokenContract0.symbol();
        this.tokenName1 = await tokenContract1.symbol();
        this.tokenDecimals0 = await tokenContract0.decimals();
        this.tokenDecimals1 = await tokenContract1.decimals();
    }

    /**
     * Get pool name
    */
    public getPoolName(): Token {
        return `${this.tokenName0} / ${this.tokenName1}`;
    }

    /**
     * Get pool address
    */
    public getPoolAddress(): Address {
        return this.poolContract.address;
    }

    /**
     * Get token name 0
    */
     public getTokenName0(): Token {
        return this.tokenName0;
    }

    /**
     * Get token name 1
    */
     public getTokenName1(): Token {
        return this.tokenName1;
    }

    /**
     * Get standard price (for an amount of 1)
    */
    public async getStandardPrice(): Promise<Number> {
        return this.getPrice(1);
    }

    /**
     * Get price for an amount
    */
    public async getPrice(inputAmount: number): Promise<Number> {
        return await this.getOuputAmount(inputAmount);
    }
}