import bcrypt from "bcrypt";
import { Role, User } from "../entity/user";

export type UserObject = {
  id: string;
  username: string;
  email: string;
  password: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
};

export const listUsers = async (): Promise<UserObject[]> => {
  return await User.find();
};

export const getUser = async (id: string): Promise<UserObject | null> => {
  return User.findOneBy({
    id: id,
  });
};

export const findUserByEmail = async (
  email: string
): Promise<UserObject | null> => {
  return User.findOneBy({
    email: email,
  });
};

export const createUser = async (
  user: Omit<UserObject, "id">
): Promise<UserObject> => {
  user.password = bcrypt.hashSync(user.password, 12);
  const { username, email, role, password } = user;
  const newUser = new User();
  newUser.username = username;
  newUser.email = email;
  newUser.role = role;
  newUser.password = password;
  return newUser.save();
};

export const updateUser = async (
  user: Omit<UserObject, "id">,
  id: string
): Promise<UserObject> => {
  const { username, email, role, password } = user;
  const userToUpdate = await User.findOneBy({ id: id });
  if (!userToUpdate) {
    throw new Error("User not found");
  }
  userToUpdate.username = username;
  userToUpdate.email = email;
  userToUpdate.role = role;
  userToUpdate.password = password;
  return userToUpdate.save();
};

export const deleteUser = async (id: string): Promise<void> => {
  const userToDelete = await User.findOneBy({ id: id });
  if (!userToDelete) {
    throw new Error("USer not found");
  }
  userToDelete.remove();
};
