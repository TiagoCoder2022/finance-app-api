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
})
