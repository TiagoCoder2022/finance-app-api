import { UserNotFoundError, InvalidPasswordError } from '../../errors/user.js'

export class LoginUserUseCase {
    constructor(
        getUserByEmailRepository,
        passwordComparatorAdapter,
        tokenGeneratorAdapter,
    ) {
        this.getUserByEmailRepository = getUserByEmailRepository
        this.passwordComparatorAdapter = passwordComparatorAdapter
        this.tokenGeneratorAdapter = tokenGeneratorAdapter
    }

    async execute(email, password) {
        // Verificar se o email é valido (se há um usuário com esse email)
        const user = await this.getUserByEmailRepository.execute(email)

        if (!user) {
            throw new UserNotFoundError()
        }

        // verificar se a senha recebida é válida
        const isPasswordValid = this.passwordComparatorAdapter.execute(
            password,
            user.password,
        )

        if (!isPasswordValid) {
            throw new InvalidPasswordError()
        }

        // depois, gerar os tokens de autenticacao
        return {
            ...user,
            tokens: this.tokenGeneratorAdapter.execute(user.id),
        }
    }
}
