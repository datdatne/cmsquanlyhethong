import api from './api';

const authService = {
    // Đăng nhập
    login: async (username, password) => {
        try {
            const response = await api.post('/auth/login', {
                username,
                password,// viet kieu neu key = value
            });
            // Lưu token vào localStorage
            //response.data chinh la cai tk LoginResponse tra ve (dto )
            if (response.data.token) {
                localStorage.setItem('token', response.data.token); // luu theo kieu key value
                localStorage.setItem('user', JSON.stringify(response.data));
            }

            return response.data;
        } catch (error) {
            throw error.response?.data || 'Đăng nhập thất bại';
        }
    },

    // Đăng xuất
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Lấy thông tin user hiện tại
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            return JSON.parse(userStr);
        }
        return null;
    },

    // Kiểm tra đã đăng nhập chưa
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },
};

export default authService;