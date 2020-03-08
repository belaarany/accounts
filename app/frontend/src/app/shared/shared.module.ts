import { CommonModule } from "@angular/common"
import { NgModule } from "@angular/core"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"

import { FontAwesomeModule } from "@fortawesome/angular-fontawesome"

import { GlobalComponentsModule } from "@root/shared/components/components.module"

@NgModule({
	declarations: [],
	imports: [FormsModule, ReactiveFormsModule, CommonModule, GlobalComponentsModule, FontAwesomeModule],
	exports: [GlobalComponentsModule, FontAwesomeModule],
})
export class GlobalSharedModule {}
