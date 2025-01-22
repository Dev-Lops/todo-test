import { useAuth } from '../../../contexts/AuthContext';
import { Button } from '../Button/Button';

export function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Todo App</h1>

          <div className="flex items-center space-x-4">
            <span className="text-gray-700">{user?.email}</span>
            <Button
              variant="secondary"
              size="sm"
              onClick={signOut}
            >
              Sair
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
} 