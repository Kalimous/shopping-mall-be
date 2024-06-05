import React, { useState, useEffect } from "react";
import { Form, Modal, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CloudinaryUploadWidget from "../utils/CloudinaryUploadWidget";
import { productActions } from "../action/productAction";
import { CATEGORY, STATUS, SIZE } from "../constants/product.constants";
import "../style/adminProduct.style.css";
import * as types from "../constants/product.constants";
import { commonUiActions } from "../action/commonUiAction";
import errorStore from "../store/errorStore";
import productStore from "../store/productStore";

const InitialFormData = {
    name: "",
    sku: "",
    stock: {},
    image: "",
    description: "",
    category: [],
    status: "active",
    price: 0,
};
const NewItemDialog = ({ mode, showDialog, setShowDialog }) => {
    const selectedProduct = useSelector(
        (state) => state.product.selectedProduct
    );
    const { error } = errorStore();
    const [formData, setFormData] = useState(
        mode === "new" ? { ...InitialFormData } : selectedProduct
    );
    const [stock, setStock] = useState([]);
    const [stockError, setStockError] = useState(false);
    const { createProduct } = productStore();
    const { getProductList } = productStore();

    const handleClose = () => {
        setStock([]);
        setShowDialog(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (stock.length === 0) return setStockError(true);
        const totalStock = stock.reduce((total, item) => {
            return { ...total, [item[0]]: parseInt([item[1]]) };
        }, {});
        if (mode === "new") {
            await createProduct({ ...formData, stock: totalStock });
            setShowDialog(false);
            getProductList();
        } else {
            // 상품 수정하기
        }
    };

    const handleChange = (event) => {
        const { id, value } = event.target;
        setFormData({ ...formData, [id]: value });
    };

    const addStock = () => {
        setStock([...stock, []]);
    };

    const deleteStock = (idx) => {
        const newStock = stock.filter((item, index) => index !== idx);
        setStock(newStock);
    };

    const handleSizeChange = (value, index) => {
        const newStock = [...stock];
        newStock[index][0] = value;
        setStock(newStock);
    };

    const handleStockChange = (value, index) => {
        const newStock = [...stock];
        newStock[index][1] = value;
        setStock(newStock);
    };

    const onHandleCategory = (event) => {
        //카테고리가 이미 추가되어 있으면 제거
        if (formData.category.includes(event.target.value)) {
            const newCategory = formData.category.filter(
                (item) => item !== event.target.value
            );
            setFormData({
                ...formData,
                category: [...newCategory],
            });
        } else {
            //아니라면 추가
            setFormData({
                ...formData,
                category: [...formData.category, event.target.value],
            });
        }
    };

    const uploadImage = (url) => {
        setFormData({ ...formData, image: url });
    };

    useEffect(() => {
        if (showDialog) {
            if (mode === "edit") {
                // 선택된 데이터값 불러오기 (재고 형태 객체에서 어레이로 바꾸기)
            } else {
                // 초기화된 값 불러오기
            }
        }
    }, [showDialog]);

    //에러나면 토스트 메세지 보여주기

    return (
        <Modal show={showDialog} onHide={handleClose}>
            <Modal.Header closeButton>
                {mode === "new" ? (
                    <Modal.Title>Create New Product</Modal.Title>
                ) : (
                    <Modal.Title>Edit Product</Modal.Title>
                )}
            </Modal.Header>

            <Form className="form-container" onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="sku">
                        <Form.Label>Sku</Form.Label>
                        <Form.Control
                            onChange={handleChange}
                            type="string"
                            placeholder="Enter Sku"
                            required
                            value={formData.sku}
                        />
                    </Form.Group>

                    <Form.Group as={Col} controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            onChange={handleChange}
                            type="string"
                            placeholder="Name"
                            required
                            value={formData.name}
                        />
                    </Form.Group>
                </Row>

                <Form.Group className="mb-3" controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        type="string"
                        placeholder="Description"
                        as="textarea"
                        onChange={handleChange}
                        rows={3}
                        value={formData.description}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="stock">
                    <Form.Label className="mr-1">Stock</Form.Label>
                    {stockError && (
                        <span className="error-message">
                            재고를 추가해주세요
                        </span>
                    )}
                    <Button size="sm" onClick={addStock}>
                        Add +
                    </Button>
                    <div className="mt-2">
                        {stock.map((item, index) => (
                            <Row key={index}>
                                <Col sm={4}>
                                    <Form.Select
                                        onChange={(event) =>
                                            handleSizeChange(
                                                event.target.value,
                                                index
                                            )
                                        }
                                        required
                                        defaultValue={
                                            item[0] ? item[0].toLowerCase() : ""
                                        }
                                    >
                                        <option
                                            value=""
                                            disabled
                                            selected
                                            hidden
                                        >
                                            Please Choose...
                                        </option>
                                        {SIZE.map((item, index) => (
                                            <option
                                                invalid="true"
                                                value={item.toLowerCase()}
                                                disabled={stock.some(
                                                    (size) =>
                                                        size[0] ===
                                                        item.toLowerCase()
                                                )}
                                                key={index}
                                            >
                                                {item}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Col>
                                <Col sm={6}>
                                    <Form.Control
                                        onChange={(event) =>
                                            handleStockChange(
                                                event.target.value,
                                                index
                                            )
                                        }
                                        type="number"
                                        placeholder="number of stock"
                                        value={item[1]}
                                        required
                                    />
                                </Col>
                                <Col sm={2}>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => deleteStock(index)}
                                    >
                                        -
                                    </Button>
                                </Col>
                            </Row>
                        ))}
                    </div>
                </Form.Group>

                <Form.Group className="mb-3" controlId="Image" required>
                    <Form.Label>Image</Form.Label>
                    <CloudinaryUploadWidget uploadImage={uploadImage} />

                    <img
                        id="uploadedimage"
                        src={formData.image}
                        className="upload-image mt-2"
                        alt="uploadedimage"
                    ></img>
                </Form.Group>

                <Row className="mb-3">
                    <Form.Group as={Col} controlId="price">
                        <Form.Label>Price</Form.Label>
                        <Form.Control
                            value={formData.price}
                            required
                            onChange={handleChange}
                            type="number"
                            placeholder="0"
                        />
                    </Form.Group>

                    <Form.Group as={Col} controlId="category">
                        <Form.Label>Category</Form.Label>
                        <Form.Control
                            as="select"
                            multiple
                            onChange={onHandleCategory}
                            value={formData.category}
                            required
                        >
                            {CATEGORY.map((item, idx) => (
                                <option key={idx} value={item.toLowerCase()}>
                                    {item}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group as={Col} controlId="status">
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                            value={formData.status}
                            onChange={handleChange}
                            required
                        >
                            {STATUS.map((item, idx) => (
                                <option key={idx} value={item.toLowerCase()}>
                                    {item}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Row>
                {mode === "new" ? (
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                ) : (
                    <Button variant="primary" type="submit">
                        Edit
                    </Button>
                )}
            </Form>
        </Modal>
    );
};

export default NewItemDialog;
