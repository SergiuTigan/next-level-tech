export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  thumbnail?: string;
  password?: string;
  email: string;
  newPassword?: string;
  avatar?: string;
  bio?: string;
  role: string;
}
