import { User } from "next-auth";
import bcrypt from "bcrypt";

import { z } from "zod";
import { db } from "../db";

const credentialsSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export async function authorize(
  credentials: Record<"username" | "password", string> | undefined,
): Promise<User | null> {

  if (!credentials) {
    throw new Error("Invalid input");
  }

  try {
    const validatedCredentials = credentialsSchema.parse(credentials);

    const { username, password } = validatedCredentials;

    const user = await db.user.findFirst({
      where: { username },
    });

    // console.log("uuuu", user);
    if (user) {
      if (await comparePasswords(password, user.password)) {
        return { id: user.id, role: "user", provider: user.provider };
      } else {
        throw new Error("Invalid password");
      }
    } else {
      const newUser = await db.user.create({
        data: {
          username,
          password: await hashPassword(password),
          provider: "password",
        },
      });
      return { id: newUser.id, role: "user", provider: newUser.provider };
    }
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      throw new Error("Invalid input: " + error.message);
    } else {
      throw new Error("Server error:");
    }
  }
}

const hashPassword = async (password: string) => {
  const saltRounds = 10; // Number of salt rounds for hashing (adjust as needed)
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

// Compare the provided password with the stored hash
const comparePasswords = async (
  providedPassword: string,
  storedHashedPassword: string,
) => {
  return await bcrypt.compare(providedPassword, storedHashedPassword);
};
