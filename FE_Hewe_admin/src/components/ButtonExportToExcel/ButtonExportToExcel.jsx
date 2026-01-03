import { Button } from "antd";

export const ButtonExportToExcel = ({ loading, onExport, style }) => {
  return (
    <Button
      loading={loading}
      // icon={<FontAwesomeIcon icon={faDownload} />}
      onClick={onExport}
      style={style}
    >
      Xuất Excel
    </Button>
  );
};
