import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Team from '@/models/Team';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Get JWT token from cookies
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - No token found' },
        { status: 401 }
      );
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    } catch (error) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    await connectDB();

    // Check if user exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }


    // Map profession to userType correctly
    let mappedUserType = 'student'; // default
    if (body.userType) {
      mappedUserType = body.userType;
    } else if (body.profession === 'working_professional') {
      mappedUserType = 'professional';
    } else if (body.profession === 'student') {
      mappedUserType = 'student';
    }

    // Prepare user update data
    const userUpdateData: any = {
      firstName: body.firstName || user.firstName,
      lastName: body.lastName || user.lastName,
      email: body.email || user.email,
      phoneNumber: body.phoneNumber || user.phoneNumber,
      userType: mappedUserType,
      isBoarding: true // Mark onboarding as completed
    };

    // Handle role-based data storage - ROLE-BASED NESTED STRUCTURE
    if (mappedUserType === 'student') {
      // For students: create education object and clear job object
      const instituteName = body.education?.instituteName || body.instituteName || '';
      const branch = body.education?.branch || body.branch || '';
      const degree = body.education?.degree || body.degree || '';
      const graduationYear = body.education?.graduationYear || body.graduationYear || '';
      const yearOfStudy = body.education?.yearOfStudy || body.yearOfStudy || '';
      const city = body.education?.city || body.city || '';
      const state = body.education?.state || body.state || '';
      const pin = body.education?.pin || body.pin || '';
      
      
      // Create education object for students (role-based nested structure)
      userUpdateData.education = {
        instituteName: instituteName,
        branch: branch,
        degree: degree,
        graduationYear: graduationYear,
        yearOfStudy: yearOfStudy,
        city: city,
        state: state,
        pin: pin
      };
      
      // Clear job object for students (will be removed from database)
      userUpdateData.job = undefined;
      
      
    } else if (mappedUserType === 'professional') {
      // For professionals: create job object and clear education object
      const jobTitle = body.job?.jobTitle || body.jobTitle || '';
      const company = body.job?.company || body.companyName || '';
      const yearOfExperience = body.job?.yearOfExperience || body.yearsOfExperience || '';
      const city = body.job?.city || body.city || '';
      const state = body.job?.state || body.state || '';
      const pin = body.job?.pin || body.pin || '';
      
      
      // Create job object for professionals (role-based nested structure)
      userUpdateData.job = {
        jobTitle: jobTitle,
        company: company,
        yearOfExperience: yearOfExperience,
        city: city,
        state: state,
        pin: pin
      };
      
      // Clear education object for professionals (will be removed from database)
      userUpdateData.education = undefined;
      
    }


    // Update user with onboarding data - ROLE-BASED NESTED STRUCTURE
    let updatedUser;
    
    // Prepare the update object
    const updateObject: any = { ...userUpdateData };
    
    // Remove undefined values from the update object
    if (updateObject.education === undefined) {
      delete updateObject.education;
    }
    if (updateObject.job === undefined) {
      delete updateObject.job;
    }
    
    
    // Prepare MongoDB update operation
    const mongoUpdate: any = { $set: updateObject };
    
    // Add $unset to completely remove inappropriate fields from database
    const fieldsToUnset: any = {};
    
    if (mappedUserType === 'student') {
      // For students, remove job field completely
      fieldsToUnset.job = 1;
    } else if (mappedUserType === 'professional') {
      // For professionals, remove education field completely
      fieldsToUnset.education = 1;
    }
    
    // Add $unset operation if there are fields to remove
    if (Object.keys(fieldsToUnset).length > 0) {
      mongoUpdate.$unset = fieldsToUnset;
    }
    
    updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      mongoUpdate,
      { new: true, upsert: false }
    );
    

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Failed to update user data' },
        { status: 500 }
      );
    }


    // Create team if team name is provided
    let team = null;
    if (body.teamName) {

      // Create new team (duplicate team names are allowed)
      team = new Team({
        teamName: body.teamName,
        leader: {
          userId: updatedUser._id,
          name: `${updatedUser.firstName} ${updatedUser.lastName}`,
          email: updatedUser.email,
          phone: updatedUser.phoneNumber
        },
        members: [], // Don't include leader in members array
        themeId: body.themeId || 'TBD',
        problemId: body.problemId || 'TBD'
      });

      await team.save();

      // Update user with teamId and set as team leader
      await User.findByIdAndUpdate(decoded.userId, { 
        teamId: team._id,
        isTeamLeader: true 
      });
    }


    return NextResponse.json({
      success: true,
      message: 'Onboarding data saved successfully',
      data: {
        user: updatedUser,
        team: team ? {
          id: team._id,
          teamName: team.teamName,
          themeId: team.themeId,
          problemId: team.problemId
        } : null
      }
    });
  } catch (error) {
    console.error('Onboarding save error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get JWT token from cookies
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - No token found' },
        { status: 401 }
      );
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    } catch (error) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    await connectDB();

    // Get user data (which now includes onboarding data)
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Onboarding fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
