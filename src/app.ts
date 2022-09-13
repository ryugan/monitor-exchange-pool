import { IUniswapService } from './interfaces/IUniswapService';
import { UniswapService } from './services/UniswapService';

main();

async function main() {

  const uniswapService: IUniswapService = new UniswapService();
  await uniswapService.init();
  await uniswapService.log();
}