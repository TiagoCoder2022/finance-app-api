import { faker } from '@faker-js/faker'
import { user } from '../../tests'
import { LoginUserUseCase } from './login-user'
import { InvalidPasswordError, UserNotFoundError } from '../../errors/user'

describe('LoginUserUseCase', () => {
    class GetUserByEmailRepositoryStub {
        async execute() {
            return user
        }
    }

    class PasswordComparatorAdapterStub {
        async execute() {
            return true
        }
    }

    class TokensGeneratorAdapterStub {
        execute() {
            return {
                accessToken: 'any_access_token',
                refreshToken: 'any_refresh_token',
            }
        }
    }

    const makeSut = () => {
        const getUserByEmailRepository = new GetUserByEmailRepositoryStub()
        const passwordComparatorAdapter = new PasswordComparatorAdapterStub()
        const tokensGeneratorAdapter = new TokensGeneratorAdapterStub()

        const sut = new LoginUserUseCase(
            getUserByEmailRepository,
            passwordComparatorAdapter,
            tokensGeneratorAdapter,
        )

        return {
            getUserByEmailRepository,
            sut,
            passwordComparatorAdapter,
            tokensGeneratorAdapter,
        }
    }

    it('should throw UserNotFoundError if user is not found', async () => {
        const { sut, getUserByEmailRepository } = makeSut()
        import.meta.jest
            .spyOn(getUserByEmailRepository, 'execute')
            .mockResolvedValueOnce(null)

        const promise = sut.execute(
            faker.internet.email,
            faker.internet.password,
        )
        await expect(promise).rejects.toThrow(new UserNotFoundError())
    })

    it('should throw InvalidPasswordError if password is invalid', async () => {
        const { sut, passwordComparatorAdapter } = makeSut()
        import.meta.jest
            .spyOn(passwordComparatorAdapter, 'execute')
            .mockReturnValue(false)

        const promise = sut.execute(
            faker.internet.email,
            faker.internet.password,
        )

        await expect(promise).rejects.toThrow(new InvalidPasswordError())
    })

    it('should return user with tokens', async () => {
        const { sut } = makeSut()
        const reult = await sut.execute(
            faker.internet.email,
            faker.internet.password,
        )
        expect(reult.tokens.accessToken).toBeDefined()
    })
})
