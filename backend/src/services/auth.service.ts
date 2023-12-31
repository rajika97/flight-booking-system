import { RefreshToken } from "../entity/refreshToken";

export type RefreshTokenObject = {
  id: string;
  token: string;
  userId: string;
};

export const getToken = async (
  id: string
): Promise<RefreshTokenObject | null> => {
  return RefreshToken.findOneBy({
    id: id,
  });
};

export const createToken = async (
  refreshToken: RefreshTokenObject
): Promise<RefreshTokenObject> => {
  const { id, token, userId } = refreshToken;
  const newRefreshToken = new RefreshToken();
  newRefreshToken.id = id;
  newRefreshToken.token = token;
  newRefreshToken.userId = userId;
  return newRefreshToken.save();
};

export const deleteToken = async (id: string): Promise<void> => {
  const refreshTokenToDelete = await RefreshToken.findOneBy({ id: id });
  if (!refreshTokenToDelete) {
    throw new Error("Token not found");
  }
  refreshTokenToDelete.remove();
};
