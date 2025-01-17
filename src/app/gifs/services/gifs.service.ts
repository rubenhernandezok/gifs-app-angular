import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';



@Injectable({providedIn: 'root'})
export class GifsService {

  public gifList: Gif[] = [];

  private _tagsHistory: string[] = [];
  private apiKey:       string = 'FMGDuwFk8u86L1n6tew7hn0h5SZ5NRRG';
  private serviceUrl:   string = 'https:api.giphy.com/v1/gifs';

  constructor(private http: HttpClient) {
    this.loadLocalStorage();

    console.log('Gifs service ready')
   }

  get tagsHistory() {
    return [...this._tagsHistory];
  }

  //Validacion para organizar el historial de busqueda
  private organizeHistory(tag: string){
    if(tag.length === 0) return;

    tag = tag.toLowerCase();

    if(this._tagsHistory.includes(tag)) {
      this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag !== tag)
    }

    this._tagsHistory.unshift(tag);

    this._tagsHistory = this.tagsHistory.splice(0,10);
    this.saveLocalStorage();


  }

  private saveLocalStorage():void {
    localStorage.setItem('history',JSON.stringify(this._tagsHistory))
  }

  private loadLocalStorage():void {
    if(!localStorage.getItem('history')) return;

    this._tagsHistory = JSON.parse(localStorage.getItem('history')!);

    if(this._tagsHistory.length ===0) return;
    this.searchTag(this._tagsHistory[0])


  }


 searchTag (tag: string):void {
    this.organizeHistory(tag);

    const params = new HttpParams()
    .set('api_key', this.apiKey)
    .set('limit', '10')
    .set('q', tag)

    this.http.get<SearchResponse>(`${this.serviceUrl}/search`, {params})
    .subscribe( resp =>{

      this.gifList = resp.data;


    })


  }


}
