import { defineStore } from 'pinia'
import { useNetworkStore } from './NetworkStore';
import { ethers, utils } from 'ethers';
import Toast, { useToast } from 'vue-toastification';
import { NFTStorage, File } from 'nft.storage'
import image1 from "@/assets/image1.jpg";
import image2 from "@/assets/image2.jpg";
import NFT from '../abis/NFT.json'

// The 'path' module provides helpers for manipulating filesystem paths
const toast = useToast();
interface NFTState {
    IPFSHash: string | undefined
}
const NFT_STORAGE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEU2N0VkOWI2NGM4NWQ2YjhGNGFBMTMxZTZFRjE2MDdhZDZBNkVhYmYiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY5Nzk2MDE0MzkwNCwibmFtZSI6InRlc3QifQ.brlmQOH8xkUBl2RJm2qQ2dgUFQPrH9jTYLtt6G_id14'
function nftContract() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(NFT.address, NFT.abi, signer);
}
const useNftStore = defineStore('NftStore', {
    state: (): NFTState => ({
        IPFSHash: undefined
    }),
    getters: {},
    actions: {

        async uploadJsonToIPFS() {

            const json = {
                borrower: "Oxdef789..",
                asset: "DAI",
                amount: 75.0,
                collateral: "ETH",
                collateralAmount: 3.0,
                duration: 15
            }
        },
        async fileFromPath(filePath: string): Promise<File> {
            // Fetch the file content using fetch API
            const response = await fetch(filePath);

            // Read the response body as ArrayBuffer
            const content: ArrayBuffer = await response.arrayBuffer();

            // Extract the file name from the path
            const fileName: string = filePath.split('/').pop() || 'unknown';

            // Determine the MIME type (you may need additional logic here based on file extensions)
            const type: string | null = response.headers.get('content-type') || 'application/octet-stream';

            // Create a Blob from the ArrayBuffer
            const blob = new Blob([content], { type: type });

            // Create a File object from the Blob
            const file = new File([blob], fileName, { type: type });

            return file;
        }
        ,
        async storeNFT(att1: string, key1: string, att2: string, key2: string, name: string, description: string) {
            console.log(NFT_STORAGE_KEY, 'KEYyY')
            // load the file from disk
            const image = await this.fileFromPath(image1)

            // create a new NFTStorage client using our API key
            const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY })

            try {

            } catch (error) {

            }
            // call client.store, passing in the image & metadata
            const result = await nftstorage.store({
                image,
                name: name,
                description,
                properties: {
                    att1: key1,
                    att2: key2,
                }
            })
            this.IPFSHash = result.url;
        },
        async mintNFT(price: string) {
            try {
                await nftContract().mint(this.IPFSHash, { value: ethers.utils.parseEther(price) })
            } catch (error) {
            }
        }
    },
});

export { useNftStore };