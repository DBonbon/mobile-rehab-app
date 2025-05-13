// containers/LazyContainers.sjs
import dynamic from 'next/dynamic';

export default {
    BasePage: dynamic(() => import('./BasePage')),
    BattlePage: dynamic(() => import('./BattlePage')),
    HomePage: dynamic(() => import('./HomePage')),
};
