'use client';

import { useEffect, useState } from 'react';
import { adminService } from '@/services/admin.service';
import { Loader2, Terminal, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAuditLogs();
      setLogs(data);
    } catch (err) {
      toast.error('Failed to load system logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">System Audit Logs</h1>
        <button 
          onClick={fetchLogs}
          className="bg-gray-100 text-gray-600 px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:bg-gray-200"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      <div className="bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-800">
        <div className="bg-gray-800 px-4 py-3 border-b border-gray-700 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-gray-400" />
          <span className="text-gray-300 font-mono text-sm">/var/log/ctse-microservices</span>
        </div>

        {loading ? (
          <div className="flex justify-center p-20 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <div className="p-6 font-mono text-sm h-[600px] overflow-y-auto custom-scrollbar">
            {logs.length === 0 ? (
              <p className="text-gray-500 italic">No audit logs found.</p>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="mb-3 hover:bg-gray-800/50 p-2 rounded transition-colors group">
                  <span className="text-gray-500">[{new Date(log.createdAt).toISOString()}]</span>{' '}
                  <span className="text-green-400 font-bold">INFO</span>: 
                  <span className="text-blue-400 ml-2">Action=</span><span className="text-gray-300">{log.action}</span>
                  <span className="text-purple-400 ml-4">Resource=</span><span className="text-gray-300">{log.resourceType}:{log.resourceId}</span>
                  <span className="text-yellow-400 ml-4">User=</span><span className="text-gray-300">{log.userId}</span>
                  <br/>
                  <span className="text-gray-400 pl-24 block mt-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    Details: {log.details}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
