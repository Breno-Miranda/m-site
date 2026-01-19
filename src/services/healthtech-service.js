/**
 * HealthTech Service
 * Farmácia 4.0 - API Client
 */
class HealthTechService {
    constructor() {
        this.basePath = '/healthtech';
        // Default pharmacy ID - should be set based on logged user's pharmacy
        this.pharmacyId = localStorage.getItem('healthtech_pharmacy_id') || null;
    }

    setPharmacyId(id) {
        this.pharmacyId = id;
        localStorage.setItem('healthtech_pharmacy_id', id);
    }

    getPharmacyId() {
        return this.pharmacyId;
    }

    // --- Pharmacy ---
    async getPharmacies() {
        try {
            return await window.core.fetchAPI(`${this.basePath}/pharmacy`);
        } catch (error) {
            console.error('Error fetching pharmacies:', error);
            throw error;
        }
    }

    async createPharmacy(data) {
        try {
            return await window.core.fetchAPI(`${this.basePath}/pharmacy`, 'POST', data);
        } catch (error) {
            console.error('Error creating pharmacy:', error);
            throw error;
        }
    }

    // --- Patients ---
    async getPatients(filters = {}) {
        try {
            const params = new URLSearchParams();
            if (this.pharmacyId) params.append('pharmacyId', this.pharmacyId);
            if (filters.phase) params.append('phase', filters.phase);
            if (filters.tag) params.append('tag', filters.tag);
            if (filters.active !== undefined) params.append('active', filters.active);

            const query = params.toString() ? `?${params.toString()}` : '';
            return await window.core.fetchAPI(`${this.basePath}/patients${query}`);
        } catch (error) {
            console.error('Error fetching patients:', error);
            throw error;
        }
    }

    async getPatientById(id) {
        try {
            return await window.core.fetchAPI(`${this.basePath}/patients/${id}`);
        } catch (error) {
            console.error('Error fetching patient:', error);
            throw error;
        }
    }

    async getPatientTimeline(id) {
        try {
            return await window.core.fetchAPI(`${this.basePath}/patients/${id}/timeline`);
        } catch (error) {
            console.error('Error fetching patient timeline:', error);
            throw error;
        }
    }

    async createPatient(data) {
        try {
            // Ensure pharmacyId is set
            if (!data.pharmacyId && this.pharmacyId) {
                data.pharmacyId = this.pharmacyId;
            }
            return await window.core.fetchAPI(`${this.basePath}/patients`, 'POST', data);
        } catch (error) {
            console.error('Error creating patient:', error);
            throw error;
        }
    }

    async updatePatient(id, data) {
        try {
            return await window.core.fetchAPI(`${this.basePath}/patients/${id}`, 'PUT', data);
        } catch (error) {
            console.error('Error updating patient:', error);
            throw error;
        }
    }

    async addPatientTags(id, tags) {
        try {
            return await window.core.fetchAPI(`${this.basePath}/patients/${id}/tags`, 'POST', { tags });
        } catch (error) {
            console.error('Error adding tags:', error);
            throw error;
        }
    }

    // --- Consultations ---
    async getConsultations(filters = {}) {
        try {
            const params = new URLSearchParams();
            if (this.pharmacyId) params.append('pharmacyId', this.pharmacyId);
            if (filters.patientId) params.append('patientId', filters.patientId);
            if (filters.status) params.append('status', filters.status);
            if (filters.date) params.append('date', filters.date);

            const query = params.toString() ? `?${params.toString()}` : '';
            return await window.core.fetchAPI(`${this.basePath}/consultations${query}`);
        } catch (error) {
            console.error('Error fetching consultations:', error);
            throw error;
        }
    }

    async createConsultation(data) {
        try {
            if (!data.pharmacyId && this.pharmacyId) {
                data.pharmacyId = this.pharmacyId;
            }
            return await window.core.fetchAPI(`${this.basePath}/consultations`, 'POST', data);
        } catch (error) {
            console.error('Error creating consultation:', error);
            throw error;
        }
    }

    async completeConsultation(id, data) {
        try {
            return await window.core.fetchAPI(`${this.basePath}/consultations/${id}/complete`, 'POST', data);
        } catch (error) {
            console.error('Error completing consultation:', error);
            throw error;
        }
    }

    // --- Formulas ---
    async getFormulas(filters = {}) {
        try {
            const params = new URLSearchParams();
            if (this.pharmacyId) params.append('pharmacyId', this.pharmacyId);
            if (filters.patientId) params.append('patientId', filters.patientId);
            if (filters.isTemplate !== undefined) params.append('isTemplate', filters.isTemplate);
            if (filters.status) params.append('status', filters.status);
            if (filters.category) params.append('category', filters.category);

            const query = params.toString() ? `?${params.toString()}` : '';
            return await window.core.fetchAPI(`${this.basePath}/formulas${query}`);
        } catch (error) {
            console.error('Error fetching formulas:', error);
            throw error;
        }
    }

    async getFormulaTemplates() {
        try {
            const params = new URLSearchParams();
            if (this.pharmacyId) params.append('pharmacyId', this.pharmacyId);
            const query = params.toString() ? `?${params.toString()}` : '';
            return await window.core.fetchAPI(`${this.basePath}/formulas/templates${query}`);
        } catch (error) {
            console.error('Error fetching formula templates:', error);
            throw error;
        }
    }

    async getFormulaById(id) {
        try {
            return await window.core.fetchAPI(`${this.basePath}/formulas/${id}`);
        } catch (error) {
            console.error('Error fetching formula:', error);
            throw error;
        }
    }

    async createFormula(data) {
        try {
            if (!data.pharmacyId && this.pharmacyId) {
                data.pharmacyId = this.pharmacyId;
            }
            return await window.core.fetchAPI(`${this.basePath}/formulas`, 'POST', data);
        } catch (error) {
            console.error('Error creating formula:', error);
            throw error;
        }
    }

    async cloneFormula(id, data) {
        try {
            return await window.core.fetchAPI(`${this.basePath}/formulas/${id}/clone`, 'POST', data);
        } catch (error) {
            console.error('Error cloning formula:', error);
            throw error;
        }
    }

    async updateFormulaProduction(id, productionData) {
        try {
            return await window.core.fetchAPI(`${this.basePath}/formulas/${id}/production`, 'PUT', productionData);
        } catch (error) {
            console.error('Error updating production:', error);
            throw error;
        }
    }

    // --- Education ---
    async getHealthTips(tag) {
        try {
            const query = tag ? `?tag=${tag}` : '';
            return await window.core.fetchAPI(`${this.basePath}/education/tips${query}`);
        } catch (error) {
            console.error('Error fetching tips:', error);
            throw error;
        }
    }

    async getEducationContent(filters = {}) {
        try {
            const params = new URLSearchParams();
            if (this.pharmacyId) params.append('pharmacyId', this.pharmacyId);
            if (filters.category) params.append('category', filters.category);
            if (filters.tag) params.append('tag', filters.tag);
            if (filters.type) params.append('type', filters.type);

            const query = params.toString() ? `?${params.toString()}` : '';
            return await window.core.fetchAPI(`${this.basePath}/education/content${query}`);
        } catch (error) {
            console.error('Error fetching education content:', error);
            throw error;
        }
    }

    async getPatientContent(patientId) {
        try {
            return await window.core.fetchAPI(`${this.basePath}/education/patient/${patientId}`);
        } catch (error) {
            console.error('Error fetching patient content:', error);
            throw error;
        }
    }

    // --- Loyalty ---
    async getLoyaltyStatus(patientId) {
        try {
            return await window.core.fetchAPI(`${this.basePath}/loyalty/${patientId}`);
        } catch (error) {
            console.error('Error fetching loyalty status:', error);
            throw error;
        }
    }

    async enrollInLoyalty(patientId) {
        try {
            return await window.core.fetchAPI(`${this.basePath}/loyalty/enroll`, 'POST', {
                pharmacyId: this.pharmacyId,
                patientId
            });
        } catch (error) {
            console.error('Error enrolling in loyalty:', error);
            throw error;
        }
    }

    async addPoints(patientId, points, description) {
        try {
            return await window.core.fetchAPI(`${this.basePath}/loyalty/points`, 'POST', {
                patientId,
                type: 'add',
                points,
                description
            });
        } catch (error) {
            console.error('Error adding points:', error);
            throw error;
        }
    }

    async redeemPoints(patientId, points, description) {
        try {
            return await window.core.fetchAPI(`${this.basePath}/loyalty/points`, 'POST', {
                patientId,
                type: 'redeem',
                points,
                description
            });
        } catch (error) {
            console.error('Error redeeming points:', error);
            throw error;
        }
    }

    async getRewards() {
        try {
            const params = new URLSearchParams();
            if (this.pharmacyId) params.append('pharmacyId', this.pharmacyId);
            const query = params.toString() ? `?${params.toString()}` : '';
            return await window.core.fetchAPI(`${this.basePath}/loyalty/rewards${query}`);
        } catch (error) {
            console.error('Error fetching rewards:', error);
            throw error;
        }
    }

    async submitNPS(patientId, score, feedback, touchpoint) {
        try {
            return await window.core.fetchAPI(`${this.basePath}/nps`, 'POST', {
                patientId,
                score,
                feedback,
                touchpoint
            });
        } catch (error) {
            console.error('Error submitting NPS:', error);
            throw error;
        }
    }

    // --- Follow-ups ---
    async getFollowUps(filters = {}) {
        try {
            const params = new URLSearchParams();
            if (this.pharmacyId) params.append('pharmacyId', this.pharmacyId);
            if (filters.patientId) params.append('patientId', filters.patientId);
            if (filters.status) params.append('status', filters.status);
            if (filters.type) params.append('type', filters.type);
            if (filters.upcoming) params.append('upcoming', 'true');

            const query = params.toString() ? `?${params.toString()}` : '';
            return await window.core.fetchAPI(`${this.basePath}/follow-ups${query}`);
        } catch (error) {
            console.error('Error fetching follow-ups:', error);
            throw error;
        }
    }

    async createFollowUp(data) {
        try {
            if (!data.pharmacyId && this.pharmacyId) {
                data.pharmacyId = this.pharmacyId;
            }
            return await window.core.fetchAPI(`${this.basePath}/follow-ups`, 'POST', data);
        } catch (error) {
            console.error('Error creating follow-up:', error);
            throw error;
        }
    }

    async completeFollowUp(id, outcome) {
        try {
            return await window.core.fetchAPI(`${this.basePath}/follow-ups/${id}/complete`, 'POST', { outcome });
        } catch (error) {
            console.error('Error completing follow-up:', error);
            throw error;
        }
    }

    // --- Analytics ---
    async getDashboardStats() {
        try {
            if (!this.pharmacyId) {
                console.warn('No pharmacyId set for analytics');
                return null;
            }
            return await window.core.fetchAPI(`${this.basePath}/analytics/dashboard?pharmacyId=${this.pharmacyId}`);
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            throw error;
        }
    }

    async getPatientAnalytics() {
        try {
            if (!this.pharmacyId) return null;
            return await window.core.fetchAPI(`${this.basePath}/analytics/patients?pharmacyId=${this.pharmacyId}`);
        } catch (error) {
            console.error('Error fetching patient analytics:', error);
            throw error;
        }
    }

    async getFormulaAnalytics() {
        try {
            if (!this.pharmacyId) return null;
            return await window.core.fetchAPI(`${this.basePath}/analytics/formulas?pharmacyId=${this.pharmacyId}`);
        } catch (error) {
            console.error('Error fetching formula analytics:', error);
            throw error;
        }
    }
}

// Export instance
window.healthTechService = new HealthTechService();
