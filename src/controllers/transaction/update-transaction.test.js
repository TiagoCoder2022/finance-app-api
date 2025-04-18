import { faker } from '@faker-js/faker'
import { UpdateTransactionController } from './update-transaction'
import { transaction } from '../../tests'
import { TransactionNotFoundError } from '../../errors'

describe('Update Transaction Controller', () => {
    class UpdateTransactionUsecaseStub {
        async execute() {
            return transaction
        }
    }

    const makeSut = () => {
        const updateTransactionUseCase = new UpdateTransactionUsecaseStub()
        const sut = new UpdateTransactionController(updateTransactionUseCase)

        return { sut, updateTransactionUseCase }
    }

    const baseHttpRequest = {
        params: { transactionId: faker.string.uuid() },
        body: {
            name: faker.commerce.productName(),
            date: faker.date.anytime().toISOString(),
            type: 'EXPENSE',
            amount: Number(faker.finance.amount()),
        },
    }

    it('should return 200 when updating a transaction successfully', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const response = await sut.execute(baseHttpRequest)
        // Assert
        expect(response.statusCode).toBe(200)
    })

    it('should return 400 when transaction id is invalid', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const response = await sut.execute({
            params: { transactionId: 'invalid_id' },
        })

        // Assert
        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when amount is invalid', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const response = await sut.execute({
            ...baseHttpRequest,
            body: {
                ...baseHttpRequest.body,
                amount: 'invalid_amount',
            },
        })

        // Assert
        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when type is invalid', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const response = await sut.execute({
            ...baseHttpRequest,
            body: {
                ...baseHttpRequest.body,
                type: 'invalid_type',
            },
        })

        // Assert
        expect(response.statusCode).toBe(400)
    })

    it('should return 500 when UpdateTransactionUseCase throws', async () => {
        // Arrange
        const { sut, updateTransactionUseCase } = makeSut()
        import.meta.jest
            .spyOn(updateTransactionUseCase, 'execute')
            .mockRejectedValueOnce(new Error())

        // Act
        const response = await sut.execute(baseHttpRequest)

        // Assert
        expect(response.statusCode).toBe(500)
    })

    it('should call UpdateTransactionUseCase with correct params', async () => {
        // Arrange
        const { sut, updateTransactionUseCase } = makeSut()
        const executeSpy = import.meta.jest.spyOn(
            updateTransactionUseCase,
            'execute',
        )

        // Act
        await sut.execute(baseHttpRequest)

        //Assert
        expect(executeSpy).toHaveBeenCalledWith(
            baseHttpRequest.params.transactionId,
            baseHttpRequest.body,
        )
    })

    it('should return 404 when TransactionNotFoundError is thrown', async () => {
        // Arrange
        const { sut, updateTransactionUseCase } = makeSut()
        import.meta.jest
            .spyOn(updateTransactionUseCase, 'execute')
            .mockRejectedValueOnce(new TransactionNotFoundError())

        // Act
        const response = await sut.execute(baseHttpRequest)

        // Assert
        expect(response.statusCode).toBe(404)
    })
})
