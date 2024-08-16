import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

import axiosInstance from '../../helpers/AxiosInstance';

const initialState = {
    subscriptionData: null,
};

// Async thunk for subscribing
export const subscribe = createAsyncThunk('/subscription/subscribe', async () => {
    try {
        toast.loading("Subscribing...", {
            position: 'top-center',
        });
        const response = await axiosInstance.post('/subscription/subscribe');
        toast.dismiss();
        toast.success(response.data.message);
        return response.data;
    } catch (error) {
        toast.dismiss();
        toast.error(error?.response?.data?.message || 'Subscription failed');
        throw error;
    }
});

// Async thunk for unsubscribing
export const unsubscribe = createAsyncThunk('/subscription/unsubscribe', async () => {
    try {
        toast.loading("Unsubscribing...", {
            position: 'top-center',
        });
        const response = await axiosInstance.post('/subscription/unsubscribe');
        toast.dismiss();
        toast.success(response.data.message);
        return response.data;
    } catch (error) {
        toast.dismiss();
        toast.error(error?.response?.data?.message || 'Unsubscription failed');
        throw error;
    }
});

// Subscription slice
const subscriptionSlice = createSlice({
    name: 'subscription',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(subscribe.fulfilled, (state, action) => {
                if (action.payload) {
                    state.subscriptionData = action.payload;
                }
            })
            .addCase(unsubscribe.fulfilled, (state, action) => {
                if (action.payload) {
                    state.subscriptionData = action.payload;
                }
            });
    },
});

export default subscriptionSlice.reducer;
