import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SelectAppComponent } from './select-app/select-app.component';

const routes: Routes = [
  {
    path: 'craftimity',
    loadChildren: () =>
      import('./craftimity/craftimity.module').then((m) => m.CraftimityModule),
  },
  {
    path: 'craftivity',
    loadChildren: () =>
      import('./craftivity/craftivity.module').then((m) => m.CraftivityModule),
  },
  {
    path: 'select-app',
    component: SelectAppComponent,
  },
  {
    path: '',
    redirectTo: 'select-app',
    pathMatch: 'full',
  },
  {
    path: 'pages',
    loadChildren: () =>
      import('./craftivity/pages/pages.module').then((m) => m.PagesPageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
