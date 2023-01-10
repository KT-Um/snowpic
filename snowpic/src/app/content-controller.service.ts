import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Environment, EnvironmentLoaderService } from './environmentloader.service';

export interface Content {
  fileIndex: number;
  name: string;
  type: string;
  mtime: string;
  src: string;
  format: string;
  extension: string;
  nextContent: Content | undefined;
  previousContent: Content | undefined;
  autoplay: boolean;
}

export interface ContentDataResponse {
  name: string;
  type: string;
  mtime: string;
}

const HTTP_OPTIONS = {
  observe: 'response' as const,
  responseType: 'json' as const,
  headers: {
    'Content-Type': 'text/plain',
  }
}

export class HttpControllerService {
  private readonly NO_SUPPORTED_FORMAT = '';
  private readonly IMAGE_FORMAT = 'image';
  private readonly VIDEO_FORMAT = 'video';
  private paths: string[];
  private isLoadingFinished: boolean;
  private contentDataList: Content[];
  private imageFormats: string;
  private videoFormats: string;

  constructor(private http: HttpClient, private readonly apiUrl: string, imageFormats: string, videoFormats: string) {
    this.paths = [];
    this.isLoadingFinished = false;
    this.contentDataList = [];
    this.imageFormats = imageFormats;
    this.videoFormats = videoFormats;
  }

  private getPathToString(): string {
    let wholePath: string = '';
    this.paths.forEach((partialPath) => {
      wholePath = wholePath.concat(partialPath, '/');
    });
    return wholePath;
  }

  public accessTopDirectory(onRetrieve: Function, onComplete: Function): void {
    this.paths = [];
    this.getDirectoriesAndFiles(onRetrieve, onComplete, this.apiUrl);
  }

  public exploreIn(onRetrieve: Function, onComplete: Function, newPath: string): string {
    this.paths.push(newPath);
    this.getDirectoriesAndFiles(onRetrieve, onComplete, this.apiUrl.concat(this.getPathToString()));
    return this.paths[this.paths.length - 1];
  }

  public exploreOut(onRetrieve: Function, onComplete: Function): string {
    const pastPath = this.paths.pop();
    this.getDirectoriesAndFiles(onRetrieve, onComplete, this.apiUrl.concat(this.getPathToString()));
    return pastPath ? pastPath : '';
  }

  private getDirectoriesAndFiles(onRetrieve: Function, onComplete: Function, url: string): void {
    this.contentDataList = [];
    this.isLoadingFinished = false;

    this.http.get<ContentDataResponse>(url, HTTP_OPTIONS).subscribe({
      next: (response: HttpResponse<ContentDataResponse>) => {
        if (response.status === 200) {
          const contentData: any = response.body;
          if (contentData) {
            const currentPath = this.getCurrentPath();

            let i = 0;
            contentData.forEach((content: ContentDataResponse) => {
              const contentFormat = this.isImage(content.name) ? this.IMAGE_FORMAT : this.isVideo(content.name) ? this.VIDEO_FORMAT : this.NO_SUPPORTED_FORMAT;
              if (content.type !== "file" || contentFormat !== this.NO_SUPPORTED_FORMAT) {
                this.contentDataList.push({
                  fileIndex: content.type === "file" ? i++ : 0,
                  name: content.name,
                  type: content.type,
                  mtime: content.mtime,
                  src: this.getContentPath(content.name, currentPath),
                  format: contentFormat,
                  extension: content.name.lastIndexOf('.') !== -1 ? content.name.substring(content.name.lastIndexOf('.') + 1, content.name.length).toLowerCase() : '',
                  nextContent: undefined,
                  previousContent: undefined,
                  autoplay: false
                });
              }
            });

            for (let i = 0; i < this.contentDataList.length; i++) {
              this.contentDataList[i].nextContent ??= this.contentDataList[i + 1];
              this.contentDataList[i].previousContent ??= this.contentDataList[i - 1];
            }
          }
          
          onRetrieve(this.contentDataList.slice());
        }
      },
      error: err => { },
      complete: () => {
        this.isLoadingFinished = true;
        onComplete();
      }
    });
  }

  public isLoading(): boolean {
    return !this.isLoadingFinished;
  }

  public isNowTopDirectory(): boolean {
    return this.paths.length == 0 ? true : false;
  }

  public getCurrentPath(): string {
    if (this.paths.length === 0)
      return '/';
    return `${this.getPathToString()}`;
  }

  public getContentPath(contentName: string, path?: string): string {
    if (!path) path = this.getCurrentPath();
    return this.apiUrl.concat(path, contentName);
  }

  private isImage(content: string): boolean {
    const extension = content.substring(content.lastIndexOf('.') + 1, content.length);

    if (extension.match(this.imageFormats)) {
      return true;
    } else {
      return false;
    }
  }

  private isVideo(content: string): boolean {
    const extension = content.substring(content.lastIndexOf('.') + 1, content.length);

    if (extension.match(this.videoFormats)) {
      return true;
    } else {
      return false;
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class ContentControllerService {
  private httpController: HttpControllerService | undefined;
  private isReadyToUse: boolean;

  constructor(private http: HttpClient, private environmentLoader: EnvironmentLoaderService) {
    this.isReadyToUse = false;
  }

  public async ready(): Promise<HttpControllerService | undefined> {
    if (this.isReadyToUse) {
      return this.httpController;
    }

    let apiUrl: string = '', imageFormats: string = '', videoFormats: string = '';
    await this.environmentLoader.load((env: Environment) => {
      if (!env.apiUrl) throw new Error("API URL is not defined yet. Loading failed.");
      apiUrl = env.apiUrl;

      if(!env.supportedImageFormats) throw new Error("Image formats are not defined yet. Loading failed.")
      imageFormats = env.supportedImageFormats;

      if(!env.supportedVideoFormats) throw new Error("Video formats are not defined yet. Loading failed.")
      videoFormats = env.supportedVideoFormats;
    });

    if (apiUrl.length === 0) throw new Error("API URL is not defined yet. It is empty.");
    if (imageFormats.length === 0) throw new Error("image_formats is not defined yet. It is empty.");
    if (videoFormats.length === 0) throw new Error("video_formats is not defined yet. It is empty.");
    this.isReadyToUse = true;

    return this.httpController = new HttpControllerService(this.http, apiUrl, imageFormats, videoFormats);
  }
}
