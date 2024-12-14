import { PostgresHelper } from '../../../db/postgres/helper'

export class PostgresUpdateTransactionRepository {
    async execute(userId, updateTransactionParams) {
        const updateFields = [] //[first_name = $1, last_name = $2]
        const updateValues = [] //[Jane, Doe]

        Object.keys(updateTransactionParams).forEach((key) => {
            updateFields.push(`${key} = $${updateValues.length + 1}`)
            updateValues.push(updateTransactionParams[key])
        })

        updateValues.push(userId)

        const updateQuery = `
        UPDATE transactions
        SET ${updateFields.join(', ')}
        WHERE id = $${updateValues.length}
        RETURNING *
        `
        const updatedUser = await PostgresHelper.query(
            updateQuery,
            updateValues,
        )

        return updatedUser[0]
    }
}
