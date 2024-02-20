export const TABLE_SORT_MAP = {
  ascending: '1',
  descending: '-1'
}

export const SORT_FIELD_MAP = {
  bundlerList: {
    bundlesNum: 1,
    successRate: 2,
    successRateD1: 3,
    userOpsNum: 4,
    bundlesNumD1: 5,
    feeEarnedD1: 6
  },
  paymasterList: {
    userOpsNum: 1,
    userOpsNumD1: 2,
    reserve: 3,
    gasSponsored: 4
  },
  factoryList: {
    accountNum: 1,
    accountNumD1: 2,
    dominance: 3
  }
}
