import * as dotenv from "dotenv"
import Axios from "axios"
import Faker from "faker"

dotenv.config()

describe("Application REST", () => {
	let port: number = parseInt(process.env.APP_PORT)

	let fakeApplication = {
		name: `E2E APP ${Date.now()}`,
		homeUrl: Faker.internet.url(),
		callbackUrl: Faker.internet.url(),
	}
	let applicationId: string
	let applicationClientId: string

	beforeAll(done => {
		done()
	})

	afterAll(done => {
		done()
	})

	test("Create an application", done => {
		Axios({
			url: `http://localhost:${port}/applications`,
			method: "post",
			headers: {
				"Authorization": `Bearer randomstring`
			},
			data: fakeApplication,
		})
		.then((response) => {
			let data = response.data

			expect(Object.keys(data)).toHaveLength(10)

			expect(data).toHaveProperty("id")
			expect(data).toHaveProperty("kind")
			expect(data).toHaveProperty("etag")
			expect(data).toHaveProperty("name")
			expect(data).toHaveProperty("client_id")
			expect(data).toHaveProperty("client_secret")
			expect(data).toHaveProperty("home_url")
			expect(data).toHaveProperty("callback_url")
			expect(data).toHaveProperty("created_at")
			expect(data).toHaveProperty("updated_at")

			expect(data.kind).toStrictEqual("applications.application")
			expect(data.name).toStrictEqual(fakeApplication.name)
			expect(data.home_url).toStrictEqual(fakeApplication.homeUrl)
			expect(data.callback_url).toStrictEqual(fakeApplication.callbackUrl)

			applicationId = data.id
			applicationClientId = data.client_id

			done()
		})
	})

	test("Fetch the previously created application", done => {
		Axios({
			url: `http://localhost:${port}/applications/${applicationId}`,
			method: "get",
			headers: {
				"Authorization": `Bearer randomstring`
			},
		})
		.then((response) => {
			let data = response.data

			expect(Object.keys(data)).toHaveLength(10)

			expect(data).toHaveProperty("id")
			expect(data).toHaveProperty("kind")
			expect(data).toHaveProperty("etag")
			expect(data).toHaveProperty("name")
			expect(data).toHaveProperty("client_id")
			expect(data).toHaveProperty("client_secret")
			expect(data).toHaveProperty("home_url")
			expect(data).toHaveProperty("callback_url")
			expect(data).toHaveProperty("created_at")
			expect(data).toHaveProperty("updated_at")

			expect(data.kind).toStrictEqual("applications.application")
			expect(data.id).toStrictEqual(applicationId)
			expect(data.name).toStrictEqual(fakeApplication.name)
			expect(data.home_url).toStrictEqual(fakeApplication.homeUrl)
			expect(data.callback_url).toStrictEqual(fakeApplication.callbackUrl)

			done()
		})
	})

	test("Fetch the partial of the previously created application", done => {
		Axios({
			url: `http://localhost:${port}/applications/${applicationId}/partial`,
			method: "get",
			headers: {
				"Authorization": `Bearer randomstring`
			},
		})
		.then((response) => {
			let data = response.data

			expect(Object.keys(data)).toHaveLength(4)

			expect(data).toHaveProperty("kind")
			expect(data).toHaveProperty("name")
			expect(data).toHaveProperty("home_url")
			expect(data).toHaveProperty("callback_url")

			expect(data.kind).toStrictEqual("applications.application.partial")
			expect(data.name).toStrictEqual(fakeApplication.name)
			expect(data.home_url).toStrictEqual(fakeApplication.homeUrl)
			expect(data.callback_url).toStrictEqual(fakeApplication.callbackUrl)

			done()
		})
	})

	test("Exchange the Client ID to entity ID", done => {
		Axios({
			url: `http://localhost:${port}/applications/exchangeClientId/${applicationClientId}`,
			method: "get",
			headers: {
				"Authorization": `Bearer randomstring`
			},
		})
		.then((response) => {
			let data = response.data

			expect(Object.keys(data)).toHaveLength(2)

			expect(data).toHaveProperty("kind")
			expect(data).toHaveProperty("id")

			expect(data.kind).toStrictEqual("applications.application.id")
			expect(data.id).toStrictEqual(applicationId)

			done()
		})
	})
})
