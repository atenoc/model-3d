import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { Adontograma2Component } from './adontograma2/adontograma2.component';
import { Model3dComponent } from './model3d/model3d.component';
import { ModelSimpleLoadComponent } from './model-simple-load/model-simple-load.component';

@NgModule({
  declarations: [
    AppComponent,
    Adontograma2Component,
    Model3dComponent,
    ModelSimpleLoadComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
