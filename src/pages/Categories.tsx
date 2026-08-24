import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addCategory, deleteCategory, fetchCaetgories } from '../store/dataSlice';

const Categories = () => {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.datas);
  const [categoryName, setCategoryName] = useState('');
  const [categoryIcon, setCategoryIcon] = useState('');

  useEffect(() => {
    dispatch(fetchCaetgories());
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCategoryName(e.target.value);
  };

  const handleIconChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCategoryIcon(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!categoryName.trim()) return;
    const result = await dispatch(
      addCategory({ categoryName, categoryIcon: categoryIcon.trim() || undefined })
    );
    if (!result?.success) {
      alert(result?.message ?? 'Failed to add category. Please try again.');
      return;
    }
    setCategoryName('');
    setCategoryIcon('');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this category?')) {
      const result = await dispatch(deleteCategory(id));
      if (!result?.success) {
        alert(result?.message ?? 'Failed to delete category. Please try again.');
      }
    }
  };

  return (
    <>
      <Breadcrumb pageName="Categories" />

      <div className="mb-6 rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">
          Add Category
        </h3>
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            required
            value={categoryName}
            onChange={handleChange}
            placeholder="Category name"
            className="flex-1 rounded border border-stroke bg-transparent py-2 px-4 outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
          />
          <input
            value={categoryIcon}
            onChange={handleIconChange}
            placeholder="Icon (emoji)"
            className="w-40 rounded border border-stroke bg-transparent py-2 px-4 outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
          />
          <button
            type="submit"
            className="rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90"
          >
            Add
          </button>
        </form>
      </div>

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="py-4 px-4 font-medium">Id</th>
                <th className="py-4 px-4 font-medium">Icon</th>
                <th className="py-4 px-4 font-medium">Category Name</th>
                <th className="py-4 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark dark:text-white">
                    {c.id}
                  </td>
                  <td className="border-b border-[#eee] py-3 px-4 text-lg dark:border-strokedark dark:text-white">
                    {c.categoryIcon || '🏷️'}
                  </td>
                  <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark dark:text-white">
                    {c.categoryName}
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
              {categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-black dark:text-white">
                    No categories yet.
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

export default Categories;
