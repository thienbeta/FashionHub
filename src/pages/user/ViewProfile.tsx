
import React from "react";
import { useParams } from "react-router-dom";
import { UserProfile } from "@/components/user/UserProfile";

// Mock user data with improved profile information
const MOCK_USERS = {
  'user1': {
    userId: 'user1',
    fullName: 'Alex Johnson',
    username: 'alexj',
    avatarUrl: '',
    bio: 'Fashion enthusiast and product designer with a passion for sustainable style. Always looking for the next trend that combines ethics with aesthetics.',
    joinDate: 'January 15, 2023',
    email: 'alex.johnson@example.com',
    location: 'New York, USA',
    website: 'www.alexjohnson.com',
    followers: 245,
    following: 123,
  },
  'user2': {
    userId: 'user2',
    fullName: 'Sarah Miller',
    username: 'sarahm',
    avatarUrl: '',
    bio: 'Fashion blogger and fitness enthusiast with a focus on athleisure. Creating content that blends style with functionality.',
    joinDate: 'March 22, 2022',
    email: 'sarah.miller@example.com',
    location: 'Los Angeles, USA',
    website: 'www.sarahstyle.com',
    followers: 1240,
    following: 530,
  },
  'current': {
    userId: 'current',
    fullName: 'Current User',
    username: 'currentuser',
    avatarUrl: '',
    bio: 'This is your own profile. Update your bio to tell others about yourself and your fashion preferences.',
    joinDate: 'December 10, 2021',
    email: 'your.email@example.com',
    location: 'Fashion City',
    website: 'www.yourfashion.com',
    followers: 42,
    following: 87,
  },
};

const ViewProfile = () => {
  const { userId = '' } = useParams<{ userId: string }>();
  
  // In a real app, you would fetch user data from an API
  const userData = MOCK_USERS[userId] || MOCK_USERS['current'];
  const isCurrentUser = userId === 'current' || !userId;
  
  return (
    <div className="py-6 bg-gray-50/50 min-h-screen">
      <UserProfile
        userId={userData.userId}
        fullName={userData.fullName}
        username={userData.username}
        avatarUrl={userData.avatarUrl}
        bio={userData.bio}
        joinDate={userData.joinDate}
        email={userData.email}
        isCurrentUser={isCurrentUser}
        location={userData.location}
        website={userData.website}
        followers={userData.followers}
        following={userData.following}
      />
    </div>
  );
};

export default ViewProfile;
