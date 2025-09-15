import { RouterProvider } from '@client/contexts/RouterContext';
import { UserProvider } from '@client/contexts/UserContext';
import { AppRouter } from '@client/router';

export function App() {
  return (
    <UserProvider>
      <RouterProvider>
        <div className="min-h-screen w-full bg-background">
          <div className="w-full max-w-6xl mx-auto bg-[url('/root_bg.png')] bg-cover bg-center bg-no-repeat bg-fixed">
            <div className="w-full min-h-screen bg-black/60 backdrop-blur-sm overflow-y-auto overflow-x-hidden">
              <AppRouter />
            </div>
          </div>
        </div>
      </RouterProvider>
    </UserProvider>
  );
}

export default App;
