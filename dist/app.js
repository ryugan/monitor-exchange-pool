"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const IUniswapV3Pool_json_1 = __importDefault(require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json"));
const UniswapPoolService_1 = require("./services/UniswapPoolService");
const contractHelper_1 = require("./helpers/contractHelper");
// Server config
const PORT = process.env.PORT || 5000;
const app = (0, express_1.default)();
const server = http_1.default.createServer(app).listen(PORT, () => console.log(`Listening on ${PORT}`));
main();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Start listen');
        const wBTCETHpoolAddress = '0xcbcdf9626bc03e24f779434178a73a0b4bad62ed'; // info.uniswap.org // todo dico (enum / address)
        console.log('Before provider');
        const provider = (0, contractHelper_1.getProvider)();
        console.log('After getProvider');
        const wBTCETHPoolContract = (0, contractHelper_1.getPoolContract)(wBTCETHpoolAddress, IUniswapV3Pool_json_1.default.abi, provider);
        console.log('After getPoolContract');
        const uniswapPoolService = new UniswapPoolService_1.UniswapPoolService(wBTCETHPoolContract);
        console.log('After new UniswapPoolService');
        uniswapPoolService.init();
        console.log('After init');
        const inputAmount = 1;
        const amountOut = yield uniswapPoolService.getPrice(inputAmount);
        const token0 = uniswapPoolService.getTokenName0();
        const token1 = uniswapPoolService.getTokenName1();
        console.log('============');
        console.log(`${inputAmount} ${token0} can be swapped for ${amountOut} ${token1}`);
        console.log('============');
    });
}
//# sourceMappingURL=app.js.map