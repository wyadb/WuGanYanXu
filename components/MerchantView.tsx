import React, { useState } from 'react';
import { Merchant } from '../types';
import { Check, Upload, Clock, User, FileText, ChevronRight, LogOut, Camera, Phone } from 'lucide-react';
import { MERCHANTS, STAFF_LIST } from '../mockData';

const Steps = [
  { id: 1, title: '信息确认' },
  { id: 2, title: '材料上传' },
  { id: 3, title: '等待审核' },
  { id: 4, title: '完成延续' }
];

const MerchantView: React.FC = () => {
  const [user, setUser] = useState<Merchant | null>(null);
  const [step, setStep] = useState(1);
  const [isLogin, setIsLogin] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Auth Form State
  const [licenceInput, setLicenceInput] = useState('410710000001'); // Using new mock data format
  const [phoneInput, setPhoneInput] = useState('');
  const [nameInput, setNameInput] = useState(''); // New Name Field

  const handleLogin = () => {
    // Mock login logic - finding a user from the generated list
    // For demo, we just grab the first merchant if input is empty or specific
    let found = MERCHANTS.find(m => m.licenseNo === licenceInput);
    
    // If mocking registration, we "create" a session for a new user
    if (isRegistering) {
        if(!licenceInput || !phoneInput || !nameInput) {
            alert("请填写完整信息");
            return;
        }
        // Simulate finding the task that was pre-assigned to this license
        // In this mock, we just log them in as a pending user "m_active_0" if not found
        if (!found) found = MERCHANTS.find(m => m.id === 'm_active_0');
        if (found) {
             // Update mock data in memory for this session
             found.ownerName = nameInput;
             found.phone = phoneInput;
        }
    } else {
        // Simple Login Check
        if (!found) {
            // Fallback for demo
            found = MERCHANTS.find(m => m.id === 'm_active_0');
        }
    }

    if (found) {
      setUser(found);
      setIsLogin(false);
      // Determine step based on status
      if (found.status === 'completed') setStep(4);
      else if (['auditing', 'approved', 'delivering'].includes(found.status)) setStep(3);
      else setStep(1);
    } else {
      alert("未找到该证号任务，请联系辖区市场监管员");
    }
  };

  const currentStaff = user ? STAFF_LIST.find(s => s.id === user.staffId) : null;

  if (isLogin) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-center px-6">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
            <FileText className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">烟草许可证无感延续</h1>
          <p className="text-gray-500 mt-2">自主申报 · 零跑腿 · 快速办</p>
        </div>

        <div className="space-y-4">
          {isRegistering && (
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">经营负责人姓名</label>
                <input 
                type="text" 
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="请输入姓名"
                />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">烟草专卖零售许可证号</label>
            <input 
              type="text" 
              value={licenceInput}
              onChange={(e) => setLicenceInput(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="请输入证号"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">手机号码</label>
            <div className="flex gap-2">
              <input 
                type="tel" 
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="请输入手机号"
              />
              <button className="bg-gray-100 text-gray-600 px-4 rounded-lg text-sm font-medium whitespace-nowrap">
                获取验证码
              </button>
            </div>
          </div>
          <button 
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
          >
            {isRegistering ? '立即注册' : '立即登录'}
          </button>
          
          <div className="text-center pt-2">
             <button 
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-blue-600 text-sm font-medium"
             >
                {isRegistering ? '已有账号？去登录' : '首次办理？去注册'}
             </button>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-gray-400">
          <p>如遇操作困难，请联系市场监管员协助</p>
          <p className="mt-2">新乡市烟草专卖局</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-blue-600 p-6 pb-12 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-blue-100 text-sm mt-1">证号: {user.licenseNo}</p>
          </div>
          <button onClick={() => setIsLogin(true)} className="p-2 bg-blue-500 rounded-full hover:bg-blue-400">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Card */}
      <div className="mx-4 -mt-8 bg-white rounded-xl shadow-lg p-5 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800">办理进度</h3>
          <span className="text-blue-600 text-sm font-medium">
            {step === 1 ? '信息确认中' : step === 2 ? '材料上传中' : step === 3 ? '审核中' : '已完成'}
          </span>
        </div>
        <div className="relative flex justify-between">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0"></div>
          <div className={`absolute top-1/2 left-0 h-1 bg-blue-500 -translate-y-1/2 z-0 transition-all duration-500`} style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
          {Steps.map((s) => (
            <div key={s.id} className="relative z-10 flex flex-col items-center bg-white">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 mb-1 transition-colors ${step >= s.id ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                {step > s.id ? <Check className="w-4 h-4" /> : s.id}
              </div>
              <span className={`text-[10px] ${step >= s.id ? 'text-blue-600' : 'text-gray-400'}`}>{s.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="px-4">
        {step === 1 && (
          <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
            <h3 className="font-bold text-lg text-gray-800 border-b pb-3">核对基础信息</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500">负责人姓名</span>
                <span className="font-medium text-gray-800">{user.ownerName}</span>
              </div>
               <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500">所属辖区</span>
                <span className="font-medium text-gray-800">{user.district}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500">经营地址</span>
                <span className="font-medium text-gray-800 text-right max-w-[60%]">{user.address}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500">许可证有效期</span>
                <span className="font-medium text-red-500">{user.expireDate} (即将到期)</span>
              </div>
            </div>
            <div className="bg-yellow-50 text-yellow-800 text-xs p-3 rounded">
              请仔细核对以上信息，如信息有变动（如地址变更），请勿操作延续，直接联系市场监管员。
            </div>
            <button 
              onClick={() => setStep(2)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold mt-4"
            >
              确认无误，下一步
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="font-bold text-lg text-gray-800 mb-2">上传申请材料</h3>
              <p className="text-xs text-gray-500 mb-4">请拍摄原件，确保文字清晰、边框完整。</p>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  '营业执照',
                  '身份证人像面',
                  '身份证国徽面',
                  '烟草证正本'
                ].map((label, idx) => (
                  <div key={idx} className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 bg-gray-50 hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer relative">
                    <Camera className="w-8 h-8 mb-2" />
                    <span className="text-xs">{label}</span>
                    <input type="file" className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
                  </div>
                ))}
              </div>
            </div>
            <button 
              onClick={() => setStep(3)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold shadow-lg shadow-blue-200"
            >
              提交延续申请
            </button>
            <button 
              onClick={() => setStep(1)}
              className="w-full text-gray-500 py-3 text-sm"
            >
              上一步
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-10 h-10 text-blue-500" />
            </div>
            <h3 className="font-bold text-xl text-gray-800 mb-2">申请已提交，审核中</h3>
            <p className="text-gray-500 text-sm mb-6">
              您的延续申请已提交，市场监管员（{currentStaff?.name}）将在近期为您审核。
            </p>
            <div className="border-t pt-4">
              <p className="text-xs text-gray-400">预计办结时间：3个工作日内</p>
            </div>
          </div>
        )}
         
         {step === 4 && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="font-bold text-xl text-gray-800 mb-2">延续已完成</h3>
            <p className="text-gray-500 text-sm mb-6">
              您的新许可证已制作完成，近期将由市场监管员送达或邮寄给您。
            </p>
            <div className="bg-gray-50 p-4 rounded-lg text-left">
              <p className="text-sm font-bold text-gray-700">新证有效期</p>
              <p className="text-lg text-blue-600 font-medium">至 2030-12-31</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Contact Support */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t flex items-center justify-between z-20">
         <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
             <User className="w-6 h-6 text-gray-500" />
           </div>
           <div>
             <p className="text-xs text-gray-500">您的市场监管员</p>
             <p className="text-sm font-bold text-gray-800">{currentStaff?.name || '未分配'}</p>
           </div>
         </div>
         <a href={`tel:${currentStaff?.phone || ''}`} className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg text-sm font-medium flex items-center gap-1">
           <Phone className="w-3 h-3" />
           {currentStaff?.phone || '暂无电话'}
         </a>
      </div>
    </div>
  );
};

export default MerchantView;