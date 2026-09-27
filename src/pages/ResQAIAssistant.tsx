import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mic,
  MicOff,
  Send,
  Image,
  Sparkles,
  ShieldAlert,
  Fuel,
  Wrench,
  Truck,
  PhoneCall,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Info,
} from 'lucide-react';
import { resqAiService, AiDiagnosticResult } from '../services/aiService';
import { speechService } from '../services/speechService';
import { useTranslation } from '../i18n/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useAssistance } from '../contexts/AssistanceContext';
import { storageService } from '../services/storageService';
import { AiChatMessage, IssueCategory } from '../types';

export const ResQAIAssistant: React.FC = () => {
  const { t, language } = useTranslation();
  const { currentUser } = useAuth();
  const { createNewRequest } = useAssistance();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      content: t.ai.welcomeMsg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAnalyzing]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() && !attachedImage) return;

    const userMsgId = `user-${Date.now()}`;
    const userMsg: AiChatMessage = {
      id: userMsgId,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      photoUrl: attachedImage || undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    const photoToProcess = attachedImage;
    setAttachedImage(null);
    setIsAnalyzing(true);

    // Call ResQ AI Diagnostic
    setTimeout(() => {
      const diagnostic: AiDiagnosticResult = resqAiService.analyzeProblem({
        userText: text,
        vehicleType: 'car',
        photoUrl: photoToProcess || undefined,
        language,
      });

      const aiMsg: AiChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        content: diagnostic.explanation,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        structuredData: {
          issueType: diagnostic.issueType,
          vehicleType: diagnostic.vehicleType,
          urgency: diagnostic.urgency,
          confidence: diagnostic.confidence,
          recommendedService: diagnostic.recommendedService,
          estimatedCost: diagnostic.estimatedCost,
          safetyGuidance: diagnostic.safetyGuidance,
          followUpQuestions: diagnostic.followUpQuestions,
          actions: diagnostic.suggestedActions,
        },
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsAnalyzing(false);

      // Speak summary if supported
      if (diagnostic.urgency === 'EMERGENCY' || diagnostic.urgency === 'URGENT') {
        speechService.speak(diagnostic.explanation.split('.')[0], language);
      }
    }, 700);
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    } else {
      const started = speechService.startListening(
        language,
        (res) => {
          setInput(res.transcript);
          if (res.isFinal) {
            setIsListening(false);
            handleSendMessage(res.transcript);
          }
        },
        (err) => {
          console.warn('Voice error:', err);
          setIsListening(false);
        },
        () => setIsListening(false)
      );
      if (started) setIsListening(true);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAttachedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTriggerAction = (action: string, payload?: any) => {
    if (action === 'view_fuel_stations') {
      navigate('/safe-places');
    } else if (action === 'call_emergency') {
      window.location.href = 'tel:112';
    } else if (action === 'call_towing') {
      navigate('/assistance?service=towing');
    } else if (action === 'request_service') {
      const vehicles = storageService.getVehicles(currentUser.id);
      const vehicle = vehicles[0] || {
        id: 'veh-temp',
        userId: currentUser.id,
        type: 'car',
        make: 'Hyundai',
        model: 'Creta',
        year: 2022,
        plateNumber: 'TN 07 BZ 4590',
        fuelType: 'diesel',
        isDefault: true,
      };

      createNewRequest({
        vehicle,
        issueCategory: payload?.issueCategory || 'breakdown',
        problemDescription: `Dispatched via ResQ AI: ${payload?.serviceType || 'Roadside Assistance'}`,
        urgency: 'NORMAL',
        location: {
          lat: 12.9249,
          lng: 80.2272,
          address: 'OMR Road near Sholinganallur Junction, Chennai',
        },
        serviceType: payload?.serviceType || 'Roadside Assistance',
        basePrice: payload?.estimatedCost || 450,
        totalPrice: payload?.estimatedCost || 450,
        distanceKm: 2.1,
        etaMinutes: 8,
      });

      navigate('/tracking');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col h-[calc(100vh-5rem)]">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 mb-4 shadow-sm flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Sparkles className="w-5 h-5 text-[#FF6500]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black tracking-tight text-slate-900 dark:text-white">
                {t.ai.title}
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                {t.ai.badge}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.ai.subtitle}
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                id: 'msg-welcome-reset',
                sender: 'assistant',
                content: t.ai.welcomeMsg,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ])
          }
          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title="Reset conversation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-bl-none'
              }`}
            >
              {/* Photo preview if user attached one */}
              {msg.photoUrl && (
                <div className="mb-3 rounded-lg overflow-hidden border border-white/20 max-w-xs">
                  <img
                    src={msg.photoUrl}
                    alt="Uploaded damage / dashboard"
                    className="w-full h-36 object-cover"
                  />
                  <div className="px-2 py-1 bg-black/40 text-[11px] text-white flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Visual condition analysed</span>
                  </div>
                </div>
              )}

              {/* Message text */}
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>

              {/* Structured AI Response Card */}
              {msg.structuredData && (
                <div className="mt-3.5 pt-3.5 border-t border-slate-200 dark:border-slate-800/80 space-y-3">
                  {/* Safety Guidance banner if critical */}
                  {msg.structuredData.safetyGuidance && (
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start gap-2.5 text-amber-900 dark:text-amber-200 text-xs">
                      <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span className="font-medium leading-snug">
                        {msg.structuredData.safetyGuidance}
                      </span>
                    </div>
                  )}

                  {/* Diagnostic Badges */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold block">
                        Category
                      </span>
                      <span className="font-bold text-slate-900 dark:text-slate-100 capitalize">
                        {msg.structuredData.issueType}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold block">
                        Urgency
                      </span>
                      <span
                        className={`font-bold ${
                          msg.structuredData.urgency === 'EMERGENCY'
                            ? 'text-red-600'
                            : msg.structuredData.urgency === 'URGENT'
                            ? 'text-amber-600'
                            : 'text-blue-600 dark:text-blue-400'
                        }`}
                      >
                        {msg.structuredData.urgency}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold block">
                        Confidence
                      </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {msg.structuredData.confidence}%
                      </span>
                    </div>
                  </div>

                  {/* Recommended Service & Cost */}
                  <div className="p-3 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-blue-700 dark:text-blue-300 font-semibold block">
                        Recommended Service
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {msg.structuredData.recommendedService}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Est. Fee</span>
                      <span className="text-sm font-black text-slate-900 dark:text-slate-100">
                        ₹{msg.structuredData.estimatedCost}
                      </span>
                    </div>
                  </div>

                  {/* Follow-up Question if any */}
                  {msg.structuredData.followUpQuestions && msg.structuredData.followUpQuestions.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/40 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                      <HelpCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <span>{msg.structuredData.followUpQuestions[0]}</span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {msg.structuredData.actions && msg.structuredData.actions.length > 0 && (
                    <div className="pt-1 flex flex-wrap gap-2">
                      {msg.structuredData.actions.map((act, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleTriggerAction(act.action, act.payload)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                            act.action === 'request_service'
                              ? 'bg-[#FF6500] hover:bg-[#ea580c] text-white shadow-md shadow-[#FF6500]/20'
                              : act.action === 'call_emergency'
                              ? 'bg-red-600 hover:bg-red-700 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <span>{act.label}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Diagnostic Disclaimer */}
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 italic">
                    {t.ai.diagnosticNotice}
                  </p>
                </div>
              )}

              <span
                className={`text-[10px] block mt-1.5 font-medium ${
                  msg.sender === 'user' ? 'text-blue-100 text-right' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {/* AI Typing / Analyzing Indicator */}
        {isAnalyzing && (
          <div className="flex items-center gap-2 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-fit shadow-sm">
            <Sparkles className="w-4 h-4 text-[#FF6500] animate-spin" />
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
              ResQ AI is analyzing your problem & nearby rescue options...
            </span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      {messages.length <= 3 && (
        <div className="py-2 shrink-0">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            {t.ai.quickPromptsLabel}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {[
              t.ai.samplePrompt1,
              t.ai.samplePrompt2,
              t.ai.samplePrompt3,
              t.ai.samplePrompt4,
            ].map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-700 transition"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Voice Listening Bar Indicator */}
      {isListening && (
        <div className="p-3 mb-2 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 flex items-center justify-between animate-pulse shrink-0">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-xs font-bold">
            <Mic className="w-4 h-4 animate-bounce" />
            <span>{t.ai.listening}</span>
          </div>
          <button
            onClick={handleVoiceToggle}
            className="px-3 py-1 text-xs font-bold rounded-lg bg-red-600 text-white"
          >
            {t.actions.stopVoice}
          </button>
        </div>
      )}

      {/* Photo Attachment Preview Bar */}
      {attachedImage && (
        <div className="p-2 mb-2 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <img src={attachedImage} alt="Preview" className="w-10 h-10 object-cover rounded-lg" />
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              {t.ai.photoAttached}
            </span>
          </div>
          <button
            onClick={() => setAttachedImage(null)}
            className="text-xs text-red-500 font-bold hover:underline px-2"
          >
            Remove
          </button>
        </div>
      )}

      {/* Input Composer */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-sm flex items-center gap-2 shrink-0">
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />

        {/* Photo Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2.5 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title={t.actions.uploadPhoto}
        >
          <Image className="w-5 h-5" />
        </button>

        {/* Voice Mic Button */}
        <button
          onClick={handleVoiceToggle}
          className={`p-2.5 rounded-xl transition ${
            isListening
              ? 'bg-red-600 text-white animate-pulse'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title={isListening ? t.actions.stopVoice : t.actions.startVoice}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Text Input */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder={t.ai.placeholder}
          className="flex-1 bg-transparent border-none outline-none text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 px-2"
        />

        {/* Send Button */}
        <button
          onClick={() => handleSendMessage()}
          disabled={!input.trim() && !attachedImage}
          className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold transition shadow-sm"
          title="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
