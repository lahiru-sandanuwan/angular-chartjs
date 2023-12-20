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
import { FileViewerComponent } from './file-viewer/file-viewer.component';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { JsonNodeComponent } from './file-viewer/json-node/json-node.component';
PlotlyModule.plotlyjs = PlotlyJS;
@NgModule({
  declarations: [
    AppComponent,
    BarChartComponent,
    ScatterPlotComponent,
    StageComponent,
    ToolComponent,
    FileViewerComponent,
    JsonNodeComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, PlotlyModule, PdfJsViewerModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
