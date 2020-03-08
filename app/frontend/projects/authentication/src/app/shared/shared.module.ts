import { CommonModule } from "@angular/common"
import { NgModule } from "@angular/core"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"

import { GlobalSharedModule } from "@root/shared/shared.module"

import { LayoutBaseComponent } from "./layout/base.component"
import { LayoutAuthboxComponent } from "./layout/authbox.component"
import { LayoutProgressbarComponent } from "./layout/progressbar.component"

@NgModule({
	declarations: [LayoutBaseComponent, LayoutAuthboxComponent, LayoutProgressbarComponent],
	imports: [CommonModule, FormsModule, ReactiveFormsModule, GlobalSharedModule],
	exports: [GlobalSharedModule, LayoutBaseComponent, LayoutAuthboxComponent, LayoutProgressbarComponent],
})
export class SharedModule {}
