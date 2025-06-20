import { Upload, Button, Form, Input, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload";
import type { FormProps } from "antd";
import type { ICategoryCreate } from "../../../Services/types.ts";
import { useCreateCategoryMutation } from "../../../Services/apiCategory.ts";

interface CategoryFormValues {
    name: string;
    image: UploadFile[];
}

const CategoriesCreatePage: React.FC = () => {
    const [createCategory] = useCreateCategoryMutation();

    const normFile = (e: any) => {
        if (Array.isArray(e)) return e;
        return e?.fileList;
    };

    const onFinish: FormProps<CategoryFormValues>["onFinish"] = async (values) => {
        const file = values.image?.[0].originFileObj as UploadFile;
        console.log("Selected file:", file);


        if (!(file instanceof File)) {
            message.error("Будь ласка, виберіть зображення.");
            return;
        }

        const payload: ICategoryCreate = {
            name: values.name,
            image: file,
        };

        try {
            await createCategory(payload).unwrap();
            message.success("Категорія створена успішно!");
        } catch (error) {
            console.error("Create error:", error);
            message.error("Не вдалося створити категорію.");
        }
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
            <div className="max-w-full overflow-x-auto">
                <h1>Додати категорію</h1>
                <Form<CategoryFormValues>
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    onFinish={onFinish}
                    layout="horizontal"
                >
                    <Form.Item
                        label="Назва"
                        name="name"
                        rules={[{ required: true, message: "Вкажіть назву категорії" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="image"
                        label="Зображення"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        rules={[{ required: true, message: "Виберіть зображення" }]}
                    >
                        <Upload
                            name="image"
                            listType="picture"
                            beforeUpload={() => false}
                            maxCount={1}
                        >
                            <Button icon={<UploadOutlined />}>Вибрати зображення</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item label={null}>
                        <Button type="primary" htmlType="submit">
                            Додати
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default CategoriesCreatePage;
