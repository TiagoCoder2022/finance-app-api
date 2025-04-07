import { EmailAlreadyInUseError } from '../../errors/user'
import { user as fixtureUser } from '../../tests'
import { CreateUserUseCase } from './create-user'

describe('Create User Use Case', () => {
    const user = {
        ...fixtureUser,
        id: undefined,
    }
    class GetUserByEmailRepositoryStub {
        async execute() {
            return null
        }
    }

    class CreateUserRepositoryStube {
        async execute() {
            return user
        }
    }

    class PasswordHasherAdapterStub {
        async execute() {
            return 'hashed_password'
        }
    }

    class IdGeneratorAdapterStub {
        execute() {
            return 'generated_id'
        }
    }

    const makeSut = () => {
        const getUserByEmailRepository = new GetUserByEmailRepositoryStub()
        const createUserRepository = new CreateUserRepositoryStube()
        const passwordHasherAdapter = new PasswordHasherAdapterStub()
        const idGeneratorAdapter = new IdGeneratorAdapterStub()

        const sut = new CreateUserUseCase(
            getUserByEmailRepository,
            createUserRepository,
            passwordHasherAdapter,
            idGeneratorAdapter,
        )

        return {
            sut,
            getUserByEmailRepository,
            createUserRepository,
            passwordHasherAdapter,
            idGeneratorAdapter,
        }
    }

    it('should create a user successfully', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const createdUser = await sut.execute(user)

        // assert
        expect(createdUser).toBeTruthy()
    })

    it('should throw an EmailAlreadyInUseError if GetUserByEmailRepository retruns a user', async () => {
        // arrange
        const { sut, getUserByEmailRepository } = makeSut()
        jest.spyOn(getUserByEmailRepository, 'execute').mockReturnValueOnce(
            user,
        )

        // act
        const promise = sut.execute(user)

        // assert
        await expect(promise).rejects.toThrow(
            new EmailAlreadyInUseError(user.email),
        )
    })

    it('should call idGeneratorAdapter to generate a random id', async () => {
        // arrange
        const { sut, idGeneratorAdapter, createUserRepository } = makeSut()

        const idGeneratorSpy = jest.spyOn(idGeneratorAdapter, 'execute')
        const createUserRepositorySpy = jest.spyOn(
            createUserRepository,
            'execute',
        )

        // act
        await sut.execute(user)

        // assert
        expect(idGeneratorSpy).toHaveBeenCalled()
        expect(createUserRepositorySpy).toHaveBeenCalledWith({
            ...user,
            password: 'hashed_password',
            id: 'generated_id',
        })
    })

    it('should call PasswordHashedApdapter to cryptograph password', async () => {
        // arrange
        const { sut, createUserRepository, passwordHasherAdapter } = makeSut()

        const createUserRepositorySpy = jest.spyOn(
            createUserRepository,
            'execute',
        )
        const passwordHasherSpy = jest.spyOn(passwordHasherAdapter, 'execute')

        // act
        await sut.execute(user)

        // assert
        expect(createUserRepositorySpy).toHaveBeenCalledWith({
            ...user,
            password: 'hashed_password',
            id: 'generated_id',
        })
        expect(passwordHasherSpy).toHaveBeenCalledWith(user.password)
    })

    it('should throw if GetUserByEmailRepository throws', async () => {
        // arrange
        const { sut, getUserByEmailRepository } = makeSut()
        jest.spyOn(getUserByEmailRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        // act
        const promise = sut.execute(user)

        // assert
        expect(promise).rejects.toThrow()
    })

    it('should throw if IdGenerateAdapter throws', async () => {
        // arrange
        const { sut, idGeneratorAdapter } = makeSut()
        jest.spyOn(idGeneratorAdapter, 'execute').mockImplementationOnce(() => {
            throw new Error()
        })

        // act
        const promise = sut.execute(user)

        // assert
        expect(promise).rejects.toThrow()
    })

    it('should throw if PasswordHasherAdapter throws', async () => {
        // arrange
        const { sut, passwordHasherAdapter } = makeSut()
        jest.spyOn(passwordHasherAdapter, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        // act
        const promise = sut.execute(user)

        // assert
        expect(promise).rejects.toThrow()
    })

    it('should throw if CreateUserRepository throws', async () => {
        // arrange
        const { sut, createUserRepository } = makeSut()
        jest.spyOn(createUserRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        // act
        const promise = sut.execute(user)

        // assert
        expect(promise).rejects.toThrow()
    })
})
