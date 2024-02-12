import validator from 'validator'

import { badRequest, notFound } from './http.js'

export const invalidPasswordResponde = () =>
    badRequest({
        message: 'Password must be at least 6 characters.',
    })

export const emailIsAlreadyInUseResponse = () =>
    badRequest({
        message: 'Invalid email. Please provide a valid one.',
    })

export const invalidIdResponse = () =>
    badRequest({
        message: 'The provided id is not valid.',
    })

export const userNotFoundresponse = () =>
    notFound({ message: 'User not found.' })

export const checkIfPasswordIsValid = (password) => password.length >= 6

export const checkIfEmailIsValid = (email) => validator.isEmail(email)

export const checkIfIdIsValid = (id) => validator.isUUID(id)
