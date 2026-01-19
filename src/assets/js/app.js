/**
 * MCredential - Main Application
 * Password Manager App Logic
 * Version: V0.10.10
 */

const App = (function () {
    // State
    let credentials = [];
    let masterPassword = null;
    let currentCredentialId = null;
    let currentFilter = 'all';
    let searchQuery = '';

    // Categories
    const categories = [
        { id: 'all', name: 'Todos', icon: 'bi-grid' },
        { id: 'trabalho', name: 'Trabalho', icon: 'bi-briefcase' },
        { id: 'pessoal', name: 'Pessoal', icon: 'bi-person' },
        { id: 'financeiro', name: 'Financeiro', icon: 'bi-bank' },
        { id: 'social', name: 'Redes Sociais', icon: 'bi-share' },
        { id: 'outros', name: 'Outros', icon: 'bi-folder' }
    ];

    // DOM Elements
    const elements = {
        loginScreen: null,
        appContainer: null,
        loginForm: null,
        masterPasswordInput: null,
        confirmPasswordInput: null,
        confirmPasswordGroup: null,
        loginButton: null,
        loginTitle: null,
        loginSubtitle: null,
        credentialsGrid: null,
        searchInput: null,
        categoryFilter: null,
        addButton: null,
        logoutButton: null,
        modal: null,
        modalTitle: null,
        credentialForm: null,
        toastContainer: null
    };

    /**
     * Initialize the application
     */
    function init() {
        cacheElements();
        bindEvents();
        checkInitialization();
    }

    /**
     * Cache DOM elements
     */
    function cacheElements() {
        elements.loginScreen = document.getElementById('login-screen');
        elements.appContainer = document.getElementById('app-container');
        elements.loginForm = document.getElementById('login-form');
        elements.masterPasswordInput = document.getElementById('master-password');
        elements.confirmPasswordInput = document.getElementById('confirm-password');
        elements.confirmPasswordGroup = document.getElementById('confirm-password-group');
        elements.loginButton = document.getElementById('login-button');
        elements.loginTitle = document.getElementById('login-title');
        elements.loginSubtitle = document.getElementById('login-subtitle');
        elements.credentialsGrid = document.getElementById('credentials-grid');
        elements.searchInput = document.getElementById('search-input');
        elements.categoryFilter = document.getElementById('category-filter');
        elements.addButton = document.getElementById('add-button');
        elements.logoutButton = document.getElementById('logout-button');
        elements.modal = document.getElementById('credential-modal');
        elements.modalTitle = document.getElementById('modal-title');
        elements.credentialForm = document.getElementById('credential-form');
        elements.toastContainer = document.getElementById('toast-container');
    }

    /**
     * Bind event listeners
     */
    function bindEvents() {
        // Login form
        elements.loginForm.addEventListener('submit', handleLogin);

        // Password visibility toggle
        document.querySelectorAll('.password-toggle').forEach(btn => {
            btn.addEventListener('click', togglePasswordVisibility);
        });

        // Search
        elements.searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase();
            renderCredentials();
        });

        // Add button
        elements.addButton.addEventListener('click', () => openModal());

        // Logout
        elements.logoutButton.addEventListener('click', logout);

        // Modal
        document.getElementById('modal-close').addEventListener('click', closeModal);
        document.getElementById('modal-cancel').addEventListener('click', closeModal);
        elements.modal.addEventListener('click', (e) => {
            if (e.target === elements.modal) closeModal();
        });

        // Credential form
        elements.credentialForm.addEventListener('submit', handleSaveCredential);

        // Password generator
        document.getElementById('generate-password-btn').addEventListener('click', generateNewPassword);
        document.getElementById('use-generated-btn').addEventListener('click', useGeneratedPassword);

        // Generator options
        document.getElementById('password-length').addEventListener('input', updatePasswordPreview);
        document.querySelectorAll('.generator-option input').forEach(input => {
            input.addEventListener('change', updatePasswordPreview);
        });

        // Delete button
        document.getElementById('delete-credential').addEventListener('click', handleDeleteCredential);
    }

    /**
     * Check if app is initialized
     */
    function checkInitialization() {
        if (StorageModule.isInitialized()) {
            elements.loginTitle.textContent = 'Bem-vindo de volta';
            elements.loginSubtitle.textContent = 'Digite sua senha mestra para acessar o vault';
            elements.confirmPasswordGroup.style.display = 'none';
            elements.loginButton.textContent = 'Desbloquear';
        } else {
            elements.loginTitle.textContent = 'Criar Senha Mestra';
            elements.loginSubtitle.textContent = 'Crie uma senha forte para proteger suas credenciais';
            elements.confirmPasswordGroup.style.display = 'block';
            elements.loginButton.textContent = 'Criar Vault';
        }
    }

    /**
     * Handle login/initialization
     */
    async function handleLogin(e) {
        e.preventDefault();

        const password = elements.masterPasswordInput.value;
        const confirmPassword = elements.confirmPasswordInput.value;

        if (!password) {
            showToast('Digite a senha mestra', 'error');
            return;
        }

        if (!StorageModule.isInitialized()) {
            // First time - create vault
            if (password !== confirmPassword) {
                showToast('As senhas não coincidem', 'error');
                return;
            }

            if (password.length < 8) {
                showToast('A senha deve ter pelo menos 8 caracteres', 'error');
                return;
            }

            elements.loginButton.disabled = true;
            elements.loginButton.innerHTML = '<i class="bi bi-hourglass-split"></i> Criando...';

            await StorageModule.initialize(password);
            masterPassword = password;
            credentials = [];

            showToast('Vault criado com sucesso!', 'success');
            showApp();
        } else {
            // Verify password
            elements.loginButton.disabled = true;
            elements.loginButton.innerHTML = '<i class="bi bi-hourglass-split"></i> Verificando...';

            const isValid = await StorageModule.verifyPassword(password);

            if (!isValid) {
                elements.loginButton.disabled = false;
                elements.loginButton.innerHTML = '<i class="bi bi-unlock"></i> Desbloquear';
                showToast('Senha incorreta', 'error');
                return;
            }

            masterPassword = password;
            credentials = await StorageModule.loadVault(password) || [];

            showApp();
        }
    }

    /**
     * Show main app
     */
    function showApp() {
        elements.loginScreen.style.display = 'none';
        elements.appContainer.classList.add('active');
        elements.masterPasswordInput.value = '';
        elements.confirmPasswordInput.value = '';

        renderCategories();
        renderCredentials();
    }

    /**
     * Logout
     */
    function logout() {
        masterPassword = null;
        credentials = [];
        currentCredentialId = null;

        elements.appContainer.classList.remove('active');
        elements.loginScreen.style.display = 'flex';
        elements.loginButton.disabled = false;
        elements.loginButton.innerHTML = '<i class="bi bi-unlock"></i> Desbloquear';

        checkInitialization();
    }

    /**
     * Render category filters
     */
    function renderCategories() {
        elements.categoryFilter.innerHTML = categories.map(cat => `
            <button class="category-btn ${cat.id === currentFilter ? 'active' : ''}" 
                    data-category="${cat.id}">
                <i class="bi ${cat.icon}"></i> ${cat.name}
            </button>
        `).join('');

        elements.categoryFilter.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                currentFilter = btn.dataset.category;
                elements.categoryFilter.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderCredentials();
            });
        });
    }

    /**
     * Render credentials grid
     */
    function renderCredentials() {
        let filtered = credentials;

        // Filter by category
        if (currentFilter !== 'all') {
            filtered = filtered.filter(c => c.category === currentFilter);
        }

        // Filter by search
        if (searchQuery) {
            filtered = filtered.filter(c =>
                c.title.toLowerCase().includes(searchQuery) ||
                c.username.toLowerCase().includes(searchQuery) ||
                c.url.toLowerCase().includes(searchQuery)
            );
        }

        if (filtered.length === 0) {
            elements.credentialsGrid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <div class="empty-icon">
                        <i class="bi bi-shield-lock"></i>
                    </div>
                    <h3 class="empty-title">Nenhuma credencial encontrada</h3>
                    <p class="empty-description">
                        ${credentials.length === 0
                    ? 'Adicione sua primeira senha para começar'
                    : 'Tente ajustar os filtros de busca'}
                    </p>
                    ${credentials.length === 0 ? `
                        <button class="btn btn-primary" onclick="App.openModal()">
                            <i class="bi bi-plus-lg"></i> Adicionar Senha
                        </button>
                    ` : ''}
                </div>
            `;
            return;
        }

        elements.credentialsGrid.innerHTML = filtered.map(cred => `
            <div class="credential-card" data-id="${cred.id}">
                <div class="credential-header">
                    <div class="credential-info">
                        <div class="credential-icon">
                            <i class="bi ${getCategoryIcon(cred.category)}"></i>
                        </div>
                        <div>
                            <h4 class="credential-title">${escapeHtml(cred.title)}</h4>
                            <span class="credential-category">${getCategoryName(cred.category)}</span>
                        </div>
                    </div>
                </div>
                <div class="credential-body">
                    ${cred.url ? `
                        <div class="credential-field">
                            <div>
                                <div class="field-label">URL</div>
                                <div class="field-value">${escapeHtml(truncate(cred.url, 30))}</div>
                            </div>
                            <button class="copy-btn" onclick="App.copyToClipboard('${escapeHtml(cred.url)}', this)" title="Copiar URL">
                                <i class="bi bi-copy"></i>
                            </button>
                        </div>
                    ` : ''}
                    <div class="credential-field">
                        <div>
                            <div class="field-label">Usuário</div>
                            <div class="field-value">${escapeHtml(cred.username)}</div>
                        </div>
                        <button class="copy-btn" onclick="App.copyToClipboard('${escapeHtml(cred.username)}', this)" title="Copiar Usuário">
                            <i class="bi bi-copy"></i>
                        </button>
                    </div>
                    <div class="credential-field">
                        <div>
                            <div class="field-label">Senha</div>
                            <div class="field-value field-password">••••••••</div>
                        </div>
                        <button class="copy-btn" onclick="App.copyToClipboard('${escapeHtml(cred.password)}', this)" title="Copiar Senha">
                            <i class="bi bi-copy"></i>
                        </button>
                    </div>
                </div>
                <div class="credential-actions">
                    <button class="btn btn-secondary btn-sm" onclick="App.openModal('${cred.id}')">
                        <i class="bi bi-pencil"></i> Editar
                    </button>
                </div>
            </div>
        `).join('');
    }

    /**
     * Open credential modal
     */
    function openModal(id = null) {
        currentCredentialId = id;

        if (id) {
            const cred = credentials.find(c => c.id === id);
            if (cred) {
                elements.modalTitle.textContent = 'Editar Credencial';
                document.getElementById('cred-title').value = cred.title;
                document.getElementById('cred-url').value = cred.url || '';
                document.getElementById('cred-username').value = cred.username;
                document.getElementById('cred-password').value = cred.password;
                document.getElementById('cred-category').value = cred.category;
                document.getElementById('cred-notes').value = cred.notes || '';
                document.getElementById('delete-credential').style.display = 'block';
            }
        } else {
            elements.modalTitle.textContent = 'Nova Credencial';
            elements.credentialForm.reset();
            document.getElementById('cred-category').value = 'pessoal';
            document.getElementById('delete-credential').style.display = 'none';
        }

        updatePasswordPreview();
        elements.modal.classList.add('active');
    }

    /**
     * Close modal
     */
    function closeModal() {
        elements.modal.classList.remove('active');
        currentCredentialId = null;
        elements.credentialForm.reset();
    }

    /**
     * Save credential
     */
    async function handleSaveCredential(e) {
        e.preventDefault();

        const title = document.getElementById('cred-title').value.trim();
        const url = document.getElementById('cred-url').value.trim();
        const username = document.getElementById('cred-username').value.trim();
        const password = document.getElementById('cred-password').value;
        const category = document.getElementById('cred-category').value;
        const notes = document.getElementById('cred-notes').value.trim();

        if (!title || !username || !password) {
            showToast('Preencha todos os campos obrigatórios', 'error');
            return;
        }

        const credentialData = {
            title,
            url,
            username,
            password,
            category,
            notes,
            updatedAt: new Date().toISOString()
        };

        if (currentCredentialId) {
            // Update existing
            const index = credentials.findIndex(c => c.id === currentCredentialId);
            if (index !== -1) {
                credentials[index] = { ...credentials[index], ...credentialData };
            }
            showToast('Credencial atualizada', 'success');
        } else {
            // Create new
            credentialData.id = generateId();
            credentialData.createdAt = new Date().toISOString();
            credentials.push(credentialData);
            showToast('Credencial adicionada', 'success');
        }

        await StorageModule.saveVault(credentials, masterPassword);
        renderCredentials();
        closeModal();
    }

    /**
     * Delete credential
     */
    async function handleDeleteCredential() {
        if (!currentCredentialId) return;

        if (!confirm('Tem certeza que deseja excluir esta credencial?')) return;

        credentials = credentials.filter(c => c.id !== currentCredentialId);
        await StorageModule.saveVault(credentials, masterPassword);

        showToast('Credencial excluída', 'success');
        renderCredentials();
        closeModal();
    }

    /**
     * Generate new password preview
     */
    function generateNewPassword() {
        updatePasswordPreview();
    }

    /**
     * Update password preview
     */
    function updatePasswordPreview() {
        const length = parseInt(document.getElementById('password-length').value);
        const uppercase = document.getElementById('gen-uppercase').checked;
        const lowercase = document.getElementById('gen-lowercase').checked;
        const numbers = document.getElementById('gen-numbers').checked;
        const symbols = document.getElementById('gen-symbols').checked;

        document.getElementById('length-value').textContent = length;

        const password = CryptoModule.generatePassword({
            length,
            uppercase,
            lowercase,
            numbers,
            symbols
        });

        document.getElementById('generated-password').textContent = password;
    }

    /**
     * Use generated password
     */
    function useGeneratedPassword() {
        const password = document.getElementById('generated-password').textContent;
        document.getElementById('cred-password').value = password;
        showToast('Senha aplicada', 'success');
    }

    /**
     * Toggle password visibility
     */
    function togglePasswordVisibility(e) {
        const btn = e.currentTarget;
        const input = btn.previousElementSibling;
        const icon = btn.querySelector('i');

        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('bi-eye');
            icon.classList.add('bi-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('bi-eye-slash');
            icon.classList.add('bi-eye');
        }
    }

    /**
     * Copy to clipboard
     */
    async function copyToClipboard(text, btn) {
        try {
            await navigator.clipboard.writeText(text);
            btn.classList.add('copied');
            btn.querySelector('i').classList.remove('bi-copy');
            btn.querySelector('i').classList.add('bi-check');

            showToast('Copiado!', 'success');

            setTimeout(() => {
                btn.classList.remove('copied');
                btn.querySelector('i').classList.remove('bi-check');
                btn.querySelector('i').classList.add('bi-copy');
            }, 2000);
        } catch (err) {
            showToast('Erro ao copiar', 'error');
        }
    }

    /**
     * Show toast notification
     */
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="bi ${type === 'success' ? 'bi-check-circle' : 'bi-exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        elements.toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // Utility functions
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function truncate(str, maxLength) {
        if (str.length <= maxLength) return str;
        return str.substr(0, maxLength) + '...';
    }

    function getCategoryIcon(categoryId) {
        const cat = categories.find(c => c.id === categoryId);
        return cat ? cat.icon : 'bi-folder';
    }

    function getCategoryName(categoryId) {
        const cat = categories.find(c => c.id === categoryId);
        return cat ? cat.name : 'Outros';
    }

    // Public API
    return {
        init,
        openModal,
        copyToClipboard
    };
})();

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', App.init);
