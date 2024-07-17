import { TokenData } from "../types/tokenDataType";

const getToken = (): string | null => {
  const tokenData = localStorage.getItem("__token");
  if (!tokenData) return null;

  try {
    const { token, expirationTime }: TokenData = JSON.parse(tokenData);
    const currentTime = new Date().getTime();

    if (currentTime > expirationTime) {
      localStorage.removeItem("__token");
      return null;
    }

    return token;
  } catch (error) {
    console.error("Failed to parse token data:", error);
    localStorage.removeItem("__token");
    return null;
  }
};

export default getToken;
