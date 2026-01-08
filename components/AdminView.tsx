import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Users, FileCheck, AlertTriangle, Activity, MapPin, Upload, FileSpreadsheet, Filter, Calendar } from 'lucide-react';
import { STAFF_LIST, MERCHANTS, CURRENT_SYSTEM_TIME } from '../mockData';
import { District, TaskStatus } from '../types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AdminView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'management'>('dashboard');
  
  // Filters
  const [selectedDistrict, setSelectedDistrict] = useState<District | 'All'>('All');
  const [selectedMonth, setSelectedMonth] = useState<string>('All'); // '2025-01', '2025-02'... or 'All'

  // Mock Months for 2025
  const months2025 = Array.from({ length: 12 }, (_, i) => `2025-${String(i + 1).padStart(2, '0')}`);

  // Derived Data
  const filteredMerchants = useMemo(() => {
    return MERCHANTS.filter(m => {
      const matchDistrict = selectedDistrict === 'All' || m.district === selectedDistrict;
      // Filter by expiry date month roughly
      const matchMonth = selectedMonth === 'All' || m.expireDate.startsWith(selectedMonth);
      return matchDistrict && matchMonth;
    });
  }, [selectedDistrict, selectedMonth]);

  const filteredStaff = useMemo(() => {
    return STAFF_LIST.filter(s => selectedDistrict === 'All' || s.area === selectedDistrict);
  }, [selectedDistrict]);

  // Stats Calculation
  const stats = useMemo(() => {
    const total = filteredMerchants.length;
    const completed = filteredMerchants.filter(m => m.status === 'completed').length;
    const rejected = filteredMerchants.filter(m => m.status === 'rejected').length;
    // Avg time dummy calculation
    const avgTime = 3.5; 
    
    return {
      total,
      completed,
      rejected,
      rate: total > 0 ? ((completed / total) * 100).toFixed(1) : '0',
      avgTime
    };
  }, [filteredMerchants]);

  // Chart Data
  const pieData = [
    { name: '已完成', value: filteredMerchants.filter(m => m.status === 'completed').length },
    { name: '办理中', value: filteredMerchants.filter(m => ['scheduled', 'visited', 'auditing', 'delivering'].includes(m.status)).length },
    { name: '已驳回', value: filteredMerchants.filter(m => m.status === 'rejected').length },
    { name: '待处理', value: filteredMerchants.filter(m => m.status === 'pending').length },
  ].filter(d => d.value > 0);

  // Group by District for Bar Chart
  const barData = useMemo(() => {
    if (selectedDistrict !== 'All') {
      // If specific district selected, show Staff performance
      return filteredStaff.map(s => ({
        name: s.name,
        已办结: MERCHANTS.filter(m => m.staffId === s.id && m.status === 'completed').length,
        处理中: MERCHANTS.filter(m => m.staffId === s.id && m.status !== 'completed').length,
      }));
    } else {
      // Show District performance
      const districts: District[] = ['牧野', '红旗', '开发', '卫滨', '凤泉'];
      return districts.map(d => ({
        name: d,
        已办结: filteredMerchants.filter(m => m.district === d && m.status === 'completed').length,
        总量: filteredMerchants.filter(m => m.district === d).length,
      }));
    }
  }, [selectedDistrict, filteredStaff, filteredMerchants]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-slate-800 text-white p-4 shadow-md sticky top-0 z-20">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-400" />
            管理员控制台
            <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300 font-normal">系统时间: {CURRENT_SYSTEM_TIME}</span>
          </h1>
          <div className="flex space-x-2">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'hover:bg-slate-700 text-slate-300'}`}
            >
              数据看板
            </button>
            <button 
              onClick={() => setActiveTab('management')}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${activeTab === 'management' ? 'bg-blue-600 text-white' : 'hover:bg-slate-700 text-slate-300'}`}
            >
              数据管理
            </button>
          </div>
        </div>

        {/* Filters Area */}
        {activeTab === 'dashboard' && (
          <div className="flex flex-wrap gap-4 items-center bg-slate-700/50 p-3 rounded-lg border border-slate-600">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-300">区域:</span>
              <select 
                value={selectedDistrict} 
                onChange={(e) => setSelectedDistrict(e.target.value as District | 'All')}
                className="bg-slate-800 border border-slate-600 text-white text-sm rounded px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="All">全市 (总体)</option>
                <option value="牧野">牧野</option>
                <option value="红旗">红旗</option>
                <option value="开发">开发</option>
                <option value="卫滨">卫滨</option>
                <option value="凤泉">凤泉</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-300">时间:</span>
              <select 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-slate-800 border border-slate-600 text-white text-sm rounded px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="All">2025年全年</option>
                {months2025.map(m => (
                  <option key={m} value={m}>{m}月</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 p-6 overflow-y-auto">
        {activeTab === 'dashboard' ? (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">临期商户总数</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{stats.total}</p>
                    <p className="text-xs text-green-500 mt-1 flex items-center">
                       {selectedDistrict === 'All' ? '全市数据' : `${selectedDistrict}区数据`}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Users className="text-blue-600 w-6 h-6" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">已办结数</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{stats.completed}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      办结率 {stats.rate}%
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <FileCheck className="text-green-600 w-6 h-6" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">平均办结时长</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{stats.avgTime} <span className="text-sm font-normal text-gray-500">天</span></p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <Activity className="text-yellow-600 w-6 h-6" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">驳回数</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{stats.rejected}</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <AlertTriangle className="text-red-600 w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Bar Chart */}
              <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-6">
                  {selectedDistrict === 'All' ? '各区域办理情况对比' : `${selectedDistrict}区监管员绩效对比`}
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        cursor={{ fill: '#f3f4f6' }}
                      />
                      <Legend iconType="circle" />
                      {selectedDistrict === 'All' ? (
                        <>
                          <Bar dataKey="已办结" fill="#10B981" radius={[4, 4, 0, 0]} barSize={30} />
                          <Bar dataKey="总量" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={30} />
                        </>
                      ) : (
                        <>
                          <Bar dataKey="已办结" fill="#10B981" radius={[4, 4, 0, 0]} barSize={20} />
                          <Bar dataKey="处理中" fill="#F59E0B" radius={[4, 4, 0, 0]} barSize={20} />
                        </>
                      )}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pie Chart */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-6">办理状态占比</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Lists Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Staff List */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                  <h3 className="font-bold text-gray-800">市场监管员列表 ({filteredStaff.length})</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 sticky top-0">
                      <tr>
                        <th className="p-3">姓名</th>
                        <th className="p-3">所属队所</th>
                        <th className="p-3">电话</th>
                        <th className="p-3">累计办结</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStaff.map(s => (
                        <tr key={s.id} className="border-b border-gray-50 hover:bg-blue-50/50">
                          <td className="p-3 font-medium text-gray-800">{s.name}</td>
                          <td className="p-3">
                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">{s.area}</span>
                          </td>
                          <td className="p-3 text-gray-500">{s.phone}</td>
                          <td className="p-3 font-bold text-green-600">{s.completedTasks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Detailed Merchant List */}
               <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                  <h3 className="font-bold text-gray-800">商户详情 ({filteredMerchants.length})</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 sticky top-0">
                      <tr>
                        <th className="p-3">商户名称</th>
                        <th className="p-3">所属队所</th>
                        <th className="p-3">到期日期</th>
                        <th className="p-3">监管员</th>
                        <th className="p-3">状态</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMerchants.slice(0, 100).map(m => ( // Limit render for perf
                        <tr key={m.id} className="border-b border-gray-50 hover:bg-blue-50/50">
                          <td className="p-3">
                            <div className="font-medium text-gray-800">{m.name}</div>
                            <div className="text-xs text-gray-400">{m.licenseNo}</div>
                          </td>
                          <td className="p-3">{m.district}</td>
                          <td className="p-3 text-gray-500">{m.expireDate}</td>
                          <td className="p-3">
                             {STAFF_LIST.find(s => s.id === m.staffId)?.name || '未分配'}
                          </td>
                          <td className="p-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              m.status === 'completed' ? 'bg-green-100 text-green-700' :
                              m.status === 'rejected' ? 'bg-red-100 text-red-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {m.status === 'completed' ? '已办结' : '办理中'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Management Tab */
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
               <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                 <FileSpreadsheet className="w-10 h-10 text-blue-600" />
               </div>
               <h2 className="text-xl font-bold text-gray-800 mb-2">批量导入商户数据</h2>
               <p className="text-gray-500 mb-6">
                 请上传 Excel 文件，需包含：商户名称、烟草证号、有效期、联系电话、所属队所、经营地址、负责人姓名。
               </p>
               <button 
                 onClick={() => alert("模拟功能：数据导入成功！新增 128 条商户数据。")}
                 className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium shadow-lg shadow-blue-200 flex items-center gap-2 mx-auto"
               >
                 <Upload className="w-5 h-5" />
                 点击上传文件
               </button>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
               <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-2">单个商户录入</h3>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">商户名称</label>
                   <input type="text" className="w-full border border-gray-300 rounded p-2" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">所属队所</label>
                    <select className="w-full border border-gray-300 rounded p-2">
                      <option>牧野</option>
                      <option>红旗</option>
                      <option>开发</option>
                      <option>卫滨</option>
                      <option>凤泉</option>
                    </select>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">许可证有效期</label>
                   <input type="date" className="w-full border border-gray-300 rounded p-2" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">指派监管员</label>
                   <input type="text" placeholder="输入姓名自动检索" className="w-full border border-gray-300 rounded p-2" />
                 </div>
                 <div className="col-span-2">
                    <button className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-900">保存录入</button>
                 </div>
               </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminView;
