import React, { useState } from 'react';
import { Role, District } from './types';
import AdminView from './components/AdminView';
import StaffView from './components/StaffView';
import MerchantView from './components/MerchantView';
import { Monitor, Smartphone, Users, Lock, ChevronRight } from 'lucide-react';
import { STAFF_LIST } from './mockData';

const ACCESS_CODE = "8888"; // Pre-set exclusive code

function App() {
  const [currentRole, setCurrentRole] = useState<Role>(null);
  const [currentStaffId, setCurrentStaffId] = useState<string>("");

  const handleStaffLogin = (staffId: string) => {
    setCurrentStaffId(staffId);
    setCurrentRole('staff');
  };

  const renderView = () => {
    switch (currentRole) {
      case 'admin':
        return <AdminView />;
      case 'staff':
        return <StaffView currentStaffId={currentStaffId} />;
      case 'merchant':
        return <MerchantView />;
      default:
        return <RoleSelection onSelectAdmin={() => setCurrentRole('admin')} onSelectStaff={handleStaffLogin} onSelectMerchant={() => setCurrentRole('merchant')} />;
    }
  };

  return (
    <>
      {renderView()}
      {currentRole && (
        <div className="fixed bottom-4 right-4 z-50">
          <button 
            onClick={() => setCurrentRole(null)}
            className="bg-black/80 text-white px-4 py-2 rounded-full shadow-lg hover:bg-black text-xs font-mono backdrop-blur"
          >
            退出演示 ({currentRole})
          </button>
        </div>
      )}
    </>
  );
}

interface RoleSelectionProps {
  onSelectAdmin: () => void;
  onSelectStaff: (id: string) => void;
  onSelectMerchant: () => void;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({ onSelectAdmin, onSelectStaff, onSelectMerchant }) => {
  const [showAuthModal, setShowAuthModal] = useState<'admin' | 'staff' | null>(null);
  const [inputCode, setInputCode] = useState("");
  
  // Staff Registration State
  const [staffName, setStaffName] = useState("");
  const [staffDistrict, setStaffDistrict] = useState<District>('牧野');
  const [staffPhone, setStaffPhone] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleAuth = () => {
    if (inputCode !== ACCESS_CODE) {
      alert("专属码错误，请联系管理员");
      return;
    }

    if (showAuthModal === 'admin') {
      onSelectAdmin();
    } else if (showAuthModal === 'staff') {
      // For demo purposes, if registering, we create a mock "session"
      // If just logging in, we pick the first staff from mock data
      if (isRegistering) {
        if (!staffName || !staffPhone) {
          alert("请填写完整信息");
          return;
        }
        // In a real app, this would post to backend. 
        // Here we just simulate logging in as a new staff (or existing one for demo simplicity)
        // Let's just log them in as the first staff of that district for the demo
        const mockStaff = STAFF_LIST.find(s => s.area === staffDistrict);
        if (mockStaff) {
          onSelectStaff(mockStaff.id);
        } else {
          onSelectStaff('s1');
        }
      } else {
        // Simulating login existing staff 's1'
        onSelectStaff('s1'); 
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
         <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
         <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-5xl w-full z-10">
        <div className="text-center mb-16">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 text-blue-300 text-xs font-medium mb-4 border border-blue-500/30">
            系统时间: 2026年1月
          </span>
          <h1 className="text-5xl font-bold text-white mb-6 tracking-tight">新乡烟草‘无感延续’系统</h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            全流程数字化管理 · 网格化精准服务 · 零跑腿无感办理
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Admin Card */}
          <div 
            onClick={() => { setShowAuthModal('admin'); setIsRegistering(false); setInputCode(""); }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all cursor-pointer group hover:-translate-y-2 duration-300"
          >
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
              <Monitor className="text-white w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">管理员端</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              数据驾驶舱、全量商户管理、任务智能分配。支持Excel批量导入。
            </p>
            <div className="flex items-center text-blue-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
              进入管理后台 <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>

          {/* Staff Card */}
          <div 
            onClick={() => { setShowAuthModal('staff'); setIsRegistering(true); setInputCode(""); }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all cursor-pointer group hover:-translate-y-2 duration-300"
          >
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-green-500/30">
              <Users className="text-white w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">市场监管员端</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              原“工作人员端”。任务池管理、上门核验、历史办理查询。
            </p>
             <div className="flex items-center text-green-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
              进入工作台 <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>

          {/* Merchant Card */}
          <div 
            onClick={onSelectMerchant}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all cursor-pointer group hover:-translate-y-2 duration-300"
          >
            <div className="bg-gradient-to-br from-orange-500 to-red-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-orange-500/30">
              <Smartphone className="text-white w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">商户端</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              实名注册、材料自主上传、办理进度实时查询。
            </p>
             <div className="flex items-center text-orange-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
              立即办理 <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-in fade-in zoom-in duration-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              {showAuthModal === 'admin' ? '管理员登录' : '市场监管员注册/登录'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                   <Lock className="w-3 h-3 inline mr-1" />专属码
                </label>
                <input 
                  type="password" 
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="请输入预设专属码 (8888)"
                />
              </div>

              {showAuthModal === 'staff' && isRegistering && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">所属队所</label>
                    <select 
                      value={staffDistrict}
                      onChange={(e) => setStaffDistrict(e.target.value as District)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                      <option value="牧野">牧野</option>
                      <option value="红旗">红旗</option>
                      <option value="开发">开发</option>
                      <option value="卫滨">卫滨</option>
                      <option value="凤泉">凤泉</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                    <input 
                      type="text" 
                      value={staffName}
                      onChange={(e) => setStaffName(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="请输入您的姓名"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">联系电话</label>
                    <input 
                      type="tel" 
                      value={staffPhone}
                      onChange={(e) => setStaffPhone(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="请输入您的手机号"
                    />
                  </div>
                </>
              )}

              <button 
                onClick={handleAuth}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 mt-2"
              >
                {isRegistering ? '验证并进入' : '进入系统'}
              </button>
              
              <button 
                onClick={() => setShowAuthModal(null)}
                className="w-full text-gray-500 py-2 text-sm hover:text-gray-800"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
