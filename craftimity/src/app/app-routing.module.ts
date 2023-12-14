import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth/auth.guard';
import { SessionGuard } from './core/guards/session/session.guard';
import { RoleGuard } from './core/guards/role/role.guard';
import { PagePage } from './page/page.page';

const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
    canActivate: [AuthGuard, RoleGuard],
  },
  {
    path: 'pages',
    component: PagePage,
    loadChildren: () =>
      import('./page/page.module').then((m) => m.PagePageModule),
    canActivate: [SessionGuard],
  },
  {
    path: '',
    redirectTo: 'pages',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
