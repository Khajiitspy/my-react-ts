import { useParams, useNavigate } from "react-router-dom";
import {
    Upload,
    Button,
    Form,
    Input,
    message,
    Popconfirm,
    Spin, type FormProps,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload";
import type { RcFile } from "antd/es/upload/interface";
import {
    useGetCategoryByIdQuery,
    useEditCategoryMutation,
    useDeleteCategoryMutation,
} from "../../../Services/apiCategory";
import { APP_ENV } from "../../../env";
import type {ICategoryEdit} from "../../../Services/types.ts";

interface CategoryFormValues {
    name: string;
    image: UploadFile[];
}

const EditCategoryPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const categoryId = Number(id);

    const { data: category, isLoading } = useGetCategoryByIdQuery(categoryId);
    console.log("Category:", category);
    const [editCategory] = useEditCategoryMutation();
    const [deleteCategory] = useDeleteCategoryMutation();
    

    const normFile = (e: any) => (Array.isArray(e) ? e : e?.fileList);

    const onFinish: FormProps<CategoryFormValues>["onFinish"] = async (values) => {
        const file = values.image?.[0]?.originFileObj as RcFile | undefined;

        console.log("Selected file:", file);


        if (!(file instanceof File)) {
            message.error("Будь ласка, виберіть зображення.");
            return;
        }

        const payload: ICategoryEdit = {
            id: categoryId,
            name: values.name,
            image: file,
        };

        try {
            await editCategory(payload).unwrap();
            message.success("Категорію оновлено успішно!");
            navigate("/categories");
        } catch (err) {
            console.error("Update failed:", err);
            message.error("Не вдалося оновити категорію.");
        }
    };

    const handleDelete = async () => {
        try {
            await deleteCategory(categoryId).unwrap();
            message.success("Категорію видалено.");
            navigate("/categories");
        } catch (err) {
            console.error("Delete failed:", err);
            message.error("Не вдалося видалити категорію.");
        }
    };

    if (isLoading) return <Spin />;

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
            <h1 className="text-xl mb-4">Редагувати категорію</h1>

            <Form<CategoryFormValues>
                layout="horizontal"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                onFinish={onFinish}
                initialValues={{
                    name: category?.name,
                    image: [],
                }}
            >

                <Form.Item
                    name="name"
                    label="Назва"
                    rules={[{ required: true, message: "Вкажіть назву категорії" }]}
                >
                    <Input />
                </Form.Item>

                {category?.image && (
                    <Form.Item label="Поточне зображення">
                        <div className="h-[100px] w-[100px] overflow-hidden rounded-md border">
                            <img
                                src={`${APP_ENV.IMAGES_200_URL}${category?.image}`}
                                alt="Current"
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </Form.Item>
                )}

                <Form.Item
                    name="image"
                    label="Нове зображення"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
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
                    <div className="flex justify-between">
                        <Button type="primary" htmlType="submit">
                            Зберегти
                        </Button>
                        <Popconfirm
                            title="Видалити категорію?"
                            onConfirm={handleDelete}
                            okText="Так"
                            cancelText="Ні"
                        >
                            <Button danger>Видалити</Button>
                        </Popconfirm>
                    </div>
                </Form.Item>
            </Form>
        </div>
    );
};

export default EditCategoryPage;
