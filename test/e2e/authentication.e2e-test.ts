import * as dotenv from "dotenv"
import Axios from "axios"
import Faker from "faker"

dotenv.config()

describe("Authentication Flow REST", () => {
	let port: number = parseInt(process.env.APP_PORT)

	let fakeAccount = {
		identifier: `e2e_${Date.now()}`,
		password: Faker.internet.password(),
		email: Faker.internet.email(),
		first_name: Faker.name.firstName(),
		last_name: Faker.name.lastName(),
	}
	let authSessionToken: string

	beforeAll(done => {
		done()
	})

	afterAll(done => {
		done()
	})

	test("Init the authenctication", async done => {
		let createAccountResponse = await Axios({
			url: `http://localhost:${port}/accounts`,
			method: "post",
			headers: {
				"Authorization": `Bearer randomstring`
			},
			data: fakeAccount,
		})

		expect(Object.keys(createAccountResponse.data)).toHaveLength(10)

		expect(createAccountResponse.data).toHaveProperty("id")
		expect(createAccountResponse.data).toHaveProperty("kind")

		expect(createAccountResponse.data.kind).toStrictEqual("accounts.account")

		let initAuthResponse = await Axios({
			url: `http://localhost:${port}/authentication/init`,
			method: "post",
			headers: {
				"Authorization": `Bearer randomstring`
			},
			data: {
				flow_type: "authorization_code",
			},
		})

		expect(Object.keys(initAuthResponse.data)).toHaveLength(4)

		expect(initAuthResponse.data).toHaveProperty("authenticated")
		expect(initAuthResponse.data).toHaveProperty("auth_session_token")
		expect(initAuthResponse.data).toHaveProperty("valid_until")
		expect(initAuthResponse.data).toHaveProperty("next_steps")

		expect(initAuthResponse.data.authenticated).toStrictEqual(false)
		expect(initAuthResponse.data.next_steps).toHaveLength(1)
		expect(initAuthResponse.data.next_steps[0]).toHaveProperty("step")
		expect(initAuthResponse.data.next_steps[0]).toHaveProperty("url")
		expect(initAuthResponse.data.next_steps[0].step).toStrictEqual("IDENTIFIER")

		authSessionToken = initAuthResponse.data.auth_session_token

		let lookupAccountResponse = await Axios({
			url: `http://localhost:${port}/authentication/lookup`,
			method: "post",
			headers: {
				"Authorization": `Bearer randomstring`
			},
			data: {
				auth_session_token: authSessionToken,
				step: "IDENTIFIER",
				identifier: fakeAccount.identifier,
			},
		})

		expect(Object.keys(lookupAccountResponse.data)).toHaveLength(3)

		expect(lookupAccountResponse.data).toHaveProperty("authenticated")
		expect(lookupAccountResponse.data).toHaveProperty("next_steps")
		expect(lookupAccountResponse.data).toHaveProperty("account")

		expect(lookupAccountResponse.data.authenticated).toStrictEqual(false)
		expect(lookupAccountResponse.data.next_steps).toHaveLength(1)
		expect(lookupAccountResponse.data.next_steps[0]).toHaveProperty("step")
		expect(lookupAccountResponse.data.next_steps[0]).toHaveProperty("url")
		expect(lookupAccountResponse.data.next_steps[0].step).toStrictEqual("PASSWORD")

		let challengePasswordResponse = await Axios({
			url: `http://localhost:${port}/authentication/challenge`,
			method: "post",
			headers: {
				"Authorization": `Bearer randomstring`
			},
			data: {
				auth_session_token: authSessionToken,
				step: "PASSWORD",
				password: fakeAccount.password,
			},
		})

		expect(Object.keys(challengePasswordResponse.data)).toHaveLength(3)

		expect(challengePasswordResponse.data).toHaveProperty("authenticated")
		expect(challengePasswordResponse.data).toHaveProperty("flow_type")
		expect(challengePasswordResponse.data).toHaveProperty("code")

		expect(challengePasswordResponse.data.authenticated).toStrictEqual(true)
		expect(challengePasswordResponse.data.flow_type).toStrictEqual("authorization_code")
		expect(typeof challengePasswordResponse.data.code === "string").toBeTruthy()

		done()
	})
})
