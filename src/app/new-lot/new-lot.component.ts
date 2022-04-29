import {Component, OnInit} from '@angular/core';
import {StorageService} from "../storage.service";
import {NearService} from "../near.service";
import {parseNearAmount} from "near-api-js/lib/utils/format";

@Component({
  selector: 'app-new-lot',
  templateUrl: './new-lot.component.html',
  styleUrls: ['./new-lot.component.scss']
})
export class NewLotComponent implements OnInit {
  title: string | undefined
  description: string | undefined
  startingPrice: number = 0
  fileToUpload: FileList | null = null
  finished: boolean = false
  loading: boolean = false

  constructor(private ipfs: StorageService,
              private near: NearService) {
  }

  handleFileInput(event: Event) {
    const element: HTMLInputElement = event.currentTarget as HTMLInputElement
    this.fileToUpload = element.files!
  }

  async save() {
    this.loading = true
    let imgLink = await this.saveToIpfs()
    let price = parseNearAmount(this.startingPrice.toString());
    this.near.createNewLot(this.title!, this.description!, imgLink!, price!)
      .finally(() => {
        this.finished = true;
        this.loading = false;
        console.log("saved new lot")
      })
  }

  saveToIpfs(): Promise<string | void> {
    if (this.fileToUpload) {
      return this.ipfs.awaitSaveFile(this.fileToUpload)
        .then(r => {
          console.log(`saved: ${r!.cid}`)
          return `https://${r!.cid}.ipfs.dweb.link/${this.fileToUpload?.item(0)!.name}`
        })
        .catch(console.error)
    } else {
      return Promise.reject()
    }
  }

  ngOnInit(): void {

  }

}
