import { GetUserByIdUseCase } from '../use-cases/get-user-by-id.js'
import { notFound, ok, serverError } from './helpers/http.js'
import { invalidIdResponse } from './helpers/user.js'
import validator from 'validator'

export class GetUserByIdController {
    async execute(httpRequest) {
        try {
            const isIdValid = validator.isUUID(httpRequest.params.userId)

            if (!isIdValid) {
                return invalidIdResponse()
            }

            const getUserByUseCase = new GetUserByIdUseCase()

            const user = await getUserByUseCase.execute(
                httpRequest.params.userId,
            )

            if (!user) {
                return notFound({
                    message: 'User not found.',
                })
            }

            return ok(user)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
