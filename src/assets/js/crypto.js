/**
 * MCredential - Crypto Module
 * AES-256-GCM encryption via Web Crypto API
 * Version: V0.10.10
 */

const CryptoModule = (function () {
    const ALGORITHM = 'AES-GCM';
    const KEY_LENGTH = 256;
    const ITERATIONS = 100000;
    const SALT_LENGTH = 16;
    const IV_LENGTH = 12;

    /**
     * Generate random bytes
     */
    function generateRandomBytes(length) {
        return crypto.getRandomValues(new Uint8Array(length));
    }

    /**
     * Convert ArrayBuffer to Base64
     */
    function bufferToBase64(buffer) {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    /**
     * Convert Base64 to ArrayBuffer
     */
    function base64ToBuffer(base64) {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes;
    }

    /**
     * Derive encryption key from master password using PBKDF2
     */
    async function deriveKey(password, salt) {
        const encoder = new TextEncoder();
        const passwordBuffer = encoder.encode(password);

        // Import password as raw key material
        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            passwordBuffer,
            { name: 'PBKDF2' },
            false,
            ['deriveBits', 'deriveKey']
        );

        // Derive AES-GCM key
        return crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: ITERATIONS,
                hash: 'SHA-256'
            },
            keyMaterial,
            { name: ALGORITHM, length: KEY_LENGTH },
            false,
            ['encrypt', 'decrypt']
        );
    }

    /**
     * Encrypt data with AES-256-GCM
     */
    async function encrypt(plaintext, masterPassword) {
        const encoder = new TextEncoder();
        const data = encoder.encode(plaintext);

        const salt = generateRandomBytes(SALT_LENGTH);
        const iv = generateRandomBytes(IV_LENGTH);
        const key = await deriveKey(masterPassword, salt);

        const encrypted = await crypto.subtle.encrypt(
            { name: ALGORITHM, iv: iv },
            key,
            data
        );

        // Combine salt + iv + encrypted data
        return {
            salt: bufferToBase64(salt),
            iv: bufferToBase64(iv),
            data: bufferToBase64(encrypted)
        };
    }

    /**
     * Decrypt data with AES-256-GCM
     */
    async function decrypt(encryptedObj, masterPassword) {
        try {
            const salt = base64ToBuffer(encryptedObj.salt);
            const iv = base64ToBuffer(encryptedObj.iv);
            const data = base64ToBuffer(encryptedObj.data);

            const key = await deriveKey(masterPassword, salt);

            const decrypted = await crypto.subtle.decrypt(
                { name: ALGORITHM, iv: iv },
                key,
                data
            );

            const decoder = new TextDecoder();
            return decoder.decode(decrypted);
        } catch (error) {
            console.error('Decryption failed:', error);
            return null;
        }
    }

    /**
     * Hash password for verification
     */
    async function hashPassword(password, salt) {
        const key = await deriveKey(password, salt);
        const exported = await crypto.subtle.exportKey('raw', key);
        return bufferToBase64(exported);
    }

    /**
     * Generate a secure random password
     */
    function generatePassword(options = {}) {
        const {
            length = 16,
            uppercase = true,
            lowercase = true,
            numbers = true,
            symbols = true
        } = options;

        let chars = '';
        const charSets = {
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
        };

        if (uppercase) chars += charSets.uppercase;
        if (lowercase) chars += charSets.lowercase;
        if (numbers) chars += charSets.numbers;
        if (symbols) chars += charSets.symbols;

        if (!chars) chars = charSets.lowercase + charSets.numbers;

        const randomBytes = generateRandomBytes(length);
        let password = '';

        for (let i = 0; i < length; i++) {
            password += chars[randomBytes[i] % chars.length];
        }

        return password;
    }

    return {
        encrypt,
        decrypt,
        hashPassword,
        generatePassword,
        generateRandomBytes,
        bufferToBase64,
        base64ToBuffer
    };
})();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CryptoModule;
}
