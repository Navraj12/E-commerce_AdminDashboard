import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import { Category, Coupon, DashboardStats, InititalState, OrderData, OrderStatus, Product, SingleOrder, User } from '../types/data'
import { Status } from '../types/status'

import { AppDispatch } from './store'
import { APIAuthenticated, BASE_URL } from '../http'

export function productImageUrl(fileName?: string | null){
    if(!fileName) return ''
    if(fileName.startsWith('http')) return fileName
    return `${BASE_URL}uploads/${fileName}`
}

export interface AddProduct{
    productName : string,
    productDescription : string,
    productPrice : number,
    productTotalStockQty : number,
    image : File | null,
    categoryId : string,
    isFeatured? : boolean,
    originalPrice? : number | null
}


const initialState:InititalState = {
    orders : [],
    products : [],
    users : [],
    categories : [],
    singleOrder: [],
   status : Status.LOADING,
   singleProduct : null,
   coupons : [],
   dashboardStats : null
}

interface DeleteProduct{
    productId : string
}
interface DeleteUser{
    userId : string
}
interface DeleteOrder{
    orderId : string
}
interface DeleteCategory{
    categoryId : string
}
interface DeleteCoupon{
    couponId : string
}

const dataSlice = createSlice({
    name : 'data',
    initialState,
    reducers:{
        setStatus(state:InititalState,action:PayloadAction<Status>){
            state.status = action.payload
        },
        setProduct(state:InititalState,action:PayloadAction<Product[]>){
            state.products = action.payload
        },
        setOrders(state:InititalState,action:PayloadAction<OrderData[]>){
            state.orders = action.payload
        },
        setCategories(state:InititalState,action:PayloadAction<Category[]>){
            state.categories = action.payload
        },
        setUsers(state:InititalState,action:PayloadAction<User[]>){
            state.users = action.payload
        },
        setSingleProduct(state:InititalState,action:PayloadAction<Product>){
            state.singleProduct = action.payload
        },
        setDeleteProduct(state:InititalState,action:PayloadAction<DeleteProduct>){
            const index = state.products.findIndex(item=>item.id === action.payload.productId)
            if(index !== -1) state.products.splice(index,1)
        },
        setDeleteUser(state:InititalState,action:PayloadAction<DeleteUser>){
            const index = state.users.findIndex(item=>item.id === action.payload.userId)
            if(index !== -1) state.users.splice(index,1)
        },
        setDeleteOrder(state:InititalState,action:PayloadAction<DeleteOrder>){
            const index = state.orders.findIndex(item=>item.id === action.payload.orderId)
            if(index !== -1) state.orders.splice(index,1)
        },
        setDeleteCategory(state:InititalState,action:PayloadAction<DeleteCategory>){
            const index = state.categories.findIndex(item=>item.id === action.payload.categoryId)
            if(index !== -1) state.categories.splice(index,1)
        },
        setSingleOrder(state:InititalState,action:PayloadAction<SingleOrder[]>){
            state.singleOrder = action.payload
        },
        updateOrderStatusById(state:InititalState,action:PayloadAction<{orderId : string, status : OrderStatus}>){
           const index =  state.singleOrder.findIndex(order=>order.id===action.payload.orderId)
            if(index !== -1){
                state.singleOrder[index].Order.orderStatus = action.payload.status
            }
        },
        setUserRole(state:InititalState,action:PayloadAction<{userId:string,role:string}>){
            const index = state.users.findIndex(u=>u.id===action.payload.userId)
            if(index !== -1) state.users[index].role = action.payload.role
        },
        setCoupons(state:InititalState,action:PayloadAction<Coupon[]>){
            state.coupons = action.payload
        },
        addCouponToState(state:InititalState,action:PayloadAction<Coupon>){
            state.coupons.push(action.payload)
        },
        setDeleteCoupon(state:InititalState,action:PayloadAction<DeleteCoupon>){
            const index = state.coupons.findIndex(c=>c.id===action.payload.couponId)
            if(index !== -1) state.coupons.splice(index,1)
        },
        setDashboardStats(state:InititalState,action:PayloadAction<DashboardStats>){
            state.dashboardStats = action.payload
        }
    }
})

export const {setOrders,setCategories,setSingleOrder,updateOrderStatusById, setDeleteCategory,setProduct,setStatus,setUsers,setSingleProduct,setDeleteProduct,setDeleteUser,setDeleteOrder,setUserRole,setCoupons,addCouponToState,setDeleteCoupon,setDashboardStats} = dataSlice.actions
export default dataSlice.reducer


export function fetchProducts(){
    return async function fetchProductsThunk(dispatch : AppDispatch ){
        dispatch(setStatus(Status.LOADING))
        try{
            const response = await APIAuthenticated.get('admin/product')
            if(response.status === 200){
                const {data} = response.data
                dispatch(setStatus(Status.SUCCESS))
                dispatch(setProduct(data))
            }else{
                dispatch(setStatus(Status.ERROR))
            }
        }catch(error){
            dispatch(setStatus(Status.ERROR))
        }
    }
 }

 export function fetchOrders(){
    return async function fetchOrdersThunk(dispatch : AppDispatch){
        dispatch(setStatus(Status.LOADING))
        try {
            const response = await APIAuthenticated.get('/order')
            if(response.status === 200){
                dispatch(setStatus(Status.SUCCESS))
                dispatch(setOrders(response.data.data))

            }else{
                dispatch(setStatus(Status.ERROR))
            }
        } catch (error) {
            dispatch(setStatus(Status.ERROR))
        }
    }
}

export function fetchUsers(){
    return async function fetchUsersThunk(dispatch : AppDispatch){
        dispatch(setStatus(Status.LOADING))
        try {
            const response = await APIAuthenticated.get('/users')
            if(response.status === 200){
                dispatch(setStatus(Status.SUCCESS))
                dispatch(setUsers(response.data.data))

            }else{
                dispatch(setStatus(Status.ERROR))
            }
        } catch (error) {
            dispatch(setStatus(Status.ERROR))
        }
    }
}

export function updateUserRole(id:string,role:string){
    return async function updateUserRoleThunk(dispatch : AppDispatch){
        dispatch(setStatus(Status.LOADING))
        try {
            const response = await APIAuthenticated.patch(`/users/${id}/role`,{role})
            if(response.status === 200){
                dispatch(setStatus(Status.SUCCESS))
                dispatch(setUserRole({userId:id,role}))
            }else{
                dispatch(setStatus(Status.ERROR))
            }
        } catch (error) {
            dispatch(setStatus(Status.ERROR))
        }
    }
}


function buildProductFormData(data:AddProduct){
    const formData = new FormData()
    formData.append('productName',data.productName)
    formData.append('productDescription',data.productDescription)
    formData.append('productPrice',String(data.productPrice))
    formData.append('productTotalStockQty',String(data.productTotalStockQty))
    formData.append('categoryId',data.categoryId)
    formData.append('isFeatured', String(Boolean(data.isFeatured)))
    if(data.originalPrice !== undefined && data.originalPrice !== null){
        formData.append('originalPrice', String(data.originalPrice))
    }
    if(data.image){
        formData.append('productImageUrl',data.image)
    }
    return formData
}

export function addProduct(data:AddProduct){
    return async function addProductThunk(dispatch : AppDispatch){
        dispatch(setStatus(Status.LOADING))
        try {
            const response = await APIAuthenticated.post('/admin/product',buildProductFormData(data),{
                headers : {
                    "Content-Type" : "multipart/form-data"
                }
            })
            if(response.status === 200){
                dispatch(setStatus(Status.SUCCESS))
            }else{
                dispatch(setStatus(Status.ERROR))
            }
        } catch (error) {
            dispatch(setStatus(Status.ERROR))
        }
    }
}

export function updateProduct(id:string,data:AddProduct){
    return async function updateProductThunk(dispatch : AppDispatch){
        dispatch(setStatus(Status.LOADING))
        try {
            const response = await APIAuthenticated.patch(`/admin/product/${id}`,buildProductFormData(data),{
                headers : {
                    "Content-Type" : "multipart/form-data"
                }
            })
            if(response.status === 200){
                dispatch(setStatus(Status.SUCCESS))
            }else{
                dispatch(setStatus(Status.ERROR))
            }
        } catch (error) {
            dispatch(setStatus(Status.ERROR))
        }
    }
}

export function addCategory(data:{categoryName : string, categoryIcon? : string}){
    return async function addCategoryThunk(dispatch : AppDispatch){
        dispatch(setStatus(Status.LOADING))
        try {
            const response = await APIAuthenticated.post('/admin/category',data)
            if(response.status === 200){
                dispatch(setStatus(Status.SUCCESS))
                dispatch(fetchCaetgories() as any)
            }else{
                dispatch(setStatus(Status.ERROR))
            }
        } catch (error) {
            dispatch(setStatus(Status.ERROR))
        }
    }
}

export function fetchCaetgories(){
    return async function fetchCaetgoriesThunk(dispatch : AppDispatch ){
        dispatch(setStatus(Status.LOADING))
        try{
            const response = await APIAuthenticated.get('admin/category')
            if(response.status === 200){
                const {data} = response.data
                dispatch(setStatus(Status.SUCCESS))
                dispatch(setCategories(data))
            }else{
                dispatch(setStatus(Status.ERROR))
            }
        }catch(error){
            dispatch(setStatus(Status.ERROR))
        }
    }
 }
export function deleteProduct(id:string){
    return async function deleteProductThunk(dispatch : AppDispatch){
        dispatch(setStatus(Status.LOADING))
        try {
            const response = await APIAuthenticated.delete('/admin/product/' + id)
            if(response.status === 200){
                dispatch(setStatus(Status.SUCCESS))
                dispatch(setDeleteProduct({productId:id}))

            }else{
                dispatch(setStatus(Status.ERROR))
            }
        } catch (error) {
            dispatch(setStatus(Status.ERROR))
        }
    }
}
export function deleteUser(id:string){
    return async function deleteUserThunk(dispatch : AppDispatch){
        dispatch(setStatus(Status.LOADING))
        try {
            const response = await APIAuthenticated.delete('/users/' + id)
            if(response.status === 200){
                dispatch(setStatus(Status.SUCCESS))
                dispatch(setDeleteUser({userId:id}))


            }else{
                dispatch(setStatus(Status.ERROR))
            }
        } catch (error) {
            dispatch(setStatus(Status.ERROR))
        }
    }
}


export function deleteOrder(id:string){
    return async function deleteProductThunk(dispatch : AppDispatch){
        dispatch(setStatus(Status.LOADING))
        try {
            const response = await APIAuthenticated.delete('/order/admin/' + id)
            if(response.status === 200){
                dispatch(setStatus(Status.SUCCESS))
                dispatch(setDeleteOrder({orderId : id}))
            }else{
                dispatch(setStatus(Status.ERROR))
            }
        } catch (error) {
            dispatch(setStatus(Status.ERROR))
        }
    }
}
export function deleteCategory(id:string){
    return async function deleteProductThunk(dispatch : AppDispatch){
        dispatch(setStatus(Status.LOADING))
        try {
            const response = await APIAuthenticated.delete('/admin/category/' + id)
            if(response.status === 200){
                dispatch(setStatus(Status.SUCCESS))
                dispatch(setDeleteCategory({categoryId : id}))
            }else{
                dispatch(setStatus(Status.ERROR))
            }
        } catch (error) {
            dispatch(setStatus(Status.ERROR))
        }
    }
}


export function singleProduct(id:string){
    return async function singleProductThunk(dispatch : AppDispatch){
        dispatch(setStatus(Status.LOADING))
        try {
            const response = await APIAuthenticated.get('/admin/product/' + id)
            if(response.status === 200){
                dispatch(setStatus(Status.SUCCESS))
                const data = response.data.data
                dispatch(setSingleProduct(Array.isArray(data) ? data[0] : data))
            }else{
                dispatch(setStatus(Status.ERROR))
            }
        } catch (error) {
            dispatch(setStatus(Status.ERROR))
        }
    }
}

export function singleOrder(id:string){
    return async function singleOrderThunk(dispatch : AppDispatch){
        dispatch(setStatus(Status.LOADING))
        try {
            const response = await APIAuthenticated.get('/order/customer/' + id)
            if(response.status === 200){
                dispatch(setStatus(Status.SUCCESS))
                dispatch(setSingleOrder(response.data.data))
            }else{
                dispatch(setStatus(Status.ERROR))
            }
        } catch (error) {
            dispatch(setStatus(Status.ERROR))
        }
    }
}

export function handleOrderStatusById(status:OrderStatus,id:string){
    return async function handleOrderStatusThunk(dispatch : AppDispatch){
        dispatch(setStatus(Status.LOADING))
        try {
            const response = await APIAuthenticated.patch('/order/admin/' + id,{orderStatus : status})
            if(response.status === 200){
                dispatch(setStatus(Status.SUCCESS))
                dispatch(updateOrderStatusById({orderId:id,status}))
            }else{
                dispatch(setStatus(Status.ERROR))
            }
        } catch (error) {
            dispatch(setStatus(Status.ERROR))
        }
    }
}

export function fetchCoupons(){
    return async function fetchCouponsThunk(dispatch : AppDispatch){
        dispatch(setStatus(Status.LOADING))
        try {
            const response = await APIAuthenticated.get('/coupon')
            if(response.status === 200){
                dispatch(setStatus(Status.SUCCESS))
                dispatch(setCoupons(response.data.data))
            }else{
                dispatch(setStatus(Status.ERROR))
            }
        } catch (error) {
            dispatch(setStatus(Status.ERROR))
        }
    }
}

export function addCoupon(data:{code:string,discountPercent:number,expiryDate:string,active?:boolean}){
    return async function addCouponThunk(dispatch : AppDispatch){
        dispatch(setStatus(Status.LOADING))
        try {
            const response = await APIAuthenticated.post('/coupon',data)
            if(response.status === 200){
                dispatch(setStatus(Status.SUCCESS))
                dispatch(addCouponToState(response.data.data))
            }else{
                dispatch(setStatus(Status.ERROR))
            }
        } catch (error) {
            dispatch(setStatus(Status.ERROR))
        }
    }
}

export function deleteCoupon(id:string){
    return async function deleteCouponThunk(dispatch : AppDispatch){
        dispatch(setStatus(Status.LOADING))
        try {
            const response = await APIAuthenticated.delete('/coupon/' + id)
            if(response.status === 200){
                dispatch(setStatus(Status.SUCCESS))
                dispatch(setDeleteCoupon({couponId:id}))
            }else{
                dispatch(setStatus(Status.ERROR))
            }
        } catch (error) {
            dispatch(setStatus(Status.ERROR))
        }
    }
}

export function fetchDashboardStats(){
    return async function fetchDashboardStatsThunk(dispatch : AppDispatch){
        dispatch(setStatus(Status.LOADING))
        try {
            const response = await APIAuthenticated.get('/admin/dashboard-stats')
            if(response.status === 200){
                dispatch(setStatus(Status.SUCCESS))
                dispatch(setDashboardStats(response.data.data))
            }else{
                dispatch(setStatus(Status.ERROR))
            }
        } catch (error) {
            dispatch(setStatus(Status.ERROR))
        }
    }
}
