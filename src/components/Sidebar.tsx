import { NavLink } from 'react-router-dom';
import {Home, Building2, Activity, LogOut, Globe2, BarChart3, Users, Book, DollarSign} from 'lucide-react';
import { useAuthStore } from '../store/auth';

interface SidebarProps {
  role: 'super_admin' | 'admin' | 'ngo_manager';
}

export default function Sidebar({ role }: SidebarProps) {
  const signOut = useAuthStore((state) => state.signOut);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
      isActive
        ? 'bg-blue-100 text-blue-600'
        : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
    }`;

  return (
    <div className="w-64 bg-white h-screen fixed left-0 top-0 border-r border-gray-200">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg">
            <Globe2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-blue-600">e_OSC</h1>
            <p className="text-sm font-medium text-gray-900">Sénégal</p>
          </div>
        </div>
      </div>

      <nav className="mt-8 px-4 space-y-2">
        <NavLink to="/" className={linkClass} end>
          <Home className="w-5 h-5" />
          <span>Accueil</span>
        </NavLink>

        {role === 'super_admin' ? (
          <>
            <NavLink to="/admins" className={linkClass}>
              <Users className="w-5 h-5" />
              <span>Administrateurs</span>
            </NavLink>
          </>
        ) : role === 'admin' ? (
          <>
            <NavLink to="/ngos" className={linkClass}>
              <Building2 className="w-5 h-5" />
              <span>OSC</span>
            </NavLink>
            <NavLink to="/agreements" className={linkClass}>
              <Book className="w-5 h-5" />
              <span>Demande d'agréments</span>
            </NavLink>
            <NavLink to="/investments_plans" className={linkClass}>
              <DollarSign className="w-5 h-5" />
              <span>Plan d'investissement</span>
            </NavLink>
            <NavLink to="/reports" className={linkClass}>
              <BarChart3 className="w-5 h-5" />
              <span>Rapports</span>
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/my-osc" className={linkClass}>
              <Building2 className="w-5 h-5" />
              <span>Mon OSC</span>
            </NavLink>
            <NavLink to="/activities" className={linkClass}>
              <Activity className="w-5 h-5" />
              <span>Activités</span>
            </NavLink>
          </>
        )}

        <button
          onClick={signOut}
          className="flex items-center space-x-2 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 w-full mt-4"
        >
          <LogOut className="w-5 h-5" />
          <span>Déconnexion</span>
        </button>
      </nav>
    </div>
  );
}