import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
    useEffect(() => {
        if (duration) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const styles = {
        success: 'bg-green-500/10 border-green-500/20 text-green-400',
        error: 'bg-red-500/10 border-red-500/20 text-red-400',
        info: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    };

    const icons = {
        success: <CheckCircle className="w-5 h-5" />,
        error: <AlertCircle className="w-5 h-5" />,
        info: <Info className="w-5 h-5" />,
    };

    return (
        <div className={`
      flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-lg 
      animate-slide-in-right
      ${styles[type]}
    `}>
            <span className="shrink-0">{icons[type]}</span>
            <p className="text-sm font-medium">{message}</p>
            <button
                onClick={onClose}
                className="ml-2 p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

export default Toast;
