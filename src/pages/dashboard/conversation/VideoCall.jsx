import React, { useState, useEffect, useRef } from 'react';
import { XMarkIcon, PhoneIcon, VideoCameraIcon, MicrophoneIcon, SpeakerWaveIcon } from '@heroicons/react/24/solid';

const VideoCall = ({ 
  callData, 
  onEndCall, 
  onAcceptCall, 
  onRejectCall,
  localStream,
  remoteStream,
  isCaller,
  isVideoOn,
  isAudioOn,
  toggleVideo,
  toggleAudio
}) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  useEffect(() => {
    let interval;
    if (callData?.isActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }

    return () => clearInterval(interval);
  }, [callData?.isActive]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!callData) return null;

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-50">
        <div className="flex items-center">
          <div className="w-16 h-12 bg-gray-200 rounded mr-2 overflow-hidden">
            {remoteStream && (
              <video 
                ref={remoteVideoRef} 
                autoPlay 
                playsInline 
                muted
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div>
            <p className="text-sm font-medium">{callData.name || 'Call in progress'}</p>
            <p className="text-xs text-gray-500">{formatTime(callDuration)}</p>
          </div>
          <button 
            onClick={() => setIsMinimized(false)}
            className="ml-2 text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <button 
            onClick={onEndCall}
            className="ml-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            <PhoneIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
      {/* Call header */}
      <div className="bg-black bg-opacity-50 text-white p-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">{callData.name || 'Video Call'}</h2>
          <p className="text-gray-300">{formatTime(callDuration)}</p>
        </div>
        <div className="flex space-x-4">
          <button 
            onClick={() => setIsMinimized(true)}
            className="text-white hover:text-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <button 
            onClick={onEndCall}
            className="text-white hover:text-gray-300"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
      <div className="flex-1 relative">
        {remoteStream ? (
          <video 
            ref={remoteVideoRef} 
            autoPlay 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-center">
              <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl text-white">
                  {callData.name ? callData.name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
              <p className="text-white text-xl">{callData.name || 'Caller'}</p>
              <p className="text-gray-400">{callData.isActive ? 'Call in progress' : 'Connecting...'}</p>
            </div>
          </div>
        )}

        {localStream && (
          <div className="absolute bottom-4 right-4 w-1/4 max-w-xs h-1/4 max-h-48 bg-black rounded-lg overflow-hidden border-2 border-gray-600">
            <video 
              ref={localVideoRef} 
              autoPlay 
              playsInline 
              muted
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      <div className="bg-black bg-opacity-50 p-4 flex justify-center space-x-6">
        <button 
          onClick={toggleVideo}
          className={`p-3 rounded-full ${isVideoOn ? 'bg-gray-700 text-white' : 'bg-red-500 text-white'}`}
        >
          <VideoCameraIcon className="h-6 w-6" />
        </button>
        <button 
          onClick={toggleAudio}
          className={`p-3 rounded-full ${isAudioOn ? 'bg-gray-700 text-white' : 'bg-red-500 text-white'}`}
        >
          <MicrophoneIcon className="h-6 w-6" />
        </button>
        <button 
          onClick={onEndCall}
          className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600"
        >
          <PhoneIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default VideoCall;