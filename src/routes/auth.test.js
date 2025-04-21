import request from 'supertest'
import { app } from '../app.js'
import { user } from '../tests/fixtures/user.js'

describe('Auth Route E2E Tests', () => {
    it('POST /api/auth/login should return 200 and tokens when user credentials are valid', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const response = await request(app).post('/api/auth/login').send({
            email: createdUser.email,
            password: user.password,
        })

        expect(response.status).toBe(200)
        expect(response.body.tokens.accessToken).toBeDefined()
        expect(response.body.tokens.refreshToken).toBeDefined()
    })

    it('POST /api/auth/login should return 404 if user is not found', async () => {
        const response = await request(app).post('/api/auth/login').send({
            email: 'anyemail@email.com',
            password: user.password,
        })

        expect(response.status).toBe(404)
    })

    it('POST /api/auth/login should return 401 if user password is invalid', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const response = await request(app).post('/api/auth/login').send({
            email: createdUser.email,
            password: 'wrong_password',
        })

        expect(response.status).toBe(401)
    })

    it('POST /api/auth/refresh-token should return 200 and new tokens when refresh token is valid', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                ...user,
                id: undefined,
            })

        const response = await request(app)
            .post('/api/auth/refresh-token')
            .send({
                refreshToken: createdUser.tokens.refreshToken,
            })

        expect(response.status).toBe(200)
        expect(response.body.accessToken).toBeDefined()
        expect(response.body.refreshToken).toBeDefined()
    })
})
