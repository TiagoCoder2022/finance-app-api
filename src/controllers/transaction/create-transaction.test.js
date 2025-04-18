import { transaction } from '../../tests'
import { CreateTransactionController } from './create-transaction'

describe('Create Transaction Controller', () => {
    class CreateTransactionUseCaseStub {
        async execute() {
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
            ...transaction,
            id: undefined,
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

    it('should return 201 when creating transaction successfully (investment)', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const response = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                type: 'INVESTMENT',
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

    it('should return 400 when amount is not a valid currency', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const response = await sut.execute({
            body: {
                ...baseHttpRequest.body,
                amount: 'invalid_amount',
            },
        })

        // Assert
        expect(response.statusCode).toBe(400)
    })

    it('should return 500 when CreateTransactionUseCase throws', async () => {
        // Arrange
        const { sut, createTransactionUseCase } = makeSut()
        import.meta.jest
            .spyOn(createTransactionUseCase, 'execute')
            .mockRejectedValueOnce(new Error())

        // Act
        const response = await sut.execute(baseHttpRequest)

        // Assert
        expect(response.statusCode).toBe(500)
    })

    it('should call CreateTransactionUseCase with correct params', async () => {
        // Arrange
        const { sut, createTransactionUseCase } = makeSut()
        const executeSpy = import.meta.jest.spyOn(
            createTransactionUseCase,
            'execute',
        )

        // Act
        await sut.execute(baseHttpRequest)

        // Assert
        expect(executeSpy).toHaveBeenCalledWith(baseHttpRequest.body)
    })
})
