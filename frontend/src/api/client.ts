import axios from 'axios';

export const client = axios.create({
    baseURL: "http://0.0.0.0:3001"
})

export interface UserDto {
    id: number;
    name: string;
    email: string;
}

export interface CreateUserCommand {
    email: string;
    password: string;
    name?: string;
}