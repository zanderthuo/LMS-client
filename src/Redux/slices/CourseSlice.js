import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import axiosInstance from '../../helpers/AxiosInstance';

const initialState = {
    courseData: [],
    progressData: null,
    status: 'idle',
    error: null,
};

// Async thunk for getting all courses
export const getAllCourse = createAsyncThunk('/course/get', async () => {
    try {
        toast.loading("Loading course data...", {
            position: 'top-center',
        });
        const response = await axiosInstance.get('/course');
        toast.dismiss();
        toast.success(response.data.message);
        return response.data?.courses;
    } catch (error) {
        toast.dismiss();
        toast.error(error?.response?.statusText || 'Failed to load courses');
        throw error;
    }
});

// Async thunk for creating a course
export const createCourse = createAsyncThunk('/course/create', async (data) => {
    try {
        toast.loading("Creating course...", {
            position: 'top-center',
        });
        const response = await axiosInstance.post('/course/newcourse', data);
        if (response.status === 201) {
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
        toast.error(error?.response?.data?.message || 'Course creation failed');
        throw error;
    }
});

// Async thunk for updating a course
export const updateCourse = createAsyncThunk('/course/update', async (data) => {
    try {
        toast.loading("Updating course...", {
            position: 'top-center',
        });
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("category", data.category);
        formData.append("createdBy", data.createdBy);
        if (data.thumbnail) {
            formData.append("thumbnail", data.thumbnail);
        }
        const response = await axiosInstance.put(`/course/${data.id}`, formData);
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
        toast.error(error?.response?.data?.message || 'Course update failed');
        throw error;
    }
});

// Async thunk for deleting a course
export const deleteCourse = createAsyncThunk('/course/delete', async (id) => {
    try {
        toast.loading("Deleting course...", {
            position: 'top-center',
        });
        const response = await axiosInstance.delete(`/course/${id}`);
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
        toast.error(error?.response?.data?.message || 'Course deletion failed');
        throw error;
    }
});

// Async thunk for updating progress
export const updateProgress = createAsyncThunk(
    '/course/updateProgress',
    async ({ courseId, lectureId, timestamp }) => {
        try {
            toast.loading("Updating progress...", {
                position: 'top-center',
            });
            const response = await axiosInstance.post('/course/progress', { courseId, lectureId, timestamp });
            toast.dismiss();
            toast.success(response.data.message);
            return response.data;
        } catch (error) {
            toast.dismiss();
            toast.error(error?.response?.data?.message || 'Progress update failed');
            throw error;
        }
    }
);

// Async thunk for fetching progress
export const fetchProgress = createAsyncThunk(
    '/course/fetchProgress',
    async (courseId) => {
        try {
            const response = await axiosInstance.get(`/course/progress/${courseId}`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch progress:', error);
            throw error;
        }
    }
);

const courseSlice = createSlice({
    name: 'courses',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllCourse.fulfilled, (state, action) => {
                if (action.payload) {
                    state.courseData = action.payload;
                }
            })
            .addCase(updateCourse.fulfilled, (state, action) => {
                if (action.payload) {
                    const index = state.courseData.findIndex(course => course._id === action.payload._id);
                    if (index > -1) {
                        state.courseData[index] = action.payload;
                    }
                }
            })
            .addCase(deleteCourse.fulfilled, (state, action) => {
                if (action.payload) {
                    state.courseData = state.courseData.filter(course => course._id !== action.payload._id);
                }
            })
            .addCase(updateProgress.fulfilled, (state, action) => {
                if (action.payload) {
                    state.progressData = action.payload;
                }
            })
            .addCase(fetchProgress.fulfilled, (state, action) => {
                if (action.payload) {
                    state.progressData = action.payload.progress;
                }
            });
    },
});

export default courseSlice.reducer;
