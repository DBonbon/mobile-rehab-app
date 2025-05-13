/* global module */

import React from 'react';
import CurrentBattles from './CurrentBattles';
import data from './CurrentBattles.data';

const CurrentBattlesStory = {
    title: 'Components/CurrentBattles',
    component: CurrentBattles,
};
export default CurrentBattlesStory;

export const CurrentBattlesWithData = () => <CurrentBattles {...data} />;
export const CurrentBattlesWithoutData = () => <CurrentBattles />;
