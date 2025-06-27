import { UserModel, IUser } from "../models/user-model";

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

export async function findUserById(userId: string) {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}

// Define the fields that can be updated
const UPDATABLE_FIELDS = ["alias", "displayName", "bio", "avatar"] as const;
type UpdatableField = (typeof UPDATABLE_FIELDS)[number];

export async function updateUser(
  userId: string,
  updateData: Partial<Pick<IUser, UpdatableField>>
) {
  // Filter out any fields that aren't in UPDATABLE_FIELDS
  const filteredUpdateData = Object.keys(updateData).reduce((acc, key) => {
    const typedKey = key as UpdatableField;
    if (UPDATABLE_FIELDS.includes(typedKey)) {
      acc[typedKey] = updateData[typedKey];
    }
    return acc;
  }, {} as Partial<Pick<IUser, UpdatableField>>);

  const user = await UserModel.findByIdAndUpdate(
    userId,
    { $set: filteredUpdateData },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}
