import { AfterViewInit, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContentsProviderService, Content } from '../contentsprovider.service';

@Component({
  selector: 'sp-content-show-dialog',
  templateUrl: './content-show-dialog.component.html',
  styleUrls: ['./content-show-dialog.component.css']
})
export class ContentShowDialogComponent implements AfterViewInit {
  private _src: string | undefined;
  private _isDialogOpened: boolean;
  private _isEmptyContent: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) private data: Content, private contentsProvider: ContentsProviderService) {
    this._isEmptyContent = data ? false: true;
    this._src = data?.src;
    this._isDialogOpened = false;
    setTimeout(()=>{this.isDialogOpened = true;}, 300);
  }

  ngAfterViewInit(): void {
  }

  public get isEmptyContent(): boolean {
    return this._isEmptyContent;
  }

  public onKeyDown(e: KeyboardEvent): void {
    switch (e.key) {
      case 'esc':
        break;
      case 'ArrowLeft':
        this.previousSrc();
        break;
      case 'ArrowRight':
        this.nextSrc();
        break; 
    }
  }

  private nextSrc(): void {
    const content: Content | undefined = this.contentsProvider.getContent(this.data.name);
    if (!content) return undefined;

    if (content.nextContent !== undefined) {
      this.data = content.nextContent;
      this._src = content.nextContent.src;
    }
  }

  private previousSrc(): void {
    const content: Content | undefined = this.contentsProvider.getContent(this.data.name);
    if (!content) return undefined;

    if (content.previousContent !== undefined) {
      this.data = content.previousContent;
      this._src = content.previousContent.src;
    }
  }

  public get src(): string | undefined {
    return this._src;
  }

  public set isDialogOpened(isOpened: boolean) {
    this._isDialogOpened = isOpened;
  }

  public get isDialogOpened(): boolean {
    return this._isDialogOpened;
  }
}
