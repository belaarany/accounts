import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ReactiveFormsModule } from "@angular/forms"
import { HttpClientModule } from "@angular/common/http"

import { SigninComponent } from "./signin.component"
import { SigninRoutingModule } from "./signin-routing.module"
import { SharedModule } from "@authentication/shared/shared.module"

@NgModule({
	declarations: [SigninComponent],
	imports: [CommonModule, HttpClientModule, SigninRoutingModule, SharedModule, ReactiveFormsModule],
	bootstrap: [],
})
export class SigninModule {}
