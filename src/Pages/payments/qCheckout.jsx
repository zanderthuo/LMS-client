import { useEffect, useState } from 'react';
import { BsCurrencyRupee } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
// import { createCharge } from '../../redux/slices/PaystackSlice.js';
import HomeLayout from '../../layouts/HomeLayout';
import { createCharge } from '../../Redux/slices/SubscriptionSlice';

function Checkout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { state } = useLocation();
    const payment = useSelector((state) => state.payment);
    const userdata = useSelector((state) => state.auth?.data);

    const [amount, setAmount] = useState(50); // Default amount in kobo
    const [phoneNumber, setPhoneNumber] = useState('+254719808225'); // Default phone number

    const paymentDetails = {
        email: userdata?.email || '',
        amount, // Amount in kobo
        phoneNumber
    };

    async function handleCreateCharge() {
        try {
            const result = await dispatch(createCharge(paymentDetails)).unwrap();
            const { reference } = result;

            const paystack = window.PaystackPop.setup({
                key: 'your-paystack-public-key', // Replace with your actual Paystack public key
                email: userdata.email,
                amount: amount,
                currency: 'KES',
                reference,
                callback: async (response) => {
                    // Handle successful payment here
                    toast.success('Payment successful');
                    navigate(`/course/${state?.title}/checkout/success`, { state: state });
                },
                onClose: () => {
                    toast.info('Payment window closed');
                }
            });

            paystack.openIframe();
        } catch (error) {
            toast.error('Failed to initiate payment');
            navigate(`/course/${state?.title}/checkout/fail`, { state: state });
        }
    }

    useEffect(() => {
        if (!state) {
            navigate("/courses");
        } else {
            document.title = 'Checkout - Learning Management System';
        }
    }, [state, navigate]);

    return (
        <HomeLayout>
            <div className='lg:h-screen flex justify-center items-center mb-6 lg:mb-0'>
                <div className='lg:w-1/3 w-11/12 m-auto bg-white rounded-lg shadow-lg flex flex-col gap-4 justify-center items-center pb-4'>
                    <h1 className='bg-yellow-500 text-black font-bold text-3xl w-full text-center py-3 rounded-t-lg'>
                        Subscription Bundle
                    </h1>
                    <p className='px-4 text-xl tracking-wider text-slate-500 text-center'>
                        This purchase will allow you to access all available courses on our platform for{' '}
                        <span className='text-2xl text-blue-500 font-bold'>1 year duration.</span>
                    </p>
                    <p className='px-5 text-xl tracking-wider text-yellow-500 text-center font-semibold'>
                        All the existing and newly launched courses will be available
                    </p>
                    <p className='flex gap-1 items-center text-xl justify-center text-green-500'>
                        <BsCurrencyRupee /> <span className='text-3xl font-bold'>{amount / 100}</span> only
                    </p>
                    <p className='text-slate-500 text-xl font-semibold px-4 text-center'>
                        100% refund on cancellation within 14 days
                    </p>
                    <button className='btn btn-primary w-[90%]' onClick={handleCreateCharge}>
                        Buy Now
                    </button>
                </div>
            </div>
        </HomeLayout>
    );
}

export default Checkout;
