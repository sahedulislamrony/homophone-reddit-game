export type InitResponse = {
  type: 'init';
  postId: string;
  count: number;
  username: string;
};

export type UserDataResponse = {
  type: 'user';
  username: string;
  userId?: string;
  avatarUrl?: string;
  karma?: number;
  createdAt?: string;
  isLoggedIn: boolean;
};

export type IncrementResponse = {
  type: 'increment';
  postId: string;
  count: number;
};

export type DecrementResponse = {
  type: 'decrement';
  postId: string;
  count: number;
};

export interface ApiError extends Error {
  status?: number;
}
