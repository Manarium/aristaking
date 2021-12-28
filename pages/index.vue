<template>
  <v-app>
    <v-app-bar height="60" color="#38b6ff00" clipped-left app elevate-on-scroll>
      <a
        href="https://www.manarium.com/"
        style="height: 100%; display: flex; align-items: center"
        target="blank"
      >
        <v-img
          v-if="smAndUp"
          src="/logo.svg"
          max-height="60"
          max-width="120"
          class="appbar-logo"
        />
        <v-img
          v-else
          src="/logo.svg"
          max-height="50"
          max-width="100"
          class="appbar-logo"
        />
      </a>
      <v-spacer />
      <v-dialog v-model="dialog" max-width="330" content-class="nice-dialog-wrapper">
        <template #activator="{ on, attrs }">
          <v-btn
            class="nice-button connect-button elevation-0"
            color="#00A3ff"
            dark
            large
            v-bind="attrs"
            v-on="on"
          >
            {{ connectButtonLabel }}
            <v-icon v-if="wallet" right>mdi-check</v-icon>
          </v-btn>
        </template>
        <v-card class="nice-card nice-connect">
          <h3 class="nice-title text-center mb-8">Connect using:</h3>
          <div>
            <v-btn
              class="nice-button metamask elevation-0 mb-4"
              :style="
                providerType === 'M'
                  ? 'color: #DC6E3E !important; border-color: #F1DB75 '
                  : ''
              "
              block
              large
              :disabled="providerType === 'M'"
              @click="clickConnectMetamask"
            >
              MetaMask
              <v-icon v-if="providerType === 'M'" right style="color: #dc6e3e !important"
                >mdi-check-circle-outline</v-icon
              >
            </v-btn>
            <v-btn
              class="nice-button walletconnect elevation-0 mb-4"
              height="80px"
              :style="
                providerType === 'W'
                  ? 'color: #7730EC !important; border-color: #001DDC'
                  : ''
              "
              block
              large
              :disabled="providerType === 'W'"
              @click="clickConnectWalletconnect"
            >
              Walletconnect
              <v-icon v-if="providerType === 'W'" right style="color: #7730ec !important"
                >mdi-check-circle-outline</v-icon
              >
            </v-btn>
          </div>
        </v-card>
      </v-dialog>
    </v-app-bar>
    <a :href="snackbar_approve_tx_url" target="_blank" rel="noopener noreferrer">
      <v-snackbar
        :timeout="-1"
        color="info"
        :value="snackbar_approve_tx_url"
        :multi-line="true"
      >
        Transaction sent, please wait...
        <br />
        Click here to see it
        <template #action="{ attrs }">
          <v-btn icon v-bind="attrs" @click.prevent="snackbar_approve_tx_url = ''"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </template>
      </v-snackbar>
    </a>
    <a :href="snackbar_approve_rec_url" target="_blank" rel="noopener noreferrer">
      <v-snackbar
        :timeout="-1"
        color="success"
        :value="snackbar_approve_rec_url"
        :multi-line="true"
      >
        Transaction confirmed! Click here to see it
        <template #action="{ attrs }">
          <v-btn icon v-bind="attrs" @click.prevent="snackbar_approve_rec_url = ''"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </template>
      </v-snackbar>
    </a>
    <v-main>
      <v-row
        justify="center"
        align="center"
        class="mx-0"
        style="padding-inline: 25px !important"
      >
        <v-col
          cols="12"
          sm="11"
          class="px-0"
          style="max-width: 760px !important; margin-inline: 50px !important"
        >
          <div class="alerts-container">
            <v-alert v-if="providerType === 'N'" type="info" text="#000000">
              To perform actions on the page, connect your wallet
            </v-alert>
            <v-alert v-if="loadingMessage" type="info">{{ loadingMessage }}</v-alert>
            <v-alert v-if="errorMessage" type="error">{{ errorMessage }}</v-alert>
            <v-alert v-if="warningMessage" type="warning">{{ warningMessage }}</v-alert>
          </div>
          <h1 v-if="!smAndUp" class="text-center mt-5 manarium_title">
            Manarium Staking App
          </h1>
          <template v-if="!MAX_STAKES || MAX_STAKES.gt(activeStakes.length)">
            <v-container
              v-if="!adding_active && activeStakes.length > 0"
              class="py-0 px-6 px-sm-0"
            >
              <v-btn
                block
                x-large
                outlined
                color="#f7a308"
                class="mb-6 mt-12"
                @click="adding_active = true"
                ><v-icon>mdi-plus</v-icon></v-btn
              >
            </v-container>
            <v-card v-else class="card_wrap" style="">
              <v-container class="d-flex mb-5 card_balance_approved">
                <div>
                  Your wallet balance: <b>{{ BNToNumstr(balanceB) }} ARI</b>
                </div>
                <v-spacer />
                <div>
                  Approved
                  <v-icon size="19" color="#38b6ff">{{
                    approvedEnough ? 'mdi-check' : 'mdi-close'
                  }}</v-icon>
                </div>
              </v-container>
              <h1 v-if="smAndUp" class="text-center manarium_title">
                Manarium Staking App
              </h1>
              <h2 v-if="smAndUp" class="text-center" style="font-size: 14px !important">
                Choose your period:
              </h2>
              <v-container class="pa-0 d-flex justify-center nice-narrower">
                <!-- <v-row> -->
                <div class="buttons-input-div">
                  <v-btn-toggle
                    v-model="daysOption"
                    class="choose"
                    mandatory
                    color="#38b6ff"
                    group
                  >
                    <v-btn
                      class="choose-button"
                      rounded
                      outlined
                      :disabled="!contractInfoOk || !approvedEnough"
                      value="0"
                      style="border-radius: 18px !important"
                    >
                      <div class="d-flex flex-column align-center">
                        <!-- <div style="font-size: 1rem !important">30000 ARI</div> -->
                        <div class="staking_period_text">7 Days</div>
                        <div class="staking_period_text">(APY: 280%)</div>
                      </div>
                    </v-btn>
                    <v-btn
                      class="choose-button"
                      rounded
                      outlined
                      :disabled="!contractInfoOk || !approvedEnough"
                      value="1"
                      style="border-radius: 18px !important"
                    >
                      <div class="d-flex flex-column align-center">
                        <!-- <div style="font-size: 1rem !important">90000 ARI</div> -->
                        <div class="staking_period_text">30 Days</div>
                        <div class="staking_period_text">(APY: 390%)</div>
                      </div>
                    </v-btn>
                    <v-btn
                      class="choose-button"
                      rounded
                      outlined
                      :disabled="!contractInfoOk || !approvedEnough"
                      value="2"
                      style="border-radius: 18px !important"
                    >
                      <div class="d-flex flex-column align-center">
                        <!-- <div style="font-size: 1rem !important">180000 ARI</div> -->
                        <div class="staking_period_text">60 Days</div>
                        <div class="staking_period_text">(APY: 400%)</div>
                      </div>
                    </v-btn>
                  </v-btn-toggle>
                  <span></span>
                  <input
                    v-model="stakingAmount"
                    class="input-amount"
                    placeholder="0.0"
                    style="
                      color: white !important;
                      min-width: 92% !important;
                      width: 92% !important;
                    "
                  />
                </div>
                <!-- </v-row> -->
              </v-container>
              <v-card-actions class="flex-column flex-sm-row">
                <v-spacer />
                <v-btn
                  v-if="approvedEnough"
                  color="#00A3FF"
                  dark
                  class="nice-button px-8 elevation-0"
                  :loading="loading_stake"
                  :disabled="stakeDisabled"
                  @click="handleClickStake"
                  style="width: 93% !important; height: 32px !important; font-size: 14px"
                >
                  <v-icon size="16" class="mr-1">mdi-numeric-2-circle</v-icon>
                  Stake
                </v-btn>
                <v-btn
                  v-else-if="wallet"
                  color="#00A3FF"
                  dark
                  class="nice-button px-8 elevation-0"
                  :loading="loading_approve"
                  :disabled="approveDisabled"
                  @click="handleClickApprove"
                  style="width: 93% !important; height: 32px !important; font-size: 14px"
                >
                  <v-icon size="16" class="mr-1">mdi-numeric-1-circle</v-icon>
                  Approve
                </v-btn>
                <v-btn
                  v-else
                  color="#00A3FF"
                  dark
                  class="nice-button px-8 elevation-0"
                  @click="dialog = true"
                  style="width: 93% !important; height: 32px !important; font-size: 14px"
                >
                  {{ connectButtonLabel }}
                </v-btn>
                <v-spacer />
              </v-card-actions>
              <div class="d-flex flex-column align-center mt-4">
                <a
                  :href="'https://bscscan.com/address/' + address_SB"
                  target="blank"
                  style="color: white; font-size: 14px"
                  >View contract</a
                >
              </div>
            </v-card>
          </template>

          <v-card v-for="(stk, i) in activeStakes" :key="i" class="nice-card">
            <h1
              v-if="smAndUp && i === 0 && !adding_active"
              class="text-center manarium_title"
            >
              Manarium Staking App
            </h1>
            <v-container class="nice-card flex-row mb-8" style="position: relative">
              <div class="nice-text" style="font-size: 1.1rem; width: auto">
                From <b>{{ fmtDate(stk.timestamp.toNumber()) }}</b>
                <br />
                To <b>{{ fmtDate(stk.timestamp.toNumber() + periods[stk.class]) }}</b>
                <br />
                Staked: <b>{{ BNToNumstr(stk.LAST_AMOUNT) }} ARI</b>
                <br />
                APY: <b> {{ ['280.00', '390.00', '400.00'][stk.class] }}%</b>
              </div>
              <div
                class="d-flex flex-column align-end"
                :class="[!smAndUp ? 'nice-minimized' : '']"
                style="position: absolute; right: 24px; top: 22px"
              >
                <v-img class="mb-1" src="/tokensign2.jpg" height="64" width="64" />
                <div style="font-size: 27px; font-weight: 700">
                  {{ rewardCounters[i] }}
                </div>
                <div
                  class="text-right"
                  style="width: 93%; line-height: 9px; color: #666; font-size: 15px"
                >
                  ARI earned
                </div>
              </div>
            </v-container>
            <v-container
              class="mt-4 pa-0 d-flex flex-column align-center col-12 col-sm-9 nice-narrower"
            >
              <v-card-text
                v-if="i === 0 && !adding_active"
                class="mb-1 px-0 fill-width"
                style="font-size: 1.1rem"
              >
                Your wallet balance: <b>{{ BNToNumstr(balanceB) }} ARI</b>
                <br />
                Approved
                <v-icon size="19" color="#38b6ff">{{
                  approvedEnough ? 'mdi-check' : 'mdi-close'
                }}</v-icon>
                <br />
              </v-card-text>
            </v-container>
            <v-card-actions class="flex-column flex-sm-row">
              <v-spacer />
              <template v-if="hasFinished[i]">
                <v-btn
                  v-if="approvedEnough"
                  dark
                  color="#00A3ff"
                  class="nice-button mx-1 elevation-0"
                  :loading="loading_unstake"
                  :disabled="unstakeDisabled[i]"
                  @click="handleClickUnstake(stk.INDEX.toString())"
                  style="width: 93% !important; height: 32px !important; font-size: 14px"
                >
                  Unstake
                </v-btn>
                <v-spacer />
                <v-btn
                  color="#00A3ff"
                  dark
                  class="nice-button mx-1 elevation-0 mt-5 mt-sm-0"
                  :loading="loading_prolong"
                  :disabled="prolongDisabled[i]"
                  @click="handleClickProlong(stk.INDEX.toString())"
                  style="width: 93% !important; height: 32px !important; font-size: 14px"
                >
                  Restake
                </v-btn>
              </template>
              <template v-else>
                <v-btn class="nice-button mx-1 elevation-0" disabled>{{
                  countdowns[i]
                }}</v-btn>
              </template>
              <v-spacer />
            </v-card-actions>
            <div
              v-if="i === 0 && !adding_active"
              class="d-flex flex-column align-center mt-4"
            >
              <a
                :href="'https://bscscan.com/address/' + address_SB"
                target="blank"
                style="
                  color: #999;
                  font-size: 14px;
                  text-decoration: underline !important;
                "
                >View contract</a
              >
            </div>
          </v-card>
          <template v-if="provider">
            <v-btn
              color="#000 !important"
              background="#5e779b !important"
              class="nice-button add-button"
              block
              text
              :loading="loading_add_bep"
              @click="ADD_BEP"
              style="
                background: #5e779b !important;
                border-radius: 16px !important;
                color: white !important;
                height: 32px !important;
                max-width: 590px !important;
                width: 93% !important;
                font-weight: 500 !important;
              "
              >Add ARI to Metamask</v-btn
            >
          </template>
        </v-col>
      </v-row>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { Contract, providers, BigNumber } from 'ethers';
import WalletConnectProvider from '@walletconnect/web3-provider';
import TokenAbi from '~/abis/Token.json';
import StakingAbi from '~/abis/Staking.json';
const infuraKey = '783879d94cd542e282d09638818f0a99'; // infura.io projectId here
const address_TKNB = '0xc80A0A55CAF6a7bfB4Ee22f9380C4077312c4a35';
const address_SB = '0x0C3542f48D26CF67e2DAc78f5588D12649F4D255';
const _providerB = new providers.JsonRpcProvider(
  'https://speedy-nodes-nyc.moralis.io/a21c320a08cac4d00423de90/bsc/mainnet'
);
const TKNB = new Contract(address_TKNB, TokenAbi, _providerB);
const SB = new Contract(address_SB, StakingAbi, _providerB);

const JSONRPC_BSC = {
  id: 1,
  jsonrpc: '2.0',
  method: 'wallet_addEthereumChain',
  params: [
    {
      chainName: 'Binance Smart Chain Mainnet',
      chainId: '0x38',
      nativeCurrency: { name: 'Binance Chain Native Token', symbol: 'BNB', decimals: 18 },
      rpcUrls: [
        'https://bsc-dataseed1.binance.org',
        'https://bsc-dataseed2.binance.org',
        'https://bsc-dataseed3.binance.org',
        'https://bsc-dataseed4.binance.org',
        'https://bsc-dataseed1.defibit.io',
        'https://bsc-dataseed2.defibit.io',
        'https://bsc-dataseed3.defibit.io',
        'https://bsc-dataseed4.defibit.io',
        'https://bsc-dataseed1.ninicoin.io',
        'https://bsc-dataseed2.ninicoin.io',
        'https://bsc-dataseed3.ninicoin.io',
        'https://bsc-dataseed4.ninicoin.io',
        'wss://bsc-ws-node.nariox.org',
      ],
      blockExplorerUrls: ['https://bscscan.com'],
      iconUrls: [
        'https://cryptologos.cc/logos/binance-coin-bnb-logo.svg',
        'https://cryptologos.cc/logos/binance-coin-bnb-logo.png',
      ],
    },
  ],
};
const JSONRPC_TKNB = {
  method: 'wallet_watchAsset',
  params: {
    type: 'ERC20',
    options: {
      address: address_TKNB,
      symbol: 'ARI',
      decimals: 18,
      image: '', //tuta
    },
  },
};

function removeTrailingZeros(str: string): string {
  if (str === '0') return str;
  if (str.slice(-1) === '0') return removeTrailingZeros(str.substr(0, str.length - 1));
  if (str.slice(-1) === '.') return str.substr(0, str.length - 1);
  return str;
}
function BNToNumstr(bn: BigNumber | string, dec = 18, prec = 3): string {
  const str = bn.toString();
  if (str === '0') return str;
  if (isNaN(Number(str))) return 'NaN';
  if (str.length <= dec)
    return removeTrailingZeros(
      ('0.' + '000000000000000000'.substr(0, dec - str.length) + str).substr(
        0,
        dec - str.length + prec + 2
      )
    );
  else
    return removeTrailingZeros(
      [str.substr(0, str.length - dec), str.slice(-dec)]
        .join('.')
        .substr(0, str.length - dec + prec + 1)
    );
}
function BNToNumstrStrict(bn: BigNumber | string, dec = 18, prec = 3): string {
  const str = bn.toString();
  if (str === '0') return str;
  if (isNaN(Number(str))) return 'NaN';
  if (str.length <= dec)
    return removeTrailingZeros(
      ('0.' + '000000000000000000'.substr(0, dec - str.length) + str).substr(
        0,
        dec - str.length + prec + 2
      )
    );
  else
    return [str.substr(0, str.length - dec), str.slice(-dec)]
      .join('.')
      .substr(0, str.length - dec + prec + 1);
}
const _STD = 24 * 3600;
const periods = [7 * _STD, 30 * _STD, 60 * _STD];
const rates = [2, 12, 26];
const amounts = [
  BigNumber.from(30000).mul(1e9).mul(1e9),
  BigNumber.from(90000).mul(1e9).mul(1e9),
  BigNumber.from(180000).mul(1e9).mul(1e9),
];
type StakeType = {
  cycle: number;
  class: 0 | 1 | 2;
  finalAmount: BigNumber;
  initialAmount: BigNumber;
  timestamp: BigNumber;
  unstaked: boolean;
  INDEX: BigNumber;
  LAST_AMOUNT: BigNumber;
};
export default Vue.extend({
  data() {
    return {
      periods,
      address_SB,
      provider: null as providers.Web3Provider | null,
      signer: null as providers.JsonRpcSigner | null,
      wallet: '',
      approvedB: '',
      balanceB: '',
      errorMessage_misc: '',
      warningMessage: '',
      successMessage: '',
      stakingAmount: '',
      loading_approve: false,
      loading_stake: false,
      loading_unstake: false,
      loading_prolong: false,
      loading_provider: false,
      loading_contractInfo: false,
      loading_add_bsc: false,
      loading_add_bep: false,
      snackbar_approve_tx_url: '',
      snackbar_approve_rec_url: '',
      snackbar_wrote: false,
      dialog: false,
      dialog_help_bsc: false,
      dialog_help_bep: false,
      chainId: null as null | number,
      stakes: [] as StakeType[],
      daysOption: '0' as '0' | '1' | '2',
      time_now: 0,
      MAX_STAKES: null as BigNumber | null,
      adding_active: false,
    };
  },
  computed: {
    activeStakes(): StakeType[] {
      return this.stakes.filter((s) => !s.unstaked);
    },
    // MESSAGES
    connectButtonLabel(): string {
      return this.wallet
        ? this.wallet.substr(0, 6) + '...' + this.wallet.substr(-4)
        : 'Connect Wallet';
    },
    loadingMessage(): string {
      return this.loading_provider
        ? 'Connecting provider...'
        : this.loading_contractInfo
        ? 'Loading info from network...'
        : '';
    },
    err_chainId(): boolean {
      return !!this.chainId && this.chainId !== 56;
    },
    errorMessage(): string {
      return this.err_chainId
        ? `You selected wrong network for this direction. Select Binance Smart Chain in your provider${
            this.providerType === 'M' ? '' : ' and refresh the page'
          }`
        : this.errorMessage_misc;
    },
    smAndUp(): boolean {
      return (this as any).$vuetify.breakpoint.smAndUp;
    },
    providerType(): 'N' | 'W' | 'M' {
      return !this.provider ? 'N' : this.provider.provider.isMetaMask ? 'M' : 'W';
    },
    // TECHNICAL OK
    contractInfoOk(): boolean {
      return !!this.approvedB && !!this.balanceB;
    },
    allSafe(): boolean {
      return (
        !!this.wallet &&
        this.contractInfoOk &&
        !this.errorMessage &&
        !this.loading_provider &&
        !this.loading_contractInfo
      );
    },
    // VALID DATA
    approvedNonZero(): boolean {
      return this.approvedBN.gt(0);
    },
    // ENOUGH
    // isStaking(): boolean {
    //   return this.stakes.some((s) => s.cycle > 0 && !s.unstaked)
    // },
    approvedEnough(): boolean {
      return this.approvedBN.gte(
        '0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
      );
    },
    balanceEnough(): boolean {
      return this.amountSelectedBN.lte(this.balanceB);
    },
    // BUTTONS DISABLED
    approveDisabled(): boolean {
      return !this.allSafe;
    },
    stakeDisabled(): boolean {
      return !(this.allSafe && this.approvedEnough && this.balanceEnough);
    },
    unstakeDisabled(): boolean[] {
      return this.hasFinished.map((f) => !(this.allSafe && f));
    },
    prolongDisabled(): boolean[] {
      return this.hasFinished.map(
        (f, i) =>
          !(
            this.allSafe &&
            f &&
            this.time_now + periods[this.stakes[i].class] < 1636934400
          )
      );
    },
    // CONVERTERS
    countdowns(): string[] {
      return this.tillFinishs.map(
        (c) => `${c.days}:${c.hours}:${c.minutes}:${c.seconds}`
      );
    },
    tillFinishs(): { days: number; hours: number; minutes: number; seconds: number }[] {
      return this.finishDates.map((fd) => {
        const distance = fd - this.time_now;
        const days = Math.floor(distance / (60 * 60 * 24));
        const hours = Math.floor((distance % (60 * 60 * 24)) / (60 * 60));
        const minutes = Math.floor((distance % (60 * 60)) / 60);
        const seconds = Math.floor(distance % 60);
        return { days, hours, minutes, seconds };
      });
    },
    finishDates(): number[] {
      return this.activeStakes.map((s) => s.timestamp.toNumber() + periods[s.class]);
    },
    hasFinished(): boolean[] {
      return this.finishDates.map((fd) => this.time_now >= fd);
    },
    amountSelectedBN(): BigNumber {
      return amounts[Number(this.daysOption)];
    },
    approvedBN(): BigNumber {
      return BigNumber.from(this.approvedB || 0);
    },
    expectedFinalBN(): BigNumber | null {
      return this.amountSelectedBN.mul(rates[Number(this.daysOption)]).div(100);
    },
    rewardCounters(): string[] {
      const mapped = this.activeStakes.map((s, i) => {
        if (!this.time_now) return '0.0000';
        const _fd = this.finishDates[i];
        const _finish = this.time_now > _fd ? _fd : this.time_now;
        const _timespan = periods[s.class];
        const _passed = _finish - s.timestamp.toNumber();
        const result = s.finalAmount.sub(s.LAST_AMOUNT).mul(_passed).div(_timespan);
        if (result.lt(0)) return '0.0000';
        return BNToNumstrStrict(result, 18, 4);
      });
      return mapped;
    },
  },
  async mounted() {
    const bn = await _providerB.getBlockNumber();
    this.time_now = (await _providerB.getBlock(bn)).timestamp;
    setInterval(() => {
      this.time_now++;
    }, 1000);
  },
  methods: {
    BNToNumstr,
    BNToNumstrStrict,
    fmtDate(seconds: number) {
      return Intl.DateTimeFormat('en-GB', {
        hour: 'numeric',
        hour12: false,
        minute: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(seconds * 1000);
    },
    calcInitialAmount(
      _class: number,
      cycle: number,
      initialAmount: BigNumber
    ): BigNumber {
      let amt = initialAmount;
      for (let i = 1; i < cycle; i++) amt = amt.mul(rates[_class]).div(100);
      return amt;
    },
    async updateChainId() {
      this.chainId = (await this.provider?.getNetwork())?.chainId || null;
    },
    async ADD_BSC() {
      this.loading_add_bsc = true;
      try {
        await this.provider?.provider.request?.(JSONRPC_BSC);
      } catch (error) {
        this.warningMessage =
          'Could not switch to BSC. Error: ' + (error.data?.message || error.message);
        console.error(error);
      }
      this.loading_add_bsc = false;
    },
    async ADD_BEP() {
      this.loading_add_bep = true;
      try {
        await this.provider?.provider.request?.(JSONRPC_TKNB as any);
      } catch (error) {
        this.warningMessage =
          'Could not add ARI. Error: ' + (error.data?.message || error.message);
        console.error(error);
      }
      this.loading_add_bep = false;
    },
    async clickConnectWalletconnect() {
      if (this.providerType === 'M') this.wallet = '';
      await this.connectWalletconnect();
      if (this.wallet) await this.loadContractInfo();
    },
    async connectWalletconnect() {
      this.loading_provider = true;
      try {
        const wc = new WalletConnectProvider({ infuraId: infuraKey, qrcode: true });
        await wc.enable();
        this.provider = new providers.Web3Provider(wc);
        wc.on('close', (code: number, reason: string) => {
          console.log({ code, reason });
          if (this.providerType === 'W') this.resetData();
        });
        this.signer = this.provider.getSigner();
        this.wallet = await this.signer.getAddress();
        await this.updateChainId();
      } catch (error) {
        this.errorMessage_misc =
          'Could not connect Walletconnect. Error: ' + error.message;
        console.error(error);
      }
      this.loading_provider = false;
      this.dialog = false;
    },
    resetData() {
      this.provider = this.signer = this.chainId = null;
      this.wallet =
        this.approvedB =
        this.balanceB =
        this.errorMessage_misc =
        this.warningMessage =
        this.successMessage =
          '';
      this.loading_approve =
        this.loading_stake =
        this.loading_unstake =
        this.loading_prolong =
        this.loading_provider =
        this.loading_contractInfo =
        this.loading_add_bsc =
        this.loading_add_bep =
        this.dialog =
        this.dialog_help_bsc =
        this.dialog_help_bep =
          false;
      this.daysOption = '0';
      this.stakes = [];
    },
    async clickConnectMetamask() {
      if (this.providerType === 'W') this.wallet = '';
      await this.connectMetamask();
      (window.ethereum as any).on('chainChanged', async (chainId: string) => {
        console.log({ chainId });
        await this.connectMetamask();
      });
      if (this.wallet) await this.loadContractInfo();
    },
    async connectMetamask() {
      this.loading_provider = true;
      try {
        if (!window.ethereum) throw new Error('Please set up MetaMask properly');
        await (window.ethereum as any).enable();
        this.provider = new providers.Web3Provider(window.ethereum || window.web3);
        this.signer = this.provider.getSigner();
        this.wallet = await this.signer.getAddress();
        await this.updateChainId();
      } catch (error) {
        this.errorMessage_misc = 'Could not connect MetaMask. Error: ' + error.message;
        console.error(error);
      }
      this.loading_provider = false;
      this.dialog = false;
    },
    async handleClickAddBSC() {
      this.loading_add_bsc = true;
      try {
        const addedNetwork = await this.provider?.provider.request?.(JSONRPC_BSC);
        await this.updateChainId();
        console.log({ addedNetwork });
      } catch (error) {
        console.error(error);
      }
      this.loading_add_bsc = false;
    },
    async handleClickAddBEP20() {
      this.loading_add_bep = true;
      try {
        const addedToken = await this.provider?.provider.request?.(JSONRPC_TKNB as any);
        await this.updateChainId();
        console.log({ addedToken });
      } catch (error) {
        console.error(error);
      }
      this.loading_add_bep = false;
    },
    async loadContractInfo() {
      this.loading_contractInfo = true;
      try {
        const w = this.wallet;
        const [Bb, Ba, Bs, MAX_STAKES]: [
          BigNumber,
          BigNumber,
          {
            indexes: BigNumber[];
            s: {
              class: 0 | 1 | 2;
              cycle: number;
              finalAmount: BigNumber;
              initialAmount: BigNumber;
              timestamp: BigNumber;
              unstaked: false;
            }[];
          },
          BigNumber
        ] = await Promise.all([
          TKNB.balanceOf(w),
          TKNB.allowance(w, address_SB),
          SB.myStakes(w),
          SB.MAX_STAKES(),
        ]);
        this.approvedB = Ba.toString();
        this.balanceB = Bb.toString();
        console.log({ BAL: this.balanceB, ALL: this.approvedB });
        this.stakes = Bs.s.map((s, i) => ({
          ...s,
          INDEX: Bs.indexes[i],
          LAST_AMOUNT: this.calcInitialAmount(s.class, s.cycle, s.initialAmount),
        }));
        this.MAX_STAKES = MAX_STAKES;
        console.log({ Bs });
      } catch (error) {
        console.error(error);
      }
      this.loading_contractInfo = false;
    },
    async handleClickApprove() {
      this.loading_approve = true;
      try {
        this.warningMessage = '';
        await this.approve();
      } catch (error) {
        this.warningMessage = error.data?.message || error.message;
        console.error(error);
      }
      this.loading_approve = false;
    },
    async handleClickStake() {
      this.loading_stake = true;
      try {
        this.warningMessage = '';
        await this.stake();
        this.adding_active = false;
      } catch (error) {
        this.warningMessage = error.data?.message || error.message;
        console.error(error);
      }
      this.loading_stake = false;
    },
    async handleClickUnstake(index: string) {
      this.loading_unstake = true;
      try {
        this.warningMessage = '';
        await this.unstake(index);
      } catch (error) {
        this.warningMessage = error.data?.message || error.message;
        console.error(error);
      }
      this.loading_unstake = false;
    },
    async handleClickProlong(index: string) {
      this.loading_prolong = true;
      try {
        this.warningMessage = '';
        await this.prolong(index);
      } catch (error) {
        this.warningMessage = error.data?.message || error.message;
        console.error(error);
      }
      this.loading_prolong = false;
    },
    async approve() {
      const TKN = new Contract(address_TKNB, TokenAbi, this.signer!);
      this.snackbar_approve_tx_url = this.snackbar_approve_rec_url = '';
      const tx = await TKN.approve(
        address_SB,
        BigNumber.from(
          '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
        )
      );
      this.snackbar_approve_tx_url = `https://etherscan.com/tx/${tx.hash}`;
      console.log({ tx });
      const receipt = await tx.wait(1);
      this.snackbar_approve_tx_url = '';
      this.snackbar_approve_rec_url = `https://etherscan.com/tx/${tx.hash}`;
      console.log({ receipt });
      await this.loadContractInfo();
    },
    async stake() {
      const SB = new Contract(address_SB, StakingAbi, this.signer!);
      this.snackbar_approve_tx_url = this.snackbar_approve_rec_url = '';
      const tx: providers.TransactionResponse = await SB.stake(
        this.daysOption,
        BigNumber.from(this.stakingAmount + '000000000000000000')
      );
      this.snackbar_approve_tx_url = `https://etherscan.com/tx/${tx.hash}`;
      console.log({ tx });
      const receipt = await tx.wait(1);
      this.snackbar_approve_tx_url = '';
      this.snackbar_approve_rec_url = `https://etherscan.com/tx/${tx.hash}`;
      console.log({ receipt });
      await this.loadContractInfo();
    },
    async unstake(index: string) {
      const SB = new Contract(address_SB, StakingAbi, this.signer!);
      this.snackbar_approve_tx_url = this.snackbar_approve_rec_url = '';
      const tx = await SB.unstake(index);
      this.snackbar_approve_tx_url = `https://etherscan.com/tx/${tx.hash}`;
      console.log({ tx });
      const receipt = await tx.wait(1);
      this.snackbar_approve_tx_url = '';
      this.snackbar_approve_rec_url = `https://etherscan.com/tx/${tx.hash}`;
      console.log({ receipt });
      await this.loadContractInfo();
    },
    async prolong(index: string) {
      const SB = new Contract(address_SB, StakingAbi, this.signer!);
      this.snackbar_approve_tx_url = this.snackbar_approve_rec_url = '';
      const tx = await SB.prolong(index);
      this.snackbar_approve_tx_url = `https://etherscan.com/tx/${tx.hash}`;
      console.log({ tx });
      const receipt = await tx.wait(1);
      this.snackbar_approve_tx_url = '';
      this.snackbar_approve_rec_url = `https://etherscan.com/tx/${tx.hash}`;
      console.log({ receipt });
      await this.loadContractInfo();
    },
  },
});
</script>

<style lang="scss">
h1 {
  font-style: normal;
  font-weight: bold;
  font-size: 32px;
}
h2 {
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
}
h3 {
  font-style: normal;
  font-weight: bold;
  font-size: 22px;
}
li {
  margin-left: 16px;
}
.v-application {
  font-family: 'Roboto';
  color: #000000;
}
div[data-app='true'] {
  background: radial-gradient(
    50% 50% at 50% 50%,
    rgba(0, 163, 255, 0.25) 0%,
    rgba(0, 26, 255, 0) 100%
  ) !important;
  background-color: #161623 !important;
  background-size: 130% !important;
  background-position: top center !important;
}
.nice-minimized {
  transform: scale(0.8) translateX(24px);
}
.v-overlay--active .v-overlay__scrim {
  backdrop-filter: blur(10px) !important;
  -webkit-backdrop-filter: blur(10px) !important;
  // background: rgba(118, 118, 118, 0.5) !important;
  opacity: unset !important;
}
.alerts-container {
  width: 100%;
  margin-top: 50px;
  .v-alert {
    margin-bottom: 5px;
    border-radius: 30px !important;
    @media only screen and (max-width: 599px) {
      border-radius: 0;
    }
  }
}
.appbar-logo {
  position: absolute !important;
  left: 32px;
  @media only screen and (max-width: 599px) {
    left: 16px;
  }
  .v-responsive__sizer {
    transition-duration: 0ms;
  }
}
.nice-dialog-wrapper {
  border-radius: 6px !important;
}
.nice-button {
  font-size: 16px !important;
  border-radius: 30px !important;
  text-transform: unset !important;
  letter-spacing: -0.29px !important;
  padding: 8px 32px !important;
  height: 48px !important;
  color: #00a3ff;
  &:not(.white--text) {
    color: rgb(255, 255, 255) !important;
  }
  &.connect-button {
    position: absolute !important;
    right: 32px;
    height: 36px !important;
    @media only screen and (max-width: 599px) {
      right: 16px;
    }
  }
  &.metamask {
    background: linear-gradient(124.4deg, #dc6e3e 0%, #fff0ad 100%);
    // width: 334px;
    // height: 80px;
  }
  &.walletconnect {
    background: linear-gradient(90deg, #7730ec 0%, #687cff 100%);
  }
  &.add-button {
    bottom: 10px;
  }
}
.nice-card {
  // color: #fff;
  padding: 30px !important;
  padding-bottom: 20px !important;
  border-radius: 30px !important;
  border: solid 1px #38b6ff !important;
  margin-bottom: 25px;
  margin-top: 15px;
  .nice-title {
    white-space: nowrap !important;
    line-height: 30px;
  }
  .nice-text {
    font-size: 16px;
    line-height: 26px;
  }
  &.nice-connect {
    position: absolute;
    max-width: 398px !important;
    width: 100% !important;
    height: 250px !important;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
  }
  &.nice-card-big {
    width: 760px;
    max-height: 687px;
  }
}
.choose-button {
  max-width: 220px !important;
  min-width: 10px !important;
  min-height: 127px !important;
  min-height: 115px !important;
  background: #38b6ff;
  box-shadow: 0px 10px 25px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
}
.choose {
  // position: absolute;
  width: 100% !important;
  min-height: 150px;
  justify-content: space-between !important;
  flex-wrap: nowrap !important;
  margin-bottom: 20px;
  .v-btn {
    border-radius: 10px !important;
  }
}
.v-btn-toggle .v-btn.v-btn.v-size--default {
  min-width: 140px;
  min-height: 117px;
}
.footer-wrap {
  padding: 0 !important;
  border-top: 1px solid #38b6ff !important;
  .footer-box {
    height: 100%;
    width: 100%;
    background: #161623 !important;
    .footer-tag {
      width: 100%;
      text-align: center;
      font-size: 15px;
      a {
        text-decoration: none;
        color: #38b6ff;
      }
    }
  }
}
.buttons-input-div {
  width: 100% !important;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  // height: 300px !important;
  margin-block: 15px;
  border-style: none;
  .input-amount {
    display: flex;
    justify-content: center !important;
    align-items: center !important;
    height: 50px;
    padding: 22px 27px 20px 27px;

    background: #212435;
    opacity: 1;
    box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.5);
    border-radius: 18px;
    border-style: none;
    .input-amount::placeholder {
      margin-left: 20px;
      font-size: 16px;
      color: white !important;
      opacity: 1;
      border-style: none;
    }
  }
}
.card_wrap {
  padding: 45px !important;
  background: #161623 !important;
  border: 2px solid #1d1b2b !important;
  box-sizing: border-box !important;
  box-shadow: 0px 6px 32px rgba(10, 10, 10, 0.5), 0px 8px 25px rgba(0, 0, 0, 0.05) !important;
  border-radius: 32px !important;
  border-style: none !important;
  margin-bottom: 50px !important;
  margin-top: 20px !important;
}
.staking_period_text {
  font-size: 1rem;
}
.manarium_title {
  font-size: 32px !important;
}
@media screen and (max-width: 550px) {
  .card_wrap {
    padding: 15px !important;
  }
  .choose-button {
    max-width: 130px !important;
    font-size: 10px;
  }
  .staking_period_text {
    font-size: 0.75rem;
  }
  .manarium_title {
    font-size: 28px !important;
  }
  @media screen and (max-width: 420px) {
    .choose {
      // position: absolute;
      width: 100% !important;
      flex-direction: column;
      min-height: 150px;
      justify-content: center !important;
      flex-wrap: nowrap !important;
      .v-btn {
        border-radius: 10px !important;
      }
    }
    .card_balance_approved {
      flex-direction: column;
      align-items: center;
    }
    .choose-button {
      max-width: 100% !important;
      min-width: 100% !important;
      min-height: 50px !important;
      max-height: 50px !important;
      background: #38b6ff;
      box-shadow: 0px 10px 25px rgba(0, 0, 0, 0.15);
      border-radius: 10px;
    }
    .nice-card {
      &.nice-connect {
        max-width: 398px !important;
        width: 90% !important;
      }
    }
  }
}
</style>
