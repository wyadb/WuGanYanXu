import { Merchant, Staff, District, TaskStatus } from './types';

// 1. System Time Simulation
export const CURRENT_SYSTEM_TIME = '2026-01-15';

// Helper Data for Realistic Names
const SURNAMES = ['王', '李', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗'];
const GIVEN_NAMES = ['伟', '强', '磊', '洋', '勇', '军', '杰', '涛', '超', '明', '刚', '平', '辉', '鹏', '华', '芳', '娜', '敏', '静', '秀', '娟', '英', '慧', '巧', '美', '霞', '丽'];

const SHOP_PREFIXES = ['乐家', '旺旺', '好邻居', '诚信', '惠民', '便民', '万家', '友谊', '兴旺', '聚福', '新星', '阳光', '天天', '幸福', '老街', '悦客', '全家福', '鸿运', '喜洋洋', '百顺'];
const SHOP_SUFFIXES = ['便利店', '超市', '烟酒店', '副食店', '百货店', '商行', '生活超市'];

const getRandomName = () => {
  const surname = SURNAMES[Math.floor(Math.random() * SURNAMES.length)];
  const givenName = GIVEN_NAMES[Math.floor(Math.random() * GIVEN_NAMES.length)];
  return surname + givenName;
};

const getRandomShopName = () => {
    const prefix = SHOP_PREFIXES[Math.floor(Math.random() * SHOP_PREFIXES.length)];
    const suffix = SHOP_SUFFIXES[Math.floor(Math.random() * SHOP_SUFFIXES.length)];
    return prefix + suffix;
}

// 2. Districts and Staff Generation
const DISTRICTS: District[] = ['牧野', '红旗', '开发', '卫滨', '凤泉'];

const generateStaff = (): Staff[] => {
  const staffList: Staff[] = [];
  
  // --- HARDCODED DEMO USER ---
  staffList.push({
    id: 's_demo',
    name: '李明',
    employeeId: 'YG1001',
    area: '牧野',
    phone: '13900000001',
    activeTasks: 5,
    completedTasks: 12
  });

  let idCounter = 2;

  DISTRICTS.forEach(district => {
    // 5-8 staff per district
    const count = Math.floor(Math.random() * 4) + 5; 
    for (let i = 0; i < count; i++) {
      staffList.push({
        id: `s${idCounter}`,
        name: getRandomName(), // Use realistic name
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

  // --- HARDCODED DEMO MERCHANT ---
  // A merchant that needs renewal
  merchants.push({
    id: 'm_demo_active',
    name: '牧野区演示便利店',
    licenseNo: '410712345678',
    ownerName: '张演示',
    address: '新乡市牧野区演示路88号',
    phone: '13800000001', // Demo phone for login
    expireDate: '2026-02-01', // Expiring soon
    daysRemaining: 17,
    status: 'pending',
    staffId: 's_demo', // Assigned to Li Ming
    district: '牧野',
    history: []
  });

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
      
      const shopName = getRandomShopName();
      
      merchants.push({
        id: `m${idCounter}`,
        name: `${district}${shopName}`, // Add district prefix for better context
        licenseNo: `4107${10000000 + idCounter}`,
        ownerName: getRandomName(), // Realistic owner name
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
    
    const shopName = getRandomShopName();

    merchants.push({
      id: `m_active_${i}`,
      name: `${district}${shopName}`,
      licenseNo: `41079999${i}`,
      ownerName: getRandomName(),
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
