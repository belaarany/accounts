import { NgModule } from "@angular/core"
import { Routes, RouterModule } from "@angular/router"

import { SigninComponent } from "./signin.component"

const routes: Routes = [
	{
		path: "",
		component: SigninComponent,
		data: {},
	},
	{
		path: "oauth",
		component: SigninComponent,
		data: {
			isOauth: true,
		},
	},
]

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class SigninRoutingModule {}
