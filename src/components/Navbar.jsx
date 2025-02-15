import { Rocket } from 'lucide-react';
import {  useAuth0 } from "@auth0/auth0-react"

function Navbar() {
    
  
   const {user, loginWithRedirect, isAuthenticated, logout   } = useAuth0();

   console.log("Current User", user);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Rocket className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-bold text-gray-800">Navigator</span>
          </div>
      
            
              {isAuthenticated ? (
                <button onClick={() => logout()}
                   className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
                   >
                  Logout</button>
              ) : (<button
                onClick={() => loginWithRedirect()}
                 className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-200"
               >
                 Login
               </button>)}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;