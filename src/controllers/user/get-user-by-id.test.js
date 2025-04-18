import { faker } from '@faker-js/faker'
import { GetUserByIdController } from './get-user-by-id'
import { user } from '../../tests'

describe('GetUserByIdController', () => {
    class GetUserByIdUseCaseStube {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const getUserByIdUseCase = new GetUserByIdUseCaseStube()
        const sut = new GetUserByIdController(getUserByIdUseCase)

        return { sut, getUserByIdUseCase }
    }

    const baseHttpRequest = {
        params: { userId: faker.string.uuid() },
    }

    it('should return 200 if a user is found', async () => {
        // Arrange
        const { sut } = makeSut()

        // Act
        const result = await sut.execute(baseHttpRequest)

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
        const { sut, getUserByIdUseCase } = makeSut()
        import.meta.jest
            .spyOn(getUserByIdUseCase, 'execute')
            .mockResolvedValueOnce(null)

        // Act
        const result = await sut.execute({
            params: { userId: faker.string.uuid() },
        })

        // Assert
        expect(result.statusCode).toBe(404)
    })

    it('should return 500 if GetUserByIdUseCase throws an error', async () => {
        // Arrange
        const { sut, getUserByIdUseCase } = makeSut()
        import.meta.jest
            .spyOn(getUserByIdUseCase, 'execute')
            .mockRejectedValue(new Error())

        // Act
        const result = await sut.execute(baseHttpRequest)

        // Assert
        expect(result.statusCode).toBe(500)
    })

    it('should calls GetUserByIdUseCase with correct param', async () => {
        // arrange
        const { sut, getUserByIdUseCase } = makeSut()
        const executeSpy = import.meta.jest.spyOn(getUserByIdUseCase, 'execute')

        //act
        await sut.execute(baseHttpRequest)

        // assert
        expect(executeSpy).toHaveBeenCalledWith(baseHttpRequest.params.userId)
    })
})
