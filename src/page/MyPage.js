import React from "react";
import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { orderActions } from "../action/orderAction";
import OrderStatusCard from "../component/OrderStatusCard";
import "../style/orderStatus.style.css";
import orderStore from "../store/orderStore";
import { useState } from "react";

const MyPage = () => {
    const { getOrder } = orderStore();
    const [orders, setOrder] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getOrder();
            setOrder(response.data.orders);
        };
        fetchData();
    }, []);

    // 오더리스트가 없다면? 주문한 상품이 없습니다 메세지 보여주기
    return (
        <Container className="status-card-container">
            {orders.length > 0 ? (
                orders.map((order) => <OrderStatusCard order={order} />)
            ) : (
                <h1>주문한 상품이 없습니다</h1>
            )}
        </Container>
    );
};

export default MyPage;
