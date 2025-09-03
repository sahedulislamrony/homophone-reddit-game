import { RouterProvider } from '@client/contexts/RouterContext';
import { AppRouter } from '@client/router';

export function App() {
  return (
    <RouterProvider>
      <div className="min-h-screen bg-gradient-to-b from-green-900 to-green-700 text-white font-minecraft">
        <AppRouter />
      </div>
    </RouterProvider>
  );
}

export default App;
