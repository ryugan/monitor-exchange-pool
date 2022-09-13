export interface IUniswapService {

    /**
     * Initialise the service
    */
    init(): Promise<void>;

    /**
     * Log pools's informations
    */
     log(): Promise<void>;
}