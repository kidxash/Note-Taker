import zustand from 'zustand'

const useUserStore = zustand((set) => ({
    isLoggedIn: false,
    user: null,
    setUser: (user) => set({ user, isLoggedIn: !!user }),
    logout: () => set({ user: null, isLoggedIn: false }),

    getUserData : async () => {
        try {
            const res = await fetch('http://localhost:3001/api/auth/user', {
                method: 'GET',
                credentials: 'include', // Include cookies for authentication
            });
            const data = await res.json();
            if (!data.success) return { success: false, message: data.message };

            set({ isLoggedIn: true, user: data.data });
            return { success: true, data: data.data };
        } catch (error) {
            console.error("Error fetching user data:", error);
            return { success: false, message: "Internal server error" };
        }
    },
    getAuthstatus: async () => {
        try {
            const res = await fetch('http://localhost:3001/api/auth/is-auth', {
                method: 'GET',
                credentials: 'include', // Include cookies for authentication
            });
            const data = await res.json();
            if (!data.success) return { success: false, message: data.message };

            set({ isLoggedIn: true, user: data.data });
            return { success: true };
        } catch (error) {
            console.error("Error fetching auth status:", error);
            return { success: false, message: "Internal server error" };
        }
    },

}));

export default useUserStore;
