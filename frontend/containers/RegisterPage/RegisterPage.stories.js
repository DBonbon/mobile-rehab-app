/* global module */

import React from 'react';
import RegisterPage from './RegisterPage';
import data from './RegisterPage.data';

const RegisterPageStory = {
    title: 'Containers/RegisterPage',
    component: RegisterPage,
};
export default RegisterPageStory;

export const RegisterPageWithData = () => <RegisterPage {...data} />;
export const RegisterPageWithoutData = () => <RegisterPage />;
