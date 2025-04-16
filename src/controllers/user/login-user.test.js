import { InvalidPasswordError, UserNotFoundError } from '../../errors/user'
import { user } from '../../tests'
import { LoginUserController } from './login-user'

describe('LoginUserController', () => {
    const httpRequest = {
        body: {
            email: 'example@email.com',
            password: 'any_pass',
        },
    }

    class LoginUserUseCaseStub {
        async execute() {
            return {
                ...user,
                tokens: {
                    accessToken: 'any_access_token',
                    refreshToken: 'any_refresh_token',
                },
            }
        }
    }

    const makeSut = () => {
        const loginUserUseCase = new LoginUserUseCaseStub()
        const sut = new LoginUserController(loginUserUseCase)

        return {
            loginUserUseCase,
            sut,
        }
    }

    it('should return 200 with user and token', async () => {
        const { sut } = makeSut()

        const response = await sut.execute(httpRequest)
        expect(response.statusCode).toBe(200)
        expect(response.body.tokens.accessToken).toBe('any_access_token')
        expect(response.body.tokens.refreshToken).toBe('any_refresh_token')
    })

    it('should return 401 if password is invalid', async () => {
        const { sut, loginUserUseCase } = makeSut()
        import.meta.jest
            .spyOn(loginUserUseCase, 'execute')
            .mockRejectedValueOnce(new InvalidPasswordError())

        const response = await sut.execute(httpRequest)

        expect(response.statusCode).toBe(401)
    })

    it('should return 404 if user is not found', async () => {
        const { sut, loginUserUseCase } = makeSut()
        import.meta.jest
            .spyOn(loginUserUseCase, 'execute')
            .mockRejectedValueOnce(new UserNotFoundError())

        const response = await sut.execute(httpRequest)

        expect(response.statusCode).toBe(404)
    })
})
