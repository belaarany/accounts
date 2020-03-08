import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ReactiveFormsModule } from "@angular/forms"
import { HttpClientModule } from "@angular/common/http"

import { RegisterComponent } from "./register.component"
import { RegisterRoutingModule } from "./register-routing.module"
import { SharedModule } from "@authentication/shared/shared.module"

@NgModule({
	declarations: [RegisterComponent],
	imports: [CommonModule, HttpClientModule, RegisterRoutingModule, SharedModule, ReactiveFormsModule],
	bootstrap: [],
})
export class RegisterModule {}
