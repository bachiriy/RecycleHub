import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';
import { RoleGuard } from './auth/guards/role.guard';
import { CollectionsResolver } from './collections/resolvers/collections.resolver';
import { NewCollectionComponent } from './collections/new-collection/new-collection.component'; // Import components
import { MyCollectionsComponent } from './collections/my-collections/my-collections.component';
import { AvailableCollectionsComponent } from './collections/available-collections/available-collections.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
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
        component: NewCollectionComponent
      },
      {
        path: 'my',
        canActivate: [RoleGuard],
        data: { role: 'PARTICULAR' },
        component: MyCollectionsComponent
      },
      {
        path: 'available',
        canActivate: [RoleGuard],
        data: { role: 'COLLECTOR' },
        component: AvailableCollectionsComponent
      },
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
    redirectTo: 'auth/profile',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }