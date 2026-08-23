import { useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { deleteUser, fetchUsers, updateUserRole } from '../store/dataSlice';

const Users = () => {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.datas);

  useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Delete this user?')) {
      dispatch(deleteUser(id));
    }
  };

  const handleRoleToggle = (id: string, currentRole?: string) => {
    const nextRole = currentRole === 'admin' ? 'customer' : 'admin';
    dispatch(updateUserRole(id, nextRole));
  };

  return (
    <>
      <Breadcrumb pageName="Users" />

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="py-4 px-4 font-medium">Username</th>
                <th className="py-4 px-4 font-medium">Email</th>
                <th className="py-4 px-4 font-medium">Role</th>
                <th className="py-4 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark dark:text-white">
                    {user.username}
                  </td>
                  <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark dark:text-white">
                    {user.email}
                  </td>
                  <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark">
                    <span
                      className={`inline-block rounded px-2.5 py-0.5 text-sm font-medium capitalize ${
                        user.role === 'admin'
                          ? 'bg-primary bg-opacity-10 text-primary'
                          : 'bg-success bg-opacity-10 text-success'
                      }`}
                    >
                      {user.role ?? 'customer'}
                    </span>
                  </td>
                  <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleRoleToggle(user.id, user.role)}
                        className="text-primary hover:underline"
                      >
                        Make {user.role === 'admin' ? 'Customer' : 'Admin'}
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-meta-1 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-black dark:text-white">
                    No users yet.
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

export default Users;
