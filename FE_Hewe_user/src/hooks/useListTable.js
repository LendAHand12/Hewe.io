import { message } from "antd";
import { useCallback, useEffect, useState } from "react";

/**
 * @param: service: api get list data
 * @param: method: method of HTTP request. @example: GET or POST
 * @param: isInitialCallAPI: is call api at first time. @type: boolean;
 * @param: callbackSetTotalItem: set total item.
 *
 * @returns
 * - data: list data in table
 * - loading: status loading of table
 * - handleGetData: func get list table data with paramsQuery.
 *        @usage handleGetData({ paramsQuery: { page: currentPage, limit: LIMIT } })
 * - handleSetLoadingTable: set status loading of table
 * - handleSetData: set data of table
 */

export const useListTable = ({
  service,
  callbackSetTotalItem,
  defaultParamsPayload = {},
  isInitialCallAPI = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const handleGetData = useCallback(
    ({ paramsQuery = {} } = {}) => {
      if (loading) {
        return;
      }

      handleSetLoadingTable(true);
      service(paramsQuery)
        .then((res) => {
          if (res.data.data.array) {
            setData(res.data.data.array);
          } else {
            setData(res.data.data);
          }
          callbackSetTotalItem(res.data.data.total);
        })
        .catch((err) => {
          // message.error(err.response.data.message);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [service]
  );

  const handleSetLoadingTable = (loadingStatus) => {
    setLoading(loadingStatus);
  };

  const handleSetData = (data) => {
    setData(data);
  };

  useEffect(() => {
    if (isInitialCallAPI) {
      handleGetData({ paramsQuery: defaultParamsPayload });
    }
  }, []);

  return {
    data,
    loading,
    handleGetData,
    handleSetLoadingTable,
    handleSetData,
  };
};
