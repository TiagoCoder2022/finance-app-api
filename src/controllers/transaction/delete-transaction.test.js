import { faker } from '@faker-js/faker'
import { DeleteTransactionController } from './delete-transaction'

describe('Delete Transaction Controller', () => {
    class DeleteTransactionUseCaseStub {
        async execute() {
            return {
                user_id: faker.string.uuid(),
                id: faker.string.uuid(),
                name: faker.commerce.productName(),
                date: faker.date.anytime().toISOString(),
                type: 'EXPENSE',
                amount: Number(faker.finance.amount()),
            }
        }
    }
    const makeSut = () => {
        const deleteTransactionUseCase = new DeleteTransactionUseCaseStub()
        const sut = new DeleteTransactionController(deleteTransactionUseCase)

        return { sut, deleteTransactionUseCase }
    }

    it('should return 200 when deleting a transaction successfully', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const response = await sut.execute({
            params: { transactionId: faker.string.uuid() },
        })

        // Assert

        expect(response.statusCode).toBe(200)
    })

    it('shoul return 400 when id is invalid', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const resonse = await sut.execute({
            params: { transactionId: 'invalid_id' },
        })

        // Assert
        expect(resonse.statusCode).toBe(400)
    })

    it('should return 404 when transaction is not found', async () => {
        // Arrange
        const { sut, deleteTransactionUseCase } = makeSut()
        jest.spyOn(deleteTransactionUseCase, 'execute').mockResolvedValueOnce(
            null,
        )

        // Act
        const response = await sut.execute({
            params: { transactionId: faker.string.uuid() },
        })

        // Assert
        expect(response.statusCode).toBe(404)
    })

    it('should retrun 500 when DeleteTransactionUseCase throws', async () => {
        // Arrange
        const { sut, deleteTransactionUseCase } = makeSut()
        jest.spyOn(deleteTransactionUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        // Act
        const response = await sut.execute({
            params: { transactionId: faker.string.uuid() },
        })

        // Assert
        expect(response.statusCode).toBe(500)
    })

    it('should call DeleteTransactionUseCase with correct params', async () => {
        // Arrange
        const { sut, deleteTransactionUseCase } = makeSut()
        const executeSpy = jest.spyOn(deleteTransactionUseCase, 'execute')
        const transactionId = faker.string.uuid()

        //Act
        await sut.execute({
            params: { transactionId },
        })

        //Assert
        expect(executeSpy).toHaveBeenCalledWith(transactionId)
    })
})
