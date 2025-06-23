import { useLoginMutation } from '../../Services/apiAccount';
import { loginSuccess } from '../../Store/authSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Form, type FormProps, Input } from 'antd';

interface LoginFormValues {
    email: string;
    password: string;
}

const LoginPage: React.FC = () => {
    const [login, { isLoading }] = useLoginMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onFinish: FormProps<LoginFormValues>["onFinish"] = async (values) => {
        try {
            const response = await login({
                email: values.email,
                password: values.password,
            }).unwrap();
            console.log(response);
            dispatch(loginSuccess(response.token));
            navigate('/admin/home');
        } catch (err) {
            alert("Login failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-6 text-center">Admin Login</h2>
                <Form<LoginFormValues>
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

                    <button
                        type="submit"
                        className="bg-orange-500 hover:bg-orange-600 transition text-white font-semibold px-4 py-2 rounded w-full mt-4"
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </Form>
            </div>
        </div>
    );
};

export default LoginPage;
