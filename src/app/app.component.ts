import {Component, OnInit} from '@angular/core'
import {Lot, NearService} from "./near.service"
import {StorageService} from "./storage.service"
import {ActivatedRoute} from "@angular/router"
import {ModalService} from "./modal.service";
import {formatNearAmount, parseNearAmount} from "near-api-js/lib/utils/format";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private currentLot: number | undefined = undefined
  loading = false

  currentLotMinPrice: string = '0.05'
  lots: Lot[] = []

  async ngOnInit() {
    await this.near.init();
    this.initLots()
  }

  constructor(private near: NearService,
              private storage: StorageService,
              private route: ActivatedRoute,
              private modals: ModalService) {
  }

  initLots() {
      this.near.getLots().then(lots => {
        console.log(lots)
        this.lots = lots
      })
  }

  openNewLotModal(id: string) {
    this.modals.open(id);
  }

  openNewBidModal(id: string, currentLot: number) {
    console.log(currentLot)
    this.currentLot = currentLot;
    this.currentLotMinPrice = (Number(formatNearAmount(this.lots[currentLot].last_price.toString())!) + 0.05).toFixed(2);
    this.modals.open(id);
  }

  closeModal(id: string) {
    this.modals.close(id);
  }

  authenticated() {
    return this.near.authenticated()
  }

  signIn() {
    this.near.signIn()
      .then(r => console.log(`User is signed in: ${r}`))
      .catch(console.error)
  }

  signOut() {
    this.near.signOut()
  }

  async makeNewBid(newBidValue: string) {
    this.loading = true;
    let yoctoPrice = parseNearAmount(newBidValue)!;
    await this.near.makeBid(this.currentLot!, yoctoPrice).finally(() => this.loading = false)
  }

  toDate(active_until: number) {
    let date = new Date(Math.round(active_until / 1000000));
    const Day = date.getDay()
    const Month = date.getMonth() + 1
    const FullYear = date.getFullYear()
    const Hours = date.getHours()
    const Minutes = date.getMinutes()
    return `${Day}.${Month}.${FullYear} ${Hours}:${Minutes}`
  }

  myBid(lot: Lot): boolean {
    return this.near.getCurrentAccountId() == lot.owner
  }

  owner(lot: Lot): boolean {
    return this.near.getCurrentAccountId() == lot.creator
  }

  formatPrice(yocto_price: number): string {
    // return formatNearAmount(yocto_price.toString())
    return formatNearAmount(yocto_price.toString())
  }
}
