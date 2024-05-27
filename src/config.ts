import { http, createConfig, fallback } from '@wagmi/vue'
import { mainnet } from '@wagmi/core/chains'
import { coinbaseWallet, walletConnect, injected } from '@wagmi/vue/connectors'

export const projectId = '4e56130e4b3384fe57facfe9c1755542'

export const metadata = {
  name: 'AA Explorer',
  description: 'AA Explorer',
  url: 'https://aaexplorer.com',
  icons: ['https://static.blockpi.io/images/aaexplorer.svg']
}

export const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: fallback([
      http('https://ethereum.blockpi.network/v1/rpc/public'),
      http()
    ])
  },
  connectors: [
    walletConnect({ projectId, metadata, showQrModal: false }),
    injected({ shimDisconnect: true }),
    coinbaseWallet({
      appName: metadata.name,
      appLogoUrl: metadata.icons[0]
    })
  ]
})
