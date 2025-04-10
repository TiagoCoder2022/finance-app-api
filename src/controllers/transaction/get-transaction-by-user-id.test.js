import { faker } from '@faker-js/faker'
import { GetTransactionsByUserIdController } from './get-transactions-by-user-id'
import { UserNotFoundError } from '../../errors/user'
import { transaction } from '../../tests'

describe('Get Transaction By Id Controller', () => {
    class GetTransactionByUserIdUseCaseStub {
        async execute() {
            return [transaction]
        }
    }

    const makeSut = () => {
        const getTransactionByUserIdUseCase =
            new GetTransactionByUserIdUseCaseStub()
        const sut = new GetTransactionsByUserIdController(
            getTransactionByUserIdUseCase,
        )

        return { sut, getTransactionByUserIdUseCase }
    }

    it('should return 200 when finding transaction by user id successfully', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const response = await sut.execute({
            query: { userId: faker.string.uuid() },
        })

        // Assert
        expect(response.statusCode).toBe(200)
    })

    it('should return 400 when missing userId param', async () => {
        // Arrange
        const { sut } = makeSut()

        //Act
        const response = await sut.execute({
            query: { userId: undefined },
        })

        // Assert
        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when userId param is invalid', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const response = await sut.execute({
            query: { userId: 'invalid_id' },
        })

        // Assert
        expect(response.statusCode).toBe(400)
    })

    it('should return 404 when GetTransactioByUserIdUseCase throws UserNotFoundError', async () => {
        // Arrange
        const { sut, getTransactionByUserIdUseCase } = makeSut()
        jest.spyOn(
            getTransactionByUserIdUseCase,
            'execute',
        ).mockRejectedValueOnce(new UserNotFoundError())

        // Act
        const response = await sut.execute({
            query: { userId: faker.string.uuid() },
        })

        // Assert
        expect(response.statusCode).toBe(404)
    })

    it('should return 500 when GetTransactioByUserIdUseCase throws generic error', async () => {
        // Arrange
        const { sut, getTransactionByUserIdUseCase } = makeSut()
        jest.spyOn(
            getTransactionByUserIdUseCase,
            'execute',
        ).mockRejectedValueOnce(new Error())

        // Act
        const response = await sut.execute({
            query: { userId: faker.string.uuid() },
        })

        // Assert
        expect(response.statusCode).toBe(500)
    })

    it('should call getTransactionByUserIdUseCase with correct params', async () => {
        // Arrange
        const { sut, getTransactionByUserIdUseCase } = makeSut()
        const executeSpy = jest.spyOn(getTransactionByUserIdUseCase, 'execute')
        const userId = faker.string.uuid()

        //Act
        await sut.execute({
            query: { userId: userId },
        })

        //Assert
        expect(executeSpy).toHaveBeenCalledWith(userId)
    })
})
