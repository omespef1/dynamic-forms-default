import { Component, OnInit, NgModule, Input, Output, EventEmitter } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { DxAccordionModule } from 'devextreme-angular';
import { MenuGroupItem, Menu } from 'src/app/models/menu';

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.css']
})
export class ToolBarComponent implements OnInit {

  @Input() menu: Menu[];
  @Output() itemClick = new EventEmitter<MenuGroupItem>(null);

  @Input()
  icon = 'far fa-question-circle';
  @Input()
  titleKey = '';
  @Input()
  subTitleKey = '';

  items: any[] = [{}];

  constructor() {
  }

  ngOnInit() {

  }

  onItemClick(e: MenuGroupItem) {
    this.itemClick.emit(e);
  }

}


@NgModule({
  declarations: [ToolBarComponent],
  imports: [NgbModule, CommonModule, DxAccordionModule],
  exports: [ToolBarComponent]
})
export class ToolBarModule { }
