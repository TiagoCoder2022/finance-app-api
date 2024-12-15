import {
    checkIfIdIsValid,
    invalidIdResponse,
    userNotFoundresponse,
    requiredFieldIsMissingResponse,
    ok,
    serverError,
} from '../helpers/index.js'
import { UserNotFoundError } from '../../errors/user.js'
export class GetUserBalanceController {
    constructor(getUserBalanceUseCase) {
        this.getUserBalanceUseCase = getUserBalanceUseCase
    }

    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId

            if (!userId) {
                return requiredFieldIsMissingResponse('userId')
            }

            const userIdIsValid = checkIfIdIsValid(userId)

            if (!userIdIsValid) {
                return invalidIdResponse()
            }

            const balance = await this.getUserBalanceUseCase.execute({ userId })

            return ok(balance)
        } catch (error) {
            console.error(error)

            if (error instanceof UserNotFoundError) {
                return userNotFoundresponse()
            }

            return serverError()
        }
    }
}
