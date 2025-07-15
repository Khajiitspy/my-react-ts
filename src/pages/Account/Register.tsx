import {useNavigate} from "react-router";
import {Button, Form, type FormProps, Input, message} from "antd";
import type {IRegister, ServerError} from "../../Services/types.ts";
import {useFormServerErrors} from "../../Utilities/useFormServerErrors.ts";
import LoadingOverlay from "../../components/ui/loading/LoadingOverlay.tsx";
import ImageUploadFormItem from "../../components/ui/form/ImageUploadFormItem.tsx";
import {loginSuccess} from "../../Store/authSlice.ts";
import {useDispatch} from "react-redux";
import {useGoogleRegisterMutation, useRegisterMutation} from "../../Services/apiAccount.ts";
import {useAddToCartMutation} from "../../Services/apiCart.ts";
import {GoogleLogin} from "@react-oauth/google";

const RegistrationPage: React.FC = () => {

    const navigate = useNavigate();

    const [register, {isLoading}] = useRegisterMutation();
    const [googleRegister] = useGoogleRegisterMutation();
    const [addToCart] = useAddToCartMutation();

    const [form] = Form.useForm<IRegister>();
    const setServerErrors = useFormServerErrors(form);

    const dispatch = useDispatch();

    const onFinish: FormProps<IRegister>['onFinish'] = async (values) => {
        try {
            const result = await register(values).unwrap();
            dispatch(loginSuccess(result.token));
            //@ts-ignore
            cartItems.forEach(item => {
                addToCart({
                    productVariantId: item.productVariantId,
                    quantity: item.quantity
                })
            });
            localStorage.removeItem('cart');
            navigate('/');
        } catch (error) {
            const serverError = error as ServerError;

            if (serverError?.status === 400 && serverError?.data?.errors) {
                setServerErrors(serverError.data.errors);
            } else {
                message.error("Сталася помилка при створенні акаунта");
            }
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-800 animate-fade-in">
                {isLoading && <LoadingOverlay />}

                <h2 className="text-2xl font-semibold text-center text-orange-500 mb-6">Реєстрація</h2>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    className="space-y-4"
                >
                    <Form.Item<IRegister>
                        label={<span className="text-gray-700 dark:text-white font-medium">Email</span>}
                        name="email"
                        rules={[{ required: true, message: 'Вкажіть email' }]}
                    >
                        <Input
                            className="rounded-lg py-2 px-4 border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-orange-400 transition"
                        />
                    </Form.Item>

                    <Form.Item<IRegister>
                        label={<span className="text-gray-700 dark:text-white font-medium">Ім'я</span>}
                        name="firstName"
                        rules={[{ required: true, message: 'Вкажіть email' }]}
                    >
                        <Input
                            className="rounded-lg py-2 px-4 border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-orange-400 transition"
                        />
                    </Form.Item>

                    <Form.Item<IRegister>
                        label={<span className="text-gray-700 dark:text-white font-medium">Прізвище</span>}
                        name="lastName"
                        rules={[{ required: true, message: 'Вкажіть email' }]}
                    >
                        <Input
                            className="rounded-lg py-2 px-4 border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-orange-400 transition"
                        />
                    </Form.Item>

                    <Form.Item<IRegister>
                        label={<span className="text-gray-700 dark:text-white font-medium">Пароль</span>}
                        name="password"
                        rules={[{ required: true, message: 'Вкажіть пароль' }]}
                    >
                        <Input.Password
                            className="rounded-lg py-2 px-4 border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-orange-400 transition"
                        />
                    </Form.Item>

                    <ImageUploadFormItem name="imageFile" label="Фоточка" />

                    <Form.Item>
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition"
                            >
                                Увійти
                            </Button>

                            <div className="w-full sm:w-auto">
                                <GoogleLogin
                                    onSuccess={async (credentialResponse) => {
                                        const { credential: id_token } = credentialResponse;

                                        if (!id_token) {
                                            console.error('No ID token received');
                                            return;
                                        }

                                        try {
                                            const { token } = await googleRegister({ token: id_token }).unwrap();
                                            dispatch(loginSuccess(token));
                                            navigate('/');
                                        } catch (err) {
                                            console.error("Google registration failed:", err);
                                            message.error("Реєстрація через Google не вдалася");
                                        }
                                    }}
                                    onError={() => {
                                        message.error("Google login failed");
                                    }}
                                    size="medium"
                                    theme="outline"
                                    width="100%" // Responsive
                                />
                            </div>
                        </div>
                    </Form.Item>

                </Form>
            </div>
        </div>

    );
}

export default RegistrationPage;
