import { useSelector, useDispatch } from 'react-redux';
import type {RootState} from '../Store';
import { useGetCartItemsQuery, useAddToCartMutation, useRemoveFromCartMutation } from '../Services/apiCart.ts';
import type { CartItemDto } from '../Services/types.ts';
import {addItem, removeItem} from '../Store/cartSlice';

export const useCart = (isAuth: boolean) => {
    const dispatch = useDispatch();
    const localCart = useSelector((state: RootState) => state.cart.items);

    const { data: remoteCart, ...remote } = useGetCartItemsQuery(undefined, { skip: !isAuth });
    const [addRemote] = useAddToCartMutation();
    const [removeRemote] = useRemoveFromCartMutation();

    const addToCart = async (item: CartItemDto) => {
        if (isAuth) {
            // console.log("Add remote cart", item);
            const existing = remoteCart?.find(i => i.productVariantId === item.productVariantId);
            const quantity = existing ? existing.quantity! + item.quantity! : 1;
            await addRemote({ ...item, quantity });
        } else {
            dispatch(addItem(item));
        }
    };

    const removeFromCart = async (productId: number) => {
        if (isAuth) {
            await removeRemote(productId);
        } else {
            dispatch(removeItem(productId));
        }
    };

    return {
        cart: isAuth ? remoteCart ?? [] : localCart,
        addToCart,
        removeFromCart,
        ...remote,
    };
};
