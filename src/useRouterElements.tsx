import { useRoutes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout/MainLayout';
import Home from './pages/Home/Home';
import TweetPage from './pages/TweetPage/TweetPage';
import TweetEthers from './pages/TweetPageEthers/TweetPageEthers';
import Approve from './pages/Approve/Approve';

const useRouterElements = () => {
    const routeElements = useRoutes([
        {
            path: '',
            element: <MainLayout />,
            children: [
                {
                    path: '/',
                    element: <Home />
                },
                {
                    path: '/tweets',
                    element: <TweetPage />
                },
                {
                    path: '/tweetEthers',
                    element: <TweetEthers />,
                },
                {
                    path: '/approve',
                    element: <Approve />,
                }
            ]
        },
       
    ]);
    return routeElements;
};

export default useRouterElements;
