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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ContentShowDialogComponent } from './content-show-dialog/content-show-dialog.component';
import { AutoScrollDirective } from './autoscroll.directive';
import { ContentsProviderService } from './contentsprovider.service';

@NgModule({
  declarations: [
    AppComponent,
    ContentShowDialogComponent,
    AutoScrollDirective
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
    BrowserAnimationsModule
  ],
  providers: [ContentsProviderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
