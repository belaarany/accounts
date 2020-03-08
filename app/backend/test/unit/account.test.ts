//import Sinon from "sinon"
import { App } from "~app/app"
import AccountMock from "~test/mock/account"
import AccountsController from "@controllers/accounts.controller"
import { AccountService } from "@models/account/account.service"

describe("Accounts Unit REST", () => {

	beforeAll(() => {
	})

	/*test("Should create an account", async done => {
		let mock = AccountMock.create()
		let ac = new AccountService()
		let account = await ac.create({
			identifier: mock.identifier,
			email: mock.email,
			firstName: mock.first_name,
			lastName: mock.last_name,
			password: mock.password,
		})

		console.log({ account })

		done()
	})*/

	/*test("sinon test", function() {p
		let req = { body: { lol: 123 }}
		let res = {
			json: Sinon.spy(),
			status: Sinon.stub().returns({ end: Sinon.spy() })
		};
		let expectedResult = { mykey: 123 }
		let ac = new AccountService()
		Sinon.stub(ac, "create").yields(null, expectedResult)
		(new AccountsController).create(req, res)
		Sinon.assert.calledWith(ac.create, req.body)
	})*/
})
