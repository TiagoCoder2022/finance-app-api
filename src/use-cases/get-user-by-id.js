import { PostGresGetUserByIdRepository } from '../repositories/postgres/index.js'

export class GetUserByIdUseCase {
    async execute(userId) {
        const getUserByIdRepository = new PostGresGetUserByIdRepository()
        const user = await getUserByIdRepository.execute(userId)

        return user
    }
}
