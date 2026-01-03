import { Table as TableAntd } from "antd";
import "./tableAntd.scss";

export const Table = ({
  rowKey,
  onChangeLimitPerRow,
  style,
  renderSummaryRows = null,
  totalItems = 0,
  isLoading = false,
  columns = [],
  data = [],
  onChangePage,
  currentPage = 1,
  limit = 10,
  scrollX = 800,
  paginationPosition = "topRight",
  pageSizeOptions = [10, 20, 50, 100],
  isShowSizeChange = false,
  isShowPagination = true,
}) => {
  const isMobileViewport = window.innerWidth <= 768;

  return (
    <TableAntd
      style={style}
      className="tableContainer customTableAntd"
      rowKey={rowKey}
      columns={columns}
      dataSource={data}
      scroll={{ x: scrollX }}
      loading={isLoading}
      size={isMobileViewport ? "middle" : "large"}
      pagination={
        isShowPagination && {
          position: [paginationPosition],
          pageSize: limit,
          total: totalItems,
          current: currentPage,
          onChange: onChangePage,
          showSizeChanger: isShowSizeChange,
          pageSizeOptions,
          onShowSizeChange: onChangeLimitPerRow,
        }
      }
      summary={(pageData) =>
        renderSummaryRows &&
        typeof renderSummaryRows === "function" &&
        renderSummaryRows(pageData)
      }
    />
  );
};
