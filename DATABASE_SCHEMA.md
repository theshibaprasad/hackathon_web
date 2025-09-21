# Database Schema Documentation

## Overview

This document describes the new role-based database schema for the hackathon web application. The schema has been redesigned to be more scalable and maintainable with separate collections for Users, Teams, and Payments.

## Collections

### 1. Users Collection

The Users collection stores user information with role-based access and type-specific details.

#### Schema Structure

```typescript
interface IUser {
  _id: ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  otpVerified: boolean;
  
  // User type and role
  userType: 'student' | 'professional';
  role: 'user' | 'admin' | 'superadmin';
  
  // Education details (for students)
  education?: {
    university: string;
    universityEmail: string;
    degree: string;
    graduationYear: number;
  };
  
  // Job details (for professionals)
  job?: {
    company: string;
    designation: string;
    experienceYears: number;
  };
  
  // Team reference
  teamId?: ObjectId;
  
  // Legacy fields (for backward compatibility)
  clerkId?: string;
  username?: string;
  isBoarding: boolean;
  googleId?: string;
  isGoogleUser?: boolean;
  firebaseUid?: string;
  // ... other legacy fields
  
  createdAt: Date;
  updatedAt: Date;
}
```

#### Key Features

- **Role-based access**: Users can have roles of 'user', 'admin', or 'superadmin'
- **Type-specific data**: Students have education details, professionals have job details
- **Team association**: Users can be associated with a team via `teamId`
- **Backward compatibility**: Legacy fields are preserved for smooth migration

### 2. Teams Collection

The Teams collection manages team information and member relationships.

#### Schema Structure

```typescript
interface ITeam {
  _id: ObjectId;
  teamName: string;
  leader: {
    userId: ObjectId;
    name: string;
    email: string;
    phone: string;
  };
  members: Array<{
    userId: ObjectId;
    name: string;
    email: string;
    phone: string;
  }>;
  themeId: string;
  problemId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Key Features

- **Team leadership**: Each team has a designated leader
- **Member management**: Teams can have multiple members with snapshot data
- **Hackathon preferences**: Teams are associated with themes and problem statements
- **Unique team names**: Team names must be unique across the platform

### 3. Payments Collection

The Payments collection tracks all payment transactions separately from user data.

#### Schema Structure

```typescript
interface IPayment {
  _id: ObjectId;
  userId: ObjectId;
  paymentStatus: 'pending' | 'success' | 'failed';
  isEarlyBird: boolean;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  invoiceUrl?: string;
  amount: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Key Features

- **Payment tracking**: Complete payment lifecycle management
- **Razorpay integration**: Stores all Razorpay-related identifiers
- **Status management**: Tracks payment status from pending to success/failed
- **Early bird support**: Tracks early bird discount eligibility
- **Invoice support**: Can store invoice URLs for successful payments

## API Endpoints

### Team Management

#### Create Team
```
POST /api/teams/create
```
Creates a new team with the current user as the leader.

#### Add Team Member
```
POST /api/teams/add-member
```
Adds a user to an existing team.

### Payment Management

#### Create Payment
```
POST /api/payments/create
```
Creates a new payment record.

#### Update Payment Status
```
PUT /api/payments/update-status
```
Updates payment status (pending → success/failed).

## Migration Process

### Running the Migration

1. **Backup your database** before running the migration
2. Run the migration script:
   ```bash
   node scripts/migrate-to-new-schema.js
   ```

### What the Migration Does

1. **Updates existing users** with new schema fields
2. **Creates teams** for users who have team information
3. **Creates payment records** for users with payment data
4. **Preserves all existing data** in legacy fields

### Post-Migration

After migration, you can:
- Gradually migrate frontend code to use new fields
- Remove legacy fields once migration is complete
- Take advantage of new team and payment management features

## Benefits of New Schema

### 1. Scalability
- Separate collections for different concerns
- Better query performance with proper indexing
- Easier to scale individual collections

### 2. Data Integrity
- Proper relationships between collections
- Validation at the database level
- Reduced data duplication

### 3. Maintainability
- Clear separation of concerns
- Easier to add new features
- Better code organization

### 4. Analytics
- Better reporting capabilities
- Easier to track team and payment metrics
- Improved data insights

## Indexes

### Users Collection
- `email` (unique)
- `phoneNumber` (unique, sparse)
- `teamId` (for team lookups)
- `userType` (for filtering)
- `role` (for access control)

### Teams Collection
- `teamName` (unique)
- `leader.userId` (for leader lookups)
- `members.userId` (for member lookups)
- `themeId` (for theme filtering)
- `problemId` (for problem filtering)

### Payments Collection
- `userId` (for user payment history)
- `teamId` (for team payment history)
- `paymentStatus` (for status filtering)
- `razorpayOrderId` (unique)
- `razorpayPaymentId` (sparse)
- `createdAt` (for time-based queries)

## Security Considerations

1. **Role-based access**: Implement proper role checking in API routes
2. **Data validation**: Validate all inputs before database operations
3. **Payment security**: Never log sensitive payment information
4. **Team permissions**: Ensure only team leaders can add/remove members

## Future Enhancements

1. **Team invitations**: Add invitation system for team members
2. **Payment refunds**: Add refund tracking and processing
3. **Analytics dashboard**: Build reporting on teams and payments
4. **Notification system**: Add notifications for team and payment events
5. **Audit logging**: Track all changes to teams and payments
