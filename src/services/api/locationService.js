import {
  STATE_DISTRICT_MAP,
  DISTRICT_STATE_MAP,
  MP_LOCATION_MAP,
  CONSTITUENCY_DETAILS_MAP,
} from '../../data/locationMappings';
import { mockConstituencyData } from '../../data/mockConstituencyData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export { STATE_DISTRICT_MAP, DISTRICT_STATE_MAP, MP_LOCATION_MAP, CONSTITUENCY_DETAILS_MAP };

export const locationService = {
  async getLocationMappings() {
    if (USE_MOCK) {
      return {
        success: true,
        data: {
          stateDistrictMap: STATE_DISTRICT_MAP,
          districtStateMap: DISTRICT_STATE_MAP,
          mpLocationMap: MP_LOCATION_MAP,
          constituencyDetailsMap: CONSTITUENCY_DETAILS_MAP,
        },
      };
    }
    return {
      success: true,
      data: {
        stateDistrictMap: STATE_DISTRICT_MAP,
        districtStateMap: DISTRICT_STATE_MAP,
        mpLocationMap: MP_LOCATION_MAP,
        constituencyDetailsMap: CONSTITUENCY_DETAILS_MAP,
      },
    };
  },

  async getConstituencyData() {
    if (USE_MOCK) {
      await new Promise((res) => setTimeout(res, 50));
      return { success: true, data: mockConstituencyData };
    }
    return { success: true, data: mockConstituencyData };
  },
};
