import { UsersService } from 'src/app/core/services/users/users.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'craftimity-more',
  templateUrl: './more.page.html',
  styleUrls: ['./more.page.scss'],
})
export class MorePage implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private usersService: UsersService
  ) {}

  ngOnInit() {}

  logout() {
    this.usersService.signout();
    this.router.navigateByUrl('/page/auth/login');
  }
}
