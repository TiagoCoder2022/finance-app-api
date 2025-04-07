import { faker } from '@faker-js/faker'
import { DeleteTransactionUseCase } from './delete-transaction'
import { transaction } from '../../tests'

describe('Delete Transaction Use Case', () => {
    class DeleteTransctionRepositoryStub {
        async execute() {
            return transaction
        }
    }

    const makeSut = () => {
        const deleteTransactionRepository = new DeleteTransctionRepositoryStub()
        const sut = new DeleteTransactionUseCase(deleteTransactionRepository)

        return {
            sut,
            deleteTransactionRepository,
        }
    }

    it('should delete transaction successfully', async () => {
        const { sut } = makeSut()
        const id = faker.string.uuid()

        const result = await sut.execute(id)

        expect(result).toEqual(transaction)
    })

    it('should call DeleteTransactionRepository with correct params', async () => {
        const { sut, deleteTransactionRepository } = makeSut()
        const id = faker.string.uuid()

        const executeSpy = jest.spyOn(deleteTransactionRepository, 'execute')
        await sut.execute(id)

        expect(executeSpy).toHaveBeenCalledWith(id)
    })

    it('should throw if DeleteTransactionRepository throws', async () => {
        const { sut, deleteTransactionRepository } = makeSut()
        const id = faker.string.uuid()

        jest.spyOn(
            deleteTransactionRepository,
            'execute',
        ).mockRejectedValueOnce(new Error())

        await expect(sut.execute(id)).rejects.toThrow()
    })
})
