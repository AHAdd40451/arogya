import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Video, Mic, MicOff, VideoOff, PhoneOff, MessageSquare, FileText, Send, X
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const mockChat = [
  { from: "provider", text: "Hello, how are you feeling today?" },
  { from: "patient", text: "Hi, I've been having a sore throat and fever for two days." },
  { from: "provider", text: "I see. Let me ask you a few questions about your symptoms." },
];

export default function VirtualVisit() {
  const params = new URLSearchParams(window.location.search);
  const provider = params.get("provider") || "Jane Smith";
  const credentials = params.get("credentials") || "NP";

  const navigate = useNavigate();
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(mockChat);
  const [showEnd, setShowEnd] = useState(false);

  const sendMessage = () => {
    if (!message.trim()) return;
    setMessages([...messages, { from: "patient", text: message }]);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-slate-800/60 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white font-medium text-sm">{provider}, {credentials} — Arogya Visit</span>
        </div>
        <span className="text-slate-400 text-sm font-mono">00:00</span>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4">
        {/* Video area */}
        <div className="flex-1 relative rounded-2xl overflow-hidden bg-slate-800 min-h-[300px]">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl text-white font-bold">{provider[0]}</span>
              </div>
              <p className="text-white font-medium">{provider}, {credentials}</p>
              <p className="text-slate-400 text-sm mt-1">Video Feed Placeholder</p>
            </div>
          </div>
          <div className="absolute bottom-4 right-4 w-32 h-24 bg-slate-700 rounded-xl border border-slate-600 flex items-center justify-center">
            <span className="text-xs text-slate-400">You</span>
          </div>
        </div>

        {/* Side */}
        <div className="lg:w-80 flex flex-col gap-4">
          {chatOpen && (
            <div className="bg-slate-800 rounded-2xl flex flex-col h-72 lg:flex-1">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
                <span className="text-white font-medium text-sm">Patient-Provider Chat</span>
                <button onClick={() => setChatOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.from === "patient" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${m.from === "patient" ? "bg-teal-600 text-white" : "bg-slate-700 text-slate-200"}`}>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-slate-700 flex gap-2">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-400 outline-none"
                />
                <button onClick={sendMessage} className="p-2 bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors">
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          )}
          <div className="bg-slate-800 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-slate-400" />
              <span className="text-white font-medium text-sm">Notes</span>
            </div>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this visit..."
              className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 resize-none h-28 rounded-xl text-sm"
            />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 py-5 bg-slate-900 border-t border-slate-800">
        <button onClick={() => setMicOn(!micOn)} className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${micOn ? "bg-slate-700 hover:bg-slate-600" : "bg-red-600 hover:bg-red-700"}`}>
          {micOn ? <Mic className="w-5 h-5 text-white" /> : <MicOff className="w-5 h-5 text-white" />}
        </button>
        <button onClick={() => setVideoOn(!videoOn)} className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${videoOn ? "bg-slate-700 hover:bg-slate-600" : "bg-red-600 hover:bg-red-700"}`}>
          {videoOn ? <Video className="w-5 h-5 text-white" /> : <VideoOff className="w-5 h-5 text-white" />}
        </button>
        <button onClick={() => setChatOpen(!chatOpen)} className="w-12 h-12 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors">
          <MessageSquare className="w-5 h-5 text-white" />
        </button>
        <button onClick={() => setShowEnd(true)} className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-colors">
          <PhoneOff className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* End dialog */}
      <Dialog open={showEnd} onOpenChange={setShowEnd}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>End Visit?</DialogTitle>
            <DialogDescription>Your visit summary and any prescriptions will be available on your dashboard.</DialogDescription>
          </DialogHeader>
          <Button
            onClick={() => navigate(createPageUrl("PostVisitSummary") + `&provider=${encodeURIComponent(provider)}&credentials=${encodeURIComponent(credentials)}`)}
            className="w-full bg-teal-600 hover:bg-teal-700 rounded-xl mt-2"
          >
            End Visit & See Summary
          </Button>
          <Button variant="outline" onClick={() => setShowEnd(false)} className="w-full rounded-xl">
            Continue Visit
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}