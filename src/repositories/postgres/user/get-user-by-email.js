import { prisma } from '../../../../prisma/prisma.js'

export class PostgreGetUserByEmailRepository {
    async execute(email) {
        return await prisma.user.findUnique({
            where: {
                email,
            },
        })
    }
}
