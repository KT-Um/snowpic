import { Component, OnInit } from '@angular/core';
import { Environment, EnvironmentLoaderService } from '../environmentloader.service';

@Component({
  selector: 'sp-app-title-bar',
  templateUrl: './app-title-bar.component.html',
  styleUrls: ['./app-title-bar.component.css']
})
export class AppTitleBarComponent implements OnInit {
  private _appName: string | undefined;
  private NO_APP_NAME: string = '';
  private _appTitleBar: boolean | undefined;
  private No_APP_TITLE_BAR: boolean = false;

  constructor(private environmentLoader: EnvironmentLoaderService) {
    this._appTitleBar = false;
  }

  ngOnInit(): void {
    this.environmentLoader.load((env: Environment) => {
      if (!env.appName) throw new Error("App title info is not loaded.");
      
      this._appName = env.appName;
      this._appTitleBar = env.appTitleBar === 'true';
    });
  }

  public get appName(): string {
    return this._appName ? this._appName : this.NO_APP_NAME;
  }

  public get appTitleBar(): boolean {
    return this._appTitleBar ? this._appTitleBar : this.No_APP_TITLE_BAR;
  }

  public home(): void {
    
  }
}
