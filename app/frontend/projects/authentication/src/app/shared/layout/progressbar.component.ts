import { Component } from "@angular/core"
import { Observable } from "rxjs"
import { Store, Select } from "@ngxs/store"

@Component({
	selector: "layout-progressbar",
	templateUrl: "./progressbar.component.html",
	styleUrls: ["./progressbar.component.scss"],
})
export class LayoutProgressbarComponent {
	@Select(state => state.signin.isFetching) public isFetching$: Observable<boolean>

	public isFetching: boolean = false

	constructor(private store: Store) {
		this.isFetching$.subscribe(value => (this.isFetching = value))
	}
}
