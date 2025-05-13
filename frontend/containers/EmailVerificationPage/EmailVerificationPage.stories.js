/* global module */

import React from 'react';
import EmailVerificationPage from './EmailVerificationPage';
import data from './EmailVerificationPage.data';

const EmailVerificationPageStory = {
    title: 'Containers/EmailVerificationPage',
    component: EmailVerificationPage,
};
export default EmailVerificationPageStory;

export const EmailVerificationPageWithData = () => <EmailVerificationPage {...data} />;
export const EmailVerificationPageWithoutData = () => <EmailVerificationPage />;
