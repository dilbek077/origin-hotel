export interface MockUser {
  id: string;
  name: string;
  username: string;
  password: string;
  role: 'ADMIN' | 'STAFF' | 'GUEST';
  roleName: string;
  description: string;
  phone?: string;
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
    phone: '+998 90 123 45 67',
  },
  {
    id: '2',
    name: 'Lola Karimova',
    username: 'manager',
    password: '123',
    role: 'ADMIN',
    roleName: 'Menejer',
    description: "Mehmonxona boshqaruvchisi huquqlari",
    phone: '+998 91 234 56 78',
  },
  {
    id: '3',
    name: 'Sardor Toshmatov',
    username: 'staff',
    password: '123',
    role: 'STAFF',
    roleName: 'Xodim (Reception)',
    description: "Xonalar, mehmonlar va bronlarni boshqarish",
    phone: '+998 93 345 67 89',
  },
];

const REGISTERED_USERS_KEY = 'origin_hotel_registered_users';

export function getRegisteredUsers(): MockUser[] {
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveRegisteredUsers(users: MockUser[]): void {
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
}

export function registerMockUser(params: {
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
}): { success: boolean; error?: string; user?: MockUser } {
  const { firstName, lastName, phone, password } = params;
  const cleanFirstName = firstName.trim();
  const cleanLastName = lastName.trim();
  const cleanPhone = phone.trim();

  if (!cleanFirstName || !cleanLastName) {
    return { success: false, error: 'Ism va familiyangizni kiriting.' };
  }

  const phoneDigits = cleanPhone.replace(/\D/g, '');
  if (phoneDigits.length < 9) {
    return { success: false, error: 'Telefon raqamini to‘liq kiriting.' };
  }

  if (password.length < 6) {
    return { success: false, error: 'Parol kamida 6 ta belgidan iborat bo‘lishi kerak.' };
  }

  const registered = getRegisteredUsers();
  const existingUser = registered.find((u) => {
    const uDigits = (u.phone || '').replace(/\D/g, '');
    return uDigits && uDigits === phoneDigits;
  });

  if (existingUser) {
    return { success: false, error: 'Ushbu telefon raqami allaqachon ro‘yxatdan o‘tgan.' };
  }

  const fullName = `${cleanFirstName} ${cleanLastName}`;
  const username = `guest_${phoneDigits.slice(-6)}`;

  const newUser: MockUser = {
    id: `guest-${Date.now()}`,
    name: fullName,
    username: username,
    password: password,
    role: 'GUEST',
    roleName: 'Mehmon',
    description: 'Origin Hotel mehmondo‘stlik mijozi',
    phone: cleanPhone,
  };

  registered.unshift(newUser);
  saveRegisteredUsers(registered);

  return { success: true, user: newUser };
}

export function authenticateMockUser(usernameOrPhone: string, password: string): MockUser | null {
  const query = usernameOrPhone.trim().toLowerCase();
  const queryDigits = query.replace(/\D/g, '');

  const allUsers = [...MOCK_USERS, ...getRegisteredUsers()];

  const found = allUsers.find((u) => {
    const uUsername = u.username.toLowerCase();
    const uPhoneDigits = (u.phone || '').replace(/\D/g, '');

    const matchesLogin =
      uUsername === query ||
      (queryDigits.length >= 7 && uPhoneDigits.endsWith(queryDigits));

    return matchesLogin && u.password === password;
  });

  return found ?? null;
}

export function verifyMockToken(token?: string | null): { valid: boolean; user?: MockUser } {
  if (!token) return { valid: false };

  const allUsers = [...MOCK_USERS, ...getRegisteredUsers()];
  const found = allUsers.find((u) => `mock-token-${u.id}` === token || token === `mock-token-${u.username}`);

  if (found) {
    return { valid: true, user: found };
  }

  // Token mavjud bo'lsa va localStorageda username/role mos kelsa
  if (token.startsWith('mock-token-')) {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      const match = allUsers.find((u) => u.name === storedUsername);
      if (match) return { valid: true, user: match };
    }
  }

  return { valid: false };
}

export function isUserAuthenticated(): boolean {
  const token = localStorage.getItem('token');
  if (!token) return false;
  return verifyMockToken(token).valid;
}

export function getStoredCurrentUser(): {
  id?: string;
  name: string;
  username: string;
  role: string;
  phone?: string;
  token: string;
} | null {
  const token = localStorage.getItem('token');
  if (!token) return null;

  const verification = verifyMockToken(token);
  if (verification.valid && verification.user) {
    return {
      id: verification.user.id,
      name: verification.user.name,
      username: verification.user.username,
      role: verification.user.role,
      phone: verification.user.phone,
      token,
    };
  }

  const name = localStorage.getItem('username') || 'Foydalanuvchi';
  const role = localStorage.getItem('role') || 'GUEST';
  return {
    name,
    username: name,
    role,
    phone: localStorage.getItem('user_phone') || undefined,
    token,
  };
}

export function storeUserSession(user: MockUser): string {
  const token = `mock-token-${user.id}`;
  localStorage.setItem('token', token);
  localStorage.setItem('role', user.role);
  localStorage.setItem('username', user.name);
  if (user.phone) {
    localStorage.setItem('user_phone', user.phone);
  }
  window.dispatchEvent(new Event('origin-hotel-auth-change'));
  return token;
}

export function logoutUser(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('username');
  localStorage.removeItem('user_phone');
  window.dispatchEvent(new Event('origin-hotel-auth-change'));
}
