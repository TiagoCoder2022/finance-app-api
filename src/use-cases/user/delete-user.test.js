import { faker } from '@faker-js/faker'
import { DeleteUserUseCase } from './delete-user'
import { user } from '../../tests'

describe('DeleteUserUseCase', () => {
    class DeleteUserRepositoryStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const deleteUserRepository = new DeleteUserRepositoryStub()
        const sut = new DeleteUserUseCase(deleteUserRepository)

        return {
            sut,
            deleteUserRepository,
        }
    }

    it('should successfully delete a user', async () => {
        // arrange
        const { sut } = makeSut()

        // act
        const deletedUser = await sut.execute(faker.string.uuid())

        // assert
        expect(deletedUser).toEqual(user)
    })

    it('should call DeleteUserRepository with correct params', async () => {
        // arrange
        const { sut, deleteUserRepository } = makeSut()
        const executeSpy = import.meta.jest.spyOn(
            deleteUserRepository,
            'execute',
        )
        const userId = faker.string.uuid()

        // act
        await sut.execute(userId)

        // assert
        expect(executeSpy).toHaveBeenCalledWith(userId)
    })

    it('should thows if DeleteUserRepository throws', async () => {
        // arrange
        const { sut, deleteUserRepository } = makeSut()
        import.meta.jest
            .spyOn(deleteUserRepository, 'execute')
            .mockImplementationOnce(() => {
                throw new Error()
            })

        // act
        const promise = sut.execute(faker.string.uuid())

        // assert
        await expect(promise).rejects.toThrow()
    })
})
