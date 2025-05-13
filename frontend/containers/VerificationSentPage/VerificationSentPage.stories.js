/* global module */

import React from 'react';
import VerificationSentPage from './VerificationSentPage';
import data from './VerificationSentPage.data';

const VerificationSentPageStory = {
    title: 'Containers/VerificationSentPage',
    component: VerificationSentPage,
};
export default VerificationSentPageStory;

export const VerificationSentPageWithData = () => <VerificationSentPage {...data} />;
export const VerificationSentPageWithoutData = () => <VerificationSentPage />;
