import { useNavigate } from 'react-router-dom';
import {Button, Form, type FormProps, Input, message} from 'antd';
import {type ILoginRequest, useLoginMutation} from "../../Services/apiAccount.ts";
import {loginSuccess} from "../../Store/authSlice.ts";
import {useAppDispatch} from "../../Store";
import { useGoogleLoginMutation } from '../../Services/apiAccount.ts';
import {GoogleLogin, useGoogleLogin} from '@react-oauth/google';

const LoginPage: React.FC = () => {
    const [login, { isLoading }] = useLoginMutation();
    const [googleLogin] = useGoogleLoginMutation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const onFinish: FormProps<ILoginRequest>["onFinish"] = async (values) => {
        try {
            const response = await login(values).unwrap();
            //console.log(response);
            dispatch(loginSuccess(response.token));
            navigate('/admin/home');
        } catch (err) {
            console.error("Login failed:", err);
            alert("Login failed");
        }
    };

    const loginUseGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const { access_token } = tokenResponse;
                const { token } = await googleLogin({ token: access_token }).unwrap();

                dispatch(loginSuccess(token));
                navigate('/admin/home');
            } catch (err) {
                console.error('Google login error:', err);
                alert('Google login failed');
            }
        },
    });
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-6 text-center">Admin Login</h2>
                <Form<ILoginRequest>
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true, message: "Enter your email" }]}
                    >
                        <Input type="email" placeholder="you@example.com" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[{ required: true, message: "Enter your password" }]}
                    >
                        <Input.Password placeholder="••••••••" />
                    </Form.Item>

                    {/*<button*/}
                    {/*    type="submit"*/}
                    {/*    className="bg-orange-500 hover:bg-orange-600 transition text-white font-semibold px-4 py-2 rounded w-full mt-4"*/}
                    {/*>*/}
                    {/*    {isLoading ? 'Logging in...' : 'Login'}*/}
                    {/*</button>*/}
                    
                    {/*<button*/}
                    {/*    onClick={(event) =>  {*/}
                    {/*        event.preventDefault();*/}
                    {/*        loginUseGoogle();*/}
                    {/*    }}*/}
                    {/*    className="bg-blue-500 hover:bg-blue-600 transition text-white font-semibold px-4 py-2 rounded w-full mt-4"*/}
                    {/*>*/}
                    {/*    {'Google'}*/}
                    {/*</button>*/}

                    <Form.Item>
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition"
                            >
                                {isLoading ? 'Logging in...' : 'Login'}
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
                                            const { token } = await googleLogin({ token: id_token }).unwrap();
                                            dispatch(loginSuccess(token));
                                            navigate('/');
                                        } catch (err) {
                                            console.error("Google login failed:", err);
                                            message.error("Login through Google failed!");
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
};

export default LoginPage;
