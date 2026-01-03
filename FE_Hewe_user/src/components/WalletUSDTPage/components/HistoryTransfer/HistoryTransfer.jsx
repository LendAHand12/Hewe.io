import { useEffect, useMemo, useState } from "react";
import { IconUSDT, Table } from "../../..";
import { useListTable, usePagination } from "../../../../hooks";
import { getHistoryTransferContentAPI } from "../../../../services/swapService";
import { Tag } from "antd";
import "./HistoryTransfer.scss";
import { SwitchSide } from "..";
import { convertTimeCreateAt } from "../../../../util/adminBizpointUtils";

const LIMIT = 10;

export const HistoryTransfer = ({ isReloadData, setIsReloadData }) => {
  const isMobileViewport = window.innerWidth < 768;
  const [currentType, setCurrentType] = useState("SEND");
  const {
    x,
    y,
    currentPage,
    totalItems,
    limitPerRow,
    handleSetCurrentPage,
    handleSetTotalItems,
  } = usePagination({ defaultPage: 1, limit: LIMIT });
  const { data, loading, handleGetData, handleSetData } = useListTable({
    service: getHistoryTransferContentAPI,
    defaultParamsPayload: {
      limit: limitPerRow,
      page: currentPage,
      type: currentType,
    },
    callbackSetTotalItem: handleSetTotalItems,
  });

  const handleGetHistoryTransfer = ({ page, currentType }) => {
    handleGetData({
      paramsQuery: { page, type: currentType, limit: LIMIT },
    });
  };

  const handleClickReceive = () => {
    if (currentType === "RECIEVE") {
      return;
    }

    setCurrentType("RECIEVE");
    handleSetData([]);
  };

  const handleClickSend = () => {
    if (currentType === "SEND") {
      return;
    }

    setCurrentType("SEND");
    handleSetData([]);
  };

  const renderColumnSend = () => {
    return !isMobileViewport
      ? [
          {
            title: "Người nhận",
            render: (_, record) => {
              return (
                <div className="row">
                  <div className="id">{record.receiverId}</div>
                  <div>{record.receiverName}</div>
                </div>
              );
            },
          },
          {
            title: "Tổng USDT chuyển",
            dataIndex: "amountUSDT",
            render: (value) => {
              return (
                <div className="center-flex-vertical">
                  <div>{value}</div>
                  <IconUSDT />
                </div>
              );
            },
          },
          {
            title: "Người nhận nhận được",
            render: (_, record) => {
              return (
                <div className="center-flex-vertical">
                  <div>{record.amountUSDT - record.fee}</div>
                  <IconUSDT />
                </div>
              );
            },
          },
          {
            title: "Phí",
            dataIndex: "fee",
            render: (value) => {
              return (
                <div className="center-flex-vertical">
                  <div>{value}</div>
                  <IconUSDT />
                </div>
              );
            },
          },
          {
            title: "Trạng thái",
            dataIndex: "status",
            render: () => {
              return <Tag color="green">Thành công</Tag>;
            },
          },
          {
            title: "Nội dung",
            dataIndex: "content",
            render: (value) => {
              return value;
            },
          },
          {
            title: "Thời gian",
            dataIndex: "createdAt",
            render: (value) => {
              return convertTimeCreateAt(value);
            },
          },
        ]
      : [
          {
            title: <div className="titleTableMobile">Thông tin chuyển</div>,
            render: (_, record) => {
              return (
                <div className="center-flex-horizontal py-4">
                  <div className="center-flex-vertical rowTableMobile">
                    <div>ID người nhận</div>
                    <div>{record.receiverId}</div>
                  </div>
                  <div className="center-flex-vertical rowTableMobile">
                    <div>Người nhận</div>
                    <div>{record.receiverName}</div>
                  </div>
                  <div className="center-flex-vertical rowTableMobile">
                    <div>Tổng USDT chuyển</div>
                    <div>
                      <div className="center-flex-vertical">
                        <div>{record.amountUSDT}</div>
                        <IconUSDT />
                      </div>
                    </div>
                  </div>
                  <div className="center-flex-vertical rowTableMobile">
                    <div>Người nhận nhận được</div>
                    <div>
                      <div className="center-flex-vertical">
                        <div>{record.amountUSDT - record.fee}</div>
                        <IconUSDT />
                      </div>
                    </div>
                  </div>
                  <div className="center-flex-vertical rowTableMobile">
                    <div>Phí</div>
                    <div>
                      <div className="center-flex-vertical">
                        <div>{record.fee}</div>
                        <IconUSDT />
                      </div>
                    </div>
                  </div>
                  <div className="center-flex-vertical rowTableMobile">
                    <div>Trạng thái</div>
                    <div>
                      <Tag color="green">Thành công</Tag>
                    </div>
                  </div>
                  <div className="center-flex-vertical rowTableMobile">
                    <div>Nội dung</div>
                    <div>{record.content}</div>
                  </div>
                  <div className="center-flex-vertical rowTableMobile">
                    <div>Thời gian</div>
                    <div>{convertTimeCreateAt(record.createdAt)}</div>
                  </div>
                </div>
              );
            },
          },
        ];
  };

  const renderColumnReceived = () => {
    return !isMobileViewport
      ? [
          {
            title: "Người gửi",
            render: (_, record) => {
              return (
                <div className="row">
                  <div className="id">{record.senderId}</div>
                  <div>{record.senderName}</div>
                </div>
              );
            },
          },
          {
            title: "Tổng USDT nhận được",
            render: (value, record) => {
              return (
                <div className="center-flex-vertical">
                  <div>{record.amountUSDT - record.fee}</div>
                  <IconUSDT />
                </div>
              );
            },
          },
          {
            title: "Trạng thái",
            dataIndex: "status",
            render: () => {
              return <Tag color="green">Thành công</Tag>;
            },
          },
          {
            title: "Nội dung",
            dataIndex: "content",
            render: (value) => {
              return value;
            },
          },
          {
            title: "Thời gian",
            dataIndex: "createdAt",
            render: (value) => {
              return convertTimeCreateAt(value);
            },
          },
        ]
      : [
          {
            title: <div className="titleTableMobile">Thông tin nhận</div>,
            render: (_, record) => {
              return (
                <div className="center-flex-horizontal py-4">
                  <div className="center-flex-vertical rowTableMobile">
                    <div>ID người gửi</div>
                    <div>{record.senderId}</div>
                  </div>
                  <div className="center-flex-vertical rowTableMobile">
                    <div>Người gửi</div>
                    <div>{record.senderName}</div>
                  </div>
                  <div className="center-flex-vertical rowTableMobile">
                    <div>Tổng USDT nhận được</div>
                    <div>
                      <div className="center-flex-vertical">
                        <div>{record.amountUSDT - record.fee}</div>
                        <IconUSDT />
                      </div>
                    </div>
                  </div>
                  <div className="center-flex-vertical rowTableMobile">
                    <div>Trạng thái</div>
                    <div>
                      <Tag color="green">Thành công</Tag>
                    </div>
                  </div>
                  <div className="center-flex-vertical rowTableMobile">
                    <div>Nội dung</div>
                    <div>{record.content}</div>
                  </div>
                  <div className="center-flex-vertical rowTableMobile">
                    <div>Thời gian</div>
                    <div>{convertTimeCreateAt(record.createdAt)}</div>
                  </div>
                </div>
              );
            },
          },
        ];
  };

  // TODO old version
  // const columns = useMemo(() => {
  //   return currentType === "SEND"
  //     ? [
  //         {
  //           title: "Người nhận",
  //           render: (_, record) => {
  //             return (
  //               <div className="row">
  //                 <div className="id">{record.receiverId}</div>
  //                 <div>{record.receiverName}</div>
  //               </div>
  //             );
  //           },
  //         },
  //         {
  //           title: "Tổng USDT chuyển",
  //           dataIndex: "amountUSDT",
  //           render: (value) => {
  //             return (
  //               <div className="center-flex-vertical">
  //                 <div>{value}</div>
  //                 <IconUSDT />
  //               </div>
  //             );
  //           },
  //         },
  //         {
  //           title: "Người nhận nhận được",
  //           render: (_, record) => {
  //             return (
  //               <div className="center-flex-vertical">
  //                 <div>{record.amountUSDT - record.fee}</div>
  //                 <IconUSDT />
  //               </div>
  //             );
  //           },
  //         },
  //         {
  //           title: "Phí",
  //           dataIndex: "fee",
  //           render: (value) => {
  //             return (
  //               <div className="center-flex-vertical">
  //                 <div>{value}</div>
  //                 <IconUSDT />
  //               </div>
  //             );
  //           },
  //         },
  //         {
  //           title: "Trạng thái",
  //           dataIndex: "status",
  //           render: () => {
  //             return <Tag color="green">Thành công</Tag>;
  //           },
  //         },
  //         {
  //           title: "Nội dung",
  //           dataIndex: "content",
  //           render: (value) => {
  //             return value;
  //           },
  //         },
  //         {
  //           title: "Thời gian",
  //           dataIndex: "createdAt",
  //           render: (value) => {
  //             return convertTimeCreateAt(value);
  //           },
  //         },
  //       ]
  //     : [
  //         {
  //           title: "Người gửi",
  //           render: (_, record) => {
  //             return (
  //               <div className="row">
  //                 <div className="id">{record.senderId}</div>
  //                 <div>{record.senderName}</div>
  //               </div>
  //             );
  //           },
  //         },
  //         {
  //           title: "Tổng USDT nhận được",
  //           render: (value, record) => {
  //             return (
  //               <div className="center-flex-vertical">
  //                 <div>{record.amountUSDT - record.fee}</div>
  //                 <IconUSDT />
  //               </div>
  //             );
  //           },
  //         },
  //         {
  //           title: "Trạng thái",
  //           dataIndex: "status",
  //           render: () => {
  //             return <Tag color="green">Thành công</Tag>;
  //           },
  //         },
  //         {
  //           title: "Nội dung",
  //           dataIndex: "content",
  //           render: (value) => {
  //             return value;
  //           },
  //         },
  //         {
  //           title: "Thời gian",
  //           dataIndex: "createdAt",
  //           render: (value) => {
  //             return convertTimeCreateAt(value);
  //           },
  //         },
  //       ];
  // }, [currentType]);

  // TODO new version
  const columns = useMemo(() => {
    return currentType === "SEND" ? renderColumnSend() : renderColumnReceived();
  }, [currentType]);

  useEffect(() => {
    if (!isReloadData) {
      handleGetHistoryTransfer({ page: currentPage, currentType });
    }
  }, [isReloadData, currentPage, currentType]);

  useEffect(() => {
    if (isReloadData) {
      handleGetHistoryTransfer({ page: currentPage, currentType });
      setIsReloadData(false);
    }
  }, [isReloadData, currentPage, currentType]);

  return (
    <div className="historyTransferContainer">
      <SwitchSide
        onClickReceive={handleClickReceive}
        onClickSend={handleClickSend}
      />
      <Table
        rowKey={(row) => row.id}
        columns={columns}
        x={x}
        y={y}
        totalItems={totalItems}
        data={data}
        currentPage={currentPage}
        isLoading={loading}
        onChangePage={handleSetCurrentPage}
        limit={limitPerRow}
        paginationPosition="bottomRight"
        scrollX={isMobileViewport ? 100 : 800}
      />
    </div>
  );
};
