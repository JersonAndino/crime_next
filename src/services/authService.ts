export const isAuthenticated = (): boolean => {
    const token = localStorage.getItem("accessToken");
    if (!token) return false;
  
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      const isTokenExpired = decoded.exp < Date.now() / 1000;
      return !isTokenExpired;
    } catch (error) {
      console.log(error);
      return false;
    }
  };