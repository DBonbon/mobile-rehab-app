/* global module */

import React from 'react';
import PasswordResetPage from './PasswordResetPage';
import data from './PasswordResetPage.data';

const PasswordResetPageStory = {
    title: 'Containers/PasswordResetPage',
    component: PasswordResetPage,
};
export default PasswordResetPageStory;

export const PasswordResetPageWithData = () => <PasswordResetPage {...data} />;
export const PasswordResetPageWithoutData = () => <PasswordResetPage />;
