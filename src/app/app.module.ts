import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import './localization';
import { FormDesignerComponent } from './components/form-designer/form-designer.component';
import { RedirectComponent } from './components/redirect/redirect.component';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './auth/token.interceptor';
import { DxPopupModule, DxFormModule, DxDataGridModule, DxToolbarModule, DxLoadPanelModule, DxNumberBoxModule, DxTextAreaModule, DxTextBoxModule, DxValidatorModule, DxSelectBoxModule, DxDropDownBoxModule, DxTagBoxModule, DxListModule, DxScrollViewModule, DxDateBoxModule, DxColorBoxModule, DxAccordionModule, DxButtonModule, DxTooltipModule, DxTreeViewModule, DxContextMenuModule, DxButtonGroupModule } from 'devextreme-angular';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ListMainFormComponent } from './components/list-main-form/list-main-form.component';
import { GridPropertiesComponent } from './components/grid-properties/grid-properties.component';
import { GridMainPropertiesComponent } from './components/grid-main-properties/grid-main-properties.component';
import { FormPropertiesComponent } from './components/form-properties/form-properties.component';
import { FormEventsComponent } from './components/form-events/form-events.component';
import { ControlsPropertiesComponent } from './components/controls-properties/controls-properties.component';
import { ControlsEventsComponent } from './components/controls-events/controls-events.component';
import { CommonFunctions } from './utils/common-functions';
import { FormVisualizationComponent } from './components/form-visualization/form-visualization.component';
import { MasterDetailComponent } from './components/master-detail/master-detail.component';
import { FileUploadModule } from 'ng2-file-upload';
import { FormsModule } from '@angular/forms';
import { FormsContainerComponent } from './components/forms-container/forms-container.component';
import { InputFilter } from './pipes/InputFilter.pipe';
import { FilterArrayPipe } from './pipes/filter-array.pipe';
import { ExcelImportComponent } from './components/excel-import/excel-import.component';
import { LOCALE_ID } from '@angular/core';
import { LoaderModule } from './components/loader/loader.component';
import { ToolBarModule } from './components/tool-bar/tool-bar.component';
import { SessionGuardService } from './services/session-guard.service';
import { GridHeaderColorDirectiveModule } from './directives/grid-header-color.directive';
import { GridHeaderTextColorDirectiveModule } from './directives/grid-header-text-color.directive';
import { PrimaryColorDirectiveModule } from './directives/primary-color.directive';
import { PrimaryTextColorDirectiveModule } from './directives/primary-text-color.directive';
import { SecundaryColorDirectiveModule } from './directives/secundary-color.directive';
import { SecundaryTextColorDirectiveModule } from './directives/secundary-text-color.directive';
import { PrimaryButtonColorDirectiveModule } from './directives/primary-button-color.directive';
import { SecundaryButtonColorDirectiveModule } from './directives/secundary-button-color.directive';
import { SecundaryButtonTextColorDirectiveModule } from './directives/secundary-button-text-color.directive';
import { PrimaryButtonTextColorDirectiveModule } from './directives/primary-button-text-color.directive';
import { LabelColorDirectiveModule } from './directives/label-color.directive';
import { TitleColorDirectiveModule } from './directives/title-color.directive';
import { TitleTextColorDirectiveModule } from './directives/title-text-color.directive';
import { SubTitleColorDirectiveModule } from './directives/sub-title-color.directive';
import { InlineSVGModule } from "ng-inline-svg";
import { AttachFileComponent } from './components/attach-file/attach-file.component';


const APP_ROUTES: Routes = [
  { path: '', component: FormsContainerComponent },
  { path: 'form-designer', component: FormDesignerComponent, canActivate: [SessionGuardService] },
  { path: 'edit-form-designer', component: FormDesignerComponent, canActivate: [SessionGuardService] },
  { path: 'form-view', component: FormVisualizationComponent, canActivate: [SessionGuardService] },
  { path: 'redirect-external', component: RedirectComponent },
  { path: 'list-forms', component: ListMainFormComponent, canActivate: [SessionGuardService] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [
    AppComponent,
    RedirectComponent,
    FormDesignerComponent,
    ControlsEventsComponent,
    ControlsPropertiesComponent,
    FormEventsComponent,
    FormPropertiesComponent,
    GridMainPropertiesComponent,
    GridPropertiesComponent,
    ListMainFormComponent,
    FormVisualizationComponent,
    MasterDetailComponent,
    FormsContainerComponent,
    InputFilter,
    FilterArrayPipe,
    ExcelImportComponent,
    AttachFileComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(APP_ROUTES, { useHash: true }),
    InlineSVGModule.forRoot(),
    HttpClientModule,
    DxPopupModule,
    DxFormModule,
    DxDataGridModule,
    DxToolbarModule,
    NgbModule,
    DxLoadPanelModule,
    DxNumberBoxModule,
    DxTextAreaModule,
    DxTextBoxModule,
    DxValidatorModule,
    DxSelectBoxModule,
    DxDropDownBoxModule,
    DxTreeViewModule,
    DxContextMenuModule,
    DxButtonGroupModule,
    DxTagBoxModule,
    DxListModule,
    DxScrollViewModule,
    DxDateBoxModule,
    DxColorBoxModule,
    DxAccordionModule,
    DxButtonModule,
    FileUploadModule,
    FormsModule,
    DxTooltipModule,
    LoaderModule,
    ToolBarModule,
    GridHeaderColorDirectiveModule,
    GridHeaderTextColorDirectiveModule,
    PrimaryColorDirectiveModule,
    PrimaryTextColorDirectiveModule,
    SecundaryColorDirectiveModule,
    SecundaryTextColorDirectiveModule,
    PrimaryButtonColorDirectiveModule,
    PrimaryButtonTextColorDirectiveModule,
    SecundaryButtonColorDirectiveModule,
    SecundaryButtonTextColorDirectiveModule,
    LabelColorDirectiveModule,
    TitleColorDirectiveModule,
    TitleTextColorDirectiveModule,
    SubTitleColorDirectiveModule,
  ],
  providers: [
    CommonFunctions,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: LOCALE_ID,
      useValue: 'es-CO',
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
