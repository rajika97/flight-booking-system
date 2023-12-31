import React, { useEffect, useState } from "react";
import { Button, Col, Table, Row, Input, Form, notification , Modal, InputNumber} from "antd";
import { createFlightBooking, getAllFlights, getFlightById } from "../apis/flight";

export function FlightsPage() {
    const [form] = Form.useForm();
    const [createFlightForm] = Form.useForm();
    const [flightArray, setFlightArray] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
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
        }).catch((error) => {
            notification["error"]({
                message: "No results found.",
            });
        }).finally(() => {
            setIsLoading(false);
        });
    };

    const submitFlightBooking = (values) => {
        const booking = {
            flightId: values["id"],
            numberOfSeats: values["numberOfSeats"],
            cost: values["cost"]
        };
        createFlightBooking(booking).then((response) => {
            notification["success"]({
                message: "Flight booked successfully.",
            });
            setIsModalOpen(false);
        }).catch((error) => {
            console.error(error);
            notification["error"]({
                message: "Flight booking failed. Please try again.",
            });
        });
    };

    const bookFlight = (record) => {
        setIsModalOpen(true);
        createFlightForm.setFieldsValue({
            id: record["id"],
            flightName: record["flightName"],
            departure: record["departure"],
            destination: record["destination"],
            date: record["date"],
            time: record["time"]
        });
    };

    const FightBookCreateModal = () => {
        return (
            <Modal
                title="Reserve Flight"
                open={isModalOpen}
                onOk={() => createFlightForm
                    .validateFields()
                    .then((values) => {
                        submitFlightBooking(values);
                    })
                    .catch((info) => {
                        console.error("Validate Failed:", info);
                    })
                }
                okText="Reserve"
                onCancel={() => setIsModalOpen(false)}
            >
                <Form form={createFlightForm} layout="vertical">
                    <Form.Item
                        name="numberOfSeats"
                        label="Number of Seats"
                        rules={[{ required: true, message: 'Please input the number of seats!' }]}
                    >
                        <InputNumber size="large" style={{ width: '100%' }} min={1} max={10}/>
                    </Form.Item>
                    <Form.Item
                        name="cost"
                        label="Cost"
                        rules={[{ required: true, message: 'Please input the cost!' }]}
                    >
                        <InputNumber addonBefore="$" size="large" style={{ width: '100%' }} min={0} />
                    </Form.Item>
                    <Form.Item
                        name="id"
                        label="Flight ID"
                    >
                        <Input disabled />
                    </Form.Item>
                    <Form.Item
                        name="flightName"
                        label="Flight Name"
                    >
                        <Input disabled />
                    </Form.Item>
                    <Form.Item
                        name="departure"
                        label="Departure"
                        style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
                    >
                        <Input disabled/>
                    </Form.Item>
                    <Form.Item
                        name="destination"
                        label="Destination"
                        style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
                    >
                        <Input disabled/>
                    </Form.Item>
                    <Form.Item
                        name="date"
                        label="Date"
                        style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
                    >
                        <Input disabled/>
                    </Form.Item>
                    <Form.Item
                        name="time"
                        label="Time"
                        style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
                    >
                        <Input disabled/>
                    </Form.Item>
                </Form>
            </Modal>
        );
    };

    const columns = [
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
                <Button type="link" onClick={() => bookFlight(record)}>Book Flight</Button>
            )
        }
    ];

    return (
        <>
            <Row>
                <Col className="todo-container" span={20} offset={2}>
                    <h1>All Available Flights</h1>
                    <Form form={form} layout="vertical" onFinish={searchFlight}>
                        <Row gutter={[16, 16]}>
                            <Col span={10}>
                                <Form.Item
                                    label="Search by Flight Name"
                                    name="query"
                                    autoComplete="new-state"
                                    role="presentation"
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
            <FightBookCreateModal />
        </>
    );
}
