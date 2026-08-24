import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  AddProduct,
  addProduct,
  deleteProduct,
  fetchCaetgories,
  fetchProducts,
  productImageUrl,
  updateProduct,
} from '../store/dataSlice';
import { Product } from '../types/data';

const emptyForm: AddProduct = {
  productName: '',
  productDescription: '',
  productPrice: 0,
  productTotalStockQty: 0,
  image: null,
  categoryId: '',
  isFeatured: false,
  originalPrice: null,
};

const Products = () => {
  const dispatch = useAppDispatch();
  const { products, categories } = useAppSelector((state) => state.datas);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AddProduct>(emptyForm);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCaetgories());
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, files, checked, type } = e.target as HTMLInputElement;
    setForm({
      ...form,
      [name]:
        name === 'image'
          ? files?.[0] ?? null
          : type === 'checkbox'
          ? checked
          : value,
    });
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditingId(p.id ?? null);
    setForm({
      productName: p.productName,
      productDescription: p.productDescription,
      productPrice: p.productPrice,
      productTotalStockQty: p.productTotalStockQty,
      image: null,
      categoryId: p.categoryId,
      isFeatured: Boolean(p.isFeatured),
      originalPrice: p.originalPrice ?? null,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      form.originalPrice !== null &&
      form.originalPrice !== undefined &&
      Number(form.originalPrice) > 0 &&
      Number(form.originalPrice) <= Number(form.productPrice)
    ) {
      alert('Original price must be greater than the current price');
      return;
    }
    const result = editingId
      ? await dispatch(updateProduct(editingId, form))
      : await dispatch(addProduct(form));
    if (!result?.success) {
      alert(result?.message ?? 'Something went wrong. Please try again.');
      return;
    }
    setShowForm(false);
    setForm(emptyForm);
    setEditingId(null);
    dispatch(fetchProducts());
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (confirm('Delete this product?')) {
      const result = await dispatch(deleteProduct(id));
      if (!result?.success) {
        alert(result?.message ?? 'Failed to delete product. Please try again.');
      }
    }
  };

  return (
    <>
      <Breadcrumb pageName="Products" />

      <div className="mb-4 flex justify-end">
        <button
          onClick={openCreate}
          className="rounded bg-primary py-2 px-4 font-medium text-white hover:bg-opacity-90"
        >
          + Add Product
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">
            {editingId ? 'Edit Product' : 'Add Product'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              required
              name="productName"
              placeholder="Product name"
              value={form.productName}
              onChange={handleChange}
              className="rounded border border-stroke bg-transparent py-2 px-4 outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
            />
            <select
              required
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              className="rounded border border-stroke bg-transparent py-2 px-4 outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.categoryName}
                </option>
              ))}
            </select>
            <input
              required
              type="number"
              name="productPrice"
              placeholder="Price"
              value={form.productPrice}
              onChange={handleChange}
              className="rounded border border-stroke bg-transparent py-2 px-4 outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
            />
            <input
              type="number"
              name="originalPrice"
              placeholder="Original price (optional, for discount)"
              value={form.originalPrice ?? ''}
              onChange={handleChange}
              className="rounded border border-stroke bg-transparent py-2 px-4 outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
            />
            <input
              required
              type="number"
              name="productTotalStockQty"
              placeholder="Stock quantity"
              value={form.productTotalStockQty}
              onChange={handleChange}
              className="rounded border border-stroke bg-transparent py-2 px-4 outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
            />
            <textarea
              required
              name="productDescription"
              placeholder="Description"
              value={form.productDescription}
              onChange={handleChange}
              className="col-span-1 rounded border border-stroke bg-transparent py-2 px-4 outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white md:col-span-2"
              rows={3}
            />
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="col-span-1 text-black dark:text-white md:col-span-2"
            />
            <label className="col-span-1 flex items-center gap-2 text-sm font-medium text-black dark:text-white md:col-span-2">
              <input
                type="checkbox"
                name="isFeatured"
                checked={!!form.isFeatured}
                onChange={handleChange}
                className="h-4 w-4 rounded border-stroke"
              />
              Mark as Top Pick (Featured)
            </label>
            <div className="col-span-1 flex gap-3 md:col-span-2">
              <button
                type="submit"
                className="rounded bg-primary py-2 px-6 font-medium text-white hover:bg-opacity-90"
              >
                {editingId ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded border border-stroke py-2 px-6 font-medium text-black dark:border-strokedark dark:text-white"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="py-4 px-4 font-medium">Image</th>
                <th className="py-4 px-4 font-medium">Name</th>
                <th className="py-4 px-4 font-medium">Category</th>
                <th className="py-4 px-4 font-medium">Price</th>
                <th className="py-4 px-4 font-medium">Stock</th>
                <th className="py-4 px-4 font-medium">Top Pick</th>
                <th className="py-4 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark">
                    <img
                      src={productImageUrl(p.productImageUrl)}
                      alt={p.productName}
                      className="h-12 w-12 rounded object-cover"
                    />
                  </td>
                  <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark dark:text-white">
                    {p.productName}
                  </td>
                  <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark dark:text-white">
                    {p.Category?.categoryName ?? '-'}
                  </td>
                  <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark dark:text-white">
                    Rs. {p.productPrice}
                  </td>
                  <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark dark:text-white">
                    {p.productTotalStockQty}
                  </td>
                  <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark dark:text-white">
                    {p.isFeatured ? (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        Featured
                      </span>
                    ) : (
                      <span className="text-xs text-bodydark2">-</span>
                    )}
                  </td>
                  <td className="border-b border-[#eee] py-3 px-4 dark:border-strokedark">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => openEdit(p)}
                        className="text-primary hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-meta-1 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-black dark:text-white">
                    No products yet.
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

export default Products;
