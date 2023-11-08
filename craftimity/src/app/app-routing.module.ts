import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth/auth.guard';
import { SelectAppComponent } from './select-app/select-app.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'select-app',
    pathMatch: 'full',
  },
  {
    path: 'select-app',
    component: SelectAppComponent,
  },
  {
    path: 'craftimity',
    loadChildren: () =>
      import('./craftimity/craftimity.module').then((m) => m.CraftimityModule),
    // canActivate: [AuthGuard],
  },
  {
    path: 'craftivity',
    loadChildren: () =>
      import('./craftivity/craftivity.module').then((m) => m.CraftivityModule),
    // canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
