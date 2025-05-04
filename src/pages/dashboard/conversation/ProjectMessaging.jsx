import React, { useState, useEffect, useRef } from 'react';
import { PaperAirplaneIcon, EllipsisVerticalIcon, PhoneIcon, VideoCameraIcon } from '@heroicons/react/24/solid';
import { format } from 'date-fns';
import { io } from 'socket.io-client';
import CallModal from './CallModal';
import VideoCall from './VideoCall';

const ProjectMessaging = ({ projectId, senderId }) => {
  // State for messaging
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  
  // State for calls
  const [callData, setCallData] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isCaller, setIsCaller] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  const [activeCall, setActiveCall] = useState(false);

  // Refs
  const pcRef = useRef(null);
  const messageSocketRef = useRef(null);
  const callSocketRef = useRef(null);

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:3001/api/messages/project/${projectId}?userId=${senderId}`);
        if (!response.ok) throw new Error('Failed to fetch messages');
        const data = await response.json();
        setMessages(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to load messages. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (senderId) fetchMessages();
  }, [projectId, senderId]);

  // Initialize sockets
  useEffect(() => {
    // Message socket
    messageSocketRef.current = io('http://localhost:3001/messages', {
      transports: ['websocket'],
      withCredentials: true
    });
    
    messageSocketRef.current.on('connect', () => {
      console.log('Connected to message socket');
      messageSocketRef.current.emit('join_project', projectId);
    });
    
    messageSocketRef.current.on('receive_message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    // Call socket
    callSocketRef.current = io('http://localhost:3001/call', {
      transports: ['websocket'],
      withCredentials: true
    });
    
    callSocketRef.current.on('connect', () => {
      console.log('Connected to call socket');
      callSocketRef.current.emit('join_call_room', { projectId, userId: senderId });
    });

    // Call events
    callSocketRef.current.on('call_received', (data) => {
      setCallData({
        ...data,
        isVideo: data.isVideo,
        callerId: data.callerId,
        isActive: true
      });
      setIsCaller(false);
      setIsRinging(true);
    });

    callSocketRef.current.on('call_accepted', (data) => {
      setIsRinging(false);
      setActiveCall(true);
    });

    callSocketRef.current.on('call_rejected', () => {
      endCall();
      alert('Call rejected');
    });

    callSocketRef.current.on('call_ended', () => {
      endCall();
    });

    // WebRTC events
    callSocketRef.current.on('offer', async (data) => {
      if (!isCaller && pcRef.current) {
        try {
          await pcRef.current.setRemoteDescription(new RTCSessionDescription(data.offer));
          const answer = await pcRef.current.createAnswer();
          await pcRef.current.setLocalDescription(answer);
          
          callSocketRef.current.emit('answer', {
            projectId,
            answer,
            callerId: data.callerId,
            calleeId: senderId
          });
        } catch (err) {
          console.error('Error handling offer:', err);
          endCall();
        }
      }
    });

    callSocketRef.current.on('answer', async (data) => {
      if (pcRef.current && pcRef.current.signalingState !== 'stable') {
        try {
          await pcRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
        } catch (err) {
          console.error('Error handling answer:', err);
          endCall();
        }
      }
    });

    callSocketRef.current.on('ice_candidate', async (data) => {
      try {
        if (data.candidate && pcRef.current) {
          await pcRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        }
      } catch (err) {
        console.error('Error adding ICE candidate:', err);
      }
    });

    return () => {
      messageSocketRef.current?.emit('leave_project', projectId);
      messageSocketRef.current?.disconnect();
      callSocketRef.current?.emit('leave_call_room', projectId);
      callSocketRef.current?.disconnect();
      endCall();
    };
  }, [projectId, senderId]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize peer connection
  const createPeerConnection = async (isVideo) => {
    try {
      const configuration = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' }
        ]
      };

      const pc = new RTCPeerConnection(configuration);
      pcRef.current = pc;

      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          callSocketRef.current.emit('ice_candidate', {
            projectId,
            candidate: event.candidate,
            userId: senderId
          });
        }
      };

      // Handle remote stream
      pc.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          setRemoteStream(event.streams[0]);
        }
      };

      // Get local media
      const constraints = {
        audio: true,
        video: isVideo ? { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } : false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setLocalStream(stream);
      setIsVideoOn(isVideo);
      setIsAudioOn(true);

      // Add tracks to peer connection
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
      });

      return pc;
    } catch (err) {
      console.error('Error creating peer connection:', err);
      throw err;
    }
  };

  const startCall = async (isVideo) => {
    try {
      setIsCaller(true);
      setIsRinging(true);
      
      // Create peer connection and get media
      await createPeerConnection(isVideo);

      // Set call data
      setCallData({
        isVideo,
        callerName: 'Calling...',
        projectId,
        isActive: true
      });

      // Notify other users
      callSocketRef.current.emit('start_call', {
        projectId,
        callerId: senderId,
        isVideo
      });

      // Create offer
      const pc = pcRef.current;
      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: isVideo
      });
      await pc.setLocalDescription(offer);

      // Send offer to callee
      callSocketRef.current.emit('offer', {
        projectId,
        offer,
        callerId: senderId,
        calleeId: null // Will be set by server
      });

    } catch (err) {
      console.error('Error starting call:', err);
      endCall();
    }
  };

  const handleAcceptCall = async (isVideo) => {
    try {
      setIsRinging(false);
      setActiveCall(true);
      
      // Create peer connection and get media
      await createPeerConnection(isVideo);

      // Notify caller that call was accepted
      callSocketRef.current.emit('accept_call', {
        projectId,
        callerId: callData.callerId,
        calleeId: senderId,
        isVideo
      });

    } catch (err) {
      console.error('Error accepting call:', err);
      endCall();
    }
  };

  const handleRejectCall = () => {
    callSocketRef.current.emit('reject_call', {
      projectId,
      callerId: callData.callerId,
      calleeId: senderId
    });
    endCall();
  };

  const endCall = () => {
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    setRemoteStream(null);
    setCallData(null);
    setIsRinging(false);
    setIsCaller(false);
    setActiveCall(false);
    
    if (isCaller || activeCall) {
      callSocketRef.current.emit('end_call', {
        projectId,
        userId: senderId
      });
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioOn(audioTrack.enabled);
      }
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !senderId) return;

    try {
      const response = await fetch(`http://localhost:3001/api/messages?senderId=${senderId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage, projectId })
      });

      if (!response.ok) throw new Error('Failed to send message');
      
      const sentMessage = await response.json();
      setNewMessage('');
      messageSocketRef.current.emit('send_message', {
        content: sentMessage.content,
        projectId,
        senderId
      });
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
      {/* Call components */}
      {callData && isRinging && !activeCall && (
        <CallModal
          callData={callData}
          onAccept={handleAcceptCall}
          onReject={handleRejectCall}
          isCaller={isCaller}
          isRinging={isRinging}
        />
      )}
      
      {activeCall && (
        <VideoCall
          callData={callData}
          onEndCall={endCall}
          localStream={localStream}
          remoteStream={remoteStream}
          isCaller={isCaller}
          isVideoOn={isVideoOn}
          isAudioOn={isAudioOn}
          toggleVideo={toggleVideo}
          toggleAudio={toggleAudio}
        />
      )}

      {/* Chat header */}
      <div className="bg-white px-4 py-3 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Project Chat</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => startCall(true)}
            className="p-2 text-gray-600 hover:text-green-600"
            title="Start video call"
          >
            <VideoCameraIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => startCall(false)}
            className="p-2 text-gray-600 hover:text-green-600"
            title="Start audio call"
          >
            <PhoneIcon className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <EllipsisVerticalIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-full text-red-500">
            {error}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-full text-gray-500">
            <p>No messages yet</p>
            <p className="text-sm">Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message._id}
              className={`flex ${message.sender._id === senderId ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender._id === senderId
                    ? 'bg-green-600 text-white rounded-tr-none'
                    : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-sm">
                    {message.sender._id === senderId
                      ? 'You'
                      : `${message.sender.firstName} ${message.sender.lastName}`}
                  </span>
                  <span className="text-xs opacity-70">
                    {format(new Date(message.createdAt), 'h:mm a')}
                  </span>
                </div>
                <div className="text-sm">{message.content}</div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <form onSubmit={handleSendMessage} className="bg-white p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || isLoading}
            className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PaperAirplaneIcon className="h-5 w-5 transform rotate-45" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectMessaging;