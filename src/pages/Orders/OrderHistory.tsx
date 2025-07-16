import React from 'react';
import { useGetOrdersQuery } from '../../Services/apiOrders';
import { Card, Collapse, Spin, Typography, Table, Alert } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { OrderItemModel } from '../../Services/types.ts';

const { Panel } = Collapse;
const { Text } = Typography;

const OrderHistory: React.FC = () => {
  const { data: orders, isLoading, isError, error } = useGetOrdersQuery();
  console.log(orders);

  if (isLoading) {
    return <Spin tip="Loading orders..." />;
  }

  if (isError) {
    return <Alert message="Error loading orders" description={(error as any).message} type="error" showIcon />;
  }

  const renderOrderItemsTable = (items: OrderItemModel[]) => {
    const columns: ColumnsType<OrderItemModel> = [
      {
        title: 'Product',
        dataIndex: 'productVariantName',
        key: 'productVariantName',
      },
      {
        title: 'Quantity',
        dataIndex: 'count',
        key: 'count',
      },
      {
        title: 'Price (each)',
        dataIndex: 'priceBuy',
        key: 'priceBuy',
        render: (price: number) => `$${price.toFixed(2)}`,
      },
      {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
        render: (total: number) => `$${total.toFixed(2)}`,
      },
    ];

    return <Table dataSource={items} columns={columns} rowKey="id" pagination={false} />;
  };

  return (
    <Card title="Order History" style={{ margin: '20px' }}>
      <Collapse accordion>
        {orders?.map((ord) => (
          <Panel
            header={
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Text strong>Order #{ord.id}</Text>
                <Text type="secondary">{new Date(ord.createdAt).toLocaleDateString()}</Text>
              </div>
            }
            key={ord.id}
          >
            <Text type="secondary">Status: {ord.status} ༚ Purchased With: {ord.paymentType} ༚ City: {ord.city}</Text>
            <div style={{ marginTop: 12 }}>{renderOrderItemsTable(ord.items)}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <Text type="secondary">Contact Number: {ord.phoneNumber} ༚ Recipient Name: {ord.recipientName}</Text>
              <Text strong>Total: ${ord.total.toFixed(2)}</Text>
            </div>
          </Panel>
        ))}
      </Collapse>
    </Card>
  );
};

export default OrderHistory;
