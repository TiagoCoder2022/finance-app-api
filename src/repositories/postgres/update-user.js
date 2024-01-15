import { PostgresHelper } from '../../db/postgres/helper'

export class PostgresUpdateUserRepository {
    async execute(userId, updateUserParams) {
        const updateFields = [] //[first_name = $1, last_name = $2]
        const updateValues = [] //[Jane, Doe]

        Object.keys(updateUserParams).forEach((key) => {
            updateFields.push(`${key} = $${updateValues.length + 1}`)
            updateValues.push(updateUserParams[key])
        })

        updateValues.push(userId)

        const updateQuery = `
        UPDATE users
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
