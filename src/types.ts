import BigNumber from 'bignumber.js';
import { Merge } from 'ts-essentials';
import { Token } from './lib/token';
import { SwapSide, ContractMethod, PricingMethod } from './constants';

type Symbol = string;
type Address = string;
type AddressOrSymbol = Address | Symbol;
type PriceString = string;
type NumberAsString = string;

type NetworkID = 1 | 3 | 42 | 4 | 56 | 137;

const ETHER_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

const UNLIMITED_ALLOWANCE = new BigNumber(2).pow(256).minus(1).toFixed();

type APIQuery = {
  [name: string]: string | number | boolean;
};

type DexConf = { exchange: string; targetExchange?: string };

type Adapters = {
  augustus: { exchange: Address };
  [adapter: string]: DexConf;
};

type Allowance = {
  tokenAddress: Address;
  allowance: string;
};

type APIError = {
  message: string;
  status?: number;
};

type Transaction = {
  from: Address;
  to: Address;
  value: string;
  data: string;
  chainId: number;
};

type Rate = {
  destAmount: PriceString;
  exchange: string;
  percent: NumberAsString;
  srcAmount: PriceString;
  data?: any;
};

type OthersRate = {
  exchange: string;
  rate: NumberAsString;
  unit: NumberAsString;
};

type OnChainOptimalRates = {
  amount: PriceString;
  bestRoute: Rate[];
  others?: OthersRate[];
};

type SimpleComputedRate = {
  exchange: string;
  rate: NumberAsString;
  slippage?: NumberAsString;
  unit?: NumberAsString;
  data?: any;
};

type SimpleComputedRateWithFeeSell = Merge<
  SimpleComputedRate,
  {
    rateFeeDeducted: NumberAsString;
    unitFeeDeducted?: NumberAsString;
  }
>;

type SimpleComputedRateWithFeeBuy = Merge<
  SimpleComputedRate,
  {
    rateNoFeeAdded: NumberAsString;
    unitNoFeeAdded?: NumberAsString;
  }
>;

type SimpleComputedRateWithFee =
  | SimpleComputedRateWithFeeSell
  | SimpleComputedRateWithFeeBuy;

type OptimalRate = {
  exchange: string;
  address?: string;
  srcAmount: NumberAsString;
  destAmount: NumberAsString;
  percent: NumberAsString;
  rate?: NumberAsString;
  data?: any;
};

type OptimalRateWithFeeSell = Merge<
  OptimalRate,
  {
    destAmountFeeDeducted: NumberAsString;
  }
>;

type OptimalRateWithFeeBuy = Merge<
  OptimalRate,
  {
    srcAmountNoFeeAdded: NumberAsString;
    destAmountNoFeeAdded: NumberAsString;
  }
>;

type OptimalRateWithFee = OptimalRateWithFeeSell | OptimalRateWithFeeBuy;

type OptimalRoute = {
  percent: NumberAsString;
  route: OptimalRate[][];
};

type OptimalRates = {
  blockNumber: number;
  destAmount: string;
  srcAmount: string;
  priceWithSlippage?: string;
  multiPath?: boolean;
  megaPath?: boolean;
  bestRoute: OptimalRate[];
  bestRouteGasCostUSD?: NumberAsString;
  contractMethod: ContractMethod;
  adapterVersion: string;
  bestRouteGas?: NumberAsString;
  multiRoute?: OptimalRate[][];
  megaRoute?: OptimalRoute[];
  others: SimpleComputedRate[];
  fromUSD?: NumberAsString;
  toUSD?: NumberAsString;
  side: SwapSide;
  details?: {
    routes?: string[];
    tokenFrom: string;
    tokenTo: string;
    connector?: string;
    srcAmount: NumberAsString;
    destAmount: NumberAsString;
  };
};

type OptimalRatesWithPartnerFeesSell = Merge<
  OptimalRates,
  {
    side: SwapSide.SELL;
    destAmountFeeDeducted: string;
    bestRoute: OptimalRateWithFeeSell[];
    multiRoute?: OptimalRateWithFeeSell[][];
    others: SimpleComputedRateWithFeeSell[];
    toUSDFeeDeducted?: NumberAsString;
  }
>;

type OptimalRatesWithPartnerFeesBuy = Merge<
  OptimalRates,
  {
    side: SwapSide.BUY;
    srcAmountNoFeeAdded: string;
    destAmountNoFeeAdded: string;
    bestRoute: OptimalRateWithFeeBuy[];
    multiRoute?: OptimalRateWithFeeBuy[][];
    others: SimpleComputedRateWithFeeBuy[];
    fromUSDNoFeeAdded?: NumberAsString;
    toUSDNoFeeAdded?: NumberAsString;
  }
>;

type OptimalRatesWithPartnerFees =
  | OptimalRatesWithPartnerFeesSell
  | OptimalRatesWithPartnerFeesBuy;

class User {
  constructor(
    public address: Address,
    public network: NetworkID = 1,
    public tokens?: Token[],
  ) {}
}

type RateOptions = {
  excludeDEXS?: string;
  includeDEXS?: string;
  excludePools?: string;
  excludePricingMethods?: PricingMethod[];
  excludeContractMethods?: ContractMethod[];
  includeContractMethods?: ContractMethod[];
  adapterVersion?: string;
  referrer?: string;
};

type TransactionRoute = {
  exchange: Address;
  targetExchange: Address | undefined;
  payload: string;
  networkFee: NumberAsString;
};

type TransactionSellRoute = Merge<
  TransactionRoute,
  { percent: NumberAsString }
>;

type TransactionPath<T extends TransactionRoute> = {
  to: Address;
  totalNetworkFee: NumberAsString;
  routes: T[];
};

type TransactionBuyRoute = Merge<
  TransactionRoute,
  {
    fromAmount: PriceString;
    toAmount: PriceString;
  }
>;

type TransactionMegaPath<T extends TransactionRoute> = {
  fromAmountPercent: NumberAsString;
  path: TransactionPath<T>[];
};

type TransactionBuyParams = {
  value: PriceString;
  fromToken: Address | undefined;
  toToken: Address | undefined;
  fromAmount: PriceString;
  toAmount: PriceString;
  expectedAmount: PriceString;
  route: TransactionBuyRoute[];
  beneficiary: Address;
  referrer: string;
};

type LegacyTransactionSellParams = {
  fromToken: Address;
  toToken: Address;
  fromAmount: PriceString;
  toAmount: PriceString;
  expectedAmount: PriceString;
  path: TransactionPath<TransactionSellRoute>[];
  mintPrice: string;
  beneficiary: Address;
  donationBasisPoints: string;
  referrer: string;
};

type TransactionSellParams = {
  fromToken: Address;
  toToken: Address;
  fromAmount: PriceString;
  toAmount: PriceString;
  expectedAmount: PriceString;
  path: TransactionPath<TransactionSellRoute>[];
  beneficiary: Address;
  referrer: string;
};

type SimpleSwapTransactionParams = {
  fromToken: Address;
  toToken: Address;
  fromAmount: string;
  toAmount: string;
  expectedAmount: string;
  callees: string[];
  exchangeData: string;
  startIndexes: number[];
  values: string[];
  beneficiary: Address;
  referrer: string;
};

type TransactionData = {
  from: Address;
  to: Address;
  data: string;
  chainId: number;
  value: PriceString;
  gasPrice?: PriceString;
  gas?: NumberAsString;
};

type BuildOptions = {
  ignoreChecks?: boolean;
  onlyParams?: boolean;
  simple?: boolean;
  gasPrice?: PriceString;
  useReduxToken?: boolean;
};

export {
  Symbol,
  Address,
  AddressOrSymbol,
  PriceString,
  NumberAsString,
  NetworkID,
  ETHER_ADDRESS,
  UNLIMITED_ALLOWANCE,
  APIQuery,
  DexConf,
  Adapters,
  Allowance,
  APIError,
  Transaction,
  Rate,
  OthersRate,
  OnChainOptimalRates,
  LegacyTransactionSellParams,
  SimpleComputedRate,
  SimpleComputedRateWithFeeSell,
  SimpleComputedRateWithFeeBuy,
  SimpleComputedRateWithFee,
  OptimalRate,
  OptimalRateWithFee,
  OptimalRateWithFeeSell,
  OptimalRateWithFeeBuy,
  OptimalRates,
  OptimalRatesWithPartnerFees,
  OptimalRatesWithPartnerFeesSell,
  OptimalRatesWithPartnerFeesBuy,
  OptimalRoute,
  User,
  RateOptions,
  TransactionRoute,
  TransactionPath,
  TransactionMegaPath,
  TransactionSellRoute,
  TransactionBuyRoute,
  TransactionBuyParams,
  TransactionSellParams,
  SimpleSwapTransactionParams,
  TransactionData,
  BuildOptions,
};
