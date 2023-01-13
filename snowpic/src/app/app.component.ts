import { Component, OnInit } from '@angular/core';
import { windowWhen } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    window.ondragstart = () => { return false; };
    window.oncontextmenu = () => { return false; };
  }
}
