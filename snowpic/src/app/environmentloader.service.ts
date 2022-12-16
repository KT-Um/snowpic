import { Injectable } from '@angular/core';

interface Server {
  image_location: string,
  server_address: string,
  protocol: string,
}

interface App {
  app_name: string,
  supported_formats: string,
  app_title_bar: string,
  dialog: Dialog
}

interface Dialog {
  dialog_close_button: string,
  content_width: string,
  content_height: string,
  content_max_width: string,
  content_max_height: string,
  content_preview_list: string,
}

export interface Environment {
  apiUrl: string | undefined,
  imageLocation: string | undefined,
  serverAddress: string | undefined,
  protocol: string | undefined,
  dialogCloseButton: string | undefined,
  appTitleBar: string | undefined,
  contentWidth: string | undefined,
  contentHeight: string | undefined,
  contentMaxWidth: string | undefined,
  contentMaxHeight: string | undefined,
  contentPreviewList: string | undefined,
  appName: string | undefined,
  supportedForamts: string | undefined
}

@Injectable({
  providedIn: 'root'
})
export class EnvironmentLoaderService {
  private readonly ASSETS_URL: string = './assets/environment.json';

  private server: Server | undefined;
  private app: App | undefined;
  private _apiUrl: string | undefined;
  private isLoaded: boolean;

  constructor() {
    this.isLoaded = false;
  }

  public async load(onLoad: (loader: Environment) => void): Promise<void> {
    if (this.isLoaded) {
      onLoad({
        apiUrl: this.apiUrl,
        imageLocation: this.imageLocation,
        serverAddress: this.serverAddress,
        protocol: this.protocol,
        dialogCloseButton: this.dialogCloseButton,
        appTitleBar: this.appTitleBar,
        contentWidth: this.contentWidth,
        contentHeight: this.contentHeight,
        contentMaxWidth: this.contentMaxWidth,
        contentMaxHeight: this.contentMaxHeight,
        contentPreviewList: this.contentPreviewList,
        appName: this.appName,
        supportedForamts: this.supportedForamts
      });

      return;
    }

    await fetch(this.ASSETS_URL).then((res: Response) => res.json()).then(env => {
      this.server = env[0];
      this.app = env[1];
      if (this.server === undefined) throw new Error("Cannot find the api url. The environment configuration is not ready yet.");

      this._apiUrl = `${this.server.protocol}://${this.server.server_address}/${this.server.image_location}/`;
      this.isLoaded = true;

      onLoad({
        apiUrl: this.apiUrl,
        imageLocation: this.imageLocation,
        serverAddress: this.serverAddress,
        protocol: this.protocol,
        dialogCloseButton: this.dialogCloseButton,
        appTitleBar: this.appTitleBar,
        contentWidth: this.contentWidth,
        contentHeight: this.contentHeight,
        contentMaxWidth: this.contentMaxWidth,
        contentMaxHeight: this.contentMaxHeight,
        contentPreviewList: this.contentPreviewList,
        appName: this.appName,
        supportedForamts: this.supportedForamts
      });
    });
  }

  private get apiUrl(): string | undefined {
    return this.server? this._apiUrl : undefined;
  }

  private get imageLocation(): string | undefined {
    return this.server ? this.server.image_location : undefined;
  }

  private get serverAddress(): string | undefined {
    return this.server ? this.server.server_address : undefined;
  }

  private get protocol(): string | undefined {
    return this.server ? this.server.protocol : undefined;
  }

  private get dialogCloseButton(): string | undefined {
    return this.app ? this.app.dialog.dialog_close_button : undefined;
  }

  private get appTitleBar(): string | undefined {
    return this.app ? this.app.app_title_bar : undefined;
  }

  private get contentWidth(): string | undefined {
    return this.app ? this.app.dialog.content_width : undefined;
  }

  private get contentHeight(): string | undefined {
    return this.app ? this.app.dialog.content_height : undefined;
  }

  private get contentMaxWidth(): string | undefined {
    return this.app ? this.app.dialog.content_max_width : undefined;
  }

  private get contentMaxHeight(): string | undefined {
    return this.app ? this.app.dialog.content_max_height : undefined;
  }
  
  private get contentPreviewList(): string | undefined {
    return this.app ? this.app.dialog.content_preview_list : undefined;
  }

  private get appName(): string | undefined {
    return this.app ? this.app.app_name : undefined;
  }
  
  private get supportedForamts(): string | undefined {
    return this.app ? this.app.supported_formats : undefined;
  }
}
