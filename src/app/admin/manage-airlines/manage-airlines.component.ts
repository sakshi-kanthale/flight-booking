import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-airlines',
  standalone: true,
  imports: [CommonModule],
  template: `<div style="padding:40px;font-family:sans-serif;"><h2>Manage Airlines</h2><p>Coming next — CRUD table goes here.</p></div>`
})
export class ManageAirlinesComponent {}