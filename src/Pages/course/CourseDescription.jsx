import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import HomeLayout from '../../layouts/HomeLayout';
import { fetchProgress } from '../../Redux/slices/CourseSlice'; // Import the thunk

function CourseDescription() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { role, isLoggedIn } = useSelector((state) => state.auth);
    const { courseData, progressData } = useSelector((state) => state.course); // Use the correct slice state

    const [progress, setProgress] = useState(null);

    useEffect(() => {
        if (isLoggedIn) {
            dispatch(fetchProgress(state._id))
                .unwrap()
                .then((data) => {
                    setProgress(data);
                })
                .catch((error) => {
                    console.error('Failed to fetch progress:', error);
                });
        }
    }, [dispatch, isLoggedIn, state._id]);

    const userHasAccess = isLoggedIn && (role === 'ADMIN' || role === 'USER');

    // Calculate progress percentage
    const percentageProgress = progress
        ? ((progress.completedLectures / state.numberOfLectures) * 100).toFixed(2)
        : 0;

    return (
        <HomeLayout>
            <div className="flex flex-col lg:flex-row lg:px-20 py-12">
                <div className="lg:w-1/2 w-full px-12 flex flex-col gap-7">
                    <img src={state.thumbnail?.secure_url} alt="thumbnail" className="rounded-xl w-full h-96" />
                    <p className="font-semibold lg:text-2xl text-xl text-yellow-400 capitalize">Course category: <span className="text-xl text-blue-500">{state.category}</span></p>
                    <p className="font-semibold lg:text-2xl text-xl text-yellow-400 capitalize">Instructor: <span className="text-xl text-blue-500">{state.createdBy}</span></p>
                    <p className="font-semibold lg:text-2xl text-xl text-yellow-400 capitalize">Number of lectures: <span className="text-xl text-blue-500">{state.numberOfLectures}</span></p>
                    <p className="font-semibold lg:text-2xl text-xl text-yellow-400 capitalize">Progress: <span className="text-xl text-blue-500">{percentageProgress}%</span></p>
                    {
                        userHasAccess ? (
                            <button className="btn btn-primary capitalize" onClick={() => navigate(`/course/${state.title}/${state._id}/lectures`, { state: state })}>Go to Lectures</button>
                        ) : (
                            <button className="btn btn-primary capitalize" onClick={() => navigate(`/login`, { state: { from: `/course/${state.title}/${state._id}/lectures` } })}>Log In</button>
                        )
                    }
                </div>
                <div className="lg:w-1/2 w-full px-12 py-12 flex flex-col gap-4">
                    <h1 className="font-bold text-yellow-500 lg:text-4xl text-xl capitalize">{state.title}</h1>
                    <p className="font-semibold lg:text-2xl text-xl text-amber-500 capitalize">Course Description:</p>
                    <p className="font-semibold lg:text-xl text-xs text-white normal-case tracking-wider">{state.description}</p>
                </div>
            </div>
        </HomeLayout>
    );
}

export default CourseDescription;
