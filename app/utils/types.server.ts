import { User } from "@prisma/client";

export type RegisterForm = Pick<User, 'email' | 'password' | 'firstName' | 'lastName'>;
export type LoginForm = Pick<User, 'email' | 'password'>;