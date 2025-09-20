/**
 * Generates a random password that meets the requirements:
 * - At least 6 characters
 * - One uppercase letter
 * - One lowercase letter
 * - One number
 */
export function generateRandomPassword(): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const specialChars = '!@#$%^&*';
  
  // Ensure at least one character from each required category
  let password = '';
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  
  // Add 3-5 more random characters to make it 6-8 characters total
  const allChars = uppercase + lowercase + numbers + specialChars;
  const additionalLength = Math.floor(Math.random() * 3) + 3; // 3-5 additional characters
  
  for (let i = 0; i < additionalLength; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password to randomize the order
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

/**
 * Validates if a password meets the requirements
 */
export function validatePassword(password: string): {
  isValid: boolean;
  checks: {
    minLength: boolean;
    hasUpperCase: boolean;
    hasLowerCase: boolean;
    hasNumbers: boolean;
  };
} {
  const minLength = password.length >= 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  
  return {
    isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers,
    checks: {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers
    }
  };
}
