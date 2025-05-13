/* global module */

import React from 'react';
import LoginPage from './LoginPage';
import data from './LoginPage.data';

const LoginPageStory = {
    title: 'Containers/LoginPage',
    component: LoginPage,
};
export default LoginPageStory;

export const LoginPageWithData = () => <LoginPage {...data} />;
export const LoginPageWithoutData = () => <LoginPage />;
