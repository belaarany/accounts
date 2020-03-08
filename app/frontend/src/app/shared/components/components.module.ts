import { CommonModule } from "@angular/common"
import { NgModule } from "@angular/core"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"

import { FontAwesomeModule } from "@fortawesome/angular-fontawesome"

import { ButtonComponent } from "./button/button.component"
import { InputComponent } from "./input/input.component"

@NgModule({
	declarations: [ButtonComponent, InputComponent],
	imports: [CommonModule, FormsModule, ReactiveFormsModule, FontAwesomeModule],
	exports: [ButtonComponent, InputComponent],
})
export class GlobalComponentsModule {}
