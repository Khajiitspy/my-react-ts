import { Table, Button, Image, Typography } from 'antd';
import { useCart } from '../../context/CartContext';
import {APP_ENV} from "../../env";

const { Title } = Typography;

const CartPage = () => {
  const { cartItems, addToCart, removeFromCart } = useCart();

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const columns = [
    {
      title: 'Image',
      dataIndex: 'imageName',
      render: (text: string) => (
        <Image width={60} src={`${APP_ENV.IMAGES_200_URL}${text}`} />
      ),
    },
    {
      title: 'Product',
      dataIndex: 'name',
    },
    {
      title: 'Category',
      dataIndex: 'categoryName',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      render: (price: number) => `₴${price}`,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      //@ts-ignore
      render: (_, item) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button onClick={() => addToCart({ productVariantId: item.productVariantId, quantity: -1 })}>−</Button>
          <span>{item.quantity}</span>
          <Button onClick={() => addToCart({ productVariantId: item.productVariantId, quantity: 1 })}>+</Button>
        </div>
      ),
    },
    {
      title: 'Total',
      //@ts-ignore
      render: (_, item) => `₴${item.price * item.quantity}`,
    },
    {
      title: 'Actions',
      //@ts-ignore
      render: (_, item) => (
        <Button danger onClick={() => removeFromCart(item.productVariantId)}>
          Remove
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>Your Cart</Title>
      <Table
        dataSource={cartItems}
        columns={columns}
        rowKey="productVariantId"
        pagination={false}
      />
      <div style={{ textAlign: 'right', marginTop: 20 }}>
        <Title level={4}>Total: ₴{total.toFixed(2)}</Title>
      </div>
    </div>
  );
};

export default CartPage;
