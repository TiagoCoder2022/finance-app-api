export class DeleteTransactionUseCase {
    constructor(deleteTransactioRepository) {
        this.deleteTransactioRepository = deleteTransactioRepository
    }
    async execute(transactionId) {
        const deleteTransaction =
            await this.deleteTransactioRepository.execute(transactionId)

        return deleteTransaction
    }
}
