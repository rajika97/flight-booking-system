import React, { useState } from "react";
import { Menu, Button, notification } from 'antd';
import { RocketOutlined, HistoryOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { Outlet, Link, useNavigate } from "react-router-dom";
import { handleLogout } from "../apis/auth";

export function HomePage() {
    const [current, setCurrent] = useState("home");
    const Navigate = useNavigate();

    const handleClick = (e) => {
        setCurrent(e.key);
    };

    const signOut = () => {
        handleLogout().then((response) => {
            Navigate("/");
        }).catch((error) => {
            console.error(error);
            notification["error"]({
                message: "Logout failed. Please try again.",
            });
        });
    }
    
    return(
        <>
            <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
                <Menu.Item key="home" icon={<RocketOutlined />}>
                    <Link to="/home/flights">Flights</Link>
                </Menu.Item>
                <Menu.Item key="reservations" icon={<HistoryOutlined />}>
                    <Link to="/home/reservations">Reservations</Link>
                </Menu.Item>
                <Menu.Item key="manage" icon={<SettingOutlined />}>
                    <Link to="/home/manage">Management</Link>
                </Menu.Item>
            </Menu>
            <Button icon={<LogoutOutlined />} danger className="sign-out-btn" onClick={() => signOut()}>
                Log Out
            </Button>
            <Outlet/>
        </>
    )
}