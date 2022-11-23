import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, map } from 'rxjs';

export interface ContentList {
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
  'url': 'http://192.168.0.50/Photo/',
  'fileformat': 'jpg',
  'dateformat': 'yyyy-mm-dd'
}

@Injectable({
  providedIn: 'root'
})
export class ImageproviderService {
  private paths: string[];
  private isLoadingFinished: boolean;

  constructor(private http: HttpClient) {
    this.paths = [];
    this.isLoadingFinished = false;
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

  public exploreIn(onRetrieve: Function, newPath: string): void {
    this.paths.push(newPath);
    this.getDirectoriesAndFiles(onRetrieve, URLS.url.concat(this.getPathToString()));
  }

  public exploreOut(onRetrieve: Function): void {
    this.paths.pop();
    this.getDirectoriesAndFiles(onRetrieve, URLS.url.concat(this.getPathToString()));
  }

  private getDirectoriesAndFiles(onRetrieve: Function, url: string): void {
    this.isLoadingFinished = false;
    this.http.get<ContentList>(url, OPTIONS).subscribe({
      next: response => {
        if (response.status === 200) {
          onRetrieve(response.body);
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

  public get url(): string {
    return URLS.url;
  }
}
