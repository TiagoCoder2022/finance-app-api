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

    it('should return 201 when creating transaction successfully (expense)', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const response = await sut.execute(baseHttpRequest)

        // Assert
        expect(response.statusCode).toBe(201)
    })

    it('should return 201 when creating transaction successfully (earning)', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const response = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                type: 'EARNING',
            },
        })

        // Assert
        expect(response.statusCode).toBe(201)
    })

    it('should return 400 when missing name', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const response = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                name: undefined,
            },
        })

        // Assert
        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when missing date', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const response = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                date: undefined,
            },
        })

        // Assert
        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when missing type', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const response = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                type: undefined,
            },
        })

        // Assert
        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when missing amount', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const response = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                amount: undefined,
            },
        })

        // Assert
        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when date is invalid', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const response = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                date: 'invalid_date',
            },
        })

        // Assert
        expect(response.statusCode).toBe(400)
    })

    it('should return 400 when type is not EXPENSE, EARNING or INVESTMENT', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const response = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                type: 'invalid_type',
            },
        })

        // Assert
        expect(response.statusCode).toBe(400)
    })
})
