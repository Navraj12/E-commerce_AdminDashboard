import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addCoupon, deleteCoupon, fetchCoupons } from '../store/dataSlice';

interface CouponForm {
  code: string;
  discountPercent: number;
  expiryDate: string;
  active: boolean;
}

const emptyForm: CouponForm = {
  code: '',
  discountPercent: 0,
  expiryDate: '',
  active: true,
};

const Coupons = () => {
  const dispatch = useAppDispatch();
  const { coupons } = useAppSelector((state) => state.datas);
  const [form, setForm] = useState<CouponForm>(emptyForm);

  useEffect(() => {
    dispatch(fetchCoupons());
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await dispatch(
      addCoupon({
        code: form.code,
        discountPercent: Number(form.discountPercent),
        expiryDate: form.expiryDate,
        active: form.active,
      })
    );
    setForm(emptyForm);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this coupon?')) {
      dispatch(deleteCoupon(id));
    }
  };

  return (
    <>
      <Breadcrumb pageName="Coupons" />

      <div className="mb-6 rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">
          Add Coupon
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <input
            required
            name="code"
            placeholder="Code"
            value={form.code}
            onChange={handleChange}
            className="rounded border border-stroke bg-transparent py-2 px-4 outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
          />
          <input
            required
            type="number"
            name="discountPercent"
            placeholder="Discount %"
            value={form.discountPercent}
            onChange={handleChange}
            className="rounded border border-stroke bg-transparent py-2 px-4 outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
          />
          <input
            required
            type="date"
            name="expiryDate"
            value={form.expiryDate}
            onChange={handleChange}
            className="rounded border border-stroke bg-transparent py-2 px-4 outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
          />
          <button
            type="submit"
            className="rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90"
          >
            Add Coupon
          </button>
        </form>
      </div>

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="py-4 px-4 font-medium">Code</th>
                <th className="py-4 px-4 font-medium">Discount</th>
                <th className="py-4 px-4 font-medium">Expiry</th>
                <th className="py-4 px-4 font-medium">Active</th>
                <th className="py-4 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id}>
                  <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark dark:text-white">
                    {c.code}
                  </td>
                  <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark dark:text-white">
                    {c.discountPercent}%
                  </td>
                  <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark dark:text-white">
                    {new Date(c.expiryDate).toLocaleDateString()}
                  </td>
                  <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark dark:text-white">
                    {c.active ? 'Yes' : 'No'}
                  </td>
                  <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark">
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-meta-1 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-black dark:text-white">
                    No coupons yet.
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

export default Coupons;
