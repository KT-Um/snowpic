import { Injectable } from '@angular/core';

interface Server {
  content_location: string,
  server_address: string,
  protocol: string,
}

interface App {
  app_name: string,
  supported_formats: string,
  supported_image_formats: string,
  supported_video_formats: string,
  app_title_bar: string,
  dialog: Dialog
}

interface Dialog {
  dialog_close_button: string,
  content_width: string,
  content_height: string,
  content_max_width: string,
  content_max_height: string,
  show_thumbnails: string,
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
  showThumbnails: string | undefined,
  appName: string | undefined,
  supportedFormats: string | undefined,
  supportedImageFormats: string | undefined,
  supportedVideoFormats: string | undefined
}

@Injectable({
  providedIn: 'root'
})
export class EnvironmentLoaderService {
  private readonly ASSETS_URL: string = 'assets/environment.json';

  private server: Server | undefined;
  private app: App | undefined;
  private _apiUrl: string | undefined;
  private isLoaded: boolean;

  constructor() {
    this.isLoaded = false;
  }

  public async load(onLoad: (loader: Environment) => void): Promise<void> {
    if (!this.isLoaded) {
      await fetch(this.ASSETS_URL).then((res: Response) => res.json()).then(env => {
        this.server = env[0];
        this.app = env[1];

        if (!this.server) throw new Error("Cannot retrieve the api url. The environment configuration is not ready yet.");
        if (!this.server.protocol || this.server.protocol?.length === 0) throw new Error("Cannot retrieve protocol. The environment configuration is not ready yet.");
        if (!this.server.server_address || this.server.server_address?.length === 0) throw new Error("Cannot retrieve server_address. The environment configuration is not ready yet.");
        if (!this.server.content_location || this.server.content_location?.length === 0) throw new Error("Cannot retrieve contents_location. The environment configuration is not ready yet.");

        this._apiUrl = `${this.server.protocol}://${this.server.server_address}/${this.server.content_location}/`;
        this.isLoaded = true;
      });
    }
    
    if (!this.apiUrl || this.apiUrl.length === 0) throw new Error("Cannot retrieve the api url. The environment configuration is not ready yet.");
    if (!this.contentLocation || this.contentLocation.length === 0) throw new Error("Cannot retrieve content_location. The environment configuration is not ready yet.");
    if (!this.serverAddress || this.serverAddress.length === 0) throw new Error("Cannot retrieve server_address. The environment configuration is not ready yet.");
    if (!this.protocol || this.protocol.length === 0) throw new Error("Cannot retrieve protocol. The environment configuration is not ready yet.");
    if (!this.dialogCloseButton || this.dialogCloseButton.length === 0) throw new Error("Cannot retrieve dialog_close_button. The environment configuration is not ready yet.");
    if (!this.appTitleBar || this.appTitleBar.length === 0) throw new Error("Cannot retrieve app_title_bar. The environment configuration is not ready yet.");
    if (!this.contentWidth || this.contentWidth.length === 0) throw new Error("Cannot retrieve content_width. The environment configuration is not ready yet.");
    if (!this.contentHeight || this.contentHeight.length === 0) throw new Error("Cannot retrieve content_height. The environment configuration is not ready yet.");
    if (!this.contentMaxWidth || this.contentMaxWidth.length === 0) throw new Error("Cannot retrieve content_max_width. The environment configuration is not ready yet.");
    if (!this.contentMaxHeight || this.contentMaxHeight.length === 0) throw new Error("Cannot retrieve content_max_height. The environment configuration is not ready yet.");
    if (!this.showThumbnails || this.showThumbnails.length === 0) throw new Error("Cannot retrieve show_thumbnails. The environment configuration is not ready yet.");
    if (!this.appName || this.appName.length === 0) throw new Error("Cannot retrieve app_name. The environment configuration is not ready yet.");
    if (!this.supportedFormats || this.supportedFormats.length === 0) throw new Error("Cannot retrieve supported_formats. The environment configuration is not ready yet.");
    if (!this.supportedImageFormats || this.supportedImageFormats.length === 0) throw new Error("Cannot retrieve supported_image_formats. The environment configuration is not ready yet.");
    if (!this.supportedVideoFormats || this.supportedVideoFormats.length === 0) throw new Error("Cannot retrieve supported_video_formats. The environment configuration is not ready yet.");

    onLoad({
      apiUrl: this.apiUrl,
      imageLocation: this.contentLocation,
      serverAddress: this.serverAddress,
      protocol: this.protocol,
      dialogCloseButton: this.dialogCloseButton,
      appTitleBar: this.appTitleBar,
      contentWidth: this.contentWidth,
      contentHeight: this.contentHeight,
      contentMaxWidth: this.contentMaxWidth,
      contentMaxHeight: this.contentMaxHeight,
      showThumbnails: this.showThumbnails,
      appName: this.appName,
      supportedFormats: this.supportedFormats,
      supportedImageFormats: this.supportedImageFormats,
      supportedVideoFormats: this.supportedVideoFormats
    });
  }

  private get apiUrl(): string | undefined {
    return this.server? this._apiUrl : undefined;
  }

  private get contentLocation(): string | undefined {
    return this.server ? this.server.content_location : undefined;
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
  
  private get showThumbnails(): string | undefined {
    return this.app ? this.app.dialog.show_thumbnails : undefined;
  }

  private get appName(): string | undefined {
    return this.app ? this.app.app_name : undefined;
  }
  
  private get supportedFormats(): string | undefined {
    return this.app ? this.app.supported_formats : undefined;
  }

  private get supportedImageFormats(): string | undefined {
    return this.app ? this.app.supported_image_formats : undefined;
  }

  private get supportedVideoFormats(): string | undefined {
    return this.app ? this.app.supported_video_formats : undefined;
  }
}
