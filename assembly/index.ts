import {Context, u128, PersistentVector, ContractPromiseBatch, storage} from "near-sdk-as";

@nearBindgen
export class Lot {
  id: u128;
  title: string;
  description: string;
  last_price: u128;
  img_link: string;
  owner: string;
  creator: string;
  active_until: u64;

  static one_week_in_nanos: u64 = 1000000000 * 60 * 60 * 24 * 7

  constructor(id: u128, title: string, description: string, img_link: string, last_price: u128) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.last_price = last_price;
    this.img_link = img_link;
    this.owner = Context.sender;
    this.creator = Context.sender;
    this.active_until = Context.blockTimestamp + Lot.one_week_in_nanos;
  }
}

export function createLot(title: string, description: string, img_link: string, last_price: u128): void {
  const counter: u128 = storage.get<u128>("counter", u128.fromString("0"))!
  assert(last_price > u128.from(0), "Price should be positive")
  lots.push(new Lot(counter, title, description, img_link, last_price))
  storage.set<u128>("counter", counter.postInc())
}

export function getLots(): Lot[] {
  let result = new Array<Lot>();
  for (let i = 0; i < lots.length; i++) {
    if (lots[i].active_until > Context.blockTimestamp) {
      result.push(lots[i])
    }
  }
  return result;
}

// payable
export function makeBid(lot_id: u64): void {
  let lot = lots[lot_id as i32];
  assert(lot.active_until > Context.blockTimestamp, "Bid could be made only for non finished lots")
  assert(lot.owner != Context.sender, "You're already owning the lot, no sense to increase the price")
  assert(lot.creator != Context.sender, "You've created this lot and can't bid")
  assert(lot.last_price < Context.attachedDeposit, "New price should be bigger than old")

  // not needed to return a money to a person who is selling the item
  if (lot.owner != lot.creator) {
    // returning money to the previous bidder
    ContractPromiseBatch.create(lot.owner).transfer(lot.last_price);
  }
  // updating the current owner
  lot.owner = Context.sender
  lot.last_price = Context.attachedDeposit
  lots[lot_id as i32] = lot
}

export const lots = new PersistentVector<Lot>("lots");
