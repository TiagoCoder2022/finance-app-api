import dayjs from 'dayjs'
import { prisma } from '../../../../prisma/prisma'
import { transaction as fakeTransaction, user } from '../../../tests'
import { PostgresDeleteTransactionRepository } from './delete-trasaction'

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
})
