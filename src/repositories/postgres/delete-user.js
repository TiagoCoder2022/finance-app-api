import { PostgresHelper } from '../../db/postgres/helper'

export class PostgresDeleteUserRepository {
    async execute(userId) {
        const deletedUser = await PostgresHelper.query(
            `DELETE FROM user
             WHERE id = $1
             RETURNING *`,
            [userId],
        )

        return deletedUser[0]
    }
}
