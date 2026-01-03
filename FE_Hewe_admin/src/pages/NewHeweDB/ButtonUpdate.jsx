import { Button, InputNumber, Modal, Form, message } from "antd";
import { useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { API_URL } from "../../constants/Statics";
import instance from "../../axios";

export default function TransactionItem({ record, getData }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const handleConfirm = async () => {
        try {
            const values = await form.validateFields();
            console.log(values)
            setLoading(true);

            await instance.post(
                `${API_URL}/editHeweDBDataToId`, {
                id: record._id,
                years: Number(values.years),
                percent: Number(values.percent),
            },
                {
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                }
            );
            message.success("Cập nhật thành công!");
            setOpen(false);

            getData(10, 1, `newest`)

        } catch (error) {
            console.error(error);
            message.error("Có lỗi xảy ra khi cập nhật");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button type="link" onClick={() => setOpen(true)}>
                Update
            </Button>

            <Modal
                title={`Cập nhật thời gian cho ${record.userName}`}
                open={open}
                onCancel={() => setOpen(false)}
                onOk={handleConfirm}
                confirmLoading={loading}
                okText="Xác nhận"
                cancelText="Huỷ"
                centered
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{ years: 1, percent: 10 }}
                >
                    <Form.Item
                        label="Số năm thêm"
                        name="years"
                        rules={[{ required: true, message: "Vui lòng nhập số năm" }]}
                    >
                        <InputNumber min={1} max={10} style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item
                        label="Phần trăm thưởng (%)"
                        name="percent"
                        rules={[{ required: true, message: "Vui lòng nhập phần trăm" }]}
                    >
                        <InputNumber min={0} max={100} style={{ width: "100%" }} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
