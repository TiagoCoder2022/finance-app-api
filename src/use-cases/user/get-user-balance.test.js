import { faker } from '@faker-js/faker'
import { GetUserBalanceUseCase } from './get-user-balance'
import { UserNotFoundError } from '../../errors/user'
import { userBalance, user } from '../../tests'

describe('GetUserBalanceUseCase', () => {
    class GetUserBalanceRepositoryStub {
        async execute() {
            return userBalance
        }
    }

    class GetUserByIdRepositoryStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const getUserBalanceRepository = new GetUserBalanceRepositoryStub()
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const sut = new GetUserBalanceUseCase(
            getUserBalanceRepository,
            getUserByIdRepository,
        )

        return {
            sut,
            getUserBalanceRepository,
            getUserByIdRepository,
        }
    }

    it('should get balance successfully', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const result = await sut.execute(faker.string.uuid())

        // assert
        expect(result).toEqual(userBalance)
    })

    it('shoul throw UserNotFoundError if GetUserByIdRepository returns null', async () => {
        // arrange
        const { sut, getUserByIdRepository } = makeSut()
        import.meta.jest
            .spyOn(getUserByIdRepository, 'execute')
            .mockResolvedValue(null)
        const userId = faker.string.uuid()

        // act
        const promise = sut.execute(userId)

        // assert
        expect(promise).rejects.toThrow(new UserNotFoundError(userId))
    })

    it('should call GetUserByIdRepository with correct params', async () => {
        const { sut, getUserByIdRepository } = makeSut()
        const userId = faker.string.uuid()
        const executeSpy = import.meta.jest.spyOn(
            getUserByIdRepository,
            'execute',
        )

        await sut.execute(userId)

        expect(executeSpy).toHaveBeenCalledWith(userId)
    })

    it('should call GetUserBalanceRepository with correct params', async () => {
        const { sut, getUserBalanceRepository } = makeSut()
        const userId = faker.string.uuid()
        const executeSpy = import.meta.jest.spyOn(
            getUserBalanceRepository,
            'execute',
        )

        await sut.execute(userId)

        expect(executeSpy).toHaveBeenCalledWith(userId)
    })

    it('should throw if GetUserByIdRepository throws', async () => {
        // arrange
        const { sut, getUserByIdRepository } = makeSut()
        import.meta.jest
            .spyOn(getUserByIdRepository, 'execute')
            .mockRejectedValue(new Error())

        // act
        const promise = sut.execute(faker.string.uuid())

        // assert
        await expect(promise).rejects.toThrow()
    })

    it('should throw if GetUserBalanceRepository throws', async () => {
        // arrange
        const { sut, getUserBalanceRepository } = makeSut()
        import.meta.jest
            .spyOn(getUserBalanceRepository, 'execute')
            .mockRejectedValue(new Error())

        // act
        const promise = sut.execute(faker.string.uuid())

        // assert
        await expect(promise).rejects.toThrow()
    })
})
