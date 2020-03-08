import { Component, ViewEncapsulation } from "@angular/core"
import { Observable } from "rxjs"
import { Store, Select } from "@ngxs/store"

import { Step } from "@authentication/core/services/authentication-flow/authentication-flow.interface"

@Component({
	selector: "layout-authbox",
	templateUrl: "./authbox.component.html",
	styleUrls: ["./authbox.component.scss"],
	encapsulation: ViewEncapsulation.None,
})
export class LayoutAuthboxComponent {
	@Select(state => state.signin.isFetching) public isFetching$: Observable<boolean>
	@Select(state => state.signin.currentStep) public currentStep$: Observable<Step>

	public isFetching: boolean = false
	public currentStep: Step

	constructor(private store: Store) {
		this.isFetching$.subscribe(value => (this.isFetching = value))
		this.currentStep$.subscribe(value => (this.currentStep = value))
	}
}
