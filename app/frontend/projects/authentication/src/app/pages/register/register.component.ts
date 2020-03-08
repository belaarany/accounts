import { Component, OnInit, ViewEncapsulation, HostListener } from "@angular/core"
import { FormBuilder, NgForm } from "@angular/forms"
import { trigger, transition, animate, style } from "@angular/animations"
import { Router, ActivatedRoute } from "@angular/router"

import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { FaIcons } from "@root/interfaces/fontawesome.interface"

@Component({
	selector: "app-register-page",
	templateUrl: "./register.component.html",
	styleUrls: ["./register.component.scss"],
	encapsulation: ViewEncapsulation.None,
})
export class RegisterComponent {
	public faIcons: FaIcons = { faArrowLeft }
	public authErrors: string[] = []
	public form = this.formBuilder.group({
		firstName: [""],
		lastName: [""],
		emailAddress: [""],
		password: [""],
		passwordConfirm: [""],
	})

	constructor(private formBuilder: FormBuilder) {}
}
