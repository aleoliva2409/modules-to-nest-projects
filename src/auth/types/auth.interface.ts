import { User } from 'src/users/entities';

export interface IJwtPayload {
  id: string;
}

export interface IAuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface ITokensGenerated {
  token: string;
  refreshToken: string;
}
