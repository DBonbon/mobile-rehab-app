/* global module */

import React from 'react';
import Achievements from './Achievements';
import data from './Achievements.data';

const AchievementsStory = {
    title: 'Components/Achievements',
    component: Achievements,
};
export default AchievementsStory;

export const AchievementsWithData = () => <Achievements {...data} />;
export const AchievementsWithoutData = () => <Achievements />;
