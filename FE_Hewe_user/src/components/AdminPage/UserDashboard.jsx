import { Button } from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { deepSearch } from "../../function/deepSearch";
import { axiosService } from "../../util/service";
import { useSearchParams } from "../../hooks/useSearchParams";

const LIMIT = 50;
const LIMIT_1000 = 1000;

export default function UserDashboard() {
  const { uid } = useParams();
  const uEmail = useSearchParams();

  const [network, setNetwork] = useState([]);

  const [current, setCurrent] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  const [loading, setLoading] = useState(false);

  // hàm getNetwork cho user gốc
  const getNetwork = async (page) => {
    setLoading(true);
    try {
      let response = await axiosService.post("api/user/getParentF1", {
        userid: uid,
        page,
        limit: LIMIT,
      });
      setNetwork([...network, ...response.data.data.array]);
      setTotalPage(Math.ceil(response.data.data.total / LIMIT));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // hàm getNetwork cho user cấp dưới của user gốc
  const getNetworkDownline = async (userid, page) => {
    try {
      let response = await axiosService.post("api/user/getParentF1", {
        userid,
        page,
        limit: LIMIT_1000,
      });
      if (response.data.data.array.length > 0) {
        const item = deepSearch(network, userid, "id");
        item.array = response.data.data.array;
        setNetwork([...network]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getNetwork(1);
  }, []);

  const loadMore = () => {
    const pageToLoadMore = current + 1;
    getNetwork(pageToLoadMore);
    setCurrent(pageToLoadMore);
  };

  const loadExpansion = (id) => {
    getNetworkDownline(id, 1);
  };

  const clearExpansion = (id) => {
    const item = deepSearch(network, id, "id");
    item.array = undefined;
    setNetwork([...network]);
  };

  const renderTree = (array) => {
    return array.map((item, index) => {
      if (item.array) {
        return (
          <li key={index}>
            <div>
              <i className="fa-solid fa-user"></i> <span className="item-email">{item.email}</span>
              <Button
                shape="round"
                size="small"
                danger
                style={{ marginLeft: 10, padding: "0 5px" }}
                onClick={() => clearExpansion(item.id)}
              >
                <i className="fa-solid fa-minus"></i>
              </Button>
            </div>
            <ul>{renderTree(item.array)}</ul>
          </li>
        );
      } else
        return (
          <li key={index}>
            <i className="fa-solid fa-user"></i> <span className="item-email">{item.email}</span>
            {item.checkParentUser && (
              <Button
                shape="round"
                size="small"
                style={{ marginLeft: 10, padding: "0 5px" }}
                onClick={() => loadExpansion(item.id)}
              >
                <i className="fa-solid fa-plus"></i>
              </Button>
            )}
          </li>
        );
    });
  };

  return (
    <div className="admin-dashboard">
      <div className="tree">
        <ul>
          <li>
            <i className="fa-solid fa-user"></i>
            <span className="item-email">
              <b>{uEmail}</b>
            </span>
            {network && <ul>{renderTree(network)}</ul>}

            {current < totalPage && (
              <Button size="small" onClick={() => loadMore()} shape="round" style={{ marginTop: 10 }} loading={loading}>
                <i className="fa-solid fa-plus" style={{ marginRight: 5 }}></i>
                More
              </Button>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
}
