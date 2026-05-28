import { written } from "../API/API";
import { useState } from "react";


function CreatePage(){
    const {createBlogs } = written();
    const [blog, newBlog] = useState({
        Title: "",
        Info: "",
    });




    const  Add = async () => {
      
        try {
            const res = await createBlogs(blog);
            console.log("Response:", res);
            
            if(res.success) {
                alert("Note has been created successfully!");
                // Clear the form after successful submission
                newBlog({ Title: "", Info: "" });
            } else {
                alert(res.message);
            }
        } catch (error) {
            console.error("Error in Add function:", error);
            alert("Error submitting blog: " + error.message);
        }
    }


return(<>
<div className="max-w-4xl mx-auto p-6 mt-20">
            <div className="bg-white shadow-lg rounded-lg p-8">
                <div className="mb-6 flex flex-col items-start">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6 text-left w-full h-5 flex justify-left">Create New Note</h1>
                    <textarea
                        type="text"
                        placeholder="Click Here To Create Title"
                        value={blog.Title}
                        onChange={(e) => newBlog({ ...blog, Title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-2 text-left mt-1.5"
                        style={{ maxWidth: "600px" }}
                    />
                </div>


        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex justify-left  ">Notes Content</h2>
        <div className="w-full flex justify-center">
        <textarea
            type="text"
            placeholder="Start typing here"
            value={blog.Info}
            onChange={(e) => newBlog({ ...blog, Info: e.target.value })}
            className="w-full h-76 max-w-3xl px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-left"
            style={{ resize: "vertical" }}
        />
        </div>
    </div>
</div>


<div className="flex justify-center mt-4">
    <button
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded shadow"
        onClick={() => { Add(); }}
    >
        Submit Note
    </button>
</div>

</>
)

}
export default CreatePage;