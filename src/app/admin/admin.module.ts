import { CommonModule } from "@angular/common";
import { NgModule, Provider } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AdminLayoutComponent } from './shared/components/admin-layout/admin-layout.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { CreatePageComponent } from './create-page/create-page.component';
import { FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";
import { AuthService } from "./shared/services/auth.service";
import { AuthGuard } from "./shared/services/auth.guard";
import { RegistrationPageComponent } from "./registration-page/registration-page.component";
import { NotAuthGuard } from "./shared/services/NotAuth.guard";



@NgModule({
  providers: [AuthGuard, NotAuthGuard],
  declarations: [
    AdminLayoutComponent,
    LoginPageComponent,
    CreatePageComponent,
    RegistrationPageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild([
      {path: '', component: AdminLayoutComponent, children: [
        {path: '', redirectTo: '/admin/create', pathMatch: 'full'},
        {path: 'registration', component: RegistrationPageComponent, canActivate: [NotAuthGuard]},
        {path: 'login', component: LoginPageComponent, canActivate: [NotAuthGuard]},
        {path: 'create', component: CreatePageComponent, canActivate: [AuthGuard]}
      ]}
    ])
  ],
  exports: [RouterModule]
})
export class AdminModule {}
