import { NgModule } from "@angular/core"
import { Routes, RouterModule, PreloadAllModules } from "@angular/router"

const routes: Routes = [
	{
		path: "signin",
		loadChildren: "./pages/signin/signin.module#SigninModule",
	},
	{
		path: "register",
		loadChildren: "./pages/register/register.module#RegisterModule",
	},
]

@NgModule({
	imports: [
		RouterModule.forRoot(routes, {
			preloadingStrategy: PreloadAllModules,
		}),
	],
	exports: [RouterModule],
})
export class AppRoutingModule {}
