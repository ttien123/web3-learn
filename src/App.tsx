import Loading from './components/Loading/Loading';
import useRouterElements from './useRouterElements';

const App = () => {
  const routeElements = useRouterElements();

  return (
    <div>
      {routeElements}
      <Loading />
    </div>
  );
}

export default App;
