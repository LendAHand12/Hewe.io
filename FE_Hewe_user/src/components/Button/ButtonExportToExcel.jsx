import { Button } from "antd";

export const ButtonExportToExcel = ({
  loading,
  onExport,
  style,
  className,
}) => {
  return (
    <Button
      loading={loading}
      icon={<i className="fa-solid fa-download"></i>}
      onClick={onExport}
      style={style}
      className={className}
    >
      Xuất Excel
    </Button>
  );
};
