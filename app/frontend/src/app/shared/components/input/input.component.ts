import { Component, Input, OnInit, ViewChild, ElementRef } from "@angular/core"
import { ControlContainer, FormGroupDirective } from "@angular/forms"

import { Observable, Subject } from "rxjs"

import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons"
import { FaIcons } from "@root/interfaces/fontawesome.interface"

@Component({
	selector: "component-input",
	templateUrl: "./input.component.html",
	styleUrls: ["./input.component.scss"],
	viewProviders: [
		{
			provide: ControlContainer,
			useExisting: FormGroupDirective,
		},
	],
})
export class InputComponent implements OnInit {
	@Input() public type: "text" | "password" = "text"
	@Input() public size: "small" | "medium" = "medium"
	@Input() public controlName: string
	@Input() public label: string
	@Input() public block: boolean = false
	@Input() public fluid: boolean = false
	@Input() public autofocus: boolean = undefined
	@Input() public errors: string[] = []
	@Input("onFocusRequest") public onFocusRequest$: Subject<void>

	public isFocused: boolean = false
	public value: string = ""

	public faIcons: FaIcons = { faExclamationCircle }

	@ViewChild("input") inputElement: ElementRef

	get hasValue(): boolean {
		return this.value.length > 0
	}

	get hasError(): boolean {
		return Boolean(this.errors.length > 0)
	}

	ngOnInit() {
		this.block = this.block !== undefined
		this.fluid = this.fluid !== undefined
		this.autofocus = this.autofocus !== undefined

		if (this.autofocus === true) {
			//this.inputElement.nativeElement.focus()
		}

		/*this.onFocusRequest$.subscribe(() => {
			console.log("subscribe")
			//this.inputElement.nativeElement.focus()
		})*/
	}

	onFocus() {
		this.isFocused = true
	}

	onBlur() {
		this.isFocused = false
	}
}
