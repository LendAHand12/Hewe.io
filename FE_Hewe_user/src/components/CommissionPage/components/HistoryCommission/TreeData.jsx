import { Tree } from "antd";
import { useEffect, useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import { axiosService } from "../../../../util/service";

const MOCK = [
  {
    title: "Expand to load",
    key: "0",
  },
  {
    title: "Expand to load",
    key: "1",
  },
  {
    title: "Tree Node",
    key: "2",
    isLeaf: true,
  },
];

const preprocessTreeData = (data) => {
  return data.map((d) => {
    return {
      title: (
        <div>
          <span style={{ fontWeight: 600, marginRight: "8px" }}>{d.name}</span>
          {/* <span>{d.email}</span> */}
        </div>
      ),
      nodeId: d._id,
      key: `${Math.random()}${d._id}`,
      isLeaf: d.childCount === 0,
    };
  });
};

export const TreeData = ({ userId }) => {
  const [data, setData] = useState([]);
  const address = userId;

  const handleGetTreeChild = async (nodeId) => {
    return axiosService.get(`/v2/getTreeByUserId?userId=${nodeId}`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });
  };

  const handleFindAndUpdateTree = (rootTreeData, key, treeData, nodeId) => {
    const newData = rootTreeData.map((d) => {
      if (d.key === key) {
        return {
          ...d,
          children: treeData,
        };
      }

      if (d.children) {
        return {
          ...d,
          children: handleFindAndUpdateTree(d.children, key, treeData, nodeId),
        };
      }

      return d;
    });

    return newData;
  };

  const handleLoadData = ({ key, children, nodeId }) => {
    return new Promise(async (resolve) => {
      if (children) {
        resolve();

        return;
      }

      try {
        const response = await handleGetTreeChild(nodeId);
        const treeData = preprocessTreeData(response.data.data.f1ArrayData);
        const newData = handleFindAndUpdateTree(data, key, treeData, nodeId);

        setData(newData);
        resolve();
      } catch (error) {
        resolve();
      }
    });
  };

  const handleGetTreeInit = async () => {
    try {
      const res = await axiosService.get(`/v2/getTreeByUserId?userId=${address}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      const dataTree = preprocessTreeData(res.data.data.f1ArrayData);

      setData(dataTree);
    } catch (error) {}
  };

  useEffect(() => {
    handleGetTreeInit();
  }, []);

  return (
    <div className="">
      <Tree showLine switcherIcon={<DownOutlined />} treeData={data} loadData={handleLoadData} />
    </div>
  );
};
