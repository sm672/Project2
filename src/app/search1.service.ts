import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, distinct, map, Observable, Subject, tap } from 'rxjs';
import { GifData, SearchReqeust, GiphyResult } from './giphy-result';

@Injectable({
  providedIn: 'root',
})
export class Search1Service {
  static readonly giphyUrl = 'https://api.giphy.com/v1/gifs/search';
  static readonly giphyApiKey = 'fplmvx8SXBNfVr2lvEKkibWPwyky5KXG';

  currentOffset = 0;
  currentSearchTerm = '';
  pageSize = 100;
  imageResult: any[] = [];
  searchResultsSubject = new Subject<Array<GifData>>();
  searchResults$ = new Observable<Array<GifData>>();

  searchRequest = new Subject<SearchReqeust>();
  resetSearch = new Subject<any>();

  constructor(private http: HttpClient) {
    this.searchResults$ = this.searchResultsSubject.asObservable();
    this.searchRequest
      .pipe(distinct((request) => request.offset, this.resetSearch))
      .subscribe((request) => {
        this.getSearchResults(
          request.searchTerm,
          request.offset,
          request.pageSize
        );
      });
  }

  public getSearchResults(
    searchTerm: string,
    offset: number,
    pageSize: number
  ) {
    console.log(searchTerm, offset, pageSize);
    const params = {
      api_key: Search1Service.giphyApiKey,
      q: searchTerm,
      limit: pageSize.toString(),
      offset: offset.toString(),
    };

    this.http
      .get<GiphyResult>(Search1Service.giphyUrl, { params })
      .subscribe((giphyResult) => {
        this.imageResult = giphyResult.data;
        this.currentOffset =
          giphyResult.pagination.offset + giphyResult.pagination.count;

        this.searchResultsSubject.next(this.imageResult);
      });
  }

  trendingGifs(): Observable<GifData[]> {
    return this.http
      .get<GifData[]>(
        'https://api.giphy.com/v1/gifs/trending?api_key=Dst7UyI10lCaZeA9seXlAWA2qaXf0uGY'
      )
      .pipe(
        tap(console.log),
        map((data) => [
          ...data.data.map(
            (gif: any) =>
              ({
                images: {
                  fixed_width: {
                    url: gif?.images.downsized.url,
                  },
                },
                title: gif?.title,
              } as GifData)
          ),
        ])
      );
  }

  //  searchgifs(gifName : string){

  //   return this.http.get('https://api.giphy.com/v1/gifs/search?q={gifName}api_key=Dst7UyI10lCaZeA9seXlAWA2qaXf0uGY')

  //  }

  search(searchTerm: string) {
    this.imageResult = [];
    this.searchResultsSubject.next(this.imageResult);

    // this is just a flush observable for the distinct operator
    this.resetSearch.next(null);

    this.searchRequest.next({
      searchTerm: searchTerm,
      offset: this.currentOffset,
      pageSize: this.pageSize,
    });
  }

  next() {
    this.searchRequest.next({
      searchTerm: this.currentSearchTerm,
      offset: this.currentOffset,
      pageSize: this.pageSize,
    });
  }

  setPageSize(size: number) {
    this.pageSize = size;
  }
}
