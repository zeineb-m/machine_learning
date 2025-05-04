import React from 'react';
import { PhoneIcon, VideoCameraIcon, XMarkIcon } from '@heroicons/react/24/solid';

const CallModal = ({ 
  callData, 
  onAccept, 
  onReject, 
  isCaller,
  isRinging
}) => {
  if (!callData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md text-center">
        <div className="mb-6">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
            {callData.isVideo ? (
              <VideoCameraIcon className="h-10 w-10 text-gray-500" />
            ) : (
              <PhoneIcon className="h-10 w-10 text-gray-500" />
            )}
          </div>
          <h2 className="text-2xl font-semibold mb-1">{callData.callerName || 'Caller'}</h2>
          <p className="text-gray-600">
            {isCaller ? 'Calling...' : isRinging ? 'Incoming Call' : 'Connecting...'}
          </p>
        </div>

        <div className="flex justify-center space-x-4">
          {!isCaller && isRinging && (
            <>
              {callData.isVideo && (
                <button
                  onClick={() => onAccept(true)}
                  className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600"
                >
                  <VideoCameraIcon className="h-6 w-6" />
                </button>
              )}
              <button
                onClick={() => onAccept(false)}
                className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600"
              >
                <PhoneIcon className="h-6 w-6" />
              </button>
            </>
          )}

          <button
            onClick={onReject}
            className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallModal;