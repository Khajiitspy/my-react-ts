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
import {
  useGetCitiesQuery,
  useGetPostDepartmentsQuery,
  useGetPaymentTypesQuery,
} from '../../Services/apiOrders';
import type { CartItemDto } from '../../Services/types';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';

const { Title } = Typography;
const { Option } = Select;

const OrderConfirmPage = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [cartItems, setCartItems] = useState<CartItemDto[]>([]);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [orderCart] = useOrderCartMutation();

  const [searchCity, setSearchCity] = useState('');
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);

  const { data: cities, isLoading: loadingCities } = useGetCitiesQuery(searchCity);
  const { data: departments, isLoading: loadingDepartments } = useGetPostDepartmentsQuery(selectedCityId!, {
    skip: !selectedCityId,
  });
  const { data: paymentTypes } = useGetPaymentTypesQuery();

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  useEffect(() => {
    if (user) {
      setCartItems(data || []);
      // Fill initial values with user's info
      form.setFieldsValue({
        recipientName: user.name,
        email: user.email,
      });
    } else {
      const localCart = localStorage.getItem('cart');
      const parsedCart = localCart ? JSON.parse(localCart) : { items: [] };
      setCartItems(parsedCart.items);
    }
  }, [user]);

  const { data } = useGetCartItemsQuery();

  const handleOrder = async (values: any) => {
    if (user) {
      try {
        await orderCart(values).unwrap();
        localStorage.removeItem("cart");
        message.success('Your order has been placed! Check your email.');
        navigate('/');
      } catch (err) {
        console.error(err);
        message.error('Failed to place the order.');
      }
    } else {
      message.error('Please log in to complete your order.');
      navigate('/login');
    }
  };

  const debouncedSearch = debounce((value: string) => {
    setSearchCity(value);
  }, 300);

  const handleCityChange = (value: number) => {
    setSelectedCityId(value);
    form.setFieldsValue({ postDepartmentId: undefined }); // reset department on city change
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

      <Form
        form={form}
        layout="vertical"
        onFinish={handleOrder}
        style={{ marginTop: 20 }}
      >
        <Form.Item
          label="Recipient Name"
          name="recipientName"
          rules={[{ required: true, message: 'Please enter recipient name' }]}
        >
          <Input placeholder="John Doe" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please enter an Email' },
          ]}
        >
          <Input placeholder="example@mail.me" />
        </Form.Item>

        <Form.Item
          label="Phone Number"
          name="phoneNumber"
          rules={[
            { required: true, message: 'Please enter phone number' },
            {
              pattern: /^\+?\d{7,14}$/,
              message: 'Enter a valid phone number',
            },
          ]}
        >
          <Input placeholder="+380123456789" />
        </Form.Item>

        <Form.Item
          label="City"
          name="cityId"
          rules={[{ required: true, message: 'Please select a city' }]}
        >
          <Select
            showSearch
            placeholder="Search and select city"
            filterOption={false}
            onSearch={debouncedSearch}
            onChange={handleCityChange}
            notFoundContent={loadingCities ? <Spin size="small" /> : null}
          >
            {cities?.map((city) => (
              <Option key={city.id} value={city.id}>
                {city.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {selectedCityId && (
          <Form.Item
            label="Post Department"
            name="postDepartmentId"
            rules={[
              { required: true, message: 'Please select post department' },
            ]}
          >
            <Select
              placeholder="Select a department"
              loading={loadingDepartments}
              notFoundContent={
                loadingDepartments ? <Spin size="small" /> : 'No departments'
              }
            >
              {departments?.map((dept) => (
                <Option key={dept.id} value={dept.id}>
                  {dept.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}

        <Form.Item
          label="Payment Type"
          name="paymentTypeId"
          rules={[{ required: true, message: 'Please select payment type' }]}
        >
          <Select placeholder="Choose payment method">
            {paymentTypes?.map((payment) => (
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
    </div>
  );
};

export default OrderConfirmPage;
