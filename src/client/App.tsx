import { RouterProvider } from '@client/contexts/RouterContext';
import { UserProvider } from '@client/contexts/UserContext';
import { AppRouter } from '@client/router';
import { Loader } from '@client/components/Loader';
import { useLoading } from '@client/components/Loader';

export function App() {
  const { isLoading } = useLoading();

  return (
    <UserProvider>
      <RouterProvider>
        <Loader isLoading={isLoading}>
          <div className="min-h-screen w-full bg-background">
            <div className="w-full max-w-6xl mx-auto">
              <AppRouter />
            </div>
          </div>
        </Loader>
      </RouterProvider>
    </UserProvider>
  );
}

export default App;
