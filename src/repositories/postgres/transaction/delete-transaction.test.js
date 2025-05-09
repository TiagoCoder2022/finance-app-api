import dayjs from 'dayjs'
import { prisma } from '../../../../prisma/prisma'
import {
    transaction as fakeTransaction,
    transaction,
    user,
} from '../../../tests'
import { PostgresDeleteTransactionRepository } from './delete-trasaction'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { TransactionNotFoundError } from '../../../errors'

describe('PostgresDeleteTransactionRepository', () => {
    it('should delete a transction on db', async () => {
        await prisma.user.create({ data: user })
        const transaction = await prisma.transaction.create({
            data: { ...fakeTransaction, user_id: user.id },
        })
        const sut = new PostgresDeleteTransactionRepository()

        const result = await sut.execute(transaction.id)

        expect(result.name).toBe(transaction.name)
        expect(result.type).toBe(transaction.type)
        expect(result.user_id).toBe(user.id)
        expect(String(result.amount)).toBe(String(result.amount))
        expect(dayjs(result.date).daysInMonth).toBe(
            dayjs(transaction.date).daysInMonth,
        )
        expect(dayjs(result.date).month).toBe(dayjs(transaction.date).month)
        expect(dayjs(result.date).year).toBe(dayjs(transaction.date).year)
    })

    it('should call Prisma with correct params', async () => {
        await prisma.user.create({ data: user })
        await prisma.transaction.create({
            data: { ...transaction, user_id: user.id },
        })
        const prismaSpy = import.meta.jest.spyOn(prisma.transaction, 'delete')
        const sut = new PostgresDeleteTransactionRepository()

        await sut.execute(transaction.id)

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                id: transaction.id,
            },
        })
    })

    it('should throw generic error if Prisma throws generic error', async () => {
        const sut = new PostgresDeleteTransactionRepository()
        import.meta.jest
            .spyOn(prisma.transaction, 'delete')
            .mockRejectedValueOnce(new Error())

        const promise = sut.execute(transaction.id)

        await expect(promise).rejects.toThrow()
    })

    it('should throw TransactionNotFoundError if Prisma throws PrismaClientKnownRequestError', async () => {
        const sut = new PostgresDeleteTransactionRepository()
        import.meta.jest
            .spyOn(prisma.transaction, 'delete')
            .mockRejectedValueOnce(
                new PrismaClientKnownRequestError('', {
                    code: 'P2025',
                }),
            )

        const promise = sut.execute(transaction.id)

        await expect(promise).rejects.toThrow(
            new TransactionNotFoundError(transaction.id),
        )
    })
})
