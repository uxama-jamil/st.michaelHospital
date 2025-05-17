import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppRoutes } from './routes';

function App() {
  const router = createBrowserRouter(AppRoutes)
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
