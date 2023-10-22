

<template>
  <head>
    <link rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  </head>
  <div class="app">

    <h1 class="">NFT MINT APP</h1>
    <div class="">
      <button v-if="connectedAccount == zeroAddress"
              @click="connect"
              class="wallet-button">CONNECT</button>
      <button v-else
              @click="connect"
              class="wallet-button">{{ shortAddress(connectedAccount) }}</button>
    </div>
    <div class="form">
      <button v-if="connectedAccount == zeroAddress"
              @click="connect"
              class="button">Connect Your Wallet</button>
    </div>
    <div class="main-row">
      <h1 class="title">General Info</h1>

      <label>NAME:</label>
      <input v-model="name"
             placeholder="">
      <div>
        <input type="file"
               @change="handleImageUpload"
               accept="image/*" />
        <div v-if="imageUrl"
             class="image-preview">
          <img :src="imageUrl"
               alt="Preview" />
        </div>

      </div>
    </div>
    <!-- Attributes -->

    <div class="main-row">
      <div class="row">
        <input v-model="attribute1"
               placeholder="key">
        <input v-model="key1"
               placeholder="value">
      </div>
      <div class="row">
        <input v-model="attribute2"
               placeholder="key">
        <input v-model="key2"
               placeholder="value">
      </div>

    </div>

    <div class="main-row">

      <label>Price</label>
      <br>
      <label>Amount</label>

      <input v-modal="price"
             placeholder="Amount">

    </div>
    <button @click="mint"
            class="mintButton">MINT</button>
  </div>
</template>
<script setup lang="ts">

import detectEthereumProvider from '@metamask/detect-provider';
import { computed, onMounted, ref } from "@vue/runtime-core";
import { useNetworkStore } from './stores/NetworkStore';
import { useNftStore } from './stores/NftStore';

let zeroAddress = "0x0000000000000000000000000000000000000000";
let currentAccount: any = computed(() => null);
const connectedAccount = computed(() => useNetworkStore().userAddress)

let provider: any = computed(() => null);
const isLoading = ref(false);
const name = ref();

// Metadata Attributes
const attribute1 = ref();
const key1 = ref();
const attribute2 = ref();
const key2 = ref();
const price = ref("0.001");

const imageUrl = ref<string | null>(null);

const handleImageUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = () => {
      imageUrl.value = reader.result as string;
    };
    reader.readAsDataURL(file);
    try {
      await uploadImage();

    } catch (error) {
      console.log(error)
    }

  } else {
    imageUrl.value = null;
    alert('Please upload a valid image file.');
  }
};


async function uploadImage() {
  await useNftStore().storeNFT(attribute1.value, key1.value, attribute2.value, key2.value, name.value, 'test2');
}
async function mint() {
  await useNftStore().mintNFT(price.value);
}

onMounted(async () => {
  console.log("NFT app mounted :)");
  provider = await detectEthereumProvider();
  if (provider) {
    await startApp(provider)
  } else {
    console.log('connnect')
  }
});



// WALLET CONFIG
function startApp(provider: any) {
  // If the provider returned by detectEthereumProvider is not the same as
  // window.ethereum, something is overwriting it, perhaps another wallet.
  if (provider !== window.ethereum) {
    console.error('Do you have multiple wallets installed?');
  }
  window.ethereum.on('chainChanged', handleChainChanged);
  window.ethereum.on('accountsChanged', handleAccountsChanged);
  window.ethereum.on('disconnect', handleAccountsChanged);
}

function handleChainChanged(_chainId: any) {
  // We recommend reloading the page, unless you must do otherwise
  window.location.reload();
}

if (window.ethereum) {
  window.ethereum
    .request({ method: 'eth_accounts' })
    .then(handleAccountsChanged)
    .catch((err: any) => {
      console.error(err);
    });

}
function handleAccountsChanged(accounts: any) {
  if (accounts.length === 0) {
    // MetaMask is locked or the user has not connected any accounts
    console.log('Please connect to MetaMask.');
  } else if (accounts[0] !== currentAccount) {
    useNetworkStore().bootstrapWeb3(provider);
    useNetworkStore().setUserAddress({ address: accounts[0] });
    currentAccount = accounts[0];
  }
}

function connect() {
  if (window.ethereum) {
    window.ethereum
      .request({ method: 'eth_requestAccounts' })
      .then(handleAccountsChanged)
      .catch((err: any) => {
        if (err.code === 4001) {
          // EIP-1193 userRejectedRequest error
          // If this happens, the user rejected the connection request.
          console.log('Please connect your wallet.');

        } else {
          console.error(err);
        }
      })
  }
  else {
    console.log('No web3 provider detected. Install Metamask or another in-browser web3 wallet to access the App.');

  }
}
const shortAddress = (addr: string): string => {
  if (!addr) {
    return "";
  }
  return (
    addr.substring(0, 6) +
    "..." +
    addr.substring(addr.length - 4, addr.length + 1)
  );
};
</script>
<style scoped></style>
./stores/NftStore