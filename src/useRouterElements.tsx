import { useRoutes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout/MainLayout';
import Home from './pages/Home/Home';
import TweetPage from './pages/TweetPage/TweetPage';

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
                }
            ]
        },
    ]);
    return routeElements;
};

export default useRouterElements;
