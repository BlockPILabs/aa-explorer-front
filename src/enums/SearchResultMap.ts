export const SEARCH_RESULT_MAP = {
  'Wallet account': {
    value: 'address',
    key: 'account',
    route: { name: 'AccountInfo' },
    group: 'Wallet Account'
  },
  Bundler: {
    value: 'address',
    key: 'bundler',
    route: { name: 'BundlerInfo' }
  },
  Paymaster: {
    value: 'address',
    key: 'paymaster',
    route: { name: 'PaymasterInfo' }
  },
  Factory: {
    value: 'address',
    key: 'factory',
    route: { name: 'FactoryInfo' }
  },
  Block: {
    value: 'blockNumber',
    key: 'blockNumber',
    route: { name: 'BlockInfo' }
  },
  UserOps: {
    value: 'hash',
    key: 'userop',
    route: { name: 'UseropInfo' },
    query: 'tx',
    queryKey: 'txHash'
  },
  'Txn hash': {
    value: 'txHash',
    key: 'tx',
    route: { name: 'TxInfo' },
    group: 'Txn Hash'
  }
}
