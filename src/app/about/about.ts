import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-about',
  imports: [
    MatCardModule,
    MatListModule,
    MatIconModule
  ],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {

}
