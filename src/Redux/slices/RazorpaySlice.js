import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

import axiosInstance from '../../helpers/AxiosInstance'


const initialState = {
    key: "",
    subscription_id: "",
    allPayments: {},
    finalMonths: {},
    monthlySalesRecord: [],
    paystackAccessCode: "",
    verificationStatus: "", // To track verification status
    transactionDetails: {} // To store transaction details
};


export const getRazorpayKey = createAsyncThunk("/razorpay/getKey", async () => {
    try {
        const response = await axiosInstance.get('/payments/key');
        return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.message)
        throw error
    }
})

export const purchaseCourseBundle = createAsyncThunk("/purchaseCourse", async () => {
    try {
        const response = await axiosInstance.post('/payments/subscribe')
        return response.data
    } catch (error) {
        toast.error(error?.response?.data?.message)
        throw error
    }
})
export const verifyUserPayment = createAsyncThunk("/verifyPayment", async (data) => {
    try {
        toast.loading("Wait! verify payment...", {
            position: 'top-center'
        })
        const response = await axiosInstance.post('/payments/verify', {
            payment_id: data.payment_id,
            razorpay_signature: data.razorpay_signature,
            subscription_id: data.subscription_id
        })
        toast.dismiss();
        toast.success(response.data?.message)
        return response?.data
    } catch (error) {
        toast.dismiss()
        toast.error(error?.response?.data?.message)
        throw error
    }
})

export const getPaymentsRecord = createAsyncThunk("/paymentsRecord", async () => {
    try {
        toast.loading("Getting payments record", {
            position: 'top-center'
        })
        const response = await axiosInstance.get("/payments?count=100")
        if (response.status === 200) {
            toast.dismiss();
            toast.success(response.data.message);
            return response.data;
        } else {
            toast.dismiss();
            toast.error(response.data.message);
            throw new Error(response.data.message);
        }
    } catch (error) {
        toast.dismiss();
        toast.error(error?.response?.data?.message)
        throw error
    }
})
export const cancelSubscription = createAsyncThunk("/cancel/subscribtion", async () => {
    try {
        toast.loading("wait! Cancel subscribtion...", {
            position: 'top-center'
        })
        const response = await axiosInstance.post("/payments/unsubscribe")
        if (response.status === 200) {
            toast.dismiss();
            toast.success(response.data.message);
            return response.data;
        } else {
            toast.dismiss();
            toast.error(response.data.message);
            throw new Error(response.data.message);
        }
    } catch (error) {
        toast.dismiss();
        toast.error(error?.response?.data?.message)
        throw error
    }
})

export const initializePaystackTransaction = createAsyncThunk("/payments/paystack/initialize", async (transactionData) => {
    try {
        toast.loading("Initializing transaction...", {
            position: 'top-center'
        });
        const response = await axiosInstance.post('/payments/paystack/initialize', transactionData);
        toast.dismiss();
        toast.success("Transaction initialized successfully");
        return response.data;
    } catch (error) {
        toast.dismiss();
        toast.error(error?.response?.data?.message);
        throw error;
    }
});

export const verifyPaystackTransaction = createAsyncThunk("/paystack/verify", async (data) => {
    try {
        toast.loading("Verifying transaction...", {
            position: 'top-center'
        });
        const response = await axiosInstance.get(`/paystack/verify?reference=${data.reference}`);
        toast.dismiss();
        toast.success("Transaction verified successfully");
        return response.data;
    } catch (error) {
        toast.dismiss();
        toast.error(error?.response?.data?.message);
        throw error;
    }
});




const razorpaySlice = createSlice({
    name: "razorpay",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getRazorpayKey.fulfilled, (state, action) => {
            state.key = action?.payload?.key
        })
        builder.addCase(purchaseCourseBundle.fulfilled, (state, action) => {
            state.subscription_id = action?.payload?.subscription_id
        })
        builder.addCase(getPaymentsRecord.fulfilled, (state, action) => {
            state.allPayments = action?.payload?.allPayments
            state.finalMonths = action?.payload?.finalMonths
            state.monthlySalesRecord = action?.payload?.monthlySalesRecord
        })
        builder.addCase(initializePaystackTransaction.fulfilled, (state, action) => {
            // Store the Paystack `access_code` if needed
            state.paystackAccessCode = action?.payload?.data?.access_code;
        })
        builder.addCase(verifyPaystackTransaction.fulfilled, (state, action) => {
            const { status, amount, message } = action.payload;

            // Assuming action.payload contains verification details
            if (status === 'success') {
                state.verificationStatus = 'success';
                state.transactionDetails = {
                    amount,
                    message
                };
                toast.success("Payment verified successfully");
            } else {
                state.verificationStatus = 'failed';
                toast.error("Payment verification failed");
            }
        })
    }
})

export default razorpaySlice.reducer