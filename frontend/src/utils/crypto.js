import CryptoJS from 'crypto-js';

// Encrypt function
export const encryptPassword = (password, masterKey) => {
  try {
    const encrypted = CryptoJS.AES.encrypt(password, masterKey).toString();
    return encrypted;
  } catch (error) {
    console.error('Encrypt failed:', error);
    return null;
  }
};

// decrypt function
export const decryptPassword = (encryptedPassword, masterKey) => {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedPassword, masterKey);
    const password = decrypted.toString(CryptoJS.enc.Utf8);
    return password;
  } catch (error) {
    console.error('Decrypt failed:', error);
    return null;
  }
};

// generate random password
export const generatePassword = (length = 16) => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  const allChars = uppercase + lowercase + numbers + symbols;
  let password = '';

  // Ensure that each character is included at least once.
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  // Fill the remaining length
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Disorder the sequence
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
};

// Check the strength of password
export const checkPasswordStrength = password => {
  let strength = 0;
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /[0-9]/.test(password),
    symbols: /[^A-Za-z0-9]/.test(password),
  };

  Object.values(checks).forEach(check => {
    if (check) strength++;
  });

  if (strength <= 2) return { level: 'Weak', color: 'red' };
  if (strength <= 4) return { level: 'Medium', color: 'orange' };
  return { level: 'Strong', color: 'green' };
};
