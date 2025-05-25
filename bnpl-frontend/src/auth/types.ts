import { JwtPayload } from "jwt-decode";

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  role: "merchant" | "customer";
}


export interface AuthContextType {
  /* raw tokens */
  accessToken:  string | null;
  refreshToken: string | null;

  user: JwtPayload | null;

  /** full payload returned from GET /auth/me/ (contains role) */
  profile: any | null;

  login:  (access: string, refresh: string) => Promise<void>;
  logout: () => void;
}
