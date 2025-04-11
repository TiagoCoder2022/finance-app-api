import {
    CreateTransactionController,
    UpdateTransactionController,
} from '../../controllers'
import {
    makeCreateTransacitonController,
    makeUpdateTransactionController,
} from './transaction'

describe('Transaction Controller Factories', () => {
    it('should return a valid CreateTransactionController instance', async () => {
        expect(makeCreateTransacitonController()).toBeInstanceOf(
            CreateTransactionController,
        )
    })

    it('should a valid UpdateTransactionController instance', async () => {
        expect(makeUpdateTransactionController()).toBeInstanceOf(
            UpdateTransactionController,
        )
    })
})
