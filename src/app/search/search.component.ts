import { Component, HostListener, OnInit } from '@angular/core';
import { GifData } from '../giphy-result';
import { Search1Service } from '../search1.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  searchTerm: string;
  public currentPage : number = 1;
  public collection: any[] = [];

  constructor(public search$: Search1Service) {
    this.searchTerm = '';

    this.search$.trendingGifs().subscribe((gifs: GifData[]) => {
      this.collection = gifs;
    })

    this.search$.searchResults$.subscribe((gifs: GifData[]) => {
      this.collection = gifs;
    })
  }

  public search(): void {
    this.search$.search(this.searchTerm);
  }
}
