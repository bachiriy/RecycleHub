import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';
import { RoleGuard } from './auth/guards/role.guard';
import { CollectionsResolver } from './collections/resolvers/collections.resolver';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'collections',
    canActivate: [AuthGuard],
    resolve: {
      collections: CollectionsResolver
    },
    children: [
      {
        path: 'new',
        canActivate: [RoleGuard],
        data: { role: 'PARTICULAR' },
        loadChildren: () => import('./collections/new-collection/new-collection.module').then(m => m.NewCollectionModule)
      },
      {
        path: 'my',
        canActivate: [RoleGuard],
        data: { role: 'PARTICULAR' },
        loadChildren: () => import('./collections/my-collections/my-collections.module').then(m => m.MyCollectionsModule)
      },
      {
        path: 'available',
        canActivate: [RoleGuard],
        data: { role: 'COLLECTOR' },
        loadChildren: () => import('./collections/available-collections/available-collections.module').then(m => m.AvailableCollectionsModule)
      },
      {
        path: 'assigned',
        canActivate: [RoleGuard],
        data: { role: 'COLLECTOR' },
        loadChildren: () => import('./collections/assigned-collections/assigned-collections.module').then(m => m.AssignedCollectionsModule)
      }
    ]
  },
  {
    path: 'points',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'PARTICULAR' },
    loadChildren: () => import('./points/points.module').then(m => m.PointsModule)
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 