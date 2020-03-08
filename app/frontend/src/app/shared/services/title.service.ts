import { Injectable , isDevMode} from "@angular/core"
import { Title } from "@angular/platform-browser"

@Injectable({ providedIn: "root" })
export class AppTitleService {
	constructor(private titleService: Title) {}

	getTitle(): string {
		return this.titleService.getTitle()
	}
	setTitle(title: string[]): void {
		let extendedTitle: string = [title.join(" - "), "GOabela Accounts"].join(" – ")

		if (isDevMode() === true) {
			extendedTitle = [extendedTitle, "(Development)"].join(" --- ")
		}

		this.titleService.setTitle(extendedTitle)
	}
}
