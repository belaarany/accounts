import * as dotenv from "dotenv"
import Axios from "axios"
import ApplicationMock from "~test/mock/application"

dotenv.config()

describe("Application REST", () => {
	let port: number = parseInt(process.env.APP_PORT)

	let fakeApplication = ApplicationMock.create()
	let applicationId: string
	let applicationClientId: string

	beforeAll(done => {
		done()
	})

	afterAll(done => {
		done()
	})

	test("Create an application", async done => {
		let postResponse = await Axios({
			url: `http://localhost:${port}/applications`,
			method: "post",
			headers: {
				"Authorization": `Bearer randomstring`
			},
			data: fakeApplication,
		})

		expect(Object.keys(postResponse.data)).toHaveLength(10)

		expect(postResponse.data).toHaveProperty("id")
		expect(postResponse.data).toHaveProperty("kind")
		expect(postResponse.data).toHaveProperty("etag")
		expect(postResponse.data).toHaveProperty("name")
		expect(postResponse.data).toHaveProperty("client_id")
		expect(postResponse.data).toHaveProperty("client_secret")
		expect(postResponse.data).toHaveProperty("home_url")
		expect(postResponse.data).toHaveProperty("callback_url")
		expect(postResponse.data).toHaveProperty("created_at")
		expect(postResponse.data).toHaveProperty("updated_at")

		expect(postResponse.data.kind).toStrictEqual("applications.application")
		expect(postResponse.data.name).toStrictEqual(fakeApplication.name)
		expect(postResponse.data.home_url).toStrictEqual(fakeApplication.homeUrl)
		expect(postResponse.data.callback_url).toStrictEqual(fakeApplication.callbackUrl)

		applicationId = postResponse.data.id
		applicationClientId = postResponse.data.client_id

		let getResponse = await Axios({
			url: `http://localhost:${port}/applications/${applicationId}`,
			method: "get",
			headers: {
				"Authorization": `Bearer randomstring`
			},
		})

		expect(Object.keys(getResponse.data)).toHaveLength(10)

		expect(getResponse.data).toHaveProperty("id")
		expect(getResponse.data).toHaveProperty("kind")
		expect(getResponse.data).toHaveProperty("etag")
		expect(getResponse.data).toHaveProperty("name")
		expect(getResponse.data).toHaveProperty("client_id")
		expect(getResponse.data).toHaveProperty("client_secret")
		expect(getResponse.data).toHaveProperty("home_url")
		expect(getResponse.data).toHaveProperty("callback_url")
		expect(getResponse.data).toHaveProperty("created_at")
		expect(getResponse.data).toHaveProperty("updated_at")

		expect(getResponse.data.kind).toStrictEqual("applications.application")
		expect(getResponse.data.id).toStrictEqual(applicationId)
		expect(getResponse.data.name).toStrictEqual(fakeApplication.name)
		expect(getResponse.data.home_url).toStrictEqual(fakeApplication.homeUrl)
		expect(getResponse.data.callback_url).toStrictEqual(fakeApplication.callbackUrl)

		let getPartialResponse = await Axios({
			url: `http://localhost:${port}/applications/${applicationId}/partial`,
			method: "get",
			headers: {
				"Authorization": `Bearer randomstring`
			},
		})

		expect(Object.keys(getPartialResponse.data)).toHaveLength(4)

		expect(getPartialResponse.data).toHaveProperty("kind")
		expect(getPartialResponse.data).toHaveProperty("name")
		expect(getPartialResponse.data).toHaveProperty("home_url")
		expect(getPartialResponse.data).toHaveProperty("callback_url")

		expect(getPartialResponse.data.kind).toStrictEqual("applications.application.partial")
		expect(getPartialResponse.data.name).toStrictEqual(fakeApplication.name)
		expect(getPartialResponse.data.home_url).toStrictEqual(fakeApplication.homeUrl)
		expect(getPartialResponse.data.callback_url).toStrictEqual(fakeApplication.callbackUrl)

		let exchangeClientIdResponse = await Axios({
			url: `http://localhost:${port}/applications/exchangeClientId/${applicationClientId}`,
			method: "get",
			headers: {
				"Authorization": `Bearer randomstring`
			},
		})

		expect(Object.keys(exchangeClientIdResponse.data)).toHaveLength(2)

		expect(exchangeClientIdResponse.data).toHaveProperty("kind")
		expect(exchangeClientIdResponse.data).toHaveProperty("id")

		expect(exchangeClientIdResponse.data.kind).toStrictEqual("applications.application.id")
		expect(exchangeClientIdResponse.data.id).toStrictEqual(applicationId)

		done()
	})
})
