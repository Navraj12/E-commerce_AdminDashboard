import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { deleteOrder, fetchOrders } from '../store/dataSlice';

const statusColor: Record<string, string> = {
  pending: 'bg-warning text-warning',
  delivered: 'bg-success text-success',
  ontheway: 'bg-primary text-primary',
  preparation: 'bg-secondary text-secondary',
  cancelled: 'bg-danger text-danger',
};

const Orders = () => {
  const dispatch = useAppDispatch();
  const { orders } = useAppSelector((state) => state.datas);

  useEffect(() => {
    dispatch(fetchOrders());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Delete this order?')) {
      dispatch(deleteOrder(id));
    }
  };

  return (
    <>
      <Breadcrumb pageName="Orders" />

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="py-4 px-4 font-medium">Order Id</th>
                <th className="py-4 px-4 font-medium">Customer</th>
                <th className="py-4 px-4 font-medium">Total</th>
                <th className="py-4 px-4 font-medium">Payment</th>
                <th className="py-4 px-4 font-medium">Status</th>
                <th className="py-4 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark dark:text-white">
                    {order.id}
                  </td>
                  <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark dark:text-white">
                    {order.User?.username ?? '-'}
                  </td>
                  <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark dark:text-white">
                    Rs. {order.totalAmount}
                  </td>
                  <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark dark:text-white">
                    {order.Payment?.paymentMethod} / {order.Payment?.paymentStatus}
                  </td>
                  <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark">
                    <span
                      className={`inline-block rounded px-2.5 py-0.5 text-sm font-medium capitalize ${
                        statusColor[order.orderStatus] ?? ''
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark">
                    <div className="flex items-center gap-3">
                      <Link to={`/order/${order.id}`} className="text-primary hover:underline">
                        View
                      </Link>
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="text-meta-1 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-black dark:text-white">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Orders;
