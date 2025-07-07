import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useGetAllRolesQuery,
} from "../../../Services/apiUsers.ts";
import { Form, Input, Button, Checkbox, Typography, Upload, message } from "antd";
import type { UploadFile } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {APP_ENV} from "../../../env";
import type { UserEditRequest } from "../../../Services/types.ts";

const { Title } = Typography;

const EditUserPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: user, isLoading } = useGetUserByIdQuery(Number(id));
  const { data: allRoles = [] } = useGetAllRolesQuery();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        firstName: user.firstName,
        lastName: user.lastName,
      });
      setSelectedRoles(user.roles);
    }
  }, [user, form]);

  const onFinish = async (values: any) => {
    const file = fileList[0]?.originFileObj;

    const updateModel: UserEditRequest = {
      id: Number(id),
      firstName: values.firstName,
      lastName: values.lastName,
      roles: selectedRoles,
      image: file,
    };

    try {
      await updateUser(updateModel).unwrap();
      message.success("Користувача оновлено");
      navigate(`/admin/users${location.search}`);
    } catch (err) {
      console.error(err);
      console.log(updateModel);
      message.error("Помилка оновлення користувача");
    }
  };

  const handleRoleChange = (checkedValues: string[]) => {
    setSelectedRoles(checkedValues);
  };

  if (isLoading || !user) return <div>Завантаження...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Title level={3}>Редагування користувача</Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          firstName: "",
          lastName: "",
        }}
      >
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="border rounded-2xl p-4 h-full">
            {user.viewImage && (
              <div className="mb-4">
                <span className="block text-sm font-medium mb-1">Поточне зображення</span>
                <img
                  src={user.viewImage ? `${APP_ENV.IMAGES_100_URL}${user.viewImage}` : '/images/user/default.png'}
                  alt="User"
                  className="w-24 h-24 object-cover rounded-full"
                />
              </div>
            )}
            <Form.Item label="Нове зображення">
              <Upload
                beforeUpload={() => false}
                fileList={fileList}
                onChange={({ fileList }) => setFileList(fileList)}
                maxCount={1}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />}>Завантажити</Button>
              </Upload>
            </Form.Item>
          </div>

          <div className="border rounded-2xl p-4 h-full">
            <Form.Item
              label="Ім'я"
              name="firstName"
              rules={[{ required: true, message: "Введіть ім'я" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Прізвище"
              name="lastName"
              rules={[{ required: true, message: "Введіть прізвище" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item label="Ролі">
              <Checkbox.Group
                value={selectedRoles}
                onChange={handleRoleChange}
              >
                <div className="flex flex-wrap gap-4">
                  {allRoles.map((role) => (
                    <Checkbox key={role} value={role}>
                      {role}
                    </Checkbox>
                  ))}
                </div>
              </Checkbox.Group>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isUpdating}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Зберегти зміни
              </Button>
            </Form.Item>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default EditUserPage;
