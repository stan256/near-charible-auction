import {Injectable} from '@angular/core'
import {File, Status, Web3Storage} from "web3.storage"

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private web3storageJWT: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDRlMEE4YzY3MzMyM2Q2YTBkNjk1RENDQTI3YTEzMTlhMkY2NDZlRTgiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTA2NTIzMzMyMTEsIm5hbWUiOiJoYWNrYXRob24tc3ByaW5nLW5lYXItdG9rZW4ifQ.7tc0jEygU1d870MQCTTJUpgRM1wOO4o-jGloYCl-8kk"
  private client: Web3Storage

  constructor() {
    this.client = new Web3Storage({ token: this.web3storageJWT })
  }

  async awaitSaveFile(fileToUpload: FileList): Promise<Status | undefined> {
    let file: File = fileToUpload.item(0)!
    let rootCid = await this.client.put([file])
    return this.client.status(rootCid)
  }
}
