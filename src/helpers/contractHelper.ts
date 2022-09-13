import { ethers, ContractInterface, providers, Signer, Contract } from 'ethers';
import axios from 'axios';

import { ABI } from '../types/ABI';
import { Address } from '../types/Address';

import { IPoolContract } from '../interfaces/IPoolContract';
import { ITokenContract } from '../interfaces/ITokenContract';
import { IPoolImmutable } from '../interfaces/IPoolImmutable';

import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + '\\..\\configs\\.env' });

const urlInfura_template: string = 'https://mainnet.infura.io/v3/{0}'; 
const urlGetABIEtherscan_template: string = 'https://api.etherscan.io/api?module=contract&action=getabi&address={0}&apikey={1}';

/**
 * Get the provider
*/
function getProvider() {
    const url = urlInfura_template.replace('{0}', process.env.INFURA_KEY);
    return new ethers.providers.JsonRpcProvider(url);
}

/**
 * Get contract for a contract
*/
function getContract(address: Address, abi: ContractInterface, provider: providers.Provider | Signer) : Contract {
    return new ethers.Contract(address, abi, provider);
}

/**
 * Get contract for a token
*/
function getTokenContract(tokenAddress: Address, abi: ContractInterface, provider: providers.Provider | Signer) : ITokenContract {
    return <ITokenContract>getContract(tokenAddress, abi, provider);
}

/**
 * Get contract for a pool
*/
function getPoolContract(poolAddress: Address, abi: ContractInterface, provider: providers.Provider | Signer) : IPoolContract {
    return <IPoolContract>getContract(poolAddress, abi, provider);
}

/**
 * Get ABI for an address
*/
async function getABI(address: Address): Promise<ABI> {
    const url = urlGetABIEtherscan_template.replace('{0}', address).replace('{1}', process.env.ETHERSCAN_API_KEY);
    const result = await axios.get(url);
    
    return JSON.parse(result.data.result);
}

/**
 * Get a pool immutable result
*/
async function getPoolImmutables(poolContract: IPoolContract): Promise<IPoolImmutable> {
    const [token0, token1, gaz] = await Promise.all([
        poolContract.token0(),
        poolContract.token1(),
        poolContract.fee()
    ]);

    return {
        token0: token0,
        token1: token1,
        gaz: gaz,
    }
}

export { getProvider, getContract, getTokenContract, getPoolContract, getABI, getPoolImmutables };