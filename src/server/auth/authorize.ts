import { User } from "next-auth";
import { User as DBUser } from "@prisma/client";
import bcrypt from "bcrypt";

import { z } from "zod";
import { db } from "../db";
import { UserData } from "./types";

// define schema for credentials
const credentialsSchema = z.object({
  username: z.string(),
  password: z.string(),
});

// define type for credentials
type Credentials = Record<"username" | "password", string>;

// async function to authorize user, required by next auth
export async function authorize(
  credentials: Credentials | undefined,
): Promise<User | null> {
  if (!credentials) {
    throw new Error("Invalid input");
  }

  try {
    const validatedCredentials = validateCredentials(credentials);

    const { username, password } = validatedCredentials;

    // find user in the database
    const user = await db.user.findFirst({
      where: { username },
    });

    // if user exists, attempt to login, otherwise create a new user
    if (user) {
      return loginUser(password, user);
    } else {
      return createNewUser(username, password);
    }
  } catch (err) {
    // handle authorization errors
    handleAuthorizationError(err);
  }
}

// validate user credentials against the defined schema
function validateCredentials(credentials: Credentials) {
  try {
    return credentialsSchema.parse(credentials);
  } catch (err) {
    // handle validation errors
    throw new Error(
      "Invalid input: " +
        (err instanceof z.ZodError ? err.message : "Server error"),
    );
  }
}

// login user with provided password and user data
async function loginUser(password: string, user: DBUser): Promise<User> {
  const isValidPassword = await comparePasswords(password, user.password || "");
  // if password is valid, map user data to the desired User type
  if (isValidPassword) {
    return mapUser(user);
  } else {
    // handle invalid password
    throw new Error("Invalid password");
  }
}

// create a new user with provided username and password
async function createNewUser(
  username: string,
  password: string,
): Promise<User> {
  const newUser = await db.user.create({
    data: {
      username,
      password: await hashPassword(password),
      provider: "password",
    },
  });
  // map user data to the desired User type
  return mapUser(newUser);
}

// map user data to the desired User type
function mapUser(userData: UserData): User {
  return {
    id: userData.id,
    provider: userData.provider,
    username: userData.username,
  };
}

// handle authorization errors
function handleAuthorizationError(err: any): never {
  console.error("error at handleAuthorizationError: ", err);
  throw new Error("Server error");
}

// asynchronously hash the provided password
const hashPassword = async (password: string) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

// asynchronously compare the provided password with the stored hash
const comparePasswords = async (
  providedPassword: string,
  storedHashedPassword: string,
) => {
  return await bcrypt.compare(providedPassword, storedHashedPassword);
};
