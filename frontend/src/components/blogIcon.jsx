import { written } from "../API/API";
import { useNavigate } from "react-router-dom";
function BlogIcon({blog}) {
    
    const {deleteBlog, updateBlog} = written();
    const navigate = useNavigate();

    const handleDelete = async(id) => {
        await deleteBlog(id);
    }

    const handleUpdate = () => {
        navigate(`/update/${blog._id}`); // Navigate to update page
    };

    const handleShowBlog = () => {
        navigate(`/blog/${blog._id}`);
    };

    return (
        <>            
            <div 
                onClick={handleShowBlog}
                className="bg-yellow-800 text-white p-4 m-4 mt-10 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 w-1/2 mx-auto cursor-pointer"
            >
                <h1 className="text-lg font-bold">{blog.Title}</h1>
                <h3 className="text-sm">Click here to continue</h3>
                <div className="flex justify-end space-x-2">
                    <button 
                        className="bg-red-700 hover:bg-red-900 text-white font-bold py-2 px-4 rounded" 
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent div click when button is clicked
                            handleDelete(blog._id);
                        }}
                    >
                        Delete
                    </button>
                    <button 
                        className="bg-green-200 hover:bg-green-300 text-white font-bold py-2 px-4 rounded" 
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent div click when button is clicked
                            handleUpdate();
                        }}
                    >
                        Update
                    </button>
                </div>
            </div>
        </>
    );
}

export default BlogIcon;
