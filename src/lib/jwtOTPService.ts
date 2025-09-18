import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export interface OTPData {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password: string;
  otp: string;
  createdAt: number;
}

class JWTOTPService {
  private readonly JWT_SECRET = process.env.JWT_SECRET!;
  private readonly OTP_EXPIRY = 5 * 60 * 1000; // 5 minutes in milliseconds

  // Generate a secure 6-digit OTP
  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Create JWT token with OTP data
  createOTPToken(userData: Omit<OTPData, 'otp' | 'createdAt'>): { token: string; otp: string } {
    const otp = this.generateOTP();
    const now = Date.now();
    
    const otpData: OTPData = {
      ...userData,
      otp,
      createdAt: now
    };

    const token = jwt.sign(otpData, this.JWT_SECRET, { 
      expiresIn: '5m' // 5 minutes
    });

    return { token, otp };
  }

  // Verify and decode OTP token
  verifyOTPToken(token: string, providedOTP: string): OTPData | null {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as OTPData;
      
      // Check if OTP matches
      if (decoded.otp !== providedOTP) {
        return null;
      }

      // Check if token is not expired (additional check)
      const now = Date.now();
      if (now - decoded.createdAt > this.OTP_EXPIRY) {
        return null;
      }

      return decoded;
    } catch (error) {
      console.error('OTP token verification failed:', error);
      return null;
    }
  }

  // Get OTP data without verification (for resend)
  getOTPData(token: string): OTPData | null {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as OTPData;
      return decoded;
    } catch (error) {
      return null;
    }
  }

  // Create new OTP for existing token
  refreshOTP(token: string): { newToken: string; newOTP: string } | null {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as OTPData;
      
      // Create new OTP data with same user info
      const newOTP = this.generateOTP();
      const now = Date.now();
      
      const newOTPData: OTPData = {
        email: decoded.email,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        phoneNumber: decoded.phoneNumber,
        password: decoded.password,
        otp: newOTP,
        createdAt: now
      };

      const newToken = jwt.sign(newOTPData, this.JWT_SECRET, { 
        expiresIn: '5m'
      });

      return { newToken, newOTP };
    } catch (error) {
      return null;
    }
  }

  // Check if token is expired
  isTokenExpired(token: string): boolean {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as OTPData;
      const now = Date.now();
      return now - decoded.createdAt > this.OTP_EXPIRY;
    } catch (error) {
      return true;
    }
  }

  // Decode token without verification (for debugging)
  decodeToken(token: string): OTPData | null {
    try {
      return jwt.decode(token) as OTPData;
    } catch (error) {
      return null;
    }
  }
}

// Export singleton instance
export const jwtOTPService = new JWTOTPService();
