import { Component, OnInit, ViewEncapsulation, HostListener } from "@angular/core"
import { FormBuilder, NgForm } from "@angular/forms"
import { trigger, transition, animate, style } from "@angular/animations"
import { Router, ActivatedRoute } from "@angular/router"

import { Observable, Subject } from "rxjs"

import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { FaIcons } from "@root/interfaces/fontawesome.interface"

import { Store, Select } from "@ngxs/store"
import { SigninState } from "@authentication/core/ngxs/state/signin.state"
import { SigninStateModel } from "@authentication/core/ngxs/types/signin.interface"
import { SigninAction } from "@authentication/core/ngxs/actions/signin.actions"

import { AppTitleService } from "@root/shared/services/title.service"
import { AccountPartial } from "@authentication/interfaces/account.interface"
import { ApplicationPartial } from "@authentication/interfaces/application.interface"
import { AuthenticationFlowService } from "@authentication/core/services/authentication-flow/authentication-flow.service"
import {
	Step,
	ApiResponseError,
	ApiErrorReason,
} from "@authentication/core/services/authentication-flow/authentication-flow.interface"
import { ApplicationsService } from "@authentication/core/services/applications/applications.service"

@Component({
	selector: "app-signin-page",
	templateUrl: "./signin.component.html",
	styleUrls: ["./signin.component.scss"],
	encapsulation: ViewEncapsulation.None,
})
export class SigninComponent implements OnInit {
	@Select(state => state.signin.currentStep) public currentStep$: Observable<Step>
	@Select(state => state.signin.accountPartial) public accountPartial$: Observable<AccountPartial>
	@Select(state => state.signin.applicationPartial) public applicationPartial$: Observable<ApplicationPartial>
	@Select(state => state.signin.isFetching) public isFetching$: Observable<boolean>

	public currentStep: Step
	public accountPartial: AccountPartial
	public applicationPartial: ApplicationPartial
	public isFetching: boolean

	public faIcons: FaIcons = { faArrowLeft }
	public authErrors: string[] = []
	public onFocusRequest$: Subject<any> = new Subject()
	public form = this.formBuilder.group({
		input: [""],
	})
	public isOauth: boolean = false

	constructor(
		private formBuilder: FormBuilder,
		private authFlowService: AuthenticationFlowService,
		private applicationsService: ApplicationsService,
		private store: Store,
		private titleService: AppTitleService,
		private route: ActivatedRoute,
		private router: Router,
	) {}

	ngOnInit(): void {
		this.titleService.setTitle(["Sign in"])

		this.isOauth = Boolean(this.route.snapshot.data.isOauth)

		this.currentStep$.subscribe(value => (this.currentStep = value))
		this.accountPartial$.subscribe(value => (this.accountPartial = value))
		this.applicationPartial$.subscribe(value => (this.applicationPartial = value))
		this.isFetching$.subscribe(value => (this.isFetching = value))

		this.resetSession()
	}

	async resetSession(): Promise<void> {
		this.authErrors = []

		try {
			await this.authFlowService.reset()
			await this.authFlowService.start()

			if (this.isOauth === true) {
				await this.applicationsService.exchangeClientId(this.route.snapshot.queryParamMap.get("client_id"))
				await this.applicationsService.getPartial()
			}

			await this.authFlowService.init()
		} catch (e) {
			console.log(e)
		}
	}

	get accountInfoText(): { primary: string; secondary: string } {
		return {
			primary: this.accountPartial === null ? "Sign in" : "Welcome",
			secondary: this.accountPartial === null ? "to your account" : this.accountPartial.name,
		}
	}

	get applicationInfoText(): { name: string, homeUrl: string } {
		return {
			name: this.applicationPartial.name,
			homeUrl: this.applicationPartial.homeUrl,
		}
	}

	get leadAvatar(): string | null {
		return this.accountPartial === null ? null : this.accountPartial.avatarUrl
	}

	async formSubmit($event: Event): Promise<void> {
		if (this.isFetching === false) {
			console.log("SigninComponent#formSubmit()", { values: this.form.value, currentStep: this.currentStep })

			this.authErrors = []

			switch (this.currentStep) {
				case Step.IDENTIFIER: {
					if (this.form.value.input.length === 0) {
						this.authErrors.push("Enter your identifier or email address.")

						this.onFocusRequest$.next()
						return
					}

					try {
						await this.authFlowService.lookup(this.form.value.input)
					} catch (e) {
						if (e instanceof ApiResponseError) {
							e.errors.forEach(error => {
								if (error.reason === ApiErrorReason.Account.ACCOUNT_NOT_EXISTS) {
									this.authErrors.push("This account cannot be found.")

									this.onFocusRequest$.next()
								}
							})
						}
					}

					break
				}

				case Step.PASSWORD: {
					if (this.form.value.input.length === 0) {
						this.authErrors.push("Enter your password.")

						this.onFocusRequest$.next()
						return
					}

					try {
						let code = await this.authFlowService.challenge(this.form.value.input)
						console.log({ code })
					} catch (e) {
						if (e instanceof ApiResponseError) {
							e.errors.forEach(error => {
								if (error.reason === ApiErrorReason.Account.INVALID_PASSWORD) {
									this.authErrors.push("Incorrect password.")

									this.onFocusRequest$.next()
								}
							})
						}
					}

					break
				}
			}
		}
	}

	onAccountInfoBackClick(): void {
		this.resetSession()
	}

	@HostListener("document:keydown", ["$event"])
	onEscapeKeydownListener(event: KeyboardEvent): void {
		if (event.key === "Escape") {
			if (this.isFetching === false) {
				if (
					this.currentStep === Step.PASSWORD ||
					this.currentStep === Step.ONE_TIME_PASSWORD ||
					this.currentStep === Step.BACKUP_CODE
				) {
					this.resetSession()
				}
			}
		}
	}
}
