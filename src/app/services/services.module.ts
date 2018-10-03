import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AuthGuardService} from './auth-guard.service';
import {UserService} from './user.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [],
  providers: [AuthGuardService, UserService]
})
export class ServicesModule { }
