import { CreateTransactionController } from '../../controllers'
import { makeCreateTransacitonController } from './transaction'

describe('Transaction Controller Factories', () => {
    it('should return a valid CreateTransactionController instance', async () => {
        expect(makeCreateTransacitonController()).toBeInstanceOf(
            CreateTransactionController,
        )
    })
})
