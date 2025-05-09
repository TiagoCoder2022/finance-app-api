import { PostgresCreateUserRepository } from './create-user'
import { user } from '../../../tests'
import { prisma } from '../../../../prisma/prisma'

describe('CreateUserRepository', () => {
    it('should create a user on db', async () => {
        const sut = new PostgresCreateUserRepository()

        const result = await sut.execute(user)

        expect(result.id).toBe(user.id)
        expect(result.first_name).toBe(user.first_name)
        expect(result.last_name).toBe(user.last_name)
        expect(result.email).toBe(user.email)
        expect(result.password).toBe(user.password)
    })

    it('should call Prisma with correct params', async () => {
        const sut = new PostgresCreateUserRepository()
        const prismaSpy = import.meta.jest.spyOn(prisma.user, 'create')

        await sut.execute(user)

        expect(prismaSpy).toHaveBeenCalledWith({
            data: user,
        })
    })

    it('should throw if Prisma thows', async () => {
        const sut = new PostgresCreateUserRepository()

        import.meta.jest
            .spyOn(prisma.user, 'create')
            .mockRejectedValueOnce(new Error())

        const promise = sut.execute(user)

        await expect(promise).rejects.toThrow()
    })
})
