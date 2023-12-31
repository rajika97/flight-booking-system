import React, { useState, useEffect } from "react";
import {
    Button,
    Col,
    Table,
    Row,
    Input,
    Form,
    Modal,
    Space,
    DatePicker,
    TimePicker,
    notification
} from "antd";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { createFlight, deleteFlight, getAllFlights, getFlightById, updateFlight } from "../apis/flight";
import dayjs from "dayjs";
import Moment from 'react-moment';

export function ManagementPage() {
    const [form] = Form.useForm();
    const [modal, contextHolder] = Modal.useModal();
    const [createFlightForm] = Form.useForm();
    const [editFlightForm] = Form.useForm();
    const [flightArray, setFlightArray] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getAvailableFlights();
    }, []);

    const getAvailableFlights = () => {
        setIsLoading(true);
        getAllFlights().then((response) => {
            setFlightArray(response);
        })
        .catch((error) => {
            console.error(error);
        }).finally(() => {
            setIsLoading(false);
        });
    };

    const searchFlight = (e) => {
        const search = e["query"];

        if (search === undefined || search === "") {
            getAvailableFlights();
            return;
        }
        
        setIsLoading(true);
        getFlightById(search).then((response) => {
            setFlightArray([response]);
            form.resetFields();
        }).catch((error) => {
            notification["error"]({
                message: "No results found.",
            });
        }).finally(() => {
            setIsLoading(false);
        });
    };

    const editSelectedFlight = (record) => {
        setIsEditModalOpen(true);
        editFlightForm.setFieldsValue({
            id: record["id"],
            flightName: record["flightName"],
            departure: record["departure"],
            destination: record["destination"],
            date: dayjs(record["date"], "YYYY-MM-DD"),
            time: dayjs(record["time"], "HH:mm:ss"),
        });
    };

    const deleteSelectedFlight = (record) => {
        setIsLoading(true);
        deleteFlight(record["id"]).then((response) => {
            getAvailableFlights();
        }).catch((error) => {
            console.error(error);
        });
    };

    const confirmDelete = (record) => {
        modal.confirm({
            title: 'Delete?',
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure you want to delete this flight record?',
            okText: "Confirm",
            onOk: () => deleteSelectedFlight(record),
            cancelText: 'Cancel',
          });
    }

    const columns = [
        {
            title: "Created",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (text, record) => (
                <span>{dayjs(record["createdAt"]).format("YYYY-MM-DD @ HH:mm:ss")}</span>
            )
        },
        {
            title: "Updated",
            dataIndex: "updatedAt",
            key: "updatedAt",
            render: (text, record) => (
                <Moment fromNow>{record["updatedAt"]}</Moment>
            )
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date",
        },
        {
            title: "Time",
            dataIndex: "time",
            key: "time",
        },
        {
            title: "Flight Name",
            dataIndex: "flightName",
            key: "flightName",
        },
        {
            title: "Departure",
            dataIndex: "departure",
            key: "departure",
        },
        {
            title: "Destination",
            dataIndex: "destination",
            key: "destination",
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space>
                    <Button
                        type="link"
                        onClick={() => editSelectedFlight(record)}
                    >
                        Edit
                    </Button>
                    <Button
                        danger
                        type="link"
                        onClick={() => confirmDelete(record)}
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    const submitCreateFlight = (values) => {
        const flight = {
            flightName: values["flightName"],
            departure: values["departure"],
            destination: values["destination"],
            date: values["date"].format("YYYY-MM-DD"),
            time: values["time"].format("HH:mm:ss"),
        };
        createFlight(flight)
            .then((response) => {
                createFlightForm.resetFields();
                setIsModalOpen(false);
                getAvailableFlights();
                notification["success"]({
                    message: "Create successful."
                });
            })
            .catch((error) => {
                console.error(error);
                notification["error"]({
                    message: "Create Flight Failed. Please try again."
                });
            });
    };

    const submitEditFlight = (values) => {
        const flight = {
            flightName: values["flightName"],
            departure: values["departure"],
            destination: values["destination"],
            date: values["date"].format("YYYY-MM-DD"),
            time: values["time"].format("HH:mm:ss"),
        };
        updateFlight(values["id"], flight).then((response) => {
            editFlightForm.resetFields();
            setIsEditModalOpen(false);
            getAvailableFlights();
            notification["success"]({
                message: "Update successful."
            });
        }).catch((error) => {
            console.error(error);
            notification["error"]({
                message: "Edit Flight Failed. Please try again."
            });
        });
    };

    const FightCreateModal = () => {
        return (
            <Modal
                title="Create Flight"
                open={isModalOpen}
                onOk={() => {
                    createFlightForm
                        .validateFields()
                        .then((values) => {
                            submitCreateFlight(values);
                        })
                        .catch((info) => {
                            console.error("Validate Failed:", info);
                        });
                }}
                onCancel={() => setIsModalOpen(false)}
            >
                <Form form={createFlightForm} layout="vertical">
                    <Form.Item
                        name="flightName"
                        label="Flight Name"
                        rules={[{ required: true, message: "Required" }]}
                    >
                        <Input placeholder="Input flight name" />
                    </Form.Item>
                    <Form.Item
                        name="departure"
                        label="Departure"
                        rules={[{ required: true, message: "Required" }]}
                    >
                        <Input placeholder="Input Departure" />
                    </Form.Item>
                    <Form.Item
                        name="destination"
                        label="Destination"
                        rules={[{ required: true, message: "Required" }]}
                    >
                        <Input placeholder="Input Destination" />
                    </Form.Item>
                    <Form.Item
                        name="date"
                        label="Date"
                        rules={[{ required: true, message: "Required" }]}
                    >
                        <DatePicker format="YYYY-MM-DD" />
                    </Form.Item>
                    <Form.Item
                        name="time"
                        label="Time"
                        rules={[{ required: true, message: "Required" }]}
                    >
                        <TimePicker format="HH:mm:ss" />
                    </Form.Item>
                </Form>
            </Modal>
        );
    };

    const FightEditModal = () => {
        return (
            <Modal
                title="Edit Flight"
                open={isEditModalOpen}
                onOk={() => {
                    editFlightForm
                        .validateFields()
                        .then((values) => {
                            submitEditFlight(values);
                        })
                        .catch((info) => {
                            console.error("Validate Failed:", info);
                        });
                }}
                onCancel={() => {
                    editFlightForm.resetFields();
                    setIsEditModalOpen(false)
                }}
            >
                <Form form={editFlightForm} layout="vertical">
                    <Form.Item
                        name="id"
                        label="ID"
                        rules={[{ required: true, message: "Required" }]}
                    >
                        <Input disabled />
                    </Form.Item>
                    <Form.Item
                        name="flightName"
                        label="Flight Name"
                        rules={[{ required: true, message: "Required" }]}
                    >
                        <Input placeholder="Input flight name" />
                    </Form.Item>
                    <Form.Item
                        name="departure"
                        label="Departure"
                        rules={[{ required: true, message: "Required" }]}
                    >
                        <Input placeholder="Input Departure" />
                    </Form.Item>
                    <Form.Item
                        name="destination"
                        label="Destination"
                        rules={[{ required: true, message: "Required" }]}
                    >
                        <Input placeholder="Input Destination" />
                    </Form.Item>
                    <Form.Item
                        name="date"
                        label="Date"
                        rules={[{ required: true, message: "Required" }]}
                    >
                        <DatePicker format="YYYY-MM-DD"/>
                    </Form.Item>
                    <Form.Item
                        name="time"
                        label="Time"
                        rules={[{ required: true, message: "Required" }]}
                    >
                        <TimePicker format="HH:mm:ss" />
                    </Form.Item>
                </Form>
            </Modal>
        );
    };


    return (
        <>
            <Row>
                <Col className="todo-container" span={20} offset={2}>
                    <h1>Manage Flights</h1>
                    <Form form={form} layout="vertical" onFinish={searchFlight}>
                        <Row gutter={[16, 16]}>
                            <Col span={10}>
                                <Form.Item
                                    label="Search by Flight Name"
                                    name="query"
                                    autoComplete="new-state"
                                    rules={[{ type: "string" }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={3}>
                                <Form.Item label="&nbsp;">
                                    <Button
                                        type="default"
                                        htmlType="submit"
                                        block
                                    >
                                        Search
                                    </Button>
                                </Form.Item>
                            </Col>
                            <Col span={2}>
                                <Form.Item label="&nbsp;">
                                    <Button
                                        type="link"
                                        block
                                        onClick={() =>  {
                                            form.resetFields();
                                            getAvailableFlights();
                                        }}
                                    >
                                        Clear
                                    </Button>
                                </Form.Item>
                            </Col>
                            <Col span={3} offset={6}>
                                <Form.Item label="&nbsp;">
                                    <Button
                                        type="primary"
                                        onClick={() => setIsModalOpen(true)}
                                        block
                                    >
                                        Create Flight
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                    <Table
                        loading={isLoading}
                        bordered
                        columns={columns}
                        dataSource={flightArray}
                    />
                </Col>
            </Row>
            <FightCreateModal />
            <FightEditModal />
            {contextHolder}
        </>
    );
}
