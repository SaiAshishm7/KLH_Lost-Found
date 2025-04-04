
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the welcome page
    navigate("/", { replace: true });
  }, [navigate]);

  // Return null as we're redirecting
  return null;
};

export default Index;
