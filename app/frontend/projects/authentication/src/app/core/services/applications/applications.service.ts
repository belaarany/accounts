import { Injectable } from "@angular/core"
import { HttpClient, HttpErrorResponse } from "@angular/common/http"
import { Observable } from "rxjs"

import { Store, Select } from "@ngxs/store"
import { SigninAction } from "@authentication/core/ngxs/actions/signin.actions"

import { API as ApplicationAPI } from "./applications.interface"

@Injectable({
	providedIn: "root",
})
export class ApplicationsService {
	public lastClientId: string

	constructor(private http: HttpClient, private store: Store) {}

	public exchangeClientId(clientId: string): Promise<void> {
		return new Promise((resolve: () => void, reject: () => void) => {
			this.http
				.get<ApplicationAPI.Response.ExchangeClientID>(
					`http://ubuntu-vm:1776/applications/exchangeClientId/${clientId}`,
				)
				.subscribe(
					(response: ApplicationAPI.Response.ExchangeClientID) => {
						this.lastClientId = response.id

						resolve()
					},
					(error: HttpErrorResponse) => {
						console.log({ error })
						reject()
					},
				)
		})
	}

	public getPartial(id?: string): Promise<void> {
		return new Promise((resolve: () => void, reject: () => void) => {
			this.http
				.get<ApplicationAPI.Response.GetPartial>(
					`http://ubuntu-vm:1776/applications/${id || this.lastClientId}/partial`,
				)
				.subscribe(
					(response: ApplicationAPI.Response.GetPartial) => {
						this.store.dispatch([
							new SigninAction.SetApplication(response),
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

	private _randomDelayValue(): number {
		return 300 + Math.random() * 750
	}

	private _fakeLatency(callback: () => any): void {
		setTimeout(callback, this._randomDelayValue())
	}
}
