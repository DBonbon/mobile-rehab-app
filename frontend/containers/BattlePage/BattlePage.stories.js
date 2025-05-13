/* global module */

import React from 'react';
import BattlePage from './BattlePage';
import data from './BattlePage.data';

const BattlePageStory = {
    title: 'Containers/BattlePage',
    component: BattlePage,
};
export default BattlePageStory;

export const BattlePageWithData = () => <BattlePage {...data} />;
export const BattlePageWithoutData = () => <BattlePage />;
