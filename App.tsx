import React, { useState } from 'react';
import { Role, District } from './types';
import AdminView from './components/AdminView';
import StaffView from './components/StaffView';
import MerchantView from './components/MerchantView';
import { Monitor, Smartphone, Users, Lock, ChevronRight, User } from 'lucide-react';
import { STAFF_LIST } from './mockData';

// Security Codes
const ADMIN_CODE = "8888";
const STAFF_CODE = "1234"; 

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
  const [inputName, setInputName] = useState("");

  const handleAuth = () => {
    // Admin Login
    if (showAuthModal === 'admin') {
      if (inputCode === ADMIN_CODE) {
        onSelectAdmin();
      } else {
        alert("管理员密码错误 (演示: 8888)");
      }
      return;
    }

    // Staff Login
    if (showAuthModal === 'staff') {
      if (inputCode !== STAFF_CODE) {
        alert("监管员专用码错误 (演示: 1234)");
        return;
      }

      if (!inputName.trim()) {
        alert("请输入您的姓名");
        return;
      }

      // Check against "Database"
      const foundStaff = STAFF_LIST.find(s => s.name === inputName.trim());
      
      if (foundStaff) {
        onSelectStaff(foundStaff.id);
      } else {
        alert("登录失败：系统中未找到该姓名。请联系管理员确认是否已录入。");
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
            onClick={() => { setShowAuthModal('admin'); setInputCode(""); setInputName(""); }}
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
            onClick={() => { setShowAuthModal('staff'); setInputCode(""); setInputName(""); }}
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
              {showAuthModal === 'admin' ? '管理员登录' : '市场监管员登录'}
            </h3>
            
            <div className="space-y-4">
              {showAuthModal === 'staff' && (
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">
                     <User className="w-3 h-3 inline mr-1" />姓名
                   </label>
                   <input 
                    type="text" 
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="请输入您的姓名"
                  />
                  <p className="text-xs text-gray-400 mt-1 ml-1">演示账号：李明</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                   <Lock className="w-3 h-3 inline mr-1" />
                   {showAuthModal === 'admin' ? '管理员密码' : '监管员专用码'}
                </label>
                <input 
                  type="password" 
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder={showAuthModal === 'admin' ? "请输入管理员密码" : "请输入专用码"}
                />
                <p className="text-xs text-gray-400 mt-1 ml-1">
                  演示专用码：{showAuthModal === 'admin' ? '8888' : '1234'}
                </p>
              </div>

              <button 
                onClick={handleAuth}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 mt-2"
              >
                进入系统
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
