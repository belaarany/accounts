import { Injectable } from "@angular/core"
import { HttpClient, HttpErrorResponse } from "@angular/common/http"
import { Observable } from "rxjs"

import { delay } from "rxjs/operators"

import { Store, Select } from "@ngxs/store"
import { SigninState } from "@authentication/core/ngxs/state/signin.state"
import { SigninStateModel } from "@authentication/core/ngxs/types/signin.interface"
import { SigninAction } from "@authentication/core/ngxs/actions/signin.actions"

import { Response, Step, ApiErrors, ApiResponseError } from "./authentication-flow.interface"

@Injectable({
	providedIn: "root",
})
export class AuthenticationFlowService {
	@Select(state => state.signin.authSessionToken) public authSessionToken$: Observable<string>
	@Select(state => state.signin.currentStep) public currentStep$: Observable<Step>
	private authSessionToken: string

	constructor(private http: HttpClient, private store: Store) {
		this.authSessionToken$.subscribe(value => (this.authSessionToken = value))
	}

	public reset(): Promise<void> {
		return new Promise((resolve: () => void, reject: () => void) => {
			this.store.dispatch([
				new SigninAction.IsFetching(false),
				new SigninAction.Reset(),
				new SigninAction.SetCurrentStep(null),
			])

			resolve()
		})
	}

	public start(): void {
		this.store.dispatch(new SigninAction.IsFetching(true))
	}

	public init(): Promise<void> {
		this.store.dispatch(new SigninAction.IsFetching(true))

		return new Promise((resolve: () => void, reject: () => void) => {
			this.http
				.post<Response.Init>("http://ubuntu-vm:1776/authentication/init", {
					flowType: "authorization_code",
				})
				.pipe(delay(120))
				.subscribe(
					(response: Response.Init) => {
						this.store.dispatch([
							new SigninAction.IsFetching(false),
							new SigninAction.SetAuthSessionToken(response.authSessionToken),
							new SigninAction.SetCurrentStep(Step.IDENTIFIER),
						])

						resolve()
					},
					(error: HttpErrorResponse) => {
						console.log({ error })
						reject()
					},
				)
		})
	}

	public lookup(input: string): Promise<void> {
		this.store.dispatch(new SigninAction.IsFetching(true))

		return new Promise((resolve: () => void, reject: (error: ApiResponseError) => void) => {
			this.http
				.post<Response.Lookup>("http://ubuntu-vm:1776/authentication/lookup", {
					authSessionToken: this.authSessionToken,
					step: Step.IDENTIFIER,
					identifier: input,
				})
				.subscribe(
					(response: Response.Lookup) => {
						this._fakeLatency(() => {
							this.store.dispatch([
								new SigninAction.IsFetching(false),
								new SigninAction.SetCurrentStep(Step.PASSWORD),
								new SigninAction.SetAccount(response.account),
							])

							resolve()
						})
					},
					(response: HttpErrorResponse) => {
						this._fakeLatency(() => {
							this.store.dispatch([new SigninAction.IsFetching(false)])

							console.log({ response })

							reject(new ApiResponseError(response.error.error.errors))
						})
					},
				)
		})
	}

	public challenge(input: string): Promise<void | string> {
		this.store.dispatch(new SigninAction.IsFetching(true))

		return new Promise((resolve: (code?: string) => void, reject: (error: ApiResponseError) => void) => {
			this.http
				.post<Response.Challenge>("http://ubuntu-vm:1776/authentication/challenge", {
					authSessionToken: this.authSessionToken,
					step: Step.PASSWORD,
					password: input,
				})
				.subscribe(
					(response: Response.Challenge) => {
						this._fakeLatency(() => {
							this.store.dispatch([
								new SigninAction.IsFetching(false),
								new SigninAction.SetCurrentStep(null),
							])

							if (response.authenticated === true) {
								resolve(response.code)
							} else {
								resolve()
							}
						})
					},
					(response: HttpErrorResponse) => {
						this._fakeLatency(() => {
							this._fakeLatency(() => {
								this.store.dispatch([new SigninAction.IsFetching(false)])

								reject(new ApiResponseError(response.error.error.errors))
							})
						})
					},
				)
		})
	}

	private _randomDelayValue(): number {
		return 300 + Math.random() * 750
	}

	private _fakeLatency(callback: () => any): void {
		setTimeout(callback, this._randomDelayValue())
	}
}
