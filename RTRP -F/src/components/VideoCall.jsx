import { useState, useRef, useEffect } from 'react';
import {
    X,
    Mic,
    MicOff,
    Video,
    VideoOff,
    Monitor,
    Phone,
    Clock,
    MessageSquare,
    Settings,
    MoreHorizontal
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function VideoCall({ skill, onClose }) {
    const { addTimeCredits } = useApp();
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [sessionTime, setSessionTime] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    // Timer effect
    useEffect(() => {
        let interval;
        if (hasStarted) {
            interval = setInterval(() => {
                setSessionTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [hasStarted]);

    // Start local camera
    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.log('Camera access denied or not available'); // Handling local dev without https
            }
        };
        startCamera();

        return () => {
            if (localVideoRef.current?.srcObject) {
                localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleEndCall = () => {
        // Log hours (rounded to nearest 0.5)
        // Only add credit if session lasted > 1 min
        if (sessionTime > 60) {
            const hours = Math.max(0.5, Math.ceil((sessionTime / 3600) * 2) / 2);
            addTimeCredits(hours);
        }
        onClose();
    };

    const toggleMute = () => {
        if (localVideoRef.current?.srcObject) {
            const audioTracks = localVideoRef.current.srcObject.getAudioTracks();
            audioTracks.forEach(track => {
                track.enabled = isMuted;
            });
        }
        setIsMuted(!isMuted);
    };

    const toggleVideo = () => {
        if (localVideoRef.current?.srcObject) {
            const videoTracks = localVideoRef.current.srcObject.getVideoTracks();
            videoTracks.forEach(track => {
                track.enabled = isVideoOff;
            });
        }
        setIsVideoOff(!isVideoOff);
    };

    return (
        <div className="fixed inset-0 bg-gray-900/95 backdrop-blur-3xl z-50 flex flex-col animate-in fade-in duration-300">
            {/* Main Video Area */}
            <div className="flex-1 relative p-4 flex gap-4 overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]"></div>

                {/* Remote Video (Large) */}
                <div className="relative flex-1 bg-gray-800/50 backdrop-blur-md rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
                    <video
                        ref={remoteVideoRef}
                        className="w-full h-full object-cover"
                        autoPlay
                        playsInline
                    />

                    {/* Header Info Overlay */}
                    <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/60 to-transparent flex justify-between items-start">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <img
                                    src={skill.user.avatar}
                                    alt={skill.user.name}
                                    className="w-12 h-12 rounded-full border-2 border-white/20"
                                />
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></span>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-lg">{skill.user.name}</h3>
                                <p className="text-gray-300 text-sm">{skill.title}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur rounded-xl border border-white/10">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                            <span className="text-white font-mono font-medium">{formatTime(sessionTime)}</span>
                        </div>
                    </div>

                    {/* Placeholder when no remote stream */}
                    <div className="absolute inset-0 flex items-center justify-center -z-10">
                        <div className="text-center">
                            <div className="relative inline-block">
                                <div className="absolute inset-0 bg-purple-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                                <img
                                    src={skill.user.avatar}
                                    alt={skill.user.name}
                                    className="w-32 h-32 rounded-full bg-gray-700 relative z-10 border-4 border-gray-800"
                                />
                            </div>
                            <h3 className="text-white text-2xl font-bold mt-6">{skill.user.name}</h3>
                            <p className="text-purple-300 mt-2">{!hasStarted ? 'Ready to connect?' : 'Connecting...'}</p>
                        </div>
                    </div>
                </div>

                {/* Local Video (Floating) */}
                <div className="absolute bottom-8 right-8 w-72 aspect-video bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border border-white/10 hover:scale-105 transition-transform duration-300 z-20 group">
                    <video
                        ref={localVideoRef}
                        className="w-full h-full object-cover mirror"
                        autoPlay
                        playsInline
                        muted
                    />
                    {isVideoOff && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-gray-500">
                            <div className="text-center">
                                <VideoOff className="w-8 h-8 mx-auto mb-2" />
                                <span className="text-xs">Camera Off</span>
                            </div>
                        </div>
                    )}
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur rounded text-xs text-white">
                        You
                    </div>
                    <button className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80">
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Control Bar */}
            <div className="h-24 bg-gray-900/80 backdrop-blur-xl border-t border-white/10 flex items-center justify-center gap-6 px-8">
                {!hasStarted ? (
                    <button
                        onClick={() => setHasStarted(true)}
                        className="px-12 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-lg font-bold rounded-full shadow-lg shadow-green-500/25 hover:scale-105 transition-all"
                    >
                        Start Session
                    </button>
                ) : (
                    <>
                        <div className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-2xl border border-white/5">
                            <ControlBtn
                                icon={isMuted ? MicOff : Mic}
                                active={isMuted}
                                onClick={toggleMute}
                                activeColor="bg-red-500 text-white"
                                label="Mute"
                            />
                            <ControlBtn
                                icon={isVideoOff ? VideoOff : Video}
                                active={isVideoOff}
                                onClick={toggleVideo}
                                activeColor="bg-red-500 text-white"
                                label="Cam"
                            />
                        </div>

                        <div className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-2xl border border-white/5">
                            <ControlBtn
                                icon={Monitor}
                                active={isScreenSharing}
                                onClick={() => setIsScreenSharing(!isScreenSharing)}
                                activeColor="bg-purple-500 text-white"
                                label="Share"
                            />
                            <ControlBtn
                                icon={MessageSquare}
                                onClick={() => { }}
                                label="Chat"
                            />
                            <ControlBtn
                                icon={Settings}
                                onClick={() => { }}
                                label="Settings"
                            />
                        </div>

                        <button
                            onClick={handleEndCall}
                            className="px-8 py-4 bg-red-500 text-white font-semibold rounded-2xl hover:bg-red-600 transition-all shadow-lg hover:shadow-red-500/25 flex items-center gap-2"
                        >
                            <Phone className="w-6 h-6 rotate-[135deg]" />
                            <span className="hidden sm:inline">End Call</span>
                        </button>
                    </>
                )}
            </div>

            {/* Close button (top right) */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 p-4 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors z-50 border border-white/5"
            >
                <X className="w-6 h-6" />
            </button>
        </div>
    );
}

function ControlBtn({ icon: Icon, active = false, onClick, activeColor = 'bg-white text-gray-900', label }) {
    return (
        <div className="flex flex-col items-center gap-1 group">
            <button
                onClick={onClick}
                className={`p-4 rounded-xl transition-all ${active
                        ? activeColor
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/5'
                    }`}
            >
                <Icon className="w-6 h-6" />
            </button>
            <span className="text-[10px] text-gray-400 group-hover:text-white transition-colors">{label}</span>
        </div>
    );
}
