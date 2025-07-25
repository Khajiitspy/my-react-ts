import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CartItemDto } from '../Services/types';

export  interface ICartState {
    items: CartItemDto[];
    totalPrice: number;
}

var initialState; // Could improve syntax, but when try to assign a new ICartState interface directly in a ternary or if/else statement, it just says ICartState is a type not value. Basically I don't know the syntax, and they made it inconsistently.
if(localStorage.getItem('cart')){
    initialState = JSON.parse(String(localStorage.getItem('cart')));
} else{
    const useless: ICartState = {
        items: new Array<CartItemDto>(),
        totalPrice: 0
    }; 
    initialState = useless;
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        createUpdateCartLocal: (state, action: PayloadAction<CartItemDto>) => {
            //@ts-ignore
            const idx = state.items.findIndex(i => i.productVariantId === action.payload.productVariantId);

            console.log(action.payload);
            if (idx !== -1) {
              state.items[idx].quantity += action.payload.quantity;
              if(state.items[idx].quantity < 1){
                  state.items.splice(idx, 1);
              }
            } else {
              state.items = [...state.items, action.payload];
              console.log(state.items);
            }
        },
    },
});

export const { createUpdateCartLocal } = cartSlice.actions;


export default cartSlice.reducer;
