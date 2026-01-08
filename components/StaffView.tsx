import React, { useState } from 'react';
import { MERCHANTS, STAFF_LIST } from '../mockData';
import { Merchant, TaskStatus } from '../types';
import { Phone, MapPin, Calendar, Clock, CheckCircle, AlertCircle, FileText, Truck, ArrowRight, History, List } from 'lucide-react';

interface StaffViewProps {
  currentStaffId: string;
}

const statusMap: Record<TaskStatus, { label: string; color: string; bg: string }> = {
  pending: { label: '待处理', color: 'text-gray-600', bg: 'bg-gray-100' },
  scheduled: { label: '已预约', color: 'text-blue-600', bg: 'bg-blue-100' },
  visited: { label: '已上门', color: 'text-purple-600', bg: 'bg-purple-100' },
  auditing: { label: '待审核', color: 'text-orange-600', bg: 'bg-orange-100' },
  approved: { label: '审核通过', color: 'text-green-600', bg: 'bg-green-100' },
  rejected: { label: '已驳回', color: 'text-red-600', bg: 'bg-red-100' },
  delivering: { label: '送达中', color: 'text-indigo-600', bg: 'bg-indigo-100' },
  completed: { label: '已完成', color: 'text-emerald-800', bg: 'bg-emerald-200' },
};

const StaffView: React.FC<StaffViewProps> = ({ currentStaffId }) => {
  const staff = STAFF_LIST.find(s => s.id === currentStaffId);
  const [selectedTask, setSelectedTask] = useState<Merchant | null>(null);
  const [activeTab, setActiveTab] = useState<'tasks' | 'history'>('tasks');

  // Filter Tasks
  const myMerchants = MERCHANTS.filter(m => m.staffId === currentStaffId);
  
  // Pending/Active Tasks (Not completed)
  const activeTasks = myMerchants.filter(m => m.status !== 'completed').sort((a, b) => a.daysRemaining - b.daysRemaining);
  const urgentTasks = activeTasks.filter(m => m.daysRemaining <= 7);

  // Completed History
  const historyTasks = myMerchants.filter(m => m.status === 'completed').sort((a, b) => new Date(b.expireDate).getTime() - new Date(a.expireDate).getTime());

  const handleStatusUpdate = (newStatus: TaskStatus) => {
    if(!selectedTask) return;
    alert(`任务状态更新为: ${statusMap[newStatus].label}`);
    setSelectedTask(null);
  };

  if (selectedTask) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white shadow p-4 sticky top-0 z-10 flex items-center gap-3">
          <button onClick={() => setSelectedTask(null)} className="text-gray-600 hover:bg-gray-100 p-2 rounded-full">
            ← 返回
          </button>
          <h1 className="font-bold text-lg">商户详情</h1>
        </header>

        <main className="p-4 space-y-4 overflow-y-auto">
          {/* Info Card */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-1">{selectedTask.name}</h2>
            <p className="text-gray-500 text-sm mb-4">证号: {selectedTask.licenseNo}</p>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                <span>{selectedTask.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <a href={`tel:${selectedTask.phone}`} className="text-blue-600">{selectedTask.phone} ({selectedTask.ownerName})</a>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className={selectedTask.daysRemaining <= 7 && selectedTask.status !== 'completed' ? "text-red-500 font-bold" : "text-gray-700"}>
                  {selectedTask.expireDate} 到期 
                  {selectedTask.status !== 'completed' && ` (剩 ${selectedTask.daysRemaining} 天)`}
                </span>
              </div>
            </div>
          </div>

          {/* Action Area (Only for non-completed) */}
          {selectedTask.status !== 'completed' && (
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">流程操作</h3>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => handleStatusUpdate('scheduled')} className="flex flex-col items-center justify-center p-3 border rounded-lg hover:bg-blue-50 border-blue-200 text-blue-700">
                  <Phone className="w-6 h-6 mb-1" />
                  <span className="text-xs">预约上门</span>
                </button>
                <button onClick={() => handleStatusUpdate('visited')} className="flex flex-col items-center justify-center p-3 border rounded-lg hover:bg-purple-50 border-purple-200 text-purple-700">
                  <MapPin className="w-6 h-6 mb-1" />
                  <span className="text-xs">上门核验</span>
                </button>
                <button onClick={() => handleStatusUpdate('auditing')} className="flex flex-col items-center justify-center p-3 border rounded-lg hover:bg-yellow-50 border-yellow-200 text-yellow-700">
                  <CheckCircle className="w-6 h-6 mb-1" />
                  <span className="text-xs">初审提交</span>
                </button>
                <button onClick={() => handleStatusUpdate('completed')} className="flex flex-col items-center justify-center p-3 border rounded-lg hover:bg-green-50 border-green-200 text-green-700">
                  <FileText className="w-6 h-6 mb-1" />
                  <span className="text-xs">办结/送达</span>
                </button>
              </div>
            </div>
          )}

          {/* History */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-bold text-gray-800 mb-3">办理记录</h3>
            <div className="space-y-4">
               {selectedTask.history?.map((h, idx) => (
                 <div key={idx} className="flex gap-3">
                   <div className="flex flex-col items-center">
                     <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                     <div className="w-0.5 h-full bg-gray-200 flex-1"></div>
                   </div>
                   <div>
                     <p className="text-xs text-gray-400">{h.date}</p>
                     <p className="text-sm text-gray-700">{h.action}</p>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-blue-700 text-white p-4 pb-4 sticky top-0 z-0 shadow-md">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h1 className="text-xl font-bold">市场监管员工作台</h1>
            <p className="text-blue-200 text-sm flex items-center gap-2 mt-1">
              <span>{staff?.name}</span>
              <span className="bg-blue-600 px-2 py-0.5 rounded text-xs border border-blue-500">{staff?.area}</span>
            </p>
          </div>
          <div className="text-right text-xs text-blue-200">
             <p>{staff?.phone}</p>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white flex border-b sticky top-[88px] z-10">
        <button 
          onClick={() => setActiveTab('tasks')}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'tasks' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          <List className="w-4 h-4" /> 待办任务 ({activeTasks.length})
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          <History className="w-4 h-4" /> 已办历史 ({historyTasks.length})
        </button>
      </div>

      <main className="flex-1 px-4 py-4 space-y-3 overflow-y-auto">
        {activeTab === 'tasks' ? (
          <>
            {urgentTasks.length > 0 && (
               <div className="bg-red-50 border border-red-100 p-3 rounded-lg mb-4 flex items-center gap-2 text-red-700 text-sm">
                 <AlertCircle className="w-4 h-4" />
                 你有 {urgentTasks.length} 个商户即将到期 (7天内)，请优先处理!
               </div>
            )}
            
            {activeTasks.map(task => (
              <div 
                key={task.id} 
                onClick={() => setSelectedTask(task)}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 active:scale-[0.98] transition-transform duration-100"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-800">{task.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${statusMap[task.status].bg} ${statusMap[task.status].color}`}>
                    {statusMap[task.status].label}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-3 line-clamp-1">{task.address}</p>
                <div className="flex justify-between items-center text-sm">
                  <div className={`flex items-center gap-1 ${task.daysRemaining <= 7 ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                    <Clock className="w-3 h-3" />
                    <span>剩 {task.daysRemaining} 天到期</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300" />
                </div>
              </div>
            ))}
             {activeTasks.length === 0 && <p className="text-center text-gray-400 mt-10">暂无待办任务</p>}
          </>
        ) : (
          /* History List */
          <>
             {historyTasks.map(task => (
              <div 
                key={task.id} 
                onClick={() => setSelectedTask(task)}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 opacity-80"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-600">{task.name}</h3>
                  <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">
                    已完成
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-2">有效期至: {task.expireDate}</p>
                <p className="text-xs text-gray-400">办结时间: {task.history?.[0]?.date || '2025-12-30'}</p>
              </div>
            ))}
            {historyTasks.length === 0 && <p className="text-center text-gray-400 mt-10">暂无办理记录</p>}
          </>
        )}
      </main>
    </div>
  );
};

export default StaffView;
