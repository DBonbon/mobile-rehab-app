/* global module */

import React from 'react';
import TriangleAvatar from './TriangleAvatar';
import data from './TriangleAvatar.data';

const TriangleAvatarStory = {
    title: 'Components/TriangleAvatar',
    component: TriangleAvatar,
};
export default TriangleAvatarStory;

export const TriangleAvatarWithData = () => <TriangleAvatar {...data} />;
export const TriangleAvatarWithoutData = () => <TriangleAvatar />;
