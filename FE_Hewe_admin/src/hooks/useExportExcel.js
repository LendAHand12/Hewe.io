/* eslint-disable no-prototype-builtins */
import { message } from "antd";
import { useState } from "react";
import ExcelJS from "exceljs";

/**
 * @param {serviceGetData} service call api to get data
 * @param {paramsPayload} params to pass in service
 *          - @example paramsPayload = { search: 'abc', page: 1, limit: 10 };
 */
export const useExportExcel = ({ serviceGetData, paramsPayload }) => {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * @description call API to get data, then loop over each data to get information and then add new row in worksheet
   * @see ListUserData.jsx for detail
   *
   * @param sheetName:
   *        - @description SheetName of excel file
   *        - @type string
   *        - @example "Sheet 1"
   *
   * @param headers:
   *        - @description Is first row of file excel with nameCol and width of that column. If   not pass width of column, default width is 20
   *        - @type array contain objects
   *        - @example [{ colName: 'A', width: 100 }, { colName: 'B', width: 50 }]
   *
   * @param onlyGetFieldData:
   *        - @description Only get specific fields in API data response, expect data response is array contain object
   *        - @type string array
   *        - @example ['name', 'level', 'phoneNumber']
   *
   * @param preprocessColumnsData:
   *        - @description: Preprocess value return in specific field, if not pass this param, return default value get from API data response
   *        - @type object which 'key' is some field in @param onlyGetFieldData, 'value' is function or value. If 'value' is function, it take @param record of that row
   *        - @example
   *            const preprocessColumnsData = {
   *                 level: (record) => renderAccountType(record.level),
   *                 createdAt: (record) => convertTimeCreateAt(record.createdAt),
   *                 name:
   *             };
   *
   * @param callbackCheckIsNotAllowAddRow:
   *        - @description Will fire before add new row in worksheet if it allowed, otherwise skip that row data.
   *        - @type function return boolean
   *        - @example
   *            const handleGetDataExceptAdminAccount = (data) => {
   *                 return data.id === 1;
   *             };
   */
  const handleExportFileExcel = async ({
    sheetName,
    headers,
    onlyGetFieldData,
    preprocessColumnsData,
    callbackCheckIsNotAllowAddRow,
  }) => {
    if (paramsPayload && paramsPayload.limit === 0) {
      message.info("Không có dữ liệu nào để xuất excel");
      return;
    }

    try {
      setIsLoading(true);

      const res = await serviceGetData(paramsPayload);
      console.log("DATA ?", res);
      const data = res.data.data.array;

      if (data.length !== 0) {
        const wb = new ExcelJS.Workbook();
        const ws = wb.addWorksheet(sheetName);
        const nameCols = headers.map((header) => header.colName);
        const widthCols = headers.map((header) => ({
          width: header.width || 20,
        }));
        const headerRow = ws.addRow(nameCols);

        ws.columns = widthCols;

        headerRow.eachCell({ includeEmpty: true }, (cell) => {
          cell.alignment = { horizontal: "center", vertical: "middle" };
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: {
              argb: "FFEE54",
            },
          };
          const border = { style: "thin", color: { argb: "0A0A0A" } };
          cell.border = {
            top: border,
            left: border,
            bottom: border,
            right: border,
          };
        });

        const keysOfRowData = new Set(Object.keys(data[0]));

        data.forEach((rowData) => {
          const row = [];

          // check if can add this row into excel file
          if (
            typeof callbackCheckIsNotAllowAddRow === "function" &&
            callbackCheckIsNotAllowAddRow(rowData)
          ) {
            return;
          }

          onlyGetFieldData.forEach((key) => {
            // check if have key in preprocessColumnsData, then add data into that function to custom
            if (
              typeof preprocessColumnsData === "object" &&
              preprocessColumnsData.hasOwnProperty(key)
            ) {
              if (typeof preprocessColumnsData[key] === "function") {
                row.push(preprocessColumnsData[key](rowData));
              } else {
                row.push(preprocessColumnsData[key]);
              }

              return;
            }

            if (keysOfRowData.has(key)) {
              row.push(rowData[key]);
            } else {
              row.push("");
            }
          });

          ws.addRow(row);
        });
        wb.xlsx.writeBuffer().then((rowData) => {
          const blob = new Blob([rowData], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          const url = window.URL.createObjectURL(blob);
          const anchor = document.createElement("a");
          anchor.href = url;
          anchor.download = "data.xlsx";
          anchor.click();
          window.URL.revokeObjectURL(url);
        });
      }
    } catch (err) {
      message.error(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleExportFileExcel,
  };
};
