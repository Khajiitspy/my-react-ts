import {
  Table,
  Typography,
  Form,
  Input,
  Select,
  message,
  Spin,
} from 'antd';
import { useAppSelector } from '../../Store';
import {
  useGetCartItemsQuery,
  useOrderCartMutation,
} from '../../Services/apiCart';
import { useGetOrderOptionsQuery } from '../../Services/apiOrders';
import type { CartItemDto } from '../../Services/types';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Option } = Select;

const OrderConfirmPage = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [cartItems, setCartItems] = useState<CartItemDto[]>([]);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [orderCart] = useOrderCartMutation();

  const { data: cartData } = useGetCartItemsQuery(undefined, { skip: !user });
  const { data: orderOptions, isLoading: loadingOptions } = useGetOrderOptionsQuery();

  useEffect(() => {
    if (user) {
      setCartItems(cartData || []);
    } else {
      const localCart = localStorage.getItem('cart');
      const parsedCart = localCart ? JSON.parse(localCart) : { items: [] };
      setCartItems(parsedCart.items);
    }
  }, [cartData, user]);

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleOrder = async (values: any) => {
    if (user) {
      try {
        await orderCart(values).unwrap();
        message.success('User cart has been ordered!');
        navigate('/');
      } catch (err) {
        console.error(err);
        message.error('Failed to order user cart!');
      }
    } else {
      message.error('Must login first!');
      navigate('/login');
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

      {loadingOptions ? (
        <Spin tip="Loading options..." />
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleOrder}
          style={{ marginTop: 20 }}
        >
          <Form.Item
            label="Recipient Name"
            name="recipientName"
            rules={[{ required: true, message: 'Please enter your full name' }]}
          >
            <Input placeholder="John Doe" />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[
              { required: true, message: 'Please enter your phone number' },
              { pattern: /^\+?\d{7,14}$/, message: 'Enter a valid phone number' },
            ]}
          >
            <Input placeholder="+380123456789" />
          </Form.Item>

          <Form.Item
            label="City"
            name="cityId"
            rules={[{ required: true, message: 'Please select your city' }]}
          >
            <Select placeholder="Select a city">
              {orderOptions?.cities.map((city) => (
                <Option key={city.id} value={city.id}>
                  {city.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Post Department"
            name="postDepartmentId"
            rules={[
              { required: true, message: 'Please select a post department' },
            ]}
          >
            <Select placeholder="Select a department">
              {orderOptions?.postDepartments.map((dept) => (
                <Option key={dept.id} value={dept.id}>
                  {dept.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Payment Type"
            name="paymentTypeId"
            rules={[{ required: true, message: 'Please choose a payment type' }]}
          >
            <Select placeholder="Select payment type">
              {orderOptions?.paymentTypes.map((payment) => (
                <Option key={payment.id} value={payment.id}>
                  {payment.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 text-white text-lg font-semibold px-6 py-3 rounded shadow transition mt-5"
            >
              Order Cart Items
            </button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default OrderConfirmPage;
