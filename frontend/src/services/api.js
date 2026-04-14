const API_BASE_URL = '/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.message || 'Something went wrong');
  }
  return response.json();
};

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const authService = {
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await handleResponse(response);
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  },
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },
  logout: () => {
    localStorage.removeItem('token');
  }
};

export const referralService = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/referrals`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/referrals/${id}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },
  create: async (referralData) => {
    const response = await fetch(`${API_BASE_URL}/referrals`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(referralData),
    });
    return handleResponse(response);
  },
  updateStatus: async (id, status) => {
    const response = await fetch(`${API_BASE_URL}/referrals/${id}/status`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ status }),
    });
    return handleResponse(response);
  },
  makeDecision: async (id, decision, reason) => {
    const response = await fetch(`${API_BASE_URL}/referrals/${id}/decision`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ decision, reason }),
    });
    return handleResponse(response);
  }
};

export const feedbackService = {
  getByReferral: async (referralId) => {
    const response = await fetch(`${API_BASE_URL}/referrals/${referralId}/feedback`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },
  create: async (referralId, feedbackData) => {
    const response = await fetch(`${API_BASE_URL}/referrals/${referralId}/feedback`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(feedbackData),
    });
    return handleResponse(response);
  }
};
