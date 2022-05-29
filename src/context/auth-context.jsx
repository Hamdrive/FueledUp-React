import { createContext, useContext, useState, useReducer } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Toast } from "../components";
import { authReducer } from "../utils";
import { initialUserState } from "../utils/auth/authReducer";
import { performUserLogin, performUserSignup } from "../utils/server-routes";

const AuthContext = createContext(initialUserState);

const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const userToken = localStorage.getItem("userToken");
  const [loader, setLoader] = useState(false);

  const [userDetails, dispatchUserDetails] = useReducer(
    authReducer,
    initialUserState
  );

  const navigate = useNavigate();
  const location = useLocation();

  const signupUser = async (signupCredentials) => {
    setLoader(true);
    try {
      const res = await performUserSignup(signupCredentials);
      if (res.status === 200 || res.status === 201) {
        Toast({
          type: "success",
          message: "You have been successfully signed up! 🎉",
        });
        dispatchUserDetails({ type: "SIGNUP", payload: res.data });
        navigate(location?.state?.from?.pathname || "/", { replace: true });
      }
    } catch (error) {
      Toast({
        type: "error",
        message: "Something went wrong there. Try again. ",
      });
      throw new Error(error);
    } finally {
      setLoader(false);
    }
  };

  const loginUser = async (loginCredentials) => {
    setLoader(true);
    try {
      const res = await performUserLogin(loginCredentials);
      if (res.status === 200 || res.status === 201) {
        Toast({
          type: "success",
          message: "You have been successfully logged in! 🎉",
        });
        dispatchUserDetails({ type: "LOGIN", payload: res.data });
        navigate(location?.state?.from?.pathname || "/", { replace: true });
      }
    } catch (error) {
      Toast({
        type: "error",
        message: "We had an issue logging you in. Try again.",
      });
      throw new Error(error);
    } finally {
      setLoader(false);
    }
  };

  const logoutUser = () => {
    Toast({
      type: "success",
      message: "You have been successfully logged out! See you soon 👋",
    });
    dispatchUserDetails({ type: "LOGOUT" });
    navigate("/", { replace: true });
  };

  const setAddress = (data) => {
    dispatchUserDetails({ type: "NEW_ADDRESS", payload: data });
    Toast({
      type: "success",
      message: "Address added 😎",
    });
  };
  const updateAddress = (data) => {
    dispatchUserDetails({ type: "UPDATE_ADDRESS", payload: data });
    Toast({
      type: "success",
      message: "Address updated ✍",
    });
  };
  const deleteAddress = (data) => {
    dispatchUserDetails({ type: "DELETE_ADDRESS", payload: data });
    Toast({
      type: "success",
      message: "Address deleted 🧹",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        userDetails,
        userToken,
        loader,
        loginUser,
        logoutUser,
        signupUser,
        setAddress,
        updateAddress,
        deleteAddress,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, useAuth };
