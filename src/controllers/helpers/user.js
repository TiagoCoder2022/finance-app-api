import { notFound } from './http.js'

export const userNotFoundresponse = () =>
    notFound({ message: 'User not found.' })
