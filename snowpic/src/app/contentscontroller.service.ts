import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Environment, EnvironmentLoaderService } from './environmentloader.service';

export interface Content {
  name: string;
  type: string;
  mtime: string;
  src: string;
  nextContent: Content | undefined;
  previousContent: Content | undefined;
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

@Injectable({
  providedIn: 'root'
})
export class ContentsControllerService {
  private paths: string[];
  private isLoadingFinished: boolean;
  private contentDataList: Content[];
  private apiUrl: string;
  private readonly ASSETS_URL: string = './assets/environment.json';
  private isReadyToUse: boolean;

  constructor(private http: HttpClient, private environmentLoader: EnvironmentLoaderService) {
    this.paths = [];
    this.isLoadingFinished = false;
    this.contentDataList = [];
    this.apiUrl = '';
    this.isReadyToUse = false;
  }

  public async ready(onReady: Function) {
    if (this.isReadyToUse) {
      onReady();
      return
    }

    await this.environmentLoader.load((env: Environment) => {
      if (!env.apiUrl) throw new Error("API URL is not defined yet. Loading failed.");
      this.apiUrl = env.apiUrl;
    });

    if (this.apiUrl === '') throw new Error("API URL is not defined yet.");
    this.isReadyToUse = true;
    onReady();
  }

  private getPathToString(): string {
    let wholePath: string = '';
    this.paths.forEach((partialPath) => {
      wholePath = wholePath.concat(partialPath, '/');
    });
    return wholePath;
  }

  public accessTopDirectory(onRetrieve: Function): void {
    this.paths = [];
    this.getDirectoriesAndFiles(onRetrieve, this.apiUrl);
  }

  public exploreIn(onRetrieve: Function, newPath: string): string {
    this.paths.push(newPath);
    this.getDirectoriesAndFiles(onRetrieve, this.apiUrl.concat(this.getPathToString()));
    return this.paths[this.paths.length - 1];
  }

  public exploreOut(onRetrieve: Function): string {
    const pastPath = this.paths.pop();
    this.getDirectoriesAndFiles(onRetrieve, this.apiUrl.concat(this.getPathToString()));
    return pastPath ? pastPath : '';
  }

  private getDirectoriesAndFiles(onRetrieve: Function, url: string): void {
    this.contentDataList = [];
    this.isLoadingFinished = false;

    this.http.get<ContentDataResponse>(url, HTTP_OPTIONS).subscribe({
      next: (response: HttpResponse<ContentDataResponse>) => {
        if (response.status === 200) {
          const contentData: any = response.body;
          if (contentData) {
            const currentPath = this.getCurrentPath();

            contentData.forEach((content: ContentDataResponse, index: number) => {
              this.contentDataList.push({
                name: content.name,
                type: content.type,
                mtime: content.mtime,
                src: this.getContentPath(content.name, currentPath),
                nextContent: undefined,
                previousContent: undefined
              });
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
      complete: () => { this.isLoadingFinished = true; }
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

  public findContent(contentName: string): Content | undefined {
    for (let i = 0; i < this.contentDataList.length; i++) {
      if (this.contentDataList[i].name === contentName) {
        return this.contentDataList[i];
      }
    }
    
    return undefined;
  }

  public getContentPath(contentName: string, path?: string): string {
    if (!path) path = this.getCurrentPath();
    return this.apiUrl.concat(path, contentName);
  }

  /*public set currentContent(content: Content | undefined) {
    this._currentContent = content;
  }*/

  /*public get currentContent(): Content | undefined {
    return this._currentContent;
  }*/

  /*public moveToNext(): boolean {
    if (!this._currentContent) return false;

    if (this._currentContent.nextContent) {
      this._currentContent = this._currentContent.nextContent;
      return true;
    }

    return false;
  }

  public moveToPrevious(): boolean {
    if (!this._currentContent) return false;

    if (this._currentContent.previousContent) {
      this._currentContent = this._currentContent.previousContent;
      return true;
    }

    return false;
  }*/
}
