export interface MockUser {
  id: string;
  name: string;
  username: string;
  password: string;
  role: 'ADMIN' | 'STAFF';
  roleName: string;
  description: string;
}

export const MOCK_USERS: MockUser[] = [
  {
    id: '1',
    name: 'Jasur Aliyev',
    username: 'admin',
    password: '123',
    role: 'ADMIN',
    roleName: 'Administrator',
    description: "Barcha huquqlarga ega (Dashboard, Moliya, Sozlamalar va barcha bo'limlar)",
  },
  {
    id: '2',
    name: 'Lola Karimova',
    username: 'manager',
    password: '123',
    role: 'ADMIN',
    roleName: 'Menejer',
    description: "Mehmonxona boshqaruvchisi huquqlari",
  },
  {
    id: '3',
    name: 'Sardor Toshmatov',
    username: 'staff',
    password: '123',
    role: 'STAFF',
    roleName: 'Xodim (Reception)',
    description: "Xonalar, mehmonlar va bronlarni boshqarish",
  },
];

export function authenticateMockUser(username: string, password: string): MockUser | null {
  const normalizedUser = username.trim().toLowerCase();
  const found = MOCK_USERS.find(
    (u) => u.username.toLowerCase() === normalizedUser && u.password === password
  );
  return found ?? null;
}
