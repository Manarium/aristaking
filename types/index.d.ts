import { providers } from 'ethers'
declare global {
  interface Window {
    web3?: providers.ExternalProvider & providers.Web3Provider
    ethereum?: providers.ExternalProvider & providers.Web3Provider
  }
}
