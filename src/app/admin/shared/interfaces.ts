import { Observable } from "rxjs";

export interface IResponseTokens {
  accessToken: string;
  expiresIn: string;
  refreshToken: string;
  user?: IUser
}

export interface IUser {
  id?: number | undefined;
  email: string;
  password: string;
  name: string;
}


export interface IUserData {
  id?: number | undefined;
  email: string;
  password: string;
}

export interface ICurrentUser {
  id?: number | undefined;
  email: string;
  name: string;
}


export interface IPost {
  title: string;
  content: string;
  // author: string;
}

export interface ICurrentPost {
  title: string;
  content: string;
  author: string;
  tags?: string[];
  imageSource?: string | null;
  date: string
}


export interface IOriginMethod {
  url: string;
  method: string;
}
