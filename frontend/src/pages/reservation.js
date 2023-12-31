import React, { useEffect, useState } from "react";
import { Button, Col, Table, Row, notification, Space, Modal } from "antd";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { deleteFlightBooking, getAllFlightBookings } from "../apis/flight";
import dayjs from "dayjs";

export function ReservationsPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [reservationArray, setReservationArray] = useState([]);
    const [modal, contextHolder] = Modal.useModal();

    useEffect(() => {
        getReservedFlights();
    }, []);

    const getReservedFlights = () => {
        setIsLoading(true);
        getAllFlightBookings()
            .then((response) => {
                setReservationArray(response);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const deleteReservation = (record) => {
        setIsLoading(true);
        const id = record["id"];
        deleteFlightBooking(id)
            .then((response) => {
                notification["success"]({
                    message: "Flight deleted successfully.",
                });
                getReservedFlights();
            })
            .catch((error) => {
                console.error(error);
                notification["error"]({
                    message: "Failed to delete flight.",
                });
            });
    };

    const confirmDelete = (record) => {
        modal.confirm({
            title: 'Delete Reservation?',
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure you want to delete this flight reservation?',
            okText: "Confirm",
            onOk: () => deleteReservation(record),
            cancelText: 'Cancel',
          });
    }

    const columns = [
        {
            title: "Reserved Time",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (text, record) => (
                <span>
                    {dayjs(record["createdAt"]).format("YYYY-MM-DD @ HH:mm:ss")}
                </span>
            ),
        },
        {
            title: "Flight Name",
            dataIndex: "flightName",
            key: "flightName",
        },
        {
            title: "Number of seats",
            dataIndex: "numberOfSeats",
            key: "numberOfSeats",
        },
        {
            title: "Cost",
            dataIndex: "cost",
            key: "cost",
            render: (text, record) =>
                record["cost"] && <span>$ {record["cost"]}</span>,
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space>
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

    return (
        <>
            <Row>
                <Col className="todo-container" span={20} offset={2}>
                    <h1>Reserved Flights</h1>
                    <br />
                    <Table
                        bordered
                        columns={columns}
                        dataSource={reservationArray}
                        loading={isLoading}
                    />
                </Col>
            </Row>
            {contextHolder}
        </>
    );
}
