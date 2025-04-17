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
        const isPasswordValid = await this.passwordComparatorAdapter.execute(
            password,
            user.password,
        )

        console.log(isPasswordValid)

        if (!isPasswordValid) {
            throw new InvalidPasswordError()
        }

        // depois, gerar os tokens de autenticacao
        const userTokens = await this.tokenGeneratorAdapter.execute(user.id)

        return {
            ...user,
            tokens: userTokens,
        }
    }
}
