import { ApplicationPartial } from "@authentication/interfaces/application.interface"

export namespace API {
	export namespace Response {
		export interface ExchangeClientID {
			kind: "applications.application.id"
			id: string
		}

		export type GetPartial = ApplicationPartial
	}
}
