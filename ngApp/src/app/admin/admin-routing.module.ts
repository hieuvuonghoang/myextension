import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { ManagerLicenseComponent } from './manager-license/manager-license/manager-license.component';
import { ManagerUserComponent } from './manager-user/manager-user.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'admin',
    component: AdminComponent,
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
    component: AdminComponent,
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
        path: '',
        component: ManagerLicenseComponent,
        data: {
          animation: 'ManagerLincense',
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
