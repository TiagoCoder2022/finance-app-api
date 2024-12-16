import { badRequest, notFound } from './http.js'

export const invalidPasswordResponde = () =>
    badRequest({
        message: 'Password must be at least 6 characters.',
    })

export const emailIsAlreadyInUseResponse = () =>
    badRequest({
        message: 'Invalid email. Please provide a valid one.',
    })

export const userNotFoundresponse = () =>
    notFound({ message: 'User not found.' })
