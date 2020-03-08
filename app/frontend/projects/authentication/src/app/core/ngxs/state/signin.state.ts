import { State, Action, StateContext } from "@ngxs/store"
import { SigninStateModel } from "../types/signin.interface"
import { SigninAction } from "../actions/signin.actions"

import { Step } from "@authentication/core/services/authentication-flow/authentication-flow.interface"
import { AccountPartial } from "@authentication/interfaces/account.interface"
import { ApplicationPartial } from "@authentication/interfaces/application.interface"

@State<SigninStateModel>({
	name: "signin",
	defaults: {
		isFetching: false,
		authSessionToken: null,
		currentStep: null,
		accountPartial: null,
		applicationPartial: null,
	},
})
export class SigninState {
	@Action(SigninAction.Reset)
	Reset(ctx: StateContext<SigninStateModel>) {
		ctx.setState({
			isFetching: false,
			authSessionToken: null,
			currentStep: null,
			accountPartial: null,
			applicationPartial: null,
		})
	}

	@Action(SigninAction.IsFetching)
	IsFetching(ctx: StateContext<SigninStateModel>, action: SigninAction.IsFetching) {
		ctx.patchState({
			isFetching: action.is,
		})
	}

	@Action(SigninAction.SetAuthSessionToken)
	SetAuthSessionToken(ctx: StateContext<SigninStateModel>, action: SigninAction.SetAuthSessionToken) {
		ctx.patchState({
			authSessionToken: action.token,
		})
	}

	@Action(SigninAction.SetCurrentStep)
	SetCurrentStep(ctx: StateContext<SigninStateModel>, action: SigninAction.SetCurrentStep) {
		ctx.patchState({
			currentStep: action.step,
		})
	}

	@Action(SigninAction.SetAccount)
	SetAccount(ctx: StateContext<SigninStateModel>, action: SigninAction.SetAccount) {
		ctx.patchState({
			accountPartial: action.accountPartial,
		})
	}

	@Action(SigninAction.SetApplication)
	SetApplication(ctx: StateContext<SigninStateModel>, action: SigninAction.SetApplication) {
		ctx.patchState({
			applicationPartial: action.applicationPartial,
		})
	}
}
