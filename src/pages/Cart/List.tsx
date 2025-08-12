import { Table, Button, Image, Typography } from 'antd';
// import { useCart } from '../../context/CartContext';
import {APP_ENV} from "../../env";
import {useGetCartItemsQuery, useAddToCartMutation, useRemoveFromCartMutation} from "../../Services/apiCart.ts";
import type { CartItemDto } from '../../Services/types'; 
import {useAppDispatch, useAppSelector} from "../../Store";
import {createUpdateCartLocal} from "../../Store/cartSlice.ts";
import {message} from "antd";
import {useNavigate} from "react-router-dom";

const { Title } = Typography;

const CartPage = () => {
  // const { cartItems, addToCart, removeFromCart } = useCart();

  const navigate = useNavigate();
  const {user} = useAppSelector(state => state.auth);

  var cartItems = new Array<CartItemDto>();
  if(user){
    const {data} = useGetCartItemsQuery(); // Maybe you can combine these 2 lines.
    cartItems = data || [];
  } else{
    cartItems = localStorage.getItem('cart') ? JSON.parse(String(localStorage.getItem('cart'))).items : []
  }
  const dispatch = useAppDispatch();
  const [addToCart] = useAddToCartMutation();
  const [removeCartItem] = useRemoveFromCartMutation();
  const total = cartItems.reduce((acc, item) => acc + (item.quantity * item.price), 0);

  const handleAddToCart = async (product: any) => {
    if (!product) return;

    console.log(product);
    
    const newItem: CartItemDto = { // Most of those values are not needed since in this page, you can only add existing ones, so only the quantity changes.
        productVariantId: product.productVariantId,
        name: "",
        categoryId: 0,
        categoryName: "",
        quantity: product.quantity,
        price: 0,
        imageName: ""
    }
    
    if(!user){
        dispatch(createUpdateCartLocal(newItem));
    }
    else{
        try {
          await addToCart({
              productVariantId: product.productVariantId,
              quantity: product.quantity
          }).unwrap();

          console.log("reload?");
          navigate("/cart"); // does not work for user. addToCart not done?
          message.success("Added product to cart!");
        } catch (err) {
          console.error(err);
          console.log(product);
          message.error("Failed to add product to cart!");
        }
    }
    navigate("/cart");
  };

  const removeFromCart = async (product: any) => {
    if (!product) return;

    console.log(product);
    
    const newItem: CartItemDto = { // Most of those values are not needed since in this page, you can only add existing ones, so only the quantity changes.
        productVariantId: product.productVariantId,
        name: "",
        categoryId: 0,
        categoryName: "",
        quantity: product.quantity, // Expects a quantity greater than or equal to its current quantity
        price: 0,
        imageName: ""
    }
    
    if(!user){
        dispatch(createUpdateCartLocal(newItem));
    }
    else{
        try {
          await removeCartItem (product.productVariantId).unwrap();
          message.success("Removed product from cart!");
        } catch (err) {
          console.error(err);
          console.log(product);
          message.error("Failed to remove product from cart!");
        }
    }
    navigate("/cart");
  }

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
          <Button onClick={() => handleAddToCart({ productVariantId: item.productVariantId, quantity: -1 })}>−</Button>
          <span>{item.quantity}</span>
          <Button onClick={() => handleAddToCart({ productVariantId: item.productVariantId, quantity: 1 })}>+</Button>
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
        <Button danger onClick={() => removeFromCart({ productVariantId: item.productVariantId, quantity: item.quantity * -1 })}>
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
      <div className='flex justify-between'>
        <div style={{ textAlign: 'right', marginTop: 20 }}>
          <Title level={4}>Total: ₴{total.toFixed(2)}</Title>
        </div>
        <button
          onClick={() => navigate("/order/confirm")}
          className="bg-amber-500 hover:bg-amber-600 text-white text-lg font-semibold px-6 py-3 rounded shadow transition mt-5"
        >
          Order Cart Items
        </button>
      </div>
    </div>
  );
};

export default CartPage;
