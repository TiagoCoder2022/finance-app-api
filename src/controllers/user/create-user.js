import {
    invalidPasswordResponde,
    emailIsAlreadyInUseResponse,
    checkIfPasswordIsValid,
    checkIfEmailIsValid,
    badRequest,
    created,
    serverError,
    validateRequiredFields,
} from '../helpers/index.js'
import { EmailAlreadyInUseError } from '../../errors/user.js'

export class CreateUserController {
    constructor(createUserUseCase) {
        this.createUserUseCase = createUserUseCase
    }

    async execute(httpRequest) {
        try {
            const params = httpRequest.body

            const requiredFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ]

            const { ok: requiredFieldsWereProvided, missingField } =
                validateRequiredFields(params, requiredFields)

            if (!requiredFieldsWereProvided) {
                return badRequest({
                    message: `The field ${missingField} is required.`,
                })
            }

            for (const field of requiredFields) {
                if (!params[field] || params[field].trim().length === 0) {
                    return badRequest({ message: `Missing param: ${field}` })
                }
            }

            const passwordIsValid = checkIfPasswordIsValid(params.password)

            if (!passwordIsValid) {
                return invalidPasswordResponde()
            }

            const emailIsValid = checkIfEmailIsValid(params.email)

            if (!emailIsValid) {
                return emailIsAlreadyInUseResponse()
            }

            const createdUser = await this.createUserUseCase.execute(params)

            return created(createdUser)
        } catch (error) {
            if (error instanceof EmailAlreadyInUseError) {
                return badRequest({
                    message: error.message,
                })
            }
            console.error(error)
            return serverError()
        }
    }
}
