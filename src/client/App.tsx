import { RouterProvider } from '@client/contexts/RouterContext';
import { AppRouter } from '@client/router';

export function App() {
  return (
    <RouterProvider>
      <div className="h-[100dvh] min-h-[100dvh] w-full overflow-y-scroll bg-background flex items-center justify-center">
        <div className="mx-auto flex max-w-2xl flex-col p-6 h-full min-h-0  ">
          <AppRouter />
        </div>
      </div>
    </RouterProvider>
  );
}

export default App;
