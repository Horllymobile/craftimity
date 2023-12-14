import { Component, OnInit } from '@angular/core';
import anime from 'animejs/lib/anime.es.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'craftimity-website';
  showIntro = true;
  ngOnInit(): void {
    setTimeout(() => {
      this.showIntro = false;
    }, 5000);

    anime({
      targets: '.intro',
      endDelay: 1000,
      delay: 1000,
      rotate: '5turn',
      backgroundColor: '#FFF',
      duration: 5000,
    });
  }
}
