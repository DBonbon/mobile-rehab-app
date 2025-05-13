/* global module */

import React from 'react';
import UserSection from './UserSection';
import data from './UserSection.data';

const UserSectionStory = {
    title: 'Components/UserSection',
    component: UserSection,
};
export default UserSectionStory;

export const UserSectionWithData = () => <UserSection {...data} />;
export const UserSectionWithoutData = () => <UserSection />;
