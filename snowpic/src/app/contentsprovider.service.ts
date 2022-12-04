import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { PROTOCOL, SERVER_ADDRESS, IMAGE_LOCATION } from '../assets/env';

export interface Content {
  name: string;
  type: string;
  mtime: any;
  src: string;
  nextContent: Content | undefined;
  previousContent: Content | undefined;
}

export interface ContentDataResponse {
  name: string;
  type: string;
  mtime: any;
}

const OPTIONS = {
  observe: 'response' as const,
  responseType: 'json' as const,
  headers: {
    'Content-Type': 'text/plain',
  }
}

const URLS = {
  'url': `${PROTOCOL.protocol}://${SERVER_ADDRESS.address}/${IMAGE_LOCATION.name}/`
}

@Injectable({
  providedIn: 'root'
})
export class ContentsProviderService {
  private paths: string[];
  private isLoadingFinished: boolean;
  private contentDataList: Content[];

  constructor(private http: HttpClient) {
    this.paths = [];
    this.isLoadingFinished = false;
    this.contentDataList = [];
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
    this.getDirectoriesAndFiles(onRetrieve, URLS.url);
  }

  private initContentData(): void {
    this.contentDataList = [];
    this.isLoadingFinished = false;
  }

  public exploreIn(onRetrieve: Function, newPath: string): string {
    this.paths.push(newPath);
    this.getDirectoriesAndFiles(onRetrieve, URLS.url.concat(this.getPathToString()));
    return this.paths[this.paths.length - 1];
  }

  public exploreOut(onRetrieve: Function): string {
    const pastPath = this.paths.pop();
    this.getDirectoriesAndFiles(onRetrieve, URLS.url.concat(this.getPathToString()));
    return pastPath ? pastPath : '';
  }

  private getDirectoriesAndFiles(onRetrieve: Function, url: string): void {
    this.initContentData();
    this.http.get<ContentDataResponse>(url, OPTIONS).subscribe({
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
    return `/${this.getPathToString()}`;
  }

  public getContent(contentName: string): Content | undefined {
    for (let i = 0; i < this.contentDataList.length; i++) {
      if (this.contentDataList[i].name === contentName) {
        return this.contentDataList[i];
      }
    }
    
    return undefined;
  }

  public getContentPath(contentName: string, path?: string): string {
    if (!path) path = this.getCurrentPath();
    return this.url.concat(path, contentName);
  }

  public get url(): string {
    return URLS.url;
  }
}
