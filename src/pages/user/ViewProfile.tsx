
import React from "react";
import { useParams } from "react-router-dom";
import { UserProfile } from "@/components/user/UserProfile";

// Mock user data for demo purposes
const MOCK_USERS = {
  'user1': {
    userId: 'user1',
    fullName: 'Alex Johnson',
    username: 'alexj',
    avatarUrl: '',
    bio: 'Product enthusiast and tech lover. Always looking for the next big thing.',
    joinDate: 'January 15, 2023',
    email: 'alex.johnson@example.com',
  },
  'user2': {
    userId: 'user2',
    fullName: 'Sarah Miller',
    username: 'sarahm',
    avatarUrl: '',
    bio: 'Food blogger and fitness enthusiast.',
    joinDate: 'March 22, 2022',
    email: 'sarah.miller@example.com',
  },
  'current': {
    userId: 'current',
    fullName: 'Current User',
    username: 'currentuser',
    avatarUrl: '',
    bio: 'This is your own profile.',
    joinDate: 'December 10, 2021',
    email: 'your.email@example.com',
  },
};

const ViewProfile = () => {
  const { userId = '' } = useParams<{ userId: string }>();
  
  // In a real app, you would fetch user data from an API
  const userData = MOCK_USERS[userId] || MOCK_USERS['current'];
  const isCurrentUser = userId === 'current' || !userId;
  
  return (
    <div className="py-6">
      <UserProfile
        userId={userData.userId}
        fullName={userData.fullName}
        username={userData.username}
        avatarUrl={userData.avatarUrl}
        bio={userData.bio}
        joinDate={userData.joinDate}
        email={userData.email}
        isCurrentUser={isCurrentUser}
      />
    </div>
  );
};

export default ViewProfile;
