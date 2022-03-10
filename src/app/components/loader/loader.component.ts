import { Component, OnInit, NgModule } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

@NgModule({
  declarations: [LoaderComponent],
  exports: [LoaderComponent]
})
export class LoaderModule { }
