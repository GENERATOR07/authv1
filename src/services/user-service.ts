import { UserModel } from "../models/user-model";

export async function findUserByEmail(email: string) {
  return await UserModel.findOne({ email });
}

export async function createUserIfNotExists(email: string) {
  let user = await findUserByEmail(email);

  if (!user) {
    user = await UserModel.create({
      email,
      loginMethod: "magic",
    });
  }

  return user;
}
