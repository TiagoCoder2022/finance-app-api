import {
    CreateUserController,
    GetUserByIdController,
    UpdateUserController,
} from '../../controllers'
import {
    makeCreateUserController,
    makeGetUserByIdController,
    makeUpdateUserController,
} from './user'

describe('User Controller Factories', () => {
    it('should return a valid GetUserByIdController instance', async () => {
        expect(makeGetUserByIdController()).toBeInstanceOf(
            GetUserByIdController,
        )
    })

    it('should return a valid CreateUserController instance', async () => {
        expect(makeCreateUserController()).toBeInstanceOf(CreateUserController)
    })

    it('should a valid UpdateUserController instance', async () => {
        expect(makeUpdateUserController()).toBeInstanceOf(UpdateUserController)
    })
})
