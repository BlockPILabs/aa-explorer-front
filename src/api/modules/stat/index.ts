import { http } from '@/api/request'
import { URL } from '@/api/urls'

export function getDaily(net, params) {
  return http.get(URL.stat.dailySummary(net), {
    params
  })
}

export function getUserOps(net, params) {
  return http.get(URL.stat.userops(net), {
    params
  })
}

export function getTopBundler(net, params) {
  return http.get(URL.stat.topBundler(net), {
    params
  })
}

export function getTopPaymaster(net, params) {
  return http.get(URL.stat.topPaymaster(net), {
    params
  })
}

export function getTopFactory(net, params) {
  return http.get(URL.stat.topFactory(net), {
    params
  })
}

export function getTxnDominance(net, params) {
  return http.get(URL.stat.txnDominance(net), {
    params
  })
}

export function getUseropType(net, params) {
  return http.get(URL.stat.useropType(net), {
    params
  })
}

export function getContractInteract(net, params) {
  return http.get(URL.stat.contractInteract(net), {
    params
  })
}

export function getBundlerList(net, params) {
  return http.get(URL.stat.bundlerList(net), {
    params
  })
}

export function getPaymasterList(net, params) {
  return http.get(URL.stat.paymasterList(net), {
    params
  })
}

export function getFactoryList(net, params) {
  return http.get(URL.stat.factoryList(net), {
    params
  })
}

export function getLatestUserOps(net) {
  return http.get(URL.stat.latestUserOps(net))
}

export function getBlockList(net, params) {
  return http.get(URL.stat.blockList(net), {
    params
  })
}

export function getDeployedAccounts(net, factory, params) {
  return http.get(URL.stat.deployedAccounts(net, factory), {
    params
  })
}

export function getBundlerDetail(net, bundler) {
  return http.get(URL.stat.bundlerDetail(net, bundler))
}

export function getPaymasterDetail(net, params) {
  return http.get(URL.stat.paymasterDetail(net), { params })
}

export function getFactoryDetail(net, factory) {
  return http.get(URL.stat.factoryDetail(net, factory))
}

export function getAccountDetail(net, params) {
  return http.get(URL.stat.accountDetail(net), { params })
}

export function getAATransactionList(net, params) {
  return http.get(URL.stat.aaTransactionList(net), { params })
}

export function getUseropDetail(net, params) {
  return http.get(URL.stat.useropDetail(net), { params })
}

export function getTxDetail(net, params) {
  return http.get(URL.stat.txDetail(net), { params })
}

export function getUseropsInTx(net, params) {
  return http.get(URL.stat.useropsInTx(net), { params })
}
