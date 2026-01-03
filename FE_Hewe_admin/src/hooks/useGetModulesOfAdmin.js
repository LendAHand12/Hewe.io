import { useState } from "react";
import axios from "../axios";

export const useGetModulesOfAdmin = () => {
  const [modules, setModules] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetModulesOfAdmin = async (token) => {
    setIsLoading(true);

    try {
      const res = await axios.get(`/getModulesOfAdmin?email=`, {
        headers: {
          Authorization: token,
        },
      });

      setModules(res.data.data.access_module);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return { isLoading, modules, handleGetModulesOfAdmin };
};
