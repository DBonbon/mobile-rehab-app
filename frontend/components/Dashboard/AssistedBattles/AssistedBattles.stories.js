/* global module */

import React from 'react';
import AssistedBattles from './AssistedBattles';
import data from './AssistedBattles.data';

const AssistedBattlesStory = {
    title: 'Components/AssistedBattles',
    component: AssistedBattles,
};
export default AssistedBattlesStory;

export const AssistedBattlesWithData = () => <AssistedBattles {...data} />;
export const AssistedBattlesWithoutData = () => <AssistedBattles />;
