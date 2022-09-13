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
exports.UniswapPoolService = void 0;
const ethers_1 = require("ethers");
const Quoter_json_1 = __importDefault(require("@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json"));
const contractHelper_1 = require("../helpers/contractHelper");
const quoterAddress = '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6'; // Contrat de devis des prix
const provider = (0, contractHelper_1.getProvider)();
class UniswapPoolService {
    /**
     * Creates an instance of UniswapPoolService.
     */
    constructor(poolContract) {
        this.poolContract = poolContract;
    }
    /**
     * Get token address 0
    */
    getTokenAddress0() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.poolContract.token0();
        });
    }
    /**
     * Get token address 1
    */
    getTokenAddress1() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.poolContract.token1();
        });
    }
    /**
     * Get token contract 0
    */
    getTokenContract0() {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenAddress0 = yield this.getTokenAddress0();
            const tokenAbi0 = yield (0, contractHelper_1.getABI)(tokenAddress0);
            return (0, contractHelper_1.getTokenContract)(tokenAddress0, tokenAbi0, provider);
        });
    }
    /**
     * Get token contract 1
    */
    getTokenContract1() {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenAddress1 = yield this.getTokenAddress1();
            const tokenAbi1 = yield (0, contractHelper_1.getABI)(tokenAddress1);
            return (0, contractHelper_1.getTokenContract)(tokenAddress1, tokenAbi1, provider);
        });
    }
    /**
     * Get input amount (with this token 0 decimals)
    */
    getInputAmount(inputAmount) {
        return ethers_1.ethers.utils.parseUnits(inputAmount.toString(), this.tokenDecimals0);
    }
    /**
     * Get ouput amount (with this token 1 decimals)
    */
    getOuputAmount(inputAmount) {
        return __awaiter(this, void 0, void 0, function* () {
            const quoterContract = (0, contractHelper_1.getContract)(quoterAddress, Quoter_json_1.default.abi, provider);
            const immutables = yield (0, contractHelper_1.getPoolImmutables)(this.poolContract);
            const amountIn = this.getInputAmount(inputAmount);
            const quotedAmountOut = yield quoterContract.callStatic.quoteExactInputSingle(immutables.token0, immutables.token1, immutables.gaz, amountIn, 0);
            return parseFloat(ethers_1.ethers.utils.formatUnits(quotedAmountOut, this.tokenDecimals1));
        });
    }
    /**
     * Initialise the service
    */
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenContract0 = yield this.getTokenContract0();
            const tokenContract1 = yield this.getTokenContract1();
            this.tokenName0 = yield tokenContract0.symbol();
            this.tokenName1 = yield tokenContract1.symbol();
            this.tokenDecimals0 = yield tokenContract0.decimals();
            this.tokenDecimals1 = yield tokenContract1.decimals();
        });
    }
    /**
     * Get pool name
    */
    getPoolName() {
        return `${this.tokenName0} / ${this.tokenName1}`;
    }
    /**
     * Get pool address
    */
    getPoolAddress() {
        return this.poolContract.address;
    }
    /**
     * Get token name 0
    */
    getTokenName0() {
        return this.tokenName0;
    }
    /**
     * Get token name 1
    */
    getTokenName1() {
        return this.tokenName1;
    }
    /**
     * Get standard price (for an amount of 1)
    */
    getStandardPrice() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getPrice(1);
        });
    }
    /**
     * Get price for an amount
    */
    getPrice(inputAmount) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getOuputAmount(inputAmount);
        });
    }
}
exports.UniswapPoolService = UniswapPoolService;
//# sourceMappingURL=UniswapPoolService.js.map