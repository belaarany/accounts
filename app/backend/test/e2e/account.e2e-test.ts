import * as dotenv from "dotenv"
import Axios from "axios"
import AccountMock from "~test/mock/account"

dotenv.config()

describe("Accounts REST", () => {
	beforeAll(done => {
		done()
	})

	afterAll(done => {
		done()
	})

	test("Success", async done => {
		let port: number = parseInt(process.env.APP_PORT)
		let fakeAccount = AccountMock.create()
		let lastCreatedAccountId: string

		let postResponse = await Axios({
			url: `http://localhost:${port}/accounts`,
			method: "post",
			headers: {
				Authorization: `Bearer randomstring`,
			},
			data: fakeAccount,
		})

		expect(Object.keys(postResponse.data)).toHaveLength(10)

		expect(postResponse.data).toHaveProperty("id")
		expect(postResponse.data).toHaveProperty("kind")
		expect(postResponse.data).toHaveProperty("etag")
		expect(postResponse.data).toHaveProperty("name")
		expect(postResponse.data).toHaveProperty("identifier")
		expect(postResponse.data).toHaveProperty("email")
		expect(postResponse.data).toHaveProperty("first_name")
		expect(postResponse.data).toHaveProperty("last_name")
		expect(postResponse.data).toHaveProperty("created_at")
		expect(postResponse.data).toHaveProperty("updated_at")

		expect(postResponse.data.kind).toStrictEqual("accounts.account")
		expect(postResponse.data.identifier).toStrictEqual(fakeAccount.identifier)
		expect(postResponse.data.email).toStrictEqual(fakeAccount.email)
		expect(postResponse.data.first_name).toStrictEqual(fakeAccount.first_name)
		expect(postResponse.data.last_name).toStrictEqual(fakeAccount.last_name)

		lastCreatedAccountId = postResponse.data.id

		let getResponse = await Axios({
			url: `http://localhost:${port}/accounts/${lastCreatedAccountId}`,
			method: "get",
			headers: {
				Authorization: `Bearer randomstring`,
			},
		})

		expect(Object.keys(getResponse.data)).toHaveLength(10)

		expect(getResponse.data).toHaveProperty("id")
		expect(getResponse.data).toHaveProperty("kind")
		expect(getResponse.data).toHaveProperty("etag")
		expect(getResponse.data).toHaveProperty("name")
		expect(getResponse.data).toHaveProperty("identifier")
		expect(getResponse.data).toHaveProperty("email")
		expect(getResponse.data).toHaveProperty("first_name")
		expect(getResponse.data).toHaveProperty("last_name")
		expect(getResponse.data).toHaveProperty("created_at")
		expect(getResponse.data).toHaveProperty("updated_at")

		expect(getResponse.data.kind).toStrictEqual("accounts.account")
		expect(getResponse.data.identifier).toStrictEqual(fakeAccount.identifier)
		expect(getResponse.data.email).toStrictEqual(fakeAccount.email)
		expect(getResponse.data.first_name).toStrictEqual(fakeAccount.first_name)
		expect(getResponse.data.last_name).toStrictEqual(fakeAccount.last_name)

		let getAllResponse = await Axios({
			url: `http://localhost:${port}/accounts`,
			method: "get",
			headers: {
				Authorization: `Bearer randomstring`,
			},
		})

		expect(Object.keys(getAllResponse.data)).toHaveLength(3)

		expect(getAllResponse.data).toHaveProperty("kind")
		expect(getAllResponse.data).toHaveProperty("etag")
		expect(getAllResponse.data).toHaveProperty("collection")

		expect(getAllResponse.data.kind).toStrictEqual("accounts.accountList")

		let collection = getAllResponse.data.collection

		expect(Array.isArray(collection)).toBeTruthy()
		expect(collection.length).toBeGreaterThanOrEqual(1)

		let account = collection.find(_account => _account.id === lastCreatedAccountId)

		expect(account).not.toEqual(undefined)
		expect(Object.keys(account)).toHaveLength(10)

		expect(account).toHaveProperty("id")
		expect(account).toHaveProperty("kind")
		expect(account).toHaveProperty("etag")
		expect(account).toHaveProperty("name")
		expect(account).toHaveProperty("identifier")
		expect(account).toHaveProperty("email")
		expect(account).toHaveProperty("first_name")
		expect(account).toHaveProperty("last_name")
		expect(account).toHaveProperty("created_at")
		expect(account).toHaveProperty("updated_at")

		expect(account.kind).toStrictEqual("accounts.account")
		expect(account.identifier).toStrictEqual(fakeAccount.identifier)
		expect(account.email).toStrictEqual(fakeAccount.email)
		expect(account.first_name).toStrictEqual(fakeAccount.first_name)
		expect(account.last_name).toStrictEqual(fakeAccount.last_name)

		done()
	})

	test("Error", async done => {
		let port: number = parseInt(process.env.APP_PORT)
		let fakeAccount = AccountMock.create()

		let postResponse = await Axios({
			url: `http://localhost:${port}/accounts`,
			method: "post",
			headers: {
				Authorization: `Bearer randomstring`,
			},
			data: fakeAccount,
		})

		expect(Object.keys(postResponse.data)).toHaveLength(10)

		expect(postResponse.data).toHaveProperty("id")

		expect(postResponse.data.kind).toStrictEqual("accounts.account")
		expect(postResponse.data.identifier).toStrictEqual(fakeAccount.identifier)

		Axios({
			url: `http://localhost:${port}/accounts`,
			method: "post",
			headers: {
				Authorization: `Bearer randomstring`,
			},
			data: fakeAccount,
		})
			.then(_ => {
				fail("Shouldn't come here")
			})
			.catch(error => {
				expect(error).toHaveProperty("response")
				expect(error.response).toHaveProperty("data")

				let data = error.response.data

				expect(data).toHaveProperty("error")
				expect(data.error).toHaveProperty("errors")
				expect(data.error).toHaveProperty("code")
				expect(data.error).toHaveProperty("message")
				expect(data.error).toHaveProperty("uid")
				expect(data.error.code).toStrictEqual(400)
				expect(data.error.errors).toStrictEqual([
					{
						source: "request",
						reason: "account.accountAlreadyExists",
						message: "This identifier or email address is already taken.",
					},
				])

				done()
			})
	})
})
