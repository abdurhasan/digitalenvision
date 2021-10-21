import { User } from 'src/models/user.model';

export interface IBirthdayWorkerParam {
  baseUrl: string;
  messageFormat: string;
  data: User[];
}

export interface IBirthdayWorkerResponse {
  data: string[];
}

export interface IHookbinResponse {
  success: boolean;
}

export interface IHookbinPayload {
  message: string;
}
