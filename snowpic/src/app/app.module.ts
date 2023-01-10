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
import { APP_BASE_HREF } from '@angular/common';

import { ContentShowComponent } from './content-show/content-show.component';
import { TitleBarComponent } from './title-bar/title-bar.component';
import { ContentListComponent } from './content-list/content-list.component';

import { EnvironmentLoaderService } from './environmentloader.service';
import { AutoScrollDirective } from './autoscroll.directive';
import { ContentControllerService } from './content-controller.service';

import { TouchControlDirective } from './touch-control.directive';
import { ThumbnailControlDirective } from './thumbnail-control.directive';
import { PeripheralsControlDirective } from './peripherals-control.directive';
import { ThumbnailTouchControlDirective } from './thumbnail-touch-control.directive';

@NgModule({
  declarations: [
    AppComponent,
    ContentShowComponent,
    AutoScrollDirective,
    TitleBarComponent,
    TouchControlDirective,
    ContentListComponent,
    ThumbnailControlDirective,
    PeripheralsControlDirective,
    ThumbnailTouchControlDirective
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
    ContentControllerService,
    { provide: APP_BASE_HREF, useValue: `/${window.location.pathname.split('/')[1] || ''}` }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
