import { faker } from '@faker-js/faker'
import { prisma } from '../../../../prisma/prisma'
import { transaction, user } from '../../../tests'
import { PostgresUpdateTransactionRepository } from './update-transaction'
import { TransactionType } from '@prisma/client'
import dayjs from 'dayjs'

import { TransactionNotFoundError } from '../../../errors'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library.js'

describe('PostgresUpdateTransactionRepository', () => {
    it('should update a transaction on db', async () => {
        await prisma.user.create({ data: user })
        await prisma.transaction.create({
            data: { ...transaction, user_id: user.id },
        })
        const sut = new PostgresUpdateTransactionRepository()
        const params = {
            id: faker.string.uuid(),
            user_id: user.id,
            name: faker.commerce.productName(),
            date: faker.date.anytime().toISOString(),
            type: TransactionType.EXPENSE,
            amount: Number(faker.finance.amount()),
        }

        const result = await sut.execute(transaction.id, params)

        expect(result.name).toBe(params.name)
        expect(result.type).toBe(params.type)
        expect(result.user_id).toBe(user.id)
        expect(String(result.amount)).toBe(String(result.amount))
        expect(dayjs(result.date).daysInMonth).toBe(
            dayjs(params.date).daysInMonth,
        )
        expect(dayjs(result.date).month).toBe(dayjs(params.date).month)
        expect(dayjs(result.date).year).toBe(dayjs(params.date).year)
    })

    it('should call Prisma with correct params', async () => {
        await prisma.user.create({ data: user })
        await prisma.transaction.create({
            data: { ...transaction, user_id: user.id },
        })
        const prismaSpy = import.meta.jest.spyOn(prisma.transaction, 'update')
        const sut = new PostgresUpdateTransactionRepository()

        await sut.execute(transaction.id, { ...transaction, user_id: user.id })

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                id: transaction.id,
            },
            data: { ...transaction, user_id: user.id },
        })
    })

    it('should throw if Prisma throws', async () => {
        const sut = new PostgresUpdateTransactionRepository()
        import.meta.jest
            .spyOn(prisma.transaction, 'update')
            .mockRejectedValueOnce(new Error())

        const promise = sut.execute(transaction.id, transaction)

        await expect(promise).rejects.toThrow()
    })

    it('should throw TransactionNotFoundError if Prisma does not find record to update', async () => {
        const sut = new PostgresUpdateTransactionRepository()
        import.meta.jest
            .spyOn(prisma.transaction, 'update')
            .mockRejectedValueOnce(
                new PrismaClientKnownRequestError('', {
                    code: 'P2025',
                }),
            )

        const promise = sut.execute(transaction.id, transaction)

        await expect(promise).rejects.toThrow(
            new TransactionNotFoundError(transaction.id),
        )
    })
})
