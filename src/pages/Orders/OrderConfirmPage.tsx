import { Table, Typography, Form, Input, message } from 'antd';
import { useAppSelector } from '../../Store';
import { useGetCartItemsQuery, useOrderCartMutation } from '../../Services/apiCart';
import type { CartItemDto } from '../../Services/types';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const OrderConfirmPage = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [cartItems, setCartItems] = useState<CartItemDto[]>([]);
  const navigate = useNavigate();
  const [orderCart ] = useOrderCartMutation();

  const { data } = useGetCartItemsQuery(undefined, { skip: !user });

  useEffect(() => {
    if (user) {
      setCartItems(data || []);
    } else {
      const localCart = localStorage.getItem('cart');
      const parsedCart = localCart ? JSON.parse(localCart) : { items: [] };
      setCartItems(parsedCart.items);
    }
  }, [data, user]);

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleOrder = async () => {
    if(user) {
      try{
        orderCart();
        message.success("User cart has been ordered!");
        navigate("/");
      } catch (err) {
        console.log(err);
        message.error("Failed ordering  user cart!");
      }
    }
    else{
      message.error("Must login first!");
      navigate("/login");
    }
  };

  const columns = [
    {
      title: 'Product',
      dataIndex: 'name',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      render: (price: number) => `₴${price}`,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
    },
    {
      title: 'Total',
      render: (_: any, item: CartItemDto) => `₴${item.price * item.quantity}`,
    },
  ];

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Title level={2}>Confirm Your Order</Title>

      <Table
        dataSource={cartItems}
        columns={columns}
        rowKey="productVariantId"
        pagination={false}
      />

      <Title level={4} style={{ marginTop: 30 }}>
        Total: ₴{total.toFixed(2)}
      </Title>

      <Title level={3} style={{ marginTop: 50 }}>
        Your Information
      </Title>

      <Form layout="vertical" onFinish={handleOrder}>
        <Form.Item
          label="Shipping Address (bluff)"
          name="address"
          rules={[{ required: true, message: 'Please enter your address' }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item>
        <button
          className="bg-amber-500 hover:bg-amber-600 text-white text-lg font-semibold px-6 py-3 rounded shadow transition mt-5"
        >
          Order Cart Items
        </button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default OrderConfirmPage;
