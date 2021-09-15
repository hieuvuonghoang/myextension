import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { LoginComponent } from '../auth/login/login.component';
import { AdminComponent } from './admin/admin.component';
import { ManagerLicenseComponent } from './manager-license/manager-license/manager-license.component';
import { NavigationComponent } from './core/navigation/navigation.component';
import { MainSidebarComponent } from './core/main-sidebar/main-sidebar.component';
import { MainFooterComponent } from './core/main-footer/main-footer.component';
import { BreadCrumbComponent } from './core/bread-crumb/bread-crumb.component';
import { ManagerUserComponent } from './manager-user/manager-user.component';
import { ManagerLicenseDetailComponent } from './manager-license/manager-license-detail/manager-license-detail.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

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
    FormsModule,
    HttpClientModule,
  ]
})
export class AdminModule { }
