import useRouterElements from './useRouterElements';



const App = () => {
  const routeElements = useRouterElements();

  return (
    <div>
      {routeElements}
    </div>
  );
}

export default App;
