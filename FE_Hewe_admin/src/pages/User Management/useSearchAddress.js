import { useEffect, useState } from "react";
import axios from "../../axios";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { message } from "antd";

export const useSearchAddress = () => {
  const [value, setValue] = useState("");
  const [options, setOptions] = useState([]);
  const history = useHistory();

  const onSelect = (data) => {
    history.push(`/adminPanel/user-management/${data}`);
  };

  const onChange = (data) => {
    setValue(data);
    setOptions([]);
  };

  const handleGetOptions = async ({ searchValue }) => {
    try {
      const res = await axios.post(
        `searchWalletUser`,
        { address: searchValue },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      setOptions([
        { value: res.data.data.userId, label: res.data.data.userEmail },
      ]);
    } catch (error) {
      message.error(error.response.data.message);
      setOptions([]);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (value.trim() !== "") {
        handleGetOptions({ searchValue: value });
      }
    }, 300);

    return () => {
      clearTimeout(timeout);
    };
  }, [value]);

  return { value, options, onSelect, onChange };
};
