import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { ManagerLicenseComponent } from './manager-license/manager-license/manager-license.component';
import { NavigationComponent } from './navigation/navigation.component';
import { MainSidebarComponent } from './main-sidebar/main-sidebar.component';
import { MainFooterComponent } from './main-footer/main-footer.component';
import { BreadCrumbComponent } from './bread-crumb/bread-crumb.component';
import { ManagerUserComponent } from './manager-user/manager-user.component';
import { ManagerLicenseDetailComponent } from './manager-license/manager-license-detail/manager-license-detail.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    LoginComponent,
    AdminComponent,
    ManagerLicenseComponent,
    NavigationComponent,
    MainSidebarComponent,
    MainFooterComponent,
    BreadCrumbComponent,
    ManagerUserComponent,
    ManagerLicenseDetailComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    HttpClientModule,
  ]
})
export class AdminModule { }
