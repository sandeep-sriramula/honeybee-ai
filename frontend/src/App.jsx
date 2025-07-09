import { useEffect, useState, useRef } from 'react'
import { marked } from "marked";
import DOMPurify from "dompurify";
import './App.css'
import './index.css'

// Chatbot Widget Component
function ChatbotWidget() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Start talking to your statements", isTyping: false },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Typewriter effect for bot messages
  const typewriterEffect = (text, messageIndex) => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setMessages(prev =>
          prev.map((msg, idx) =>
            idx === messageIndex
              ? { ...msg, text: text.slice(0, currentIndex + 1), isTyping: true }
              : msg
          )
        );
        currentIndex++;
      } else {
        setMessages(prev =>
          prev.map((msg, idx) =>
            idx === messageIndex
              ? { ...msg, isTyping: false }
              : msg
          )
        );
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 30); // Adjust speed here (lower = faster)
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };
  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    setMessages((prev) => [...prev, { role: "user", text, isTyping: false }]);
    setInput("");
    setIsTyping(true);

    // Add loading message with wave spinner
    setMessages((prev) => [...prev, { role: "bot", text: "loading", isTyping: true }]);

    try {
      const res = await fetch("https://honeybee-ai.onrender.com/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
      });
      const data = await res.json();

      // Replace loading message with empty message and start typewriter
      setMessages((prev) => prev.slice(0, -1).concat({ role: "bot", text: "", isTyping: true }));

      // Start typewriter effect
      setTimeout(() => {
        setMessages(prev => {
          const newMessageIndex = prev.length - 1;
          typewriterEffect(data.answer, newMessageIndex);
          return prev;
        });
      }, 200);

    } catch {
      // Replace loading message with empty message and start typewriter
      setMessages((prev) => prev.slice(0, -1).concat({ role: "bot", text: "", isTyping: true }));
      setTimeout(() => {
        setMessages(prev => {
          const newMessageIndex = prev.length - 1;
          typewriterEffect("⚠️ Server unreachable.", newMessageIndex);
          return prev;
        });
      }, 200);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !isTyping) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSendClick = (e) => {
    e.preventDefault();
    if (!isTyping) {
      sendMessage();
    }
  };

  const renderMarkdown = (text) => {
    const html = marked.parse(text);
    return { __html: DOMPurify.sanitize(html) };
  };

  return (
    <div className="relative ">
      {/* Background layer for chatbot */}
      <div className="absolute inset-0 rounded-xl overflow-hidden -z-10 w-full max-w-6xl mx-auto">
        <div className="w-full h-full bg-gradient-to-br from-cyan-500/20 via-indigo-500/20 to-purple-500/20">
        </div>
      </div>

      {/* Chat Widget */}
      <div className="w-full max-w-6xl mx-auto h-[520px] rounded-xl backdrop-blur-2xl bg-gray-900/30 border border-indigo-500/30 shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-900/60 to-purple-900/60 border-b border-indigo-500/30 text-white text-xs font-semibold uppercase">
          <div className="bg-gradient-to-r from-cyan-300 to-indigo-300 bg-clip-text text-transparent">AI Banking Assistant</div>
          <div className="text-cyan-400">Chatbot</div>
        </div>
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-2 space-y-3 text-sm text-white">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`w-fit max-w-[85%] px-4 py-2 rounded-xl backdrop-blur-sm transform transition-all duration-300 ${msg.role === "user"
                  ? "bg-gradient-to-r from-indigo-500/30 to-purple-500/30 border border-indigo-400/30 text-white rounded-br-none self-end text-right ml-auto animate-[slideInRight_0.5s_ease-out] hover:translate-x-2"
                  : "bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border border-cyan-400/30 text-white rounded-bl-none self-start text-start animate-[slideInLeft_0.5s_ease-out] hover:-translate-x-2"
                }`}
              style={{
                animationDelay: `${i * 0.1}s`,
                animationFillMode: 'both'
              }}
            >
              {msg.text === "loading" && msg.role === "bot" ? (
                <div className="wave-container">
                  <div className="wave-bar bg-cyan-400"></div>
                  <div className="wave-bar bg-cyan-400"></div>
                  <div className="wave-bar bg-cyan-400"></div>
                  <div className="wave-bar bg-cyan-400"></div>
                  <div className="wave-bar bg-cyan-400"></div>
                </div>
              ) : (
                <div dangerouslySetInnerHTML={renderMarkdown(msg.text)} />
              )}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-indigo-900/60 to-purple-900/60 border-t border-indigo-500/30">
          <input
            type="text"
            placeholder="Type message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            disabled={isTyping}
            className={`flex-1 px-4 py-2 rounded-lg bg-gray-800/50 text-white border border-indigo-500/30 focus:border-cyan-500/50 outline-none transition-colors ${isTyping ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          />
          <button
            onClick={handleSendClick}
            type="button"
            disabled={isTyping}
            className={`px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600/80 to-purple-600/80 text-white border border-indigo-500/30 hover:from-indigo-500/80 hover:to-purple-500/80 transition-all duration-300 ${isTyping ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            {isTyping ? 'AI TYPING...' : 'SEND'}
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  // Contact form state
  const [contact, setContact] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [contactStatus, setContactStatus] = useState('');

  useEffect(() => {
    // Parallax effect for background elements
    let mouseMoveHandler;
    const bgElements = document.querySelectorAll('.fixed > div');
    if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
      mouseMoveHandler = (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        bgElements.forEach(element => {
          const speed = 20; // Adjust for more or less movement
          const xOffset = (x - 0.5) * speed;
          const yOffset = (y - 0.5) * speed;
          element.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        });
      };
      document.addEventListener('mousemove', mouseMoveHandler);
    }
    // Scroll animations for sections
    const sections = document.querySelectorAll('section');
    const observer = new window.IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('section-visible');
        }
      });
    }, { threshold: 0.1 });
    sections.forEach(section => {
      section.classList.add('section-hidden');
      observer.observe(section);
    });
    // Header text animation
    const timeoutId = setTimeout(() => {
      const headerText = document.querySelector('.text-6xl');
      if (headerText) {
        headerText.style.opacity = 1;
        headerText.style.transform = 'translateY(0)';
      }
    }, 300);
    // Cleanup
    return () => {
      observer.disconnect();
      if (mouseMoveHandler) document.removeEventListener('mousemove', mouseMoveHandler);
      clearTimeout(timeoutId);
    };
  }, []);

  const handleContactChange = (e) => {
    const { id, value } = e.target;
    setContact((prev) => ({ ...prev, [id]: value }));
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Simple validation
    if (!contact.name || !contact.email || !contact.subject || !contact.message) {
      setContactStatus('Please fill in all fields.');
      return;
    }
    // Here you would send the data to your backend or email service
    // For now, just show a success message
    setContactStatus('Message sent!');
    setContact({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="bg-black text-white font-['Space_Grotesk'] overflow-x-hidden">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden  pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-96 h-96  bg-indigo-900/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-900/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s' }}></div>
        <div className="absolute top-40 right-20 w-64 h-64 bg-cyan-900/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '3.5s' }}></div>
        {/* Additional intense light sources */}
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4.5s' }}></div>
        <div className="absolute bottom-1/3 right-1/3 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5.5s' }}></div>
        {/* Decorative Honeycomb */}
        <div className="absolute inset-0 opacity-[0.25] pointer-events-none ">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
            <defs>
              {/* <!-- Basic hexagon size --> */}
              <pattern id="honeycomb" width="173.2" height="150" patternUnits="userSpaceOnUse">
                {/* <!-- Row 1 --> */}
                <polygon
                  points="86.6,0 129.9,25 129.9,75 86.6,100 43.3,75 43.3,25"
                  stroke="rgba(6, 182, 212, 0.15)"
                  strokeWidth="2"
                  fill="none" />
                <polygon
                  points="43.3,25 0,0"
                  stroke="rgba(6, 182, 212, 0.15)"
                  strokeWidth=""
                  fill="none" />
                <polygon
                  points="173.2,0 216.5,26 216.5,75 173.2,100 129.9,75 129.9,25"
                  stroke="rgba(6, 182, 212, 0.15)"
                  strokeWidth="2"
                  fill="none" />
                {/* <!-- Row 2 (offset horizontally by half width) --> */}
                <polygon
                  points="129.9,75 173.2,100 173.2,150 129.9,175 86.6,150 86.6,100"
                  stroke="rgba(6, 182, 212, 0.08)"
                  strokeWidth="2"
                  fill="none" />
                <polygon
                  points="43.3,75 86.6,100 86.6,150 43.3,175 0,150 0,100"
                  stroke="rgba(6, 182, 212, 0.08)"
                  strokeWidth="2"
                  fill="none" />
              </pattern>
            </defs>
            {/* 
    <!-- Main honeycomb background --> */}
            <rect width="100%" height="100%" fill="url(#honeycomb)" />

            {/* <!-- Optional animated glow overlay --> */}
            <rect width="100%" height="100%" fill="url(#honeycomb)" opacity="0.5">
              <animate attributeName="opacity" values="0.1;0.9;0.1" dur="5s" repeatCount="indefinite" />
            </rect>
          </svg>
        </div>
      </div>
      <main>
        {/* Home Section */}
        <section id="home" className="min-h-screen flex items-center justify-center relative pt-20">
          <div className="container mx-auto px-6 py-20">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-3xl"></div>
                <div className="text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-indigo-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent pb-2 relative">
                  Honeybee
                </div>
              </div>
              <p className="text-2xl md:text-2xl text-gray-400 max-w-3xl mb-8">
                Highly Optimized Neural Engine for Your Banking Evaluation & Exploration
              </p>
              <div className="flex gap-4 flex-wrap justify-center">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600/50 to-purple-600/50 rounded-lg blur opacity-75 group-hover:opacity-100 transition-all duration-500"></div>
                  <button 
                    className="px-6 py-3 bg-gradient-to-r from-indigo-900/90 to-purple-900/90 rounded-lg text-white text-base font-medium relative z-10 flex items-center justify-center gap-2 group-hover:from-indigo-800/90 group-hover:to-purple-800/90 transition-all duration-300 transform group-hover:scale-105 group-active:scale-95"
                    onClick={() => {
                      const aboutSection = document.getElementById('about');
                      if (aboutSection) {
                        aboutSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    <span className="bg-gradient-to-r from-cyan-300 to-indigo-300 bg-clip-text text-transparent">Get Started</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </section>

        <section id="about" className="min-h-screen flex items-center relative py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-block mb-3">
                  <div className="text-xs text-cyan-400 tracking-widest uppercase mb-1">About AI Banking Assistant</div>
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Empowering Your Financial Journey</div>
                </div>
                <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-indigo-500 mx-auto"></div>
              </div>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl blur-sm group-hover:bg-indigo-500/20 transition-all duration-500"></div>
                  <div className="relative bg-gray-900/20 backdrop-blur-2xl border border-indigo-500/30 p-6 rounded-xl shadow-2xl group-hover:border-indigo-500/50 transition-all duration-300">
                    <div className="flex flex-col">
                      <div className="font-medium text-xl text-white mb-3">Key Features</div>
                      <p className="text-gray-400">AI-powered insights, personalized financial questions, and seamless integration with your banking services. </p>
                      <ul className="mt-4 space-y-2">
                        <li className="flex items-center">
                          <svg className="w-5 h-5 text-cyan-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 6a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <span>Instant financial insights</span>
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2">💳</span>
                          <span>Analyze your spending by category or month</span>
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2">🔍</span>
                          <span>Find specific transactions by keyword</span>
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2">📈</span>
                          <span>Summarize income vs expenses</span>
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2">🗓</span>
                          <span>Track recurring bills and subscriptions</span>
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2">🧾</span>
                          <span>Understand your financial patterns easily</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-xl blur-sm group-hover:bg-purple-500/20 transition-all duration-500"></div>
                  <div className="relative bg-gray-900/20 backdrop-blur-2xl border border-purple-500/30 p-6 rounded-xl shadow-2xl group-hover:border-purple-500/50 transition-all duration-300">
                    <div className="flex flex-col">
                      <div className="font-medium text-xl text-white mb-3">Demo Information</div>
                      <p className="text-gray-400">This demo uses simulated personal bank statement for savings account, taken from Kaggle. It includes the following scenarios among others:</p>
                      <ul className="mt-4 space-y-2">
                        <li className="flex items-center">
                          <span className="mr-2">💳</span>
                          <span>Monthly bills, EMIs, and utility payments</span>
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2">📈</span>
                          <span>Stock investments and school fees</span>
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2">🍽️</span>
                          <span>Dining out, groceries, and lifestyle spending</span>
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2">⛽</span>
                          <span>Gas, travel, and vacation expenses</span>
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2">💰</span>
                          <span>Savings transfers and luxury purchases</span>
                        </li>
                        <li className="flex items-center">
                          <span className="mr-2">🧾</span>
                          <span>Other day-to-day personal expenses</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Services Section */}
        <section id="services" className="min-h-screen flex items-center relative py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-block mb-3">
                  <div className="text-xs text-cyan-400 tracking-widest uppercase mb-1">What I used</div>
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Tech Stack</div>
                </div>
                <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-indigo-500 mx-auto"></div>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {/* Service Card 1 */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-indigo-500/10 rounded-lg opacity-0 group-hover:opacity-100 blur-sm transition-opacity"></div>
                  <div className="bg-gradient-to-br from-gray-900/30 to-gray-950/30 backdrop-blur-2xl border border-indigo-500/30 rounded-lg p-6 relative z-10 h-full group-hover:border-indigo-500/50 transition-all duration-300">
                    <div className="flex flex-col h-full">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded bg-indigo-900/60 flex items-center justify-center mr-3 group-hover:bg-indigo-800/70 transition-colors">
                          <svg className="w-5 h-5 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
                          </svg>
                        </div>
                        <div className="font-medium text-lg text-indigo-300 group-hover:text-indigo-200 transition-colors">Frontend</div>
                      </div>
                      <p className="text-gray-400 mb-4">Crafted using React for dynamic behavior and Tailwind CSS for modern, utility-first design.</p>
                      <a href="#" className="mt-auto text-indigo-400 hover:text-indigo-300 inline-flex items-center">
                        Learn more
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                {/* Service Card 2 */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-purple-500/10 rounded-lg opacity-0 group-hover:opacity-100 blur-sm transition-opacity"></div>
                  <div className="bg-gradient-to-br from-gray-900/30 to-gray-950/30 backdrop-blur-2xl border border-purple-500/30 rounded-lg p-6 relative z-10 h-full group-hover:border-purple-500/50 transition-all duration-300">
                    <div className="flex flex-col h-full">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded bg-purple-900/60 flex items-center justify-center mr-3 group-hover:bg-purple-800/70 transition-colors">
                          <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                          </svg>
                        </div>
                        <div className="font-medium text-lg text-purple-300 group-hover:text-purple-200 transition-colors">Backend</div>
                      </div>
                      <p className="text-gray-400 mb-4">Powered by FastAPI and OpenRouter GPT for fast, secure, and intelligent bank statement analysis.</p>
                      <a href="#" className="mt-auto text-purple-400 hover:text-purple-300 inline-flex items-center">
                        Learn more
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                {/* Service Card 3 */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-purple-500/10 rounded-lg opacity-0 group-hover:opacity-100 blur-sm transition-opacity"></div>
                  <div className="bg-gradient-to-br from-gray-900/30 to-gray-950/30 backdrop-blur-2xl border border-purple-500/30 rounded-lg p-6 relative z-10 h-full group-hover:border-purple-500/50 transition-all duration-300">
                    <div className="flex flex-col h-full">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded bg-purple-900/60 flex items-center justify-center mr-3 group-hover:bg-purple-800/70 transition-colors">
                          <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                          </svg>
                        </div>
                        <div className="font-medium text-lg text-purple-300 group-hover:text-purple-200 transition-colors">AI Model</div>
                      </div>
                      <p className="text-gray-400 mb-4">Powered by Google Gemini 2.5 Flash (Lite Preview) via OpenRouter, optimized for fast, lightweight, real-time financial understanding.</p>
                      <a href="#" className="mt-auto text-purple-400 hover:text-purple-300 inline-flex items-center">
                        Learn more
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Chatbot section*/}
        <section id="portfolio" className="min-h-screen flex items-center relative py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-block mb-3">
                  <div className="text-xs text-cyan-400 tracking-widest uppercase mb-1">Demo</div>
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Try it now</div>
                </div>
                <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-indigo-500 mx-auto"></div>
              </div>
              <div className="justify-center">
                <ChatbotWidget />
              </div>
            </div>
          </div>
        </section>
        {/* Contact Section */}
        <section id="contact" className="min-h-screen flex items-center relative py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-block mb-3">
                  <div className="text-xs text-cyan-400 tracking-widest uppercase mb-1">Get In Touch</div>
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Contact Me</div>
                </div>
                <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-indigo-500 mx-auto"></div>
              </div>
              <div className="grid md:grid-cols-5 gap-8">
                <div className="md:col-span-2">
                  <div className="bg-gray-900/30 backdrop-blur-2xl border border-indigo-500/30 p-6 rounded-xl shadow-2xl">
                    <div className="text-xl font-medium text-white mb-4">Contact Information</div>
                    <div className="space-y-4">
                      <div className="flex items-start"></div>
                      <div className="flex items-start">
                        <svg className="w-5 h-5 text-cyan-400 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <div className="text-sm text-gray-400">Email</div>
                          <a href="mailto:ssandeep2444@gmail.com" className="text-white hover:text-cyan-400 transition-colors">ssandeep2444@gmail.com</a>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <svg className="w-5 h-5 text-cyan-400 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <div>
                          <div className="text-sm text-gray-400">Phone</div>
                          <a href="#" className="text-white hover:text-cyan-400 transition-colors">+1 (xxx) xxx-1942</a>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <div className="text-white mb-2">Follow Me</div>
                      <div className="flex space-x-3">
                        <a href="#" className="w-8 h-8 rounded-full bg-indigo-900/50 flex items-center justify-center text-white hover:bg-indigo-800 transition-colors">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                          </svg>
                        </a>
                        <a href="#" className="w-8 h-8 rounded-full bg-indigo-900/50 flex items-center justify-center text-white hover:bg-indigo-800 transition-colors">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                          </svg>
                        </a>
                        <a href="#" className="w-8 h-8 rounded-full bg-indigo-900/50 flex items-center justify-center text-white hover:bg-indigo-800 transition-colors">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-3">
                  <div className="bg-gray-900/30 backdrop-blur-2xl border border-indigo-500/30 p-6 rounded-xl shadow-2xl">
                    <div className="text-xl font-medium text-white mb-4">Send me a message</div>
                    <form onSubmit={handleContactSubmit}>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label htmlFor="name" className="block text-sm text-gray-400 mb-1">Name</label>
                          <input type="text" id="name" value={contact.name} onChange={handleContactChange} className="w-full bg-gray-800/50 border border-gray-700 focus:border-cyan-500 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-colors" />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm text-gray-400 mb-1">Email</label>
                          <input type="email" id="email" value={contact.email} onChange={handleContactChange} className="w-full bg-gray-800/50 border border-gray-700 focus:border-cyan-500 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-colors" />
                        </div>
                      </div>
                      <div className="mb-4">
                        <label htmlFor="subject" className="block text-sm text-gray-400 mb-1">Subject</label>
                        <input type="text" id="subject" value={contact.subject} onChange={handleContactChange} className="w-full bg-gray-800/50 border border-gray-700 focus:border-cyan-500 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-colors" />
                      </div>
                      <div className="mb-6">
                        <label htmlFor="message" className="block text-sm text-gray-400 mb-1">Message</label>
                        <textarea id="message" rows={4} value={contact.message} onChange={handleContactChange} className="w-full bg-gray-800/50 border border-gray-700 focus:border-cyan-500 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-colors resize-none"></textarea>
                      </div>
                      {contactStatus && (
                        <div className="mb-4 text-sm text-cyan-400">{contactStatus}</div>
                      )}
                      <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600/50 to-purple-600/50 rounded-lg blur opacity-75 group-hover:opacity-100 transition-all duration-500"></div>
                        <button type="submit" className="w-full px-6 py-3 bg-gradient-to-r from-indigo-900/90 to-purple-900/90 rounded-lg text-white text-base font-medium relative z-10 flex items-center justify-center gap-2 group-hover:from-indigo-800/90 group-hover:to-purple-800/90 transition-all duration-300">
                          <span className="bg-gradient-to-r from-cyan-300 to-indigo-300 bg-clip-text text-transparent">Send Message</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
