import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { ScatterPlotComponent } from './scatter-plot/scatter-plot.component';
import { PlotlyModule } from 'angular-plotly.js';

import * as PlotlyJS from 'plotly.js-dist-min';
import { StageComponent } from './stage/stage.component';
import { ToolComponent } from './tool/tool.component';
import { AppContextService } from './services/app-context.service';

PlotlyModule.plotlyjs = PlotlyJS;
@NgModule({
  declarations: [
    AppComponent,
    BarChartComponent,
    ScatterPlotComponent,
    StageComponent,
    ToolComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, PlotlyModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
