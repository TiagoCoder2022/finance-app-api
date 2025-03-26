import { faker } from '@faker-js/faker'
import { GetUserByIdController } from './get-user-by-id'

describe('GetUserByIdController', () => {
    class GetUserByIdUseCaseStube {
        async execute() {
            return {
                id: faker.string.uuid(),
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 7 }),
            }
        }
    }

    const makeSut = () => {
        const getUserByIdUsecase = new GetUserByIdUseCaseStube()
        const sut = new GetUserByIdController(getUserByIdUsecase)

        return { sut, getUserByIdUsecase }
    }

    it('should return 200 if a user is found', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute({
            params: { userId: faker.string.uuid() },
        })

        // Assert
        expect(result.statusCode).toBe(200)
    })

    it('shoul return 400 if a invalid id is provided', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute({
            params: { userId: 'invalid_id' },
        })
        // Assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 404 if a user is not found', async () => {
        // Arrange
        const { sut, getUserByIdUsecase } = makeSut()
        jest.spyOn(getUserByIdUsecase, 'execute').mockResolvedValueOnce(null)

        // Act
        const result = await sut.execute({
            params: { userId: faker.string.uuid() },
        })

        // Assert
        expect(result.statusCode).toBe(404)
    })
})
