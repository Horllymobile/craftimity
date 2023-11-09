import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-more',
  templateUrl: './more.page.html',
  styleUrls: ['./more.page.scss'],
})
export class MorePage implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  logout() {
    this.authService.signout();
    this.router.navigateByUrl('/craftivity/auth/login');
  }
}
