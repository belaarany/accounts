import { AccountPartial } from "@authentication/interfaces/account.interface"

export namespace Response {
	export interface Init {
		authenticated: boolean
		authSessionToken: string
		validUntil: string
		nextSteps: {
			step: Step
			url: string
		}[]
	}

	export interface Lookup {
		authenticated: boolean
		nextSteps: {
			step: Step
			url: string
		}[]
		account: AccountPartial
	}

	export interface Challenge {
		authenticated: boolean
		nextSteps?: {
			step: Step
			url: string
		}[]
		flowType?: "authorization_code"
		code?: string
	}
}

export enum Step {
	INIT = "INIT",
	IDENTIFIER = "IDENTIFIER",
	PASSWORD = "PASSWORD",
	ONE_TIME_PASSWORD = "ONE_TIME_PASSWORD",
	BACKUP_CODE = "BACKUP_CODE",
}

export namespace ApiErrorReason {
	export enum Account {
		INVALID_PASSWORD = "account.invalidPassword",
		ACCOUNT_NOT_EXISTS = "account.accountNotExists",
		INVALID_LOOKUP_METHOD = "account.invalidLookupMethod",
	}

	export enum Authorization {
		ACCESS_DENIED = "authorization.accessDenied",
	}

	export enum Request {
		INVALID_BODY_PROPERTY = "request.body.invalidProperty",
		INVALID_PARAMETER_PROPERTY = "request.params.invalidProperty",
	}

	export enum Server {
		SERVER_ERROR = "server.serverError",
	}
}

export interface ApiError {
	source: "request" | "server" | "authentication"
	location?: "header" | "body" | "parameter" | "query"
	property?: string
	reason: ApiErrorReason.Account | ApiErrorReason.Authorization | ApiErrorReason.Request | ApiErrorReason.Server
	message: string
}

export type ApiErrors = ApiError[]

// SHOULD NOT BE HERE
export class ApiResponseError extends Error {
	public readonly errors: ApiErrors

	constructor(errors: ApiErrors) {
		super()

		this.name = "ApiResponseError"
		this.errors = errors

		Object.setPrototypeOf(this, ApiResponseError.prototype)
	}
}
