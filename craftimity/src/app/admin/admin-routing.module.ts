import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPage } from './admin.page';

const routes: Routes = [
  {
    path: '',
    component: AdminPage,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadChildren: () =>
          import('./home/home.module').then((m) => m.HomePageModule),
      },
      {
        path: 'orders',
        loadChildren: () =>
          import('./orders/orders.module').then((m) => m.OrdersPageModule),
      },
      {
        path: 'messages',
        loadChildren: () =>
          import('./messages/messages.module').then(
            (m) => m.MessagesPageModule
          ),
      },
      // {
      //   path: 'wishlists',
      //   loadChildren: () =>
      //     import('./wishlists/wishlists.module').then((m) => m.WishlistsPageModule),
      // },
      {
        path: 'more',
        loadChildren: () =>
          import('./more/more.module').then((m) => m.MorePageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
