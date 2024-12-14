export class UpdateTransactionUseCase {
    constructor(updateTransactionRepository) {
        this.updateTransactionRepository = updateTransactionRepository
    }

    async execute(transactionId, transactionParams) {
        const transaction = await this.updateTransactionRepository.execute(
            transactionId,
            transactionParams,
        )

        return transaction
    }
}
