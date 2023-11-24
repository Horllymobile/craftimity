import { UsersService } from 'src/app/core/services/users/users.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'craftivity-more',
  templateUrl: './more.page.html',
  styleUrls: ['./more.page.scss'],
})
export class MorePage implements OnInit {
  constructor(private usersService: UsersService, private router: Router) {}

  ngOnInit() {}

  logout() {
    this.usersService.signout();
    this.router.navigateByUrl('/craftivity/auth/login');
  }
}
