import { ForbiddenError } from '../../errors/index.js'

export class UpdateTransactionUseCase {
    constructor(updateTransactionRepository, getTransactionByIdRepository) {
        this.updateTransactionRepository = updateTransactionRepository
        this.getTransactionByIdRepository = getTransactionByIdRepository
    }

    async execute(transactionId, transactionParams) {
        const transaction =
            await this.getTransactionByIdRepository.execute(transactionId)

        if (
            transactionParams?.userId &&
            transaction.user_id !== transactionParams.user_id
        ) {
            throw new ForbiddenError()
        }
        return await this.updateTransactionRepository.execute(
            transactionId,
            transactionParams,
        )
    }
}
