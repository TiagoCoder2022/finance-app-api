import { v4 as uuidv4 } from 'uuid'
import { EmailAlreadyInUseError } from '../../errors/user.js'

export class CreateUserUseCase {
    constructor(
        getUserByEmailRepository,
        createUserRepository,
        passwordHasherAdapter,
    ) {
        this.getUserByEmailRepository = getUserByEmailRepository
        this.createUserRepository = createUserRepository
        this.passwordHasherAdapter = passwordHasherAdapter
    }

    async execute(createUserParams) {
        const userWithProvidedEmail =
            await this.getUserByEmailRepository.execute(createUserParams.email)

        if (userWithProvidedEmail) {
            throw new EmailAlreadyInUseError(createUserParams.email)
        }
        // gerar ID do usuário
        const userId = uuidv4()

        // criptografar a senha
        const hashedPassword = await this.passwordHasherAdapter.execute(
            createUserParams.password,
        )

        //inserir o usuário no banco
        const user = {
            ...createUserParams,
            id: userId,
            password: hashedPassword,
        }

        const createdUser = await this.createUserRepository.execute(user)

        return createdUser
    }
}
