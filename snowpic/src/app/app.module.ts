import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ContentShowDialogComponent } from './content-show-dialog/content-show-dialog.component';
import { EnvironmentLoaderService } from './environmentloader.service';

import { AutoScrollDirective } from './autoscroll.directive';
import { ContentsControllerService } from './contentscontroller.service';
import { TitleBarComponent } from './title-bar/title-bar.component';
import { ProcessSlideEventDirective } from './process-slide-event.directive';
import { ContentsListComponent } from './contents-list/contents-list.component';

@NgModule({
  declarations: [
    AppComponent,
    ContentShowDialogComponent,
    AutoScrollDirective,
    TitleBarComponent,
    ProcessSlideEventDirective,
    ContentsListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatDividerModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    BrowserAnimationsModule,
    MatSnackBarModule
  ],
  providers: [
    EnvironmentLoaderService,
    ContentsControllerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
