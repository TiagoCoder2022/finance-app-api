import { PostGresGetUserByIdRepository } from '../repositories/postgres/get-user-by-id.js'

export class GetUserByIdUseCase {
    async execute(userId) {
        const getUserByIdRepository = new PostGresGetUserByIdRepository()
        const user = await getUserByIdRepository.execute(userId)

        return user
    }
}
