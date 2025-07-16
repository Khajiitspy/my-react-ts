// import type { Dispatch } from '@reduxjs/toolkit';
// import type {ILoginResponse} from "../Services/apiAccount.ts";
// import {loginSuccess} from "../Store/authSlice.ts";
// import type {RootState} from "../Store";
// import {apiCart} from "../Services/apiCart.ts";
// import {clearCart} from "../Store/cartSlice.ts";

// export const handleAuthQueryStarted = async (_arg : any,
//                                              {dispatch, getState, queryFulfilled}:
//                                              {
//                                                  dispatch: Dispatch;
//                                                  getState: () => RootState;
//                                                  queryFulfilled: Promise<{ data: ILoginResponse }>;
//                                              }) => {
//     try {
//         console.log('onQueryStarted');
//         const {data} = await queryFulfilled;
//         if (data && data.token) {
//             dispatch(loginSuccess(data.token));
//             const localCart = getState().cart.items;
//             console.log("Get Root State", localCart);
//             if (localCart.length > 0) {
//                 await dispatch(apiCart.endpoints.addToCartRange.initiate(localCart)).unwrap();
//             }
//             dispatch(clearCart());
//         }
//     } catch (error) {
//         console.error('Auth error:', error);
//     }
// };
