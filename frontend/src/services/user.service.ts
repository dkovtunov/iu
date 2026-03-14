import {client, CreateUserCommand, UserDto} from "../api/client.ts";

export const registerUser = async (email: string, password: string, name?: string) => {
    if (email && password) {
        const response = await client.post<UserDto>("/users", {email, password, name} as CreateUserCommand)

        return response.data
    }
}
