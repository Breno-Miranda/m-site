/**
 * MCredential - Storage Module
 * Encrypted localStorage management
 * Version: V0.10.11
 */

const StorageModule = (function () {
    const STORAGE_KEYS = {
        VAULT: 'mcredential_vault',
        SALT: 'mcredential_salt',
        HASH: 'mcredential_hash',
        INITIALIZED: 'mcredential_initialized'
    };

    /**
     * Check if vault is initialized (first run)
     */
    function isInitialized() {
        return localStorage.getItem(STORAGE_KEYS.INITIALIZED) === 'true';
    }

    /**
     * Initialize vault with master password
     */
    async function initialize(masterPassword) {
        const salt = CryptoModule.generateRandomBytes(16);
        const hash = await CryptoModule.hashPassword(masterPassword, salt);

        localStorage.setItem(STORAGE_KEYS.SALT, CryptoModule.bufferToBase64(salt));
        localStorage.setItem(STORAGE_KEYS.HASH, hash);
        localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');

        // Create empty vault
        await saveVault([], masterPassword);

        return true;
    }

    /**
     * Verify master password
     */
    async function verifyPassword(masterPassword) {
        if (!isInitialized()) return false;

        const saltBase64 = localStorage.getItem(STORAGE_KEYS.SALT);
        const storedHash = localStorage.getItem(STORAGE_KEYS.HASH);

        if (!saltBase64 || !storedHash) return false;

        const salt = CryptoModule.base64ToBuffer(saltBase64);
        const hash = await CryptoModule.hashPassword(masterPassword, salt);

        return hash === storedHash;
    }

    /**
     * Save encrypted vault
     */
    async function saveVault(credentials, masterPassword) {
        const data = JSON.stringify(credentials);
        const encrypted = await CryptoModule.encrypt(data, masterPassword);
        localStorage.setItem(STORAGE_KEYS.VAULT, JSON.stringify(encrypted));
        return true;
    }

    /**
     * Load and decrypt vault
     */
    async function loadVault(masterPassword) {
        const encryptedStr = localStorage.getItem(STORAGE_KEYS.VAULT);

        if (!encryptedStr) return [];

        try {
            const encrypted = JSON.parse(encryptedStr);
            const decrypted = await CryptoModule.decrypt(encrypted, masterPassword);

            if (!decrypted) return null; // Wrong password

            return JSON.parse(decrypted);
        } catch (error) {
            console.error('Failed to load vault:', error);
            return null;
        }
    }

    /**
     * Clear all data (factory reset)
     */
    function clearAll() {
        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
    }

    return {
        isInitialized,
        initialize,
        verifyPassword,
        saveVault,
        loadVault,
        clearAll
    };
})();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageModule;
}
