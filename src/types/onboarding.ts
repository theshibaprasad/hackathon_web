// Form data interface without Mongoose Document properties
export interface OnboardingFormData {
  userId: string;
  profession: 'student' | 'working_professional';
  gender?: string;
  city: string;
  state: string;
  pin: string;
  instituteName?: string;
  degree?: string;
  branch?: string;
  yearOfStudy?: string;
  graduationYear?: string;
  companyName?: string;
  jobTitle?: string;
  yearsOfExperience?: string;
  teamName?: string;
  isTeamLeader?: boolean;
  selectedThemes: string[];
  selectedProblemStatements: string[];
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentAmount: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  isEarlyBird: boolean;
}
