import { Step } from "@authentication/core/services/authentication-flow/authentication-flow.interface"
import { AccountPartial } from "@authentication/interfaces/account.interface"
import { ApplicationPartial } from "@authentication/interfaces/application.interface"

export interface SigninStateModel {
	isFetching: boolean
	authSessionToken: string | null
	currentStep: Step | null
	accountPartial: AccountPartial | null
	applicationPartial: ApplicationPartial | null
}
