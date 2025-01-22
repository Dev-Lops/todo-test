import Link from 'next/link';
import { useRouter } from 'next/router';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/tasks', label: 'Tarefas', icon: '✓' },
  { href: '/profile', label: 'Perfil', icon: '👤' },
];

export function Sidebar() {
  const router = useRouter();

  return (
    <aside className="w-64 bg-white shadow-lg h-screen">
      <nav className="mt-8">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`
                  flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100
                  ${router.pathname === item.href ? 'bg-gray-100' : ''}
                `}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
} 