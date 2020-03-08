import { Step } from "@authentication/core/services/authentication-flow/authentication-flow.interface"
import { AccountPartial } from "@authentication/interfaces/account.interface"
import { ApplicationPartial } from "@authentication/interfaces/application.interface"

export namespace SigninAction {
	const prefix = "[Signin]"

	export class IsFetching {
		static readonly type: string = [prefix, "IsFetching"].join(" ")

		constructor(public is: boolean) {}
	}

	export class Reset {
		static readonly type: string = [prefix, "Reset"].join(" ")
	}

	export class SetCurrentStep {
		static readonly type: string = [prefix, "SetCurrentStep"].join(" ")

		constructor(public step: Step | null) {}
	}

	export class SetAuthSessionToken {
		static readonly type: string = [prefix, "SetAuthSessionToken"].join(" ")

		constructor(public token: string) {}
	}

	export class SetAccount {
		static readonly type: string = [prefix, "SetAccount"].join(" ")

		constructor(public accountPartial: AccountPartial) {}
	}

	export class SetApplication {
		static readonly type: string = [prefix, "SetApplication"].join(" ")

		constructor(public applicationPartial: ApplicationPartial) {}
	}
}
