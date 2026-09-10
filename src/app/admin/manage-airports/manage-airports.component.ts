import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-airports',
  standalone: true,
  imports: [CommonModule],
  template: `<div style="padding:40px;font-family:sans-serif;"><h2>Manage Airports</h2><p>Coming next — CRUD table goes here.</p></div>`
})
export class ManageAirportsComponent {}