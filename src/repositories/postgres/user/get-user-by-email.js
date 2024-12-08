import { PostgresHelper } from '../../../db/postgres/helper.js'

export class PostgreGetUserByEmailRepository {
    async execute(email) {
        const user = await PostgresHelper.query(
            'SELECT * FROM users WHERE email = $1',
            [email],
        )

        return user[0]
    }
}
