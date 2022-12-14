import { ethers, Contract, BigNumber, BigNumberish } from 'ethers';

import Quoter from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json';
import OracleLibrary from '@uniswap/v3-periphery/artifacts/contracts/libraries/OracleLibrary.sol/OracleLibrary.json';

import { getProvider, getContract, getTokenContract, getABI, getPoolImmutables } from '../helpers/contractHelper';

import { ABI } from '../types/ABI';
import { Address } from '../types/Address';
import { Token } from '../types/Token';

import { ITokenContract } from '../interfaces/contrats/ITokenContract';
import { IPoolContract } from '../interfaces/contrats/IPoolContract';
import { ITokenService } from '../interfaces/services/ITokenService';
import { IUniswapPoolService } from '../interfaces/services/IUniswapPoolService';
import { IPoolImmutable } from '../interfaces/IPoolImmutable';
import { TokenService } from '../services/TokenService';

const quoterAddress = '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6'; // Contrat de devis des prix
const provider = getProvider();

export class UniswapPoolService implements IUniswapPoolService {

    private poolContract: IPoolContract;
    private quoterContract: Contract;

    private tokenService0: ITokenService;
    private tokenService1: ITokenService;
   
    /**
     * Get token address 0
    */
    private getTokenContractAddress0(): Address {
        return this.tokenService0.getTokenAddress();
    }
    
    /**
     * Get token contract address 1
    */
    private getTokenContractAddress1(): Address {
        return this.tokenService1.getTokenAddress();
    }

    /**
     * Get token address 0
    */
    private async getPoolTokenAddress0(): Promise<Address> {
        return await this.poolContract.token0();
    }

    /**
     * Get token address 1
    */
    private async getPoolTokenAddress1(): Promise<Address> {
        return await this.poolContract.token1();
    }

    /**
     * Get token contract 0
    */
    private async getTokenContract0(): Promise<ITokenContract> {
        const tokenAddress0 = await this.getPoolTokenAddress0();
        const tokenAbi0: ABI = await getABI(tokenAddress0);
        return getTokenContract(tokenAddress0, tokenAbi0, provider);
    }

    /**
     * Get token contract 1
    */
    private async getTokenContract1(): Promise<ITokenContract> {
        const tokenAddress1 = await this.getPoolTokenAddress1();
        const tokenAbi1: ABI = await getABI(tokenAddress1);

        return getTokenContract(tokenAddress1, tokenAbi1, provider);
    }

    /**
     * Get input amount (with this token 0 decimals)
    */
    private getInputAmount(inputAmount: number): BigNumber {
        const tokenDecimals = this.tokenService0.getTokenDecimals();
        return ethers.utils.parseUnits(inputAmount.toString(), tokenDecimals);
    }

    /**
     * Get ouput amount (with this token 1 decimals)
    */
    private async getOuputAmount(inputAmount: number): Promise<Number> {
        const immutables: IPoolImmutable = await getPoolImmutables(this.poolContract);
        const amountIn: BigNumber = this.getInputAmount(inputAmount);
        const quotedAmountOut: BigNumberish = await this.quoterContract.callStatic.quoteExactInputSingle(immutables.token0, immutables.token1, immutables.gaz, amountIn, 0);
        const tokenDecimals = this.tokenService1.getTokenDecimals();

        return parseFloat(ethers.utils.formatUnits(quotedAmountOut, tokenDecimals));
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

        this.tokenService0 = new TokenService(tokenContract0);
        this.tokenService1 = new TokenService(tokenContract1);
        this.quoterContract = getContract(quoterAddress, Quoter.abi, provider);

        await Promise.all([this.tokenService0.init(), this.tokenService1.init()]);
    }

    /**
     * Get pool name
    */
    public getPoolName(): string {
        return `${this.getTokenName0()} / ${this.getTokenName1()}`;
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
        return this.tokenService0.getTokenName();
    }

    /**
     * Get token name 1
    */
     public getTokenName1(): Token {
        return this.tokenService1.getTokenName();
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