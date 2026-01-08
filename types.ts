export type Role = 'merchant' | 'staff' | 'admin' | null;

export type District = '牧野' | '红旗' | '开发' | '卫滨' | '凤泉';

export type TaskStatus = 
  | 'pending'    // 待处理
  | 'scheduled'  // 已预约
  | 'visited'    // 已上门
  | 'auditing'   // 待审核
  | 'approved'   // 审核通过
  | 'rejected'   // 已驳回
  | 'delivering' // 送达中
  | 'completed'; // 已完成

export interface Merchant {
  id: string;
  name: string;
  licenseNo: string; // 烟草证号
  ownerName: string; // 法人
  address: string;
  phone: string;
  expireDate: string; // YYYY-MM-DD
  daysRemaining: number;
  status: TaskStatus;
  staffId: string;
  district: District; // Added district
  history?: {
    date: string;
    action: string;
  }[];
}

export interface Staff {
  id: string;
  name: string;
  employeeId: string;
  area: District; // Changed to typed District
  phone: string; // Added phone
  activeTasks: number;
  completedTasks: number;
}

export interface AdminStats {
  totalMerchants: number;
  completed: number;
  completionRate: number;
  avgTimeDays: number;
  rejectionRate: number;
}
