import Following from '~/pages/Following';
import Home from '~/pages/Home';

const publicRoutes = [
    { path: '/', component: Home },
    { path: '/following', component: Following },
];
const privateRoutes = [];

export { publicRoutes, privateRoutes };
