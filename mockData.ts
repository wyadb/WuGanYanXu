import { Merchant, Staff, District, TaskStatus } from './types';

// 1. System Time Simulation
export const CURRENT_SYSTEM_TIME = '2026-01-15';

// 2. Districts and Staff Generation
const DISTRICTS: District[] = ['牧野', '红旗', '开发', '卫滨', '凤泉'];

const generateStaff = (): Staff[] => {
  const staffList: Staff[] = [];
  let idCounter = 1;

  DISTRICTS.forEach(district => {
    // 5-8 staff per district
    const count = Math.floor(Math.random() * 4) + 5; 
    for (let i = 0; i < count; i++) {
      staffList.push({
        id: `s${idCounter}`,
        name: `${district}监管员${i + 1}`,
        employeeId: `YG${1000 + idCounter}`,
        area: district,
        phone: `13${Math.floor(Math.random() * 9 + 1)}0000${1000 + idCounter}`, // Mock phone
        activeTasks: 0,
        completedTasks: 0
      });
      idCounter++;
    }
  });
  return staffList;
};

export const STAFF_LIST: Staff[] = generateStaff();

// 3. Merchant Generation (Approx 100 per month for 2025)
const generateMerchants = (): Merchant[] => {
  const merchants: Merchant[] = [];
  const startYear = 2025;
  let idCounter = 1;

  // Generate for all 12 months of 2025
  for (let month = 0; month < 12; month++) {
    // Approx 100 merchants per month (+/- random)
    const count = 90 + Math.floor(Math.random() * 20); 
    
    for (let i = 0; i < count; i++) {
      const district = DISTRICTS[Math.floor(Math.random() * DISTRICTS.length)];
      // Assign a random staff from that district
      const districtStaff = STAFF_LIST.filter(s => s.area === district);
      const assignedStaff = districtStaff[Math.floor(Math.random() * districtStaff.length)];
      
      const day = Math.floor(Math.random() * 28) + 1;
      const expireDate = `${startYear}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      // Calculate days remaining (vs Current System Time 2026-01-15)
      // Since these are 2025 dates, they are all in the past (negative remaining) or processed.
      // However, for the sake of the 'active task' simulation, let's say some in late Dec 2025 might still be processing.
      // But mostly this data is for historical charts. 
      // Let's also add some "Future" data for Jan/Feb 2026 for the active task pool.
      
      merchants.push({
        id: `m${idCounter}`,
        name: `${district}商户${idCounter}`,
        licenseNo: `4107${10000000 + idCounter}`,
        ownerName: `老板${idCounter}`,
        address: `新乡市${district}某街道${Math.floor(Math.random()*100)}号`,
        phone: `138${String(idCounter).padStart(8, '0').slice(0, 8)}`,
        expireDate: expireDate,
        daysRemaining: -100, // Placeholder, calculated properly in logic if needed
        status: 'completed', // Most 2025 data is completed
        staffId: assignedStaff.id,
        district: district,
        history: [{ date: expireDate, action: '已归档' }]
      });
      
      // Increment staff stats
      const staffIndex = STAFF_LIST.findIndex(s => s.id === assignedStaff.id);
      if (staffIndex > -1) {
        STAFF_LIST[staffIndex].completedTasks++;
      }

      idCounter++;
    }
  }

  // Generate some "Active" data for Jan/Feb 2026 (The "Current" tasks)
  for (let i = 0; i < 50; i++) {
    const district = DISTRICTS[Math.floor(Math.random() * DISTRICTS.length)];
    const districtStaff = STAFF_LIST.filter(s => s.area === district);
    const assignedStaff = districtStaff[Math.floor(Math.random() * districtStaff.length)];
    
    // Dates between 2026-01-16 and 2026-02-15
    const day = Math.floor(Math.random() * 28) + 1;
    const expireDate = `2026-0${Math.random() > 0.5 ? 1 : 2}-${String(day).padStart(2, '0')}`;
    const diff = new Date(expireDate).getTime() - new Date(CURRENT_SYSTEM_TIME).getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));

    merchants.push({
      id: `m_active_${i}`,
      name: `${district}待办商户${i}`,
      licenseNo: `41079999${i}`,
      ownerName: `张待办${i}`,
      address: `新乡市${district}新路${i}号`,
      phone: `150000000${i}`,
      expireDate: expireDate,
      daysRemaining: days,
      status: i % 5 === 0 ? 'visited' : 'pending',
      staffId: assignedStaff.id,
      district: district,
      history: []
    });

    const staffIndex = STAFF_LIST.findIndex(s => s.id === assignedStaff.id);
    if (staffIndex > -1) {
      STAFF_LIST[staffIndex].activeTasks++;
    }
  }

  return merchants;
};

export const MERCHANTS: Merchant[] = generateMerchants();
