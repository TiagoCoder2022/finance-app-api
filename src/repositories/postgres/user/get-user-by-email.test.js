import { prisma } from '../../../../prisma/prisma'
import { user as fakeUser } from '../../../tests'
import { PostgreGetUserByEmailRepository } from './get-user-by-email'

describe('GetUserByEmailRepository', () => {
    it('should get user by email on db', async () => {
        const user = await prisma.user.create({ data: fakeUser })

        const sut = new PostgreGetUserByEmailRepository()

        const result = await sut.execute(user.email)

        expect(result).toStrictEqual(user)
    })

    it('should call Prisma with correct paramas', async () => {
        const sut = new PostgreGetUserByEmailRepository()

        const prismaSpy = jest.spyOn(prisma.user, 'findUnique')

        await sut.execute(fakeUser.email)

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                email: fakeUser.email,
            },
        })
    })

    it('should throw if Prisma thows', async () => {
        const sut = new PostgreGetUserByEmailRepository()

        jest.spyOn(prisma.user, 'findUnique').mockRejectedValueOnce(new Error())

        const promise = sut.execute(fakeUser.email)

        await expect(promise).rejects.toThrow()
    })
})
