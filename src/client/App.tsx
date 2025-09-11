import { RouterProvider } from '@client/contexts/RouterContext';
import { UserProvider } from '@client/contexts/UserContext';
import { AppRouter } from '@client/router';

export function App() {
  return (
    <UserProvider>
      <RouterProvider>
        <div className="min-h-screen w-full bg-background">
          <div className="w-full max-w-6xl mx-auto">
            <AppRouter />
          </div>
        </div>
      </RouterProvider>
    </UserProvider>
  );
}

export default App;
