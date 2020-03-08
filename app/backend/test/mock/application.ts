import Faker from "faker"

export default {
	create: () => ({
		name: `E2E APP ${Date.now()}`,
		homeUrl: Faker.internet.url(),
		callbackUrl: Faker.internet.url(),
	})
}
