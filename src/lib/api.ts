import axios from 'axios';
import type { List, Campaign } from '../types';

const SENDFOX_API_URL = 'https://api.sendfox.com';
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

const api = axios.create({
  baseURL: `${CORS_PROXY}${SENDFOX_API_URL}`,
  headers: {
    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5MzciLCJqdGkiOiI4ODhlMTY3Nzk4NWY3MGU4NDdkMDFkMTZlZjdlMzM2ZGY2NGY4NjJiNTAzNGQ1NWNkMjEwZWU4YjU5NTZiYTI0MmQ3YWQ4MjRhNzBlZmY5NSIsImlhdCI6MTczNzY1ODIyOS41NjY0NiwibmJmIjoxNzM3NjU4MjI5LjU2NjQ2MiwiZXhwIjo0ODkzMzMxODI5LjU1NzkxOSwic3ViIjoiNTAyMzQiLCJzY29wZXMiOltdfQ.oSmjeG1mnTt96tJRVuXSPMPnIcU8-tP772x-xcVxCpyyAltpKdcSA1NNE1Dsof9ixfn8Ng-xw_1q28WBKXW1TiFFCqFr5iTjxR25TyU7WQkekeAA4cubgToRP6uM_itxDZAjdyBDqSlLNrzxhvIsx4XcOU9oCaHpPemQgSFa0st3Tx7FHtosROUKDmH-2IdyeBVIi4nh3KotFvSi6P3aWyVxfShDnyCHeExNF7ZAPgZi4kejSCqwWYSy1oPscGZFIei5YHYCrs0l3uPcXM7YXzKJSeZuE9usqSnUHunwiOgMMNOs-rwL93ILP5SNKm5vxE29qcek-yVBi9u5FVRI3A_TkRjeKPiOEa1GbAmVnyvhuW2Msr2_BDrGq1Hlriwr1H9P0ZBgFVSoJfTxQcIKJnHbI1hXe0oBXhHr_HxmLnKmIjtMeVFr0Nkvhd28SvGhX-qOMdqFhSxQahQ9WfAGFUX7X2xnQKJqtZAOeOSN1KsYo6J8gk4aFTEDnl3FFFzcN4-DRdHKkPhh1f2LF4qc8I17ic5bNTd35luztsmpH84CoOi6lYY9V2H0G2vQd6RdbSCCC9wq7S2Keh6oAWLO0dsqUIU6FSU8qfjYkfie3GVfbw6CBV6l04XjYo7Kl7YXFY-Gmx0wYLtgUmuoa4yMdozC4m_U04Gll0Xh_Qj_w1A',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Add interceptor to handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error);
    throw {
      message: error.response?.data?.message || 'An error occurred while communicating with SendFox',
      status: error.response?.status || 500
    };
  }
);

export const sendFoxApi = {
  async getLists(): Promise<List[]> {
    try {
      const data = await api.get('/lists');
      return Array.isArray(data?.data) ? data.data : [];
    } catch (error) {
      console.error('Failed to fetch lists:', error);
      throw error;
    }
  },

  async createCampaign(campaign: Campaign): Promise<void> {
    // Since SendFox API doesn't support campaign creation via API,
    // we'll throw an informative error
    throw {
      message: 'Campaign creation is currently only available through the SendFox web interface. Please log in to your SendFox account to create and send campaigns.',
      status: 400
    };
  }
};