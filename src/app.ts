import { IUniswapService } from './interfaces/services/IUniswapService';
import { UniswapService } from './services/UniswapService';

main();

async function main() {

  const uniswapService: IUniswapService = new UniswapService();
  await uniswapService.init();
  await uniswapService.log();
}