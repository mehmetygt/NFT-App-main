import { defineStore } from 'pinia'
import { ethers, utils } from 'ethers';

export interface Network {
    ethereum: any | undefined;
    userAddress: string;
    provider:any
    sentTransactions: {};
}
export const useNetworkStore = defineStore('NetworkStore', {
    state: (): Network => ({
        userAddress: "0x0000000000000000000000000000000000000000",
        ethereum: undefined,
        provider:undefined,
        sentTransactions: {},
    }),
    getters: {
    },
    actions: {
        async setUserAddress(
            payload: { address: string }
        ) {
            this.userAddress = payload.address;

        },
        async setupWeb3() {
            let ethereum = undefined;

            if (window.ethereum) {
                console.log("setting up web3!");
                ethereum = window.ethereum;
            }

        },
        async bootstrapWeb3( payload: { provider: any }) {
            this.provider = payload.provider;
            await this.setupWeb3();
        }
    }
})