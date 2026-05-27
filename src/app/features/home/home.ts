import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [RouterLink,
    CommonModule, 
    RouterModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
