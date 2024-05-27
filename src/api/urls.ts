export const URL = {
  chains: {
    list: '/networks',
    exist: '/aaAccountNetworks'
  },
  search: {
    search: (net) => {
      return `/network/${net}/search`
    }
  },
  stat: {
    dailySummary: (net) => {
      return `/network/${net}/dailyStatistic`
    },
    userops: (net) => {
      return `/network/${net}/userops`
    },
    topBundler: (net) => {
      return `/network/${net}/topBundler`
    },
    topPaymaster: (net) => {
      return `/network/${net}/topPaymaster`
    },
    topFactory: (net) => {
      return `/network/${net}/topFactory`
    },
    txnDominance: (net) => {
      return `/network/${net}/aaTxnDominance`
    },
    useropType: (net) => {
      return `/network/${net}/userOpType`
    },
    contractInteract: (net) => {
      return `/network/${net}/aaContractInteract`
    },
    bundlerList: (net) => {
      return `/network/${net}/bundlers`
    },
    paymasterList: (net) => {
      return `/network/${net}/paymasters`
    },
    factoryList: (net) => {
      return `/network/${net}/factories`
    },
    latestUserOps: (net) => {
      return `/network/${net}/latestUserOps`
    },
    blockList: (net) => {
      return `/network/${net}/aaBlocks`
    },
    deployedAccounts: (net, factory) => {
      return `/network/${net}/factory/${factory}/deployedAccounts`
    },
    bundlerDetail: (net, bundler) => {
      return `/network/${net}/bundler/${bundler}`
    },
    paymasterDetail: (net) => {
      return `/network/${net}/paymasterOverview`
    },
    factoryDetail: (net, factory) => {
      return `/network/${net}/factory/${factory}`
    },
    accountDetail: (net) => {
      return `/network/${net}/aaAccountInfo`
    },
    aaTransactionList: (net) => {
      return `/network/${net}/aaTransactionList`
    },
    useropDetail: (net) => {
      return `/network/${net}/useropsAnalysis`
    },
    txDetail: (net) => {
      return `/network/${net}/aaTransaction`
    },
    useropsInTx: (net) => {
      return `/network/${net}/useropsAnalysisList`
    },
    blockMev: (net) => {
      return `/network/${net}/block/mev`
    },
    bundlerMev: (net) => {
      return `/network/${net}/bundler/mev`
    },
    latestAttacks: (net) => {
      return `/network/${net}/monitor/listMev`
    },
    mevTransaction: (net) => {
      return `/network/${net}/mevTransaction`
    },
    mevInfo: (net) => {
      return `/network/${net}/monitor/mevInfo`
    }
  },
  whale: {
    overview: (net) => {
      return `/network/${net}/whaleOverview`
    },
    rank: (net) => {
      return `/network/${net}/topWhale`
    },
    chart: (net) => {
      return `/network/${net}/whaleChart`
    }
  },
  monitor: {
    overview: (net) => {
      return `/network/${net}/monitor/assetDetail`
    },
    addMonitor: (net) => {
      return `/network/${net}/addMonitor`
    },
    removeMonitor: (net) => {
      return `/network/${net}/removeMonitor`
    },
    trackerList: (net) => {
      return `/network/${net}/monitor/trackerList`
    },
    accountType: (net) => {
      return `/network/${net}/monitor/accountType`
    }
  }
}
