import { RouterProvider } from '@client/contexts/RouterContext';
import { AppRouter } from '@client/router';
import { Loader } from '@client/components/Loader';
import { useLoading } from '@client/components/Loader';

export function App() {
  const { isLoading } = useLoading();

  return (
    <RouterProvider>
      <Loader isLoading={isLoading}>
        <div className="min-h-screen w-full bg-background">
          <div className="w-full max-w-6xl mx-auto">
            <AppRouter />
          </div>
        </div>
      </Loader>
    </RouterProvider>
  );
}

export default App;
