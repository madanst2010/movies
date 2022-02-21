import { Component, OnInit } from '@angular/core';
import { BaseModal, ButtonModule } from 'carbon-components-angular';

@Component({
  selector: 'app-select-playlist',
  templateUrl: './select-playlist.component.html',
  styleUrls: ['./select-playlist.component.scss']
})
export class SelectPlaylistComponent  extends BaseModal {

  items = [
    { content: "one" },
    { content: "two" },
    { content: "three" },
    { content: "four" }
  ];
}
