// ============================================
// DULLIS APP - COMPLETE CODE
// Filename: App.js
// ============================================

import React, { useState, useEffect, useRef } from 'react';
import { Send, Phone, Video, MoreVertical, Search, Plus, X, LogOut, User } from 'lucide-react';

export default function DullisApp() {
  // Auth State
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authStep, setAuthStep] = useState('phone'); // phone, otp, profile
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [avatar, setAvatar] = useState('👤');
  
  // Chat State
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState({});
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchPhoneInput, setSearchPhoneInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);

  const avatarEmojis = ['👤', '👥', '🎭', '⭐', '🎨', '🎵', '🎪', '🎬', '🎮', '🎯', '🎸', '🎺', '📚', '⚽', '🏀', '🎾'];

  // Splash screen timing
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Load user data from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('dullis_user');
    const savedContacts = localStorage.getItem('dullis_contacts');
    
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setIsLoggedIn(true);
      
      if (savedContacts) {
        setContacts(JSON.parse(savedContacts));
      }
    }
  }, []);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages[activeChat]]);

  // === AUTHENTICATION FUNCTIONS ===
  
  const handlePhoneSubmit = () => {
    if (phoneNumber.length < 10) {
      alert('Sahi phone number likho');
      return;
    }
    
    alert('OTP bhej diya ' + phoneNumber + ' par. Code: 123456');
    setAuthStep('otp');
  };

  const handleOTPSubmit = () => {
    if (otpCode === '123456') {
      setAuthStep('profile');
    } else {
      alert('OTP galat hai. Sahi code: 123456');
    }
  };

  const handleProfileSubmit = () => {
    if (displayName.trim() === '') {
      alert('Apna naam likho');
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      displayName: displayName,
      phoneNumber: phoneNumber,
      avatar: avatar,
      createdAt: new Date(),
    };

    setCurrentUser(newUser);
    localStorage.setItem('dullis_user', JSON.stringify(newUser));
    localStorage.setItem('dullis_contacts', JSON.stringify([]));
    setIsLoggedIn(true);
    setAuthStep('phone');
    setPhoneNumber('');
    setDisplayName('');
  };

  const handleLogout = () => {
    localStorage.removeItem('dullis_user');
    localStorage.removeItem('dullis_contacts');
    setIsLoggedIn(false);
    setCurrentUser(null);
    setContacts([]);
    setActiveChat(null);
  };

  // === CHAT FUNCTIONS ===

  const handleAddContact = () => {
    if (searchPhoneInput.trim() === '') {
      alert('Phone number likho');
      return;
    }

    // Demo users database
    const allUsers = [
      { id: '1', displayName: 'Alex Johnson', phoneNumber: '+1 234 567 8901', avatar: '👤' },
      { id: '2', displayName: 'Jordan Smith', phoneNumber: '+1 234 567 8902', avatar: '👥' },
      { id: '3', displayName: 'Casey Williams', phoneNumber: '+1 234 567 8903', avatar: '🎭' },
      { id: '4', displayName: 'Sam Davis', phoneNumber: '+1 234 567 8904', avatar: '⭐' },
      { id: '5', displayName: 'Morgan Brown', phoneNumber: '+1 234 567 8905', avatar: '🎨' },
      { id: '6', displayName: 'Taylor Martinez', phoneNumber: '+1 234 567 8906', avatar: '🎵' },
    ];

    const foundUser = allUsers.find(u => 
      u.phoneNumber === searchPhoneInput || u.phoneNumber.includes(searchPhoneInput.slice(-4))
    );

    if (foundUser) {
      setSearchResults([foundUser]);
    } else {
      setSearchResults([]);
      alert('User nhi mila. Kosis karo: +1 234 567 8901');
    }
  };

  const handleAddUserAsContact = (user) => {
    const alreadyAdded = contacts.find(c => c.id === user.id);
    
    if (alreadyAdded) {
      alert('Pehle se contacts mein hai');
      return;
    }

    const newContact = {
      ...user,
      lastMessage: 'No messages yet',
      time: 'Just now',
      online: Math.random() > 0.5,
    };

    const updatedContacts = [...contacts, newContact];
    setContacts(updatedContacts);
    localStorage.setItem('dullis_contacts', JSON.stringify(updatedContacts));
    
    setActiveChat(user.id);
    setMessages(prev => ({
      ...prev,
      [user.id]: []
    }));

    setSearchPhoneInput('');
    setSearchResults([]);
    setShowAddModal(false);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === '' || !activeChat) return;

    const newMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      senderName: currentUser.displayName,
      timestamp: new Date(),
      status: 'sent',
    };

    const updatedMessages = [...(messages[activeChat] || []), newMessage];
    setMessages(prev => ({
      ...prev,
      [activeChat]: updatedMessages
    }));

    localStorage.setItem(`dullis_messages_${activeChat}`, JSON.stringify(updatedMessages));
    setInputValue('');

    // Auto reply
    setTimeout(() => {
      const replies = [
        'Bilkul sahi kaha! 😊',
        'Main bhi yahi sochta th',
        'Sochne do...',
        'Haha zabardast! 😂',
        'Bilkul kar sakte hain!',
        'Mujhe bataio aur',
        'Kya baat hai!',
        'Main bhi yahi socha tha',
        'Tum kaise ho?',
        'Baad mein baat karte hain!',
      ];

      const reply = {
        id: Date.now() + 1,
        text: replies[Math.floor(Math.random() * replies.length)],
        sender: activeChat,
        senderName: contacts.find(c => c.id === activeChat)?.displayName,
        timestamp: new Date(),
        status: 'read',
      };

      const finalMessages = [...updatedMessages, reply];
      setMessages(prev => ({
        ...prev,
        [activeChat]: finalMessages
      }));
      localStorage.setItem(`dullis_messages_${activeChat}`, JSON.stringify(finalMessages));
    }, 1000 + Math.random() * 1500);
  };

  // Load messages for active chat
  useEffect(() => {
    if (activeChat) {
      const savedMessages = localStorage.getItem(`dullis_messages_${activeChat}`);
      if (savedMessages) {
        setMessages(prev => ({
          ...prev,
          [activeChat]: JSON.parse(savedMessages)
        }));
      } else {
        setMessages(prev => ({
          ...prev,
          [activeChat]: []
        }));
      }
    }
  }, [activeChat]);

  // === SPLASH SCREEN ===
  if (showSplash) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-green-400 via-green-500 to-teal-600 flex flex-col items-center justify-center">
        <div className="w-40 h-40 rounded-full bg-white shadow-2xl flex items-center justify-center mb-8 animate-bounce">
          <span className="text-9xl font-bold text-green-500">D</span>
        </div>
        <h1 className="text-5xl font-bold text-white mt-8 tracking-wider">DULLIS</h1>
        <p className="text-white text-lg mt-4 opacity-90">Sab Ko Connect Karo</p>
        <div className="mt-12 flex gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    );
  }

  // === LOGIN SCREEN ===
  if (!isLoggedIn) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-green-500 to-teal-600 flex flex-col items-center justify-center p-4">
        <div className="w-32 h-32 rounded-full bg-white shadow-2xl flex items-center justify-center mb-8">
          <span className="text-7xl font-bold text-green-500">D</span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-12">DULLIS</h1>

        <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
          {authStep === 'phone' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">DULLIS Mein Aao</h2>
              <p className="text-gray-600">Apna phone number likho</p>
              
              <input
                type="tel"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                placeholder="+1 234 567 8901"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
              />
              
              <button
                onClick={handlePhoneSubmit}
                className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 rounded-lg font-bold hover:from-green-600 hover:to-teal-700 transition-all"
              >
                OTP Bhejo
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                💡 Try karo: +1 234 567 8901
              </p>
            </div>
          )}

          {authStep === 'otp' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">OTP Verify Karo</h2>
              <p className="text-gray-600">{phoneNumber} par OTP gaya hai</p>
              
              <input
                type="text"
                value={otpCode}
                onChange={e => setOtpCode(e.target.value)}
                placeholder="OTP likho"
                maxLength="6"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-center text-2xl tracking-widest"
              />
              
              <button
                onClick={handleOTPSubmit}
                className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 rounded-lg font-bold hover:from-green-600 hover:to-teal-700 transition-all"
              >
                Verify Karo
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                💡 Code: 123456
              </p>

              <button
                onClick={() => setAuthStep('phone')}
                className="w-full text-green-600 py-2 font-semibold hover:text-green-700"
              >
                Number Badlo
              </button>
            </div>
          )}

          {authStep === 'profile' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Profile Banao</h2>
              
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="Apna naam likho"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
              />

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Emoji Choose Karo</p>
                <div className="grid grid-cols-8 gap-2">
                  {avatarEmojis.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => setAvatar(emoji)}
                      className={`p-2 rounded-lg transition-all ${
                        avatar === emoji
                          ? 'bg-green-500 ring-2 ring-green-300'
                          : 'bg-gray-100 hover:bg-gray-200'
                      } text-xl`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gray-100 p-4 rounded-lg flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-300 to-teal-400 flex items-center justify-center text-2xl">
                  {avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{displayName || 'Tera Naam'}</p>
                  <p className="text-sm text-gray-600">{phoneNumber}</p>
                </div>
              </div>

              <button
                onClick={handleProfileSubmit}
                className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 rounded-lg font-bold hover:from-green-600 hover:to-teal-700 transition-all"
              >
                Tayyari Mukamal Karo
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // === MAIN APP ===
  const activeContact = contacts.find(c => c.id === activeChat);
  const currentMessages = messages[activeChat] || [];
  const filteredContacts = contacts.filter(c =>
    c.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">DULLIS</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddModal(true)}
                className="p-2 hover:bg-green-600 rounded-full transition-colors"
                title="Naya friend add karo"
              >
                <Plus size={20} />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-green-600 rounded-full transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center bg-white bg-opacity-20 rounded-full px-4 py-2">
            <Search size={18} className="text-white opacity-70" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent flex-1 ml-2 outline-none text-white placeholder-white placeholder-opacity-60"
            />
          </div>
        </div>

        {/* User Profile */}
        <div className="bg-gray-50 border-b border-gray-200 p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-300 to-teal-400 flex items-center justify-center text-xl">
            {currentUser?.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate">{currentUser?.displayName}</p>
            <p className="text-xs text-gray-600 truncate">{currentUser?.phoneNumber}</p>
          </div>
        </div>

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {contacts.length === 0 ? 'Abhi koi friend nhi. Add karo!' : 'Koi match nhi'}
            </div>
          ) : (
            filteredContacts.map(contact => (
              <div
                key={contact.id}
                onClick={() => setActiveChat(contact.id)}
                className={`p-4 cursor-pointer border-b border-gray-100 transition-colors ${
                  activeChat === contact.id
                    ? 'bg-gray-100 border-l-4 border-l-green-500'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-300 to-teal-400 flex items-center justify-center text-2xl shadow">
                      {contact.avatar}
                    </div>
                    {contact.online && (
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">{contact.displayName}</h3>
                    <p className="text-sm text-gray-600 truncate">{contact.lastMessage}</p>
                  </div>
                  <div className="text-xs text-gray-500">{contact.time}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      {activeChat ? (
        <div className="flex-1 flex flex-col bg-gray-50">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-4 flex items-center justify-between shadow">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-xl shadow">
                  {activeContact?.avatar}
                </div>
                {activeContact?.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div>
                <h2 className="font-semibold">{activeContact?.displayName}</h2>
                <p className="text-xs opacity-80">
                  {activeContact?.online ? 'Online hai' : 'Offline'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-green-600 rounded-full transition-colors">
                <Phone size={20} />
              </button>
              <button className="p-2 hover:bg-green-600 rounded-full transition-colors">
                <Video size={20} />
              </button>
              <button className="p-2 hover:bg-green-600 rounded-full transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {currentMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <div className="text-6xl mb-4">💬</div>
                <p className="text-lg font-semibold">{activeContact?.displayName} ko salaam karo!</p>
                <p className="text-sm">Ab chat shuru kar</p>
              </div>
            ) : (
              currentMessages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl shadow-sm ${
                      message.sender === 'user'
                        ? 'bg-green-500 text-white rounded-br-none'
                        : 'bg-white text-gray-900 rounded-bl-none border border-gray-200'
                    }`}
                  >
                    <p className="break-words">{message.text}</p>
                    <div
                      className={`text-xs mt-1 flex items-center justify-end gap-1 ${
                        message.sender === 'user'
                          ? 'text-green-100'
                          : 'text-gray-600'
                      }`}
                    >
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      {message.sender === 'user' && (
                        <span className="ml-1">
                          {message.status === 'read' ? '✓✓' : '✓'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="bg-white border-t border-gray-200 p-4 shadow-md">
            <div className="flex items-center gap-3">
              <button className="text-green-500 hover:text-green-600 transition-colors p-2">
                <Plus size={24} />
              </button>
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                placeholder="Message likho..."
                className="flex-1 bg-gray-100 rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 text-gray-900 placeholder-gray-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={inputValue.trim() === ''}
                className="bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full p-3 transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
          <div className="text-6xl mb-4">💬</div>
          <p className="text-lg font-semibold text-gray-900">Friend select karo chat karne ke liye</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-teal-700"
          >
            Pehla Friend Add Karo
          </button>
        </div>
      )}

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-96 shadow-2xl max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Naya Friend Add Karo</h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSearchPhoneInput('');
                  setSearchResults([]);
                }}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            {searchResults.length === 0 ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number Search Karo
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      value={searchPhoneInput}
                      onChange={e => setSearchPhoneInput(e.target.value)}
                      placeholder="+1 234 567 8901"
                      className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                    />
                    <button
                      onClick={handleAddContact}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold"
                    >
                      Search
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Demo Numbers:</strong>
                    <br />
                    • +1 234 567 8901 (Alex)
                    <br />
                    • +1 234 567 8902 (Jordan)
                    <br />
                    • +1 234 567 8903 (Casey)
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 mb-4">{searchResults.length} result:</p>
                {searchResults.map(user => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-300 to-teal-400 flex items-center justify-center text-2xl">
                        {user.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{user.displayName}</p>
                        <p className="text-sm text-gray-600">{user.phoneNumber}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddUserAsContact(user)}
                      className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold text-sm"
                    >
                      Add Karo
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
