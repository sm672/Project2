import { Component, OnInit } from '@angular/core';
import { Search1Service } from '../search1.service';

@Component({
  selector: 'app-gifs',
  templateUrl: './gifs.component.html',
  styleUrls: ['./gifs.component.css']
})
export class GifsComponent implements OnInit {

gifs : any[] = []


  constructor(public giphy :Search1Service) { }

  ngOnInit(): void {
   this.giphy.trendingGifs() 
   .subscribe((response : any)=>{

    console.log('data', response);
      this.gifs = response.data;
   })
   
   
  }
  

}
