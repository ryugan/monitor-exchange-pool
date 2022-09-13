"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.getPoolImmutables = exports.getABI = exports.getPoolContract = exports.getTokenContract = exports.getContract = exports.getProvider = void 0;
const ethers_1 = require("ethers");
const axios_1 = __importDefault(require("axios"));
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: __dirname + '/.env' });
const urlGetABIEtherscan = 'https://api.etherscan.io/api?module=contract&action=getabi&address={0}&apikey={1}';
/**
 * Get the provider
*/
function getProvider() {
    return new ethers_1.ethers.providers.JsonRpcProvider(process.env.INFURA_URL);
}
exports.getProvider = getProvider;
/**
 * Get contract for a contract
*/
function getContract(address, abi, provider) {
    return new ethers_1.ethers.Contract(address, abi, provider);
}
exports.getContract = getContract;
/**
 * Get contract for a token
*/
function getTokenContract(tokenAddress, abi, provider) {
    return getContract(tokenAddress, abi, provider);
}
exports.getTokenContract = getTokenContract;
/**
 * Get contract for a pool
*/
function getPoolContract(poolAddress, abi, provider) {
    return getContract(poolAddress, abi, provider);
}
exports.getPoolContract = getPoolContract;
/**
 * Get ABI for an address
*/
function getABI(address) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = urlGetABIEtherscan.replace('{0}', address).replace('{1}', process.env.ETHERSCAN_API_KEY);
        const result = yield axios_1.default.get(url);
        return JSON.parse(result.data.result);
    });
}
exports.getABI = getABI;
/**
 * Get a pool immutable result
*/
function getPoolImmutables(poolContract) {
    return __awaiter(this, void 0, void 0, function* () {
        const [token0, token1, gaz] = yield Promise.all([
            poolContract.token0(),
            poolContract.token1(),
            poolContract.fee()
        ]);
        return {
            token0: token0,
            token1: token1,
            gaz: gaz,
        };
    });
}
exports.getPoolImmutables = getPoolImmutables;
//# sourceMappingURL=contractHelper.js.map