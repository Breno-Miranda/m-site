class AuthService {
    constructor() {
        this.tokenKey = 'msoft_auth_token';
        this.userKey = 'msoft_user_data';
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!localStorage.getItem(this.tokenKey);
    }

    // Get current user
    getUser() {
        const userStr = localStorage.getItem(this.userKey);
        return userStr ? JSON.parse(userStr) : null;
    }

    // Login
    async login(email, password) {
        try {
            const response = await window.core.fetchAPI('/auth/login', 'POST', { email, password });

            if (response && response.success) {
                localStorage.setItem(this.tokenKey, response.token);
                localStorage.setItem(this.userKey, JSON.stringify(response.user));

                // Dispatch auth change event
                window.dispatchEvent(new CustomEvent('auth-change', { detail: { isAuthenticated: true, user: response.user } }));

                return response;
            } else {
                const errorMsg = response?.error || 'Falha no login';
                throw new Error(errorMsg);
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    // Register
    async register(name, email, password) {
        try {
            const response = await window.core.fetchAPI('/auth/register', 'POST', { name, email, password });
            return response;
        } catch (error) {
            console.error('Register error:', error);
            throw error;
        }
    }

    // Logout
    logout() {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);

        // Dispatch auth change event
        window.dispatchEvent(new CustomEvent('auth-change', { detail: { isAuthenticated: false, user: null } }));

        // Redirect to home
        window.core.navigate('/');
    }

    // Check role
    hasRole(role) {
        const user = this.getUser();
        return user && user.role === role;
    }
}

// Export instance
window.authService = new AuthService();
