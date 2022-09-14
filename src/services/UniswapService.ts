import IUniswapV3Pool from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json';
import { IPoolContract } from '../interfaces/contrats/IPoolContract';
import { IUniswapService } from '../interfaces/services/IUniswapService';
import { IUniswapPoolService } from '../interfaces/services/IUniswapPoolService';
import { UniswapPoolService } from './UniswapPoolService';
import UniswapConfig from '../configs/uniswapConfig.json';
import { UniswapConfigModel } from '../models/UniswapConfigModel';
import { getProvider, getPoolContract } from '../helpers/contractHelper';

export class UniswapService implements IUniswapService {

    private uniswapPoolServices: IUniswapPoolService[] = [];

    /**
     * Initialise the service
    */
     public async init(): Promise<void> {

        const pools: UniswapConfigModel[] = UniswapConfig.pools.filter(p => p.actif);

        if (!pools.length) {
            return;
        }

        const provider = getProvider();
        const initPools: Promise<void>[] = [];

        for (const pool of pools) {

            const poolContract: IPoolContract = getPoolContract(pool.address, IUniswapV3Pool.abi, provider);
            const uniswapPoolService: IUniswapPoolService = new UniswapPoolService(poolContract); 

            this.uniswapPoolServices.push(uniswapPoolService);
            initPools.push(uniswapPoolService.init());
        }

        await Promise.all(initPools);
     }

    /**
     * Log pools's informations
    */
     public async log(): Promise<void> {

        console.clear();
        console.log('============');
        console.log('Start listenning');
        console.log();

        for (const uniswapPoolService of this.uniswapPoolServices) {

            const inputAmount = 1;
            const ouputAmount = await uniswapPoolService.getPrice(inputAmount);
            const token0 = uniswapPoolService.getTokenName0();
            const token1 = uniswapPoolService.getTokenName1();

            console.log('============');
            console.log(`${uniswapPoolService.getPoolName()} - ${uniswapPoolService.getPoolAddress()}`);
            console.log('============');
            console.log(`${inputAmount} ${token0} can be swapped for ${ouputAmount} ${token1}`);
            console.log('============');
            console.log();
        }

        console.log();
        console.log('End listenning');
        console.log('============');
     }
}