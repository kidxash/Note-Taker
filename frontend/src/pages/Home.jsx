import { useEffect, useState } from "react";
import { written } from "../API/API";
import BlogIcon from "../components/blogIcon";
import { Link } from "react-router-dom";

function HomePage(){
    const {products, fetchBlogs, isLoggedIn, user} = written();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadBlogs = async () => {
            setLoading(true);
            try {
                await fetchBlogs();
            } catch (error) {
                console.log('Error loading blogs:', error);
            } finally {
                setLoading(false);
            }
        };
        loadBlogs();
    }, []);

    return(
        <div className="">
            <h1 className="text-center text-5xl font-bold mb-12 text-gray-800">
                Welcome To SafeNote
            </h1>
            {isLoggedIn && user?.username && (
                <p className="text-center text-xl text-gray-600 -mt-8 mb-8">Welcome back, <span className="font-semibold text-yellow-600">{user.username}</span>!</p>
            )}


            {!isLoggedIn ? (
                <div className="text-center mt-16">
                    <p className="text-xl text-gray-600 mb-4">Login to get started</p>
                    <Link
                        to="/login"
                        className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                        Login
                    </Link>
                </div>
            ) : loading ? (
                    <div className="text-center">
                        <p className="text-lg text-gray-600">Loading...</p>
                    </div>
                ) : products?.length === 0 ? (
                    <div className="text-center">
                        <p className="text-gray-600 mb-6">No blogs yet. Start writing!</p>
                        <Link
                            to="/create" 
                            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
                        >
                            Create Your First Blog
                        </Link>
                    </div>
                ) : (
                    <div>
                        {products.map((blog) => (
                            <BlogIcon key={blog._id} blog={blog} />
                        ))}
                    </div>
                )}
            </div>
    );
}

export default HomePage;

