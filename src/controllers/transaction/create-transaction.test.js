import { CreateTransactionController } from './create-transaction'
import { faker } from '@faker-js/faker'

describe('Create Transaction Controller', () => {
    class CreateTransactionUseCaseStub {
        async execute(transaction) {
            return transaction
        }
    }

    const makeSut = () => {
        const createTransactionUseCase = new CreateTransactionUseCaseStub()
        const sut = new CreateTransactionController(createTransactionUseCase)

        return { sut, createTransactionUseCase }
    }

    const baseHttpRequest = {
        body: {
            user_id: faker.string.uuid(),
            name: faker.commerce.productName(),
            date: faker.date.anytime().toISOString(),
            type: 'EXPENSE',
            amount: Number(faker.finance.amount()),
        },
    }

    it('should return 201 when creating transaction successfully', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const response = await sut.execute(baseHttpRequest)

        // Assert
        expect(response.statusCode).toBe(201)
    })

    it('', async () => {})

    it('', async () => {})

    it('', async () => {})
})
