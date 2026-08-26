export const STATE_DISTRICT_MAP = {
  'Bihar': ['Gaya'],
  'Uttar Pradesh': ['Varanasi'],
  'Maharashtra': ['Nagpur', 'Pune', 'Thane'],
  'Karnataka': ['Mysuru', 'Bengaluru Urban'],
  'Rajasthan': ['Jaipur'],
  'West Bengal': ['Murshidabad'],
  'Tamil Nadu': ['Coimbatore'],
  'Gujarat': ['Rajkot', 'Ahmadabad'],
  'Madhya Pradesh': ['Indore'],
  'Punjab': ['Ludhiana'],
  'Odisha': ['Khordha'],
  'Assam': ['Kamrup'],
  'Haryana': ['Rohtak'],
  'Kerala': ['Alappuzha'],
  'Jharkhand': ['Ranchi'],
  'Andhra Pradesh': ['Guntur'],
  'Telangana': ['Warangal'],
  'Uttarakhand': ['Dehradun'],
  'Goa': ['North Goa'],
};

export const DISTRICT_STATE_MAP = Object.entries(STATE_DISTRICT_MAP).reduce((acc, [st, dists]) => {
  dists.forEach((d) => {
    acc[d] = st;
  });
  return acc;
}, {});

export const MP_LOCATION_MAP = {
  'Shri Rajesh Kumar': { state: 'Bihar', district: 'Gaya' },
  'Smt. Sunita Sharma': { state: 'Uttar Pradesh', district: 'Varanasi' },
  'Dr. Amit Deshmukh': { state: 'Maharashtra', district: 'Nagpur' },
  'Shri Ananth Hegde': { state: 'Karnataka', district: 'Mysuru' },
  'Shri Partha Mukherjee': { state: 'West Bengal', district: 'Murshidabad' },
};
