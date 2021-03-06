import * as envalid from "envalid"
import * as winston from "winston"
import { IGetEnvs, getEnvs } from "./getEnvs"

const validators: object = {
    APP_TOKEN_SECRET: envalid.str(),
    APP_PORT: envalid.port(),
    APP_URL: envalid.url(),
    APP_DEV_BEARER_TOKEN: envalid.str(),
}

const validateEnv = (): void => {
    const options: envalid.CleanOptions = {
        reporter: (result: any) => {
            if (Object.keys(result.errors).length === 0) {
                winston.info("Environment variables loaded successfully")

                const envFiltered: IGetEnvs = getEnvs()

                winston.debug(`Env --> ${JSON.stringify(envFiltered)}`)
            }
            else {
                winston.error("Environment variables cannot be loaded: " + JSON.stringify(result.errors))

                throw new Error("Environment variables cannot be loaded")
            }
        }
    }

    envalid.cleanEnv(process.env, validators, options)
}

export { validateEnv, validators }
