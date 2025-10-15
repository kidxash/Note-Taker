import { create } from 'zustand'

export const written = create((set) => ({



	products: [],
	setProducts: (products) => set({ products }),

	isLoggedIn: false,	
	user: null,
	setUser: (user) => set({ user }),

	

	createBlogs: async (newproduct) => {
		if (!newproduct.Title || !newproduct.Info) {
			return { success: false, message: "Please fill in everything" }
    }
    
    const res = await fetch("http://localhost:3001/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newproduct)
    });
    const data = await res.json();
    set((state) => ({ products: [...state.products, data.data] }));
    return { success: true, message: "Product created successfully" };
},
fetchBlogs: async () => {
    const res = await fetch("http://localhost:3001/");
		const data = await res.json();
        set({ products: data.data });
    },
    updateBlog: async (pid, updatedProduct) => {
		const res = await fetch(`http://localhost:3001/${pid}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(updatedProduct),
		});
		const data = await res.json();
		if (!data.success) return { success: false, message: data.message };

		set((state) => ({
			products: state.products.map((product) => (product._id === pid ? data.data : product)),
		}));

		return { success: true, message: data.message };
	},
	deleteBlog: async (pid) => {
		const res = await fetch(`http://localhost:3001/${pid}`, {
			method: "DELETE",
		});
		const data = await res.json();
		if (!data.success) return { success: false, message: data.message };

		set((state) => ({ products: state.products.filter((product) => product._id !== pid) }));
		return { success: true, message: data.message };
	},
}))
