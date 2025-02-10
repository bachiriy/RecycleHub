export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  phone: string;
  birthDate: Date;
  profileImage?: string;
  role: 'COLLECTOR' | 'PARTICULAR';
  points?: number;
} 