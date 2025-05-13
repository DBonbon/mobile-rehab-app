/* global module */

import React from 'react';
import PasswordResetConfirmPage from './PasswordResetConfirmPage';
import data from './PasswordResetConfirmPage.data';

const PasswordResetConfirmPageStory = {
    title: 'Containers/PasswordResetConfirmPage',
    component: PasswordResetConfirmPage,
};
export default PasswordResetConfirmPageStory;

export const PasswordResetConfirmPageWithData = () => <PasswordResetConfirmPage {...data} />;
export const PasswordResetConfirmPageWithoutData = () => <PasswordResetConfirmPage />;
