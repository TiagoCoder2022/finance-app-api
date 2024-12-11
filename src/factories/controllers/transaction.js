import { CreateTransactionController } from '../../controllers/index.js'
import {
    PostgresCreateTransactionRepository,
    PostGresGetUserByIdRepository,
} from '../../repositories/postgres/index.js'
import { CreateTransactionUseCase } from '../../use-cases/index.js'

export const makeCreateTransacitonController = () => {
    const createTransactionRepository =
        new PostgresCreateTransactionRepository()

    const getUserByIdRepository = new PostGresGetUserByIdRepository()

    const createTransactionUseCase = new CreateTransactionUseCase(
        createTransactionRepository,
        getUserByIdRepository,
    )

    const createTransactionController = new CreateTransactionController(
        createTransactionUseCase,
    )

    return createTransactionController
}
