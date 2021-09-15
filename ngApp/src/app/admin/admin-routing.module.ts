import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanDeactivateGuard } from '../guard/can-deactivate.guard';
import { ManagerLicenseDetailResolverService } from '../resolvers/manager-license-detail-resolver.service';
import { AdminComponent } from './admin/admin.component';
import { ManagerLicenseDetailComponent } from './manager-license/manager-license-detail/manager-license-detail.component';
import { ManagerLicenseComponent } from './manager-license/manager-license/manager-license.component';
import { ManagerUserComponent } from './manager-user/manager-user.component';
import { CanActivateGuard } from '../guard/can-activate.guard';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [CanActivateGuard],
    children: [
      {
        path: 'manager-license',
        component: ManagerLicenseComponent,
        data: {
          animation: 'ManagerLincense',
        }
      },
      {
        path: 'manager-user',
        component: ManagerUserComponent,
        data: {
          animation: 'ManagerUser',
        }
      },
      {
        path: 'manager-license-detail/:id',
        component: ManagerLicenseDetailComponent,
        data: {
          animation: 'ManagerLicenseDetail',
        },
        resolve: {
          license: ManagerLicenseDetailResolverService,
        },
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: '',
        component: ManagerLicenseComponent,
        data: {
          animation: 'ManagerLincense',
        }
      }
    ]
  },
  {
    path: '',
    redirectTo: '/admin/manager-license',
    pathMatch: 'full',
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
