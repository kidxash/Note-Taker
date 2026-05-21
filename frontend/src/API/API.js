import { create } from 'zustand'

export const written = create((set) => ({



	products: [],
	setProducts: (products) => set({ products }),

	isLoggedIn: false,	
	user: null,
	setUser: (user) => set({ user }),
	setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),

	logout: async () => {
		try {
			const res = await fetch('http://localhost:3001/api/logout', {
				method: 'POST',
				credentials: 'include'
			});
			const data = await res.json();
			
			if (data.success) {
				// Clear user state
				set({ user: null, isLoggedIn: false, products: [] });
				return { success: true, message: data.message };
			} else {
				return { success: false, message: data.message };
			}
		} catch (error) {
			console.error('Logout error:', error);
			// Clear state anyway on error
			set({ user: null, isLoggedIn: false, products: [] });
			return { success: false, message: 'Logout failed' };
		}
	},

	

	createBlogs: async (newproduct) => {
		if (!newproduct.Title || !newproduct.Info) {
			return { success: false, message: "Please fill in everything" }
    }
    
    const res = await fetch("http://localhost:3001/api/blogs", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify(newproduct)
    });
    const data = await res.json();
    set((state) => ({ products: [...state.products, data.data] }));
    return { success: true, message: "Product created successfully" };
},
fetchBlogs: async () => {
    try {
        const res = await fetch("http://localhost:3001/api/blogs", {
            credentials: 'include'
        });
        const data = await res.json();
        
        if (data.success) {
            set({ products: data.data || [] });
            return { success: true, data: data.data };
        } else {
            console.error('Failed to fetch blogs:', data.message);
            set({ products: [] });
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error('Error fetching blogs:', error);
        set({ products: [] });
        return { success: false, message: 'Failed to fetch blogs' };
    }
},
    updateBlog: async (pid, updatedProduct) => {
		const res = await fetch(`http://localhost:3001/api/blogs/${pid}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: 'include',
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
		const res = await fetch(`http://localhost:3001/api/blogs/${pid}`, {
			method: "DELETE",
			credentials: 'include'
		});
		const data = await res.json();
		if (!data.success) return { success: false, message: data.message };

		set((state) => ({ products: state.products.filter((product) => product._id !== pid) }));
		return { success: true, message: data.message };
	},
}))
