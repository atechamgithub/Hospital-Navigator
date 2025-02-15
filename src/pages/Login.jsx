
import {  useAuth0 } from "@auth0/auth0-react"
const Login = () => {
    const {user, loginWithRedirect, isAuthenticated , logout  } = useAuth0();

  console.log("Current User", user);
  return (
    
            <div >
          {isAuthenticated && <h2  className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl"   >Welcome {user.name}</h2>}
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
   
  )
}

export default Login


