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
		Axios({
			url: `http://localhost:${port}/accounts`,
			method: "post",
			headers: {
				"Authorization": `Bearer randomstring`
			},
			data: fakeAccount,
		})
		.then((response) => {
			let data = response.data

			expect(Object.keys(data)).toHaveLength(10)

			expect(data).toHaveProperty("id")
			expect(data).toHaveProperty("kind")

			expect(data.kind).toStrictEqual("accounts.account")

			done()
		})
	})

	afterAll(done => {
		done()
	})

	test("Init the authenctication", done => {
		Axios({
			url: `http://localhost:${port}/authentication/init`,
			method: "post",
			headers: {
				"Authorization": `Bearer randomstring`
			},
			data: {
				flow_type: "authorization_code",
			},
		})
		.then((response) => {
			let data = response.data

			expect(Object.keys(data)).toHaveLength(4)

			expect(data).toHaveProperty("authenticated")
			expect(data).toHaveProperty("auth_session_token")
			expect(data).toHaveProperty("valid_until")
			expect(data).toHaveProperty("next_steps")

			expect(data.authenticated).toStrictEqual(false)
			expect(data.next_steps).toHaveLength(1)
			expect(data.next_steps[0]).toHaveProperty("step")
			expect(data.next_steps[0]).toHaveProperty("url")
			expect(data.next_steps[0].step).toStrictEqual("IDENTIFIER")

			authSessionToken = data.auth_session_token

			done()
		})
	})

	test("Lookup the account", done => {
		Axios({
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
		.then((response) => {
			let data = response.data

			expect(Object.keys(data)).toHaveLength(3)

			expect(data).toHaveProperty("authenticated")
			expect(data).toHaveProperty("next_steps")
			expect(data).toHaveProperty("account")

			expect(data.authenticated).toStrictEqual(false)
			expect(data.next_steps).toHaveLength(1)
			expect(data.next_steps[0]).toHaveProperty("step")
			expect(data.next_steps[0]).toHaveProperty("url")
			expect(data.next_steps[0].step).toStrictEqual("PASSWORD")

			done()
		})
	})

	test("Challenge the password", done => {
		Axios({
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
		.then((response) => {
			let data = response.data

			expect(Object.keys(data)).toHaveLength(3)

			expect(data).toHaveProperty("authenticated")
			expect(data).toHaveProperty("flow_type")
			expect(data).toHaveProperty("code")

			expect(data.authenticated).toStrictEqual(true)
			expect(data.flow_type).toStrictEqual("authorization_code")
			expect(typeof data.code === "string").toBeTruthy()

			done()
		})
	})
})
