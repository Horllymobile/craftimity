import { Component, OnInit } from '@angular/core';
import { STORAGE_VARIABLES } from '../core/constants/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-app',
  templateUrl: './select-app.component.html',
  styleUrls: ['./select-app.component.scss'],
})
export class SelectAppComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  async goToCraftimity() {
    localStorage.setItem(STORAGE_VARIABLES.APP, STORAGE_VARIABLES.CRAFTIMITY);
    this.router.navigateByUrl('/craftimity');
  }

  async goToCraftivity() {
    localStorage.setItem(STORAGE_VARIABLES.APP, STORAGE_VARIABLES.CRAFTIVITY);
    this.router.navigateByUrl('/craftivity');
  }
}
