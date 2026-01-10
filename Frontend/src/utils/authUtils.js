export const isAuthenticated = () => {
  try {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    
    if (!token || !userStr) return false;
    
    const user = JSON.parse(userStr);
    return !!(token && user && user.email);
  } catch (error) {
    console.error("Auth check error:", error);
    return false;
  }
};

export const getAuthToken = () => {
  return localStorage.getItem("token");
};

export const getUserData = () => {
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    return null;
  }
};

export const requireAuth = (navigate) => {
  if (!isAuthenticated()) {
    navigate("/login", { 
      state: { 
        from: window.location.pathname,
        message: "Please login to continue" 
      } 
    });
    return false;
  }
  return true;
};