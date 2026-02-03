import {Timestamp} from 'firebase/firestore';

export interface User {
  id?: string;
  /** @deprecated Use 'id' instead - kept for backward compatibility */
  _id?: string;
  firstName: string;
  lastName: string;
  password?: string;
  email: string;
  newPassword?: string;
  avatar?: string;
  bio?: string;
  role: string;
  createdAt?: string | Timestamp;
}
