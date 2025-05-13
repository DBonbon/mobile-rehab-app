/* global module */

import React from 'react';
import ProfilePage from './ProfilePage';
import data from './ProfilePage.data';

const ProfilePageStory = {
    title: 'Containers/ProfilePage',
    component: ProfilePage,
};
export default ProfilePageStory;

export const ProfilePageWithData = () => <ProfilePage {...data} />;
export const ProfilePageWithoutData = () => <ProfilePage />;
