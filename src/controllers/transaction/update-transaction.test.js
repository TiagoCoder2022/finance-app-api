import { faker } from '@faker-js/faker'
import { UpdateTransactionController } from './update-transaction'

describe('Update Transaction Controller', () => {
    class UpdateTransactionUsecaseStub {
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

    it('should return 400 when unallowed field is provided', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const response = await sut.execute({
            ...baseHttpRequest,
            body: {
                ...baseHttpRequest.body,
                unallowed_field: 'some_value',
            },
        })

        // Assert
        expect(response.statusCode).toBe(400)
    })
})
