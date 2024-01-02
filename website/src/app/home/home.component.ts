import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
// import anime from 'animejs/lib/anime.es.js';
import { NavbarComponent } from '../components/navbar/navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {}
