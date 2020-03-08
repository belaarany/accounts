import { BrowserModule } from "@angular/platform-browser"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { NgModule, ModuleWithProviders, isDevMode } from "@angular/core"
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http"

import { NgxsModule } from "@ngxs/store"
import { NgxsReduxDevtoolsPluginModule } from "@ngxs/devtools-plugin"

import { environment } from "@authentication/env"
import { AppRoutingModule } from "./app-routing.module"
import { AppComponent } from "./app.component"
import { SharedModule } from "./shared/shared.module"
import { SigninState } from "./core/ngxs/state/signin.state"
import { AppTitleService } from "@root/shared/services/title.service"
import { KeyCaseInterceptor, AuthTokenInterceptor } from "@authentication/core/interceptors"

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		AppRoutingModule,
		SharedModule,
		NgxsModule.forRoot([SigninState], { developmentMode: true }),
		NgxsReduxDevtoolsPluginModule.forRoot({
			disabled: environment.production === true,
		}),
	],
	providers: [
		AppTitleService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: KeyCaseInterceptor,
			multi: true,
		},
		{
			provide: HTTP_INTERCEPTORS,
			useClass: AuthTokenInterceptor,
			multi: true,
		},
	],
	bootstrap: [AppComponent],
	exports: [],
})
export class AppModule {}

@NgModule({})
export class AuthenticationSharedModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: AppModule,
			providers: [],
		}
	}
}
