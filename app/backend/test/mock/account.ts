import Faker from "faker"

export default {
	create: () => ({
		identifier: `e2e_${Date.now()}`,
		password: Faker.internet.password(),
		email: `e2e-${Date.now()}@e2etesting.com`,
		first_name: Faker.name.firstName(),
		last_name: Faker.name.lastName(),
	})
}
