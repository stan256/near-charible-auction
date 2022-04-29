import {Injectable} from '@angular/core'
import {ConnectConfig, Contract, Near, WalletConnection} from "near-api-js"
import * as nearAPI from "near-api-js"

@Injectable({
  providedIn: 'root'
})
export class NearService {
  near: Near | undefined = undefined
  wallet: WalletConnection | undefined = undefined
  auctionContract: any

  gas = "300000000000000";

  public async init() {
    await nearAPI.connect(config).then(near => {
      this.near = near
      this.wallet = new WalletConnection(near, null)
      this.auctionContract = new Contract(
        this.wallet.account(),
        CONTRACT,
        {
          changeMethods: ['createLot', 'makeBid'],
          viewMethods: ['getLots']
        }
      )
    })
  }

  createNewLot(title: string, description: string, imgLink: string, startingPrice: string): Promise<void> {
    let req = {
      title: title,
      description: description,
      img_link: imgLink,
      last_price: startingPrice
    }
    return this.auctionContract!.createLot(req, this.gas, "100000000000000000000000").then((a: any) => {
      console.log(`lot created successfully, ${a}`)
    })
  }

  getLots(): Promise<Lot[]> {
    return this.auctionContract!.getLots();
  }

  makeBid(lotId: number, bidPrice: string): Promise<void> {
    let req = {
      lot_id: lotId
    }

    return this.auctionContract!.makeBid(req, this.gas, bidPrice)
  }

  getCurrentAccountId(): string {
    return this.wallet!.account().accountId
  }

  signIn() {
    return this.wallet!.requestSignIn(CONTRACT, "Charitable auction - Junkwin")
  }

  signOut() {
    this.wallet!.signOut()
  }

  authenticated(): boolean {
    if (this.wallet) {
      return this.wallet!.isSignedIn()
    } else {
      return false
    }
  }
}

const CONTRACT: string = "dev-1651249761353-63465678167713"

let config: ConnectConfig = {
  networkId: "testnet",
  keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
  nodeUrl: "https://rpc.testnet.near.org",
  walletUrl: "https://wallet.testnet.near.org",
  helperUrl: "https://helper.testnet.near.org"
}

export interface Lot {
  id: number
  title: string
  description: string
  last_price: number
  img_link: string
  owner: string
  creator: string
  active_until: number
}
