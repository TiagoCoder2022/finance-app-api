import {
    PasswordComparatorAdapter,
    TokensGeneratorAdapter,
    TokenVerifierAdapter,
} from '../../adapters'
import {
    LoginUserController,
    RefreshTokenController,
} from '../../controllers/index.js'
import { PostgresGetUserByEmailRepository } from '../../repositories/postgres'
import { LoginUserUseCase, RefreshTokenUseCase } from '../../use-cases/index.js'

export const makeLoginUserController = () => {
    const tokensGeneratorAdapter = new TokensGeneratorAdapter()
    const passwordComparatorAdapter = new PasswordComparatorAdapter()
    const getUserByEmailRepository = new PostgresGetUserByEmailRepository()

    const loginUserUseCase = new LoginUserUseCase(
        getUserByEmailRepository,
        passwordComparatorAdapter,
        tokensGeneratorAdapter,
    )
    const loginUserController = new LoginUserController(loginUserUseCase)

    return loginUserController
}

export const makeRefreshTokenController = () => {
    const tokensGeneratorAdapter = new TokensGeneratorAdapter()
    const tokenVerifierAdapter = new TokenVerifierAdapter()
    const refreshTokenUseCase = new RefreshTokenUseCase(
        tokensGeneratorAdapter,
        tokenVerifierAdapter,
    )
    const refreshTokenController = new RefreshTokenController(
        refreshTokenUseCase,
    )
    return refreshTokenController
}
