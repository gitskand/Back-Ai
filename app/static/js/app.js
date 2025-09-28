// const chat = document.getElementById('chat');
// const msg = document.getElementById('msg');
// const send = document.getElementById('send');
// const identitySel = document.getElementById('identity');
// const voiceSel = document.getElementById('voiceSelect');
// const langSel = document.getElementById('langSelect');
// const toggleMic = document.getElementById('toggleMic');
// const stopBtn = document.getElementById('stopVoice');
// const nameInput = document.getElementById('nameInput');
// const avatar = document.getElementById('avatar');

// const state = {
//   voices: [],
//   currentUtter: null,
//   isRecognizing: false,
// };

// // --- Speech helpers ---------------------------------------------------------
// function cancelSpeech() {
//   if (!('speechSynthesis' in window)) return;
//   try {
//     window.speechSynthesis.cancel();
//   } catch (_) {}
//   if (state.currentUtter) {
//     try { state.currentUtter.onend = state.currentUtter.onerror = null; } catch (_) {}
//     state.currentUtter = null;
//   }
// }

// function cleanTextForSpeech(text) {
//   return text.replace(
//     /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF]|\uFE0F)/g,
//     ''
//   ).trim();
// }

// function speak(text) {
//   if (!('speechSynthesis' in window)) return;
//   cancelSpeech();


//   const utter = new SpeechSynthesisUtterance(safeText);
//   utter.lang = langSel.value;

//   const chosen = state.voices.find(v => v.name === voiceSel.value);
//   if (chosen) utter.voice = chosen;

//   utter.rate = 1.0;
//   utter.pitch = 1.0;
//   utter.volume = 1.0;

//   utter.onend = () => { state.currentUtter = null; };
//   utter.onerror = () => { state.currentUtter = null; };

//   state.currentUtter = utter;
//   window.speechSynthesis.speak(utter);
// }

// window.addEventListener('beforeunload', cancelSpeech);
// document.addEventListener('visibilitychange', () => {
//   if (document.hidden) cancelSpeech();
// });

// // --- UI helpers -------------------------------------------------------------
// function addBubble(text, who = 'ai') {
//   const wrap = document.createElement('div');
//   wrap.className = 'bubble ' + who;
//   const av = document.createElement('div');
//   av.className = 'avatar';
//   const img = document.createElement('img');
//   img.src = who === 'ai' ? getAvatarSrc(identitySel.value) : '/static/img/batwall.jpeg';
//   av.appendChild(img);
//   const tx = document.createElement('div');
//   tx.className = 'text';
//   tx.textContent = text;
//   wrap.appendChild(av);
//   wrap.appendChild(tx);
//   chat.appendChild(wrap);
//   chat.scrollTop = chat.scrollHeight;
// }



// function getAvatarSrc(identity) {
//   switch (identity) {
//     case 'male': return '/static/img/avatar-male.jpg';
//     case 'female': return './static/img/avatar-female.jpeg';
   
//     default: return '/static/img/avatar-neutral.png';
//   }
// }

// function updateHeaderAvatar() {
//   const avatarEl = document.getElementById('avatar');
//   if (!avatarEl) return; // 🚨 prevent breaking if element doesn't exist yet

//   avatarEl.querySelector('img').src = getAvatarSrc(identitySel.value);
//   avatarEl.classList.remove('ring-pride', 'ring-trans');
//   if (['gay', 'lesbian', 'bi'].includes(identitySel.value)) avatarEl.classList.add('ring-pride');
//   if (['trans', 'trans_pride'].includes(identitySel.value)) avatarEl.classList.add('ring-trans');
// }

// identitySel.addEventListener('change', () => {
//   updateHeaderAvatar();
//   applyPersonaDefaults();
// });
// updateHeaderAvatar();

// // --- Send flow --------------------------------------------------------------
// send.addEventListener('click', () => {
//   const text = msg.value.trim();
//   if (!text) return;
//   cancelSpeech();
//   addBubble(text, 'user');
//   sendToServer(text);
//   msg.value = '';
// });

// msg.addEventListener('keydown', (e) => {
//   if (e.key === 'Enter') send.click();
// });

// async function sendToServer(text) {
//   send.disabled = true;
//   try {
//     const payload = {
//       message: text,
//       identity: identitySel.value,
//       name: nameInput.value || 'Friend',
//       locale: langSel.value
//     };

//     const res = await fetch('/api/chat', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(payload)
//     });

//     const data = await res.json().catch(() => ({}));
//     if (!res.ok || !data.ok) {
//       addBubble('Error: ' + (data.error || `${res.status} ${res.statusText}`));
//       return;
//     }

//     cancelSpeech();
    
//     // 👇 Optional: reshuffle voice before every reply if persona is neutral
//     if (identitySel.value === 'neutral') {
//       applyPersonaDefaults();
//     }

//     addBubble(data.reply, 'ai');
//     speak(data.reply);
//   } catch (err) {
//     addBubble('Network error. Please try again.');
//   } finally {
//     send.disabled = false;
//   }
// }

// // --- Voices -----------------------------------------------------------------
// function loadVoices() {
//   state.voices = window.speechSynthesis.getVoices();
//   voiceSel.innerHTML = '';
//   const lang = langSel.value.split('-')[0];
//   const filtered = state.voices.filter(v => v.lang.toLowerCase().startsWith(lang.toLowerCase()));
//   const show = filtered.length ? filtered : state.voices;

//   show.forEach(v => {
//     const opt = document.createElement('option');
//     opt.value = v.name;
//     opt.textContent = `${v.name} (${v.lang})`;
//     voiceSel.appendChild(opt);
//   });

//   applyPersonaDefaults();
// }

// // 🎭 Persona-based default voices (✅ updated logic)
// function applyPersonaDefaults() {
//   const persona = identitySel.value;

//   if (persona === 'male') {
//     // ✅ Prefer Aaron (en-US)
//     const aaron = state.voices.find(
//       v => v.name.toLowerCase().includes('aaron') && v.lang === 'en-US'
//     );
//     if (aaron) {
//       voiceSel.value = aaron.name;
//       langSel.value = 'en-US';
//       return;
//     }
//     const fallbackMale = state.voices.find(v => v.lang === 'en-US');
//     if (fallbackMale) {
//       voiceSel.value = fallbackMale.name;
//       langSel.value = 'en-US';
//     }

//   } else if (persona === 'female') {
//     // ✅ Prefer known female voices
//     const female = state.voices.find(v =>
//       /(samantha|allison|female|ava|karen)/i.test(v.name) && v.lang === 'en-GB'
//     );
//     if (female) {
//       voiceSel.value = female.name;
//       langSel.value = 'en-GB';
//       return;
//     }
//     const fallbackFemale = state.voices.find(v => v.lang === 'en-GB');
//     if (fallbackFemale) {
//       voiceSel.value = fallbackFemale.name;
//       langSel.value = 'en-GB';
//     }

//   } else if (persona === 'neutral') {
//     // 🌍 Shuffle accent + voice randomly
//     const accents = ['en-US', 'en-GB', 'en-IN', 'en-AU'];
//     const randomAccent = accents[Math.floor(Math.random() * accents.length)];

//     const accentVoices = state.voices.filter(v => v.lang === randomAccent);
//     if (accentVoices.length > 0) {
//       const randomVoice = accentVoices[Math.floor(Math.random() * accentVoices.length)];
//       voiceSel.value = randomVoice.name;
//       langSel.value = randomAccent;
//     } else {
//       // fallback: pick any English voice
//       const englishVoices = state.voices.filter(v => v.lang.startsWith('en-'));
//       if (englishVoices.length > 0) {
//         const fallback = englishVoices[Math.floor(Math.random() * englishVoices.length)];
//         voiceSel.value = fallback.name;
//         langSel.value = fallback.lang;
//       }
//     }
//   }
// }

// // ✅ Load voices properly
// if ('speechSynthesis' in window) {
//   window.speechSynthesis.onvoiceschanged = () => {
//     loadVoices();
//     applyPersonaDefaults();
//   };
//   setTimeout(() => {
//     loadVoices();
//     applyPersonaDefaults();
//   }, 300);
// }

// langSel.addEventListener('change', () => {
//   loadVoices();
//   cancelSpeech();
// });

// // --- Stop button ------------------------------------------------------------
// stopBtn.addEventListener('click', cancelSpeech);

// // --- Mic / Speech recognition ----------------------------------------------
// let recognition;
// if ('webkitSpeechRecognition' in window) {
//   recognition = new webkitSpeechRecognition();
//   recognition.continuous = false;
//   recognition.interimResults = false;
//   recognition.lang = langSel.value;

//   recognition.onstart = () => { state.isRecognizing = true; };
//   recognition.onend = () => { state.isRecognizing = false; };
//   recognition.onerror = () => { state.isRecognizing = false; };

//   recognition.onresult = (e) => {
//     const text = e.results[0][0].transcript;
//     msg.value = text;
//     send.click();
//   };

//   langSel.addEventListener('change', () => {
//     if (recognition) recognition.lang = langSel.value;
//   });
// }

// toggleMic.addEventListener('mousedown', () => {
//   if (!recognition) return;
//   cancelSpeech();
//   recognition.start();
//   toggleMic.textContent = '🎙️…';
// });
// ['mouseup', 'mouseleave'].forEach(evt => {
//   toggleMic.addEventListener(evt, () => {
//     if (!recognition) return;
//     recognition.stop();
//     toggleMic.textContent = '🎙️';
//   });
// });
// // Touch support for hold-to-speak on mobile
// toggleMic.addEventListener('touchstart', (e) => {
//   if (!recognition) return;
//   e.preventDefault(); // prevent ghost click
//   cancelSpeech();
//   recognition.start();
//   toggleMic.textContent = '🎙️…';
// });

// ['touchend', 'touchcancel'].forEach(evt => {
//   toggleMic.addEventListener(evt, () => {
//     if (!recognition) return;
//     recognition.stop();
//     toggleMic.textContent = '🎙️';
//   });
// });
// ===== DOM refs =====


// const chat = document.getElementById('chat');
// const msg = document.getElementById('msg');
// const send = document.getElementById('send');
// const identitySel = document.getElementById('identity');
// const voiceSel = document.getElementById('voiceSelect');
// const langSel = document.getElementById('langSelect');
// const toggleMic = document.getElementById('toggleMic');
// const stopBtn = document.getElementById('stopVoice');
// const nameInput = document.getElementById('nameInput');
// const avatar = document.getElementById('avatar');

// // ===== State =====
// const state = {
//   voices: [],
//   currentUtter: null,
//   isRecognizing: false,
// };

// // ===== Speech helpers =====
// function cancelSpeech() {
//   if (!('speechSynthesis' in window)) return;
//   try { window.speechSynthesis.cancel(); } catch (_) {}
//   if (state.currentUtter) {
//     try { state.currentUtter.onend = state.currentUtter.onerror = null; } catch (_) {}
//     state.currentUtter = null;
//   }
// }

// function stopRecognition() {
//   if (typeof recognition !== 'undefined' && recognition && state.isRecognizing) {
//     try { recognition.stop(); } catch (_) {}
//     state.isRecognizing = false;
//   }
// }

// // Strong emoji/pictograph strip so TTS won’t say “smiling face…”
// function cleanTextForSpeech(text) {
//   let t = String(text || "");
//   try {
//     t = t
//       .replace(/\p{Extended_Pictographic}/gu, "")
//       .replace(/\p{Emoji_Presentation}/gu, "")
//       .replace(/\uFE0F/gu, "")   // VS16
//       .replace(/\u200D/gu, "");  // ZWJ
//     t = t
//       .replace(/[\u{1F1E6}-\u{1F1FF}]/gu, "") // flags
//       .replace(/[\u{1F3FB}-\u{1F3FF}]/gu, ""); // skin tones
//   } catch {
//     const emojiFallback =
//       /[\u2700-\u27BF]|\u24C2|[\u25A0-\u25FF]|[\u2190-\u21FF]|[\u2300-\u23FF]|[\u2600-\u26FF]|[\u2B00-\u2BFF]|[\u1F000-\u1FAFF]|\uFE0F|\u200D|[\uD83C-\uDBFF][\uDC00-\uDFFF]/g;
//     t = t.replace(emojiFallback, "");
//   }
//   return t.trim();
// }

// function speak(text) {
//   if (!('speechSynthesis' in window)) return;
//   cancelSpeech();

//   const safeText = cleanTextForSpeech(text);
//   if (!safeText) return;

//   const utter = new SpeechSynthesisUtterance(safeText);
//   utter.lang = langSel.value;

//   const chosen = state.voices.find(v => v.name === voiceSel.value);
//   if (chosen) utter.voice = chosen;

//   utter.rate = 1.0;
//   utter.pitch = 1.0;
//   utter.volume = 1.0;

//   utter.onend = () => { state.currentUtter = null; };
//   utter.onerror = () => { state.currentUtter = null; };

//   state.currentUtter = utter;
//   window.speechSynthesis.speak(utter);
// }

// window.addEventListener('beforeunload', () => { cancelSpeech(); stopRecognition(); });
// document.addEventListener('visibilitychange', () => { if (document.hidden) { cancelSpeech(); stopRecognition(); } });

// // ===== UI helpers =====
// function addBubble(text, who = 'ai') {
//   const wrap = document.createElement('div');
//   wrap.className = 'bubble ' + who;

//   const av = document.createElement('div');
//   av.className = 'avatar';
//   const img = document.createElement('img');
//   img.src = who === 'ai' ? getAvatarSrc(identitySel.value) : '/static/img/batwall.jpeg';
//   av.appendChild(img);

//   const tx = document.createElement('div');
//   tx.className = 'text';
//   tx.textContent = text;

//   wrap.appendChild(av);
//   wrap.appendChild(tx);
//   chat.appendChild(wrap);
//   chat.scrollTop = chat.scrollHeight;
// }

// function getAvatarSrc(identity) {
//   switch (identity) {
//     case 'male': return '/static/img/avatar-male.jpg';
//     case 'female': return '/static/img/avatar-female.jpeg';
//     default: return '/static/img/avatar-neutral.png';
//   }
// }

// function updateHeaderAvatar() {
//   const avatarEl = document.getElementById('avatar');
//   if (!avatarEl) return;
//   avatarEl.querySelector('img').src = getAvatarSrc(identitySel.value);
//   avatarEl.classList.remove('ring-pride', 'ring-trans');
//   if (['gay', 'lesbian', 'bi'].includes(identitySel.value)) avatarEl.classList.add('ring-pride');
//   if (['trans', 'trans_pride'].includes(identitySel.value)) avatarEl.classList.add('ring-trans');
// }

// identitySel.addEventListener('change', () => {
//   updateHeaderAvatar();
//   applyPersonaDefaults();
// });
// updateHeaderAvatar();

// // ===== Send flow =====
// send.addEventListener('click', () => {
//   const text = msg.value.trim();
//   if (!text) return;
//   cancelSpeech();
//   addBubble(text, 'user');
//   sendToServer(text);
//   msg.value = '';
// });

// msg.addEventListener('keydown', (e) => {
//   if (e.key === 'Enter') send.click();
// });

// async function sendToServer(text) {
//   send.disabled = true;
//   try {
//     const payload = {
//       message: text,
//       identity: identitySel.value,
//       name: nameInput.value || 'Friend',
//       locale: langSel.value
//     };

//     const res = await fetch('/api/chat', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(payload)
//     });

//     const data = await res.json().catch(() => ({}));
//     if (!res.ok || !data.ok) {
//       addBubble('Error: ' + (data.error || `${res.status} ${res.statusText}`));
//       return;
//     }

//     cancelSpeech();
//     if (identitySel.value === 'neutral') {
//       applyPersonaDefaults();
//     }

//     addBubble(data.reply, 'ai');
//     // if speak throws, it no longer breaks the whole flow
//     try { speak(data.reply); } catch (_) {}
//   } catch (err) {
//     addBubble('Network error. Please try again.');
//   } finally {
//     send.disabled = false;
//   }
// }

// // ===== Voices =====
// function loadVoices() {
//   state.voices = window.speechSynthesis.getVoices();
//   voiceSel.innerHTML = '';
//   const lang = langSel.value.split('-')[0];
//   const filtered = state.voices.filter(v => (v.lang || '').toLowerCase().startsWith(lang.toLowerCase()));
//   const show = filtered.length ? filtered : state.voices;

//   show.forEach(v => {
//     const opt = document.createElement('option');
//     opt.value = v.name;
//     opt.textContent = `${v.name} (${v.lang})`;
//     voiceSel.appendChild(opt);
//   });

//   applyPersonaDefaults();
// }

// // 🎭 Persona-based default voices
// function applyPersonaDefaults() {
//   const persona = identitySel.value;

//   if (persona === 'male') {
//     const aaron = state.voices.find(
//       v => (v.name || '').toLowerCase().includes('aaron') && v.lang === 'en-US'
//     );
//     if (aaron) { voiceSel.value = aaron.name; langSel.value = 'en-US'; return; }
//     const fallbackMale = state.voices.find(v => v.lang === 'en-US');
//     if (fallbackMale) { voiceSel.value = fallbackMale.name; langSel.value = 'en-US'; }

//   } else if (persona === 'female') {
//     const female = state.voices.find(v =>
//       /(samantha|allison|female|ava|karen)/i.test(v.name || '') && v.lang === 'en-GB'
//     );
//     if (female) { voiceSel.value = female.name; langSel.value = 'en-GB'; return; }
//     const fallbackFemale = state.voices.find(v => v.lang === 'en-GB');
//     if (fallbackFemale) { voiceSel.value = fallbackFemale.name; langSel.value = 'en-GB'; }

//   } else if (persona === 'neutral') {
//     const accents = ['en-US', 'en-GB', 'en-IN', 'en-AU'];
//     const randomAccent = accents[Math.floor(Math.random() * accents.length)];
//     const accentVoices = state.voices.filter(v => v.lang === randomAccent);
//     if (accentVoices.length > 0) {
//       const randomVoice = accentVoices[Math.floor(Math.random() * accentVoices.length)];
//       voiceSel.value = randomVoice.name; langSel.value = randomAccent;
//     } else {
//       const englishVoices = state.voices.filter(v => (v.lang || '').startsWith('en-'));
//       if (englishVoices.length > 0) {
//         const fallback = englishVoices[Math.floor(Math.random() * englishVoices.length)];
//         voiceSel.value = fallback.name; langSel.value = fallback.lang;
//       }
//     }
//   }
// }

// // Load voices properly
// if ('speechSynthesis' in window) {
//   window.speechSynthesis.onvoiceschanged = () => { loadVoices(); applyPersonaDefaults(); };
//   setTimeout(() => { loadVoices(); applyPersonaDefaults(); }, 300);
// }

// langSel.addEventListener('change', () => { loadVoices(); cancelSpeech(); });

// // ===== Stop button =====
// stopBtn.addEventListener('click', () => { cancelSpeech(); stopRecognition(); });

// // ===== Mic / Speech recognition =====
// let recognition;
// if ('webkitSpeechRecognition' in window) {
//   recognition = new webkitSpeechRecognition();
//   recognition.continuous = false;
//   recognition.interimResults = false;
//   recognition.lang = langSel.value;

//   recognition.onstart = () => { state.isRecognizing = true; };
//   recognition.onend = () => { state.isRecognizing = false; };
//   recognition.onerror = () => { state.isRecognizing = false; };

//   recognition.onresult = (e) => {
//     const text = e.results[0][0].transcript;
//     msg.value = text;
//     send.click();
//   };

//   langSel.addEventListener('change', () => {
//     if (recognition) recognition.lang = langSel.value;
//   });
// }

// toggleMic.addEventListener('mousedown', () => {
//   if (!recognition) return;
//   cancelSpeech();
//   recognition.start();
//   toggleMic.textContent = '🎙️…';
// });
// ['mouseup', 'mouseleave'].forEach(evt => {
//   toggleMic.addEventListener(evt, () => {
//     if (!recognition) return;
//     recognition.stop();
//     toggleMic.textContent = '🎙️';
//   });
// });
// // Touch support for hold-to-speak on mobile
// toggleMic.addEventListener('touchstart', (e) => {
//   if (!recognition) return;
//   e.preventDefault();
//   cancelSpeech();
//   recognition.start();
//   toggleMic.textContent = '🎙️…';
// });
// ['touchend', 'touchcancel'].forEach(evt => {
//   toggleMic.addEventListener(evt, () => {
//     if (!recognition) return;
//     recognition.stop();
//     toggleMic.textContent = '🎙️';
//   });
// });

// // ===== Optional: clear chat helper (if you use a Clear button) =====
// function clearChat() {
//   try { cancelSpeech(); } catch (_) {}
//   try { stopRecognition(); } catch (_) {}
//   if (chat) chat.innerHTML = '';
//   try { localStorage.removeItem('chatMessages'); } catch (_) {}
// }




/* ================================
   Mobile-Stable Chat + Voice App.js
   ================================ */

   const chat = document.getElementById('chat');
   const msg = document.getElementById('msg');
   const send = document.getElementById('send');
   const identitySel = document.getElementById('identity');
   const voiceSel = document.getElementById('voiceSelect');
   const langSel = document.getElementById('langSelect');
   const toggleMic = document.getElementById('toggleMic');
   const stopBtn = document.getElementById('stopVoice');
   const nameInput = document.getElementById('nameInput');
   const avatar = document.getElementById('avatar');
   
   /* ---------- Global State ---------- */
   const state = {
     voices: [],
     currentUtter: null,
     isRecognizing: false,
     audioUnlocked: false,   // iOS/Safari needs user-gesture unlock
     tapToggleMode: true,    // single tap toggles mic on mobile; hold also supported
     recognizingManuallyStarted: false,
   };
   
   /* ---------- Audio Unlock (iOS/Safari) ---------- */
   function unlockAudioOnce() {
     if (!('speechSynthesis' in window)) return;
     if (state.audioUnlocked) return;
   
     try {
       // 1) Dummy utterance (many iOS versions require this)
       const u = new SpeechSynthesisUtterance('');
       window.speechSynthesis.speak(u);
   
       // 2) Resume if paused (some devices load paused by default)
       if (window.speechSynthesis.paused) {
         window.speechSynthesis.resume();
       }
       state.audioUnlocked = true;
       // console.log('🔓 Audio unlocked');
     } catch (_) {
       // ignore
     }
   }
   
   /* ---------- Speech helpers ---------- */
   function cancelSpeech() {
     if (!('speechSynthesis' in window)) return;
     try { window.speechSynthesis.cancel(); } catch (_) {}
     if (state.currentUtter) {
       try { state.currentUtter.onend = state.currentUtter.onerror = null; } catch (_) {}
       state.currentUtter = null;
     }
   }
   
   function stopRecognition() {
     if (recognition && state.isRecognizing) {
       try { recognition.stop(); } catch (_) {}
       state.isRecognizing = false;
       state.recognizingManuallyStarted = false;
       setMicUI(false);
     }
   }
   
   // Strong emoji/pictograph strip so TTS won’t say “smiling face…”
   function cleanTextForSpeech(text) {
     let t = String(text || "");
     try {
       t = t
         .replace(/\p{Extended_Pictographic}/gu, "")
         .replace(/\p{Emoji_Presentation}/gu, "")
         .replace(/\uFE0F/gu, "")   // VS16
         .replace(/\u200D/gu, "");  // ZWJ
       t = t
         .replace(/[\u{1F1E6}-\u{1F1FF}]/gu, "") // flags
         .replace(/[\u{1F3FB}-\u{1F3FF}]/gu, ""); // skin tones
     } catch {
       const emojiFallback =
         /[\u2700-\u27BF]|\u24C2|[\u25A0-\u25FF]|[\u2190-\u21FF]|[\u2300-\u23FF]|[\u2600-\u26FF]|[\u2B00-\u2BFF]|[\u1F000-\u1FAFF]|\uFE0F|\u200D|[\uD83C-\uDBFF][\uDC00-\uDFFF]/g;
       t = t.replace(emojiFallback, "");
     }
     return t.trim();
   }
   
   function speak(text) {
     if (!('speechSynthesis' in window)) return;
   
     // Mobile/Safari: must be resumed just before speaking
     try {
       if (window.speechSynthesis.paused) {
         window.speechSynthesis.resume();
       }
     } catch (_) {}
   
     cancelSpeech();
   
     const safeText = cleanTextForSpeech(text);
     if (!safeText) return;
   
     const utter = new SpeechSynthesisUtterance(safeText);
     utter.lang = langSel?.value || 'en-US';
   
     const chosen = state.voices.find(v => v.name === voiceSel?.value);
     if (chosen) utter.voice = chosen;
   
     utter.rate = 1.0;
     utter.pitch = 1.0;
     utter.volume = 1.0;
   
     utter.onend = () => { state.currentUtter = null; };
     utter.onerror = () => { state.currentUtter = null; };
   
     state.currentUtter = utter;
   
     try {
       window.speechSynthesis.speak(utter);
     } catch (e) {
       // Some mobiles need another resume right before
       try { window.speechSynthesis.resume(); window.speechSynthesis.speak(utter); } catch (_) {}
     }
   }
   
   /* ---------- Lifecycle safety ---------- */
   window.addEventListener('beforeunload', () => { cancelSpeech(); stopRecognition(); });
   document.addEventListener('visibilitychange', () => {
     if (document.hidden) { cancelSpeech(); stopRecognition(); }
   });
   
   /* ---------- UI helpers ---------- */
   function addBubble(text, who = 'ai') {
     const wrap = document.createElement('div');
     wrap.className = 'bubble ' + who;
   
     const av = document.createElement('div');
     av.className = 'avatar';
     const img = document.createElement('img');
     img.src = who === 'ai' ? getAvatarSrc(identitySel.value) : '/static/img/batwall.jpeg';
     av.appendChild(img);
   
     const tx = document.createElement('div');
     tx.className = 'text';
     tx.textContent = text;
   
     wrap.appendChild(av);
     wrap.appendChild(tx);
     chat.appendChild(wrap);
     chat.scrollTop = chat.scrollHeight;
   }
   
   function getAvatarSrc(identity) {
     switch (identity) {
       case 'male': return '/static/img/avatar-male.jpg';
       case 'female': return '/static/img/avatar-female.jpeg';
       default: return '/static/img/avatar-neutral.png';
     }
   }
   
   function updateHeaderAvatar() {
     const avatarEl = document.getElementById('avatar');
     if (!avatarEl) return;
     avatarEl.querySelector('img').src = getAvatarSrc(identitySel.value);
     avatarEl.classList.remove('ring-pride', 'ring-trans');
     if (['gay', 'lesbian', 'bi'].includes(identitySel.value)) avatarEl.classList.add('ring-pride');
     if (['trans', 'trans_pride'].includes(identitySel.value)) avatarEl.classList.add('ring-trans');
   }
   
   /* ---------- Persona & Voices ---------- */
   function loadVoices() {
     if (!('speechSynthesis' in window)) return;
     state.voices = window.speechSynthesis.getVoices() || [];
     voiceSel.innerHTML = '';
     const lang = (langSel.value || 'en-US').split('-')[0];
     const filtered = state.voices.filter(v => (v.lang || '').toLowerCase().startsWith(lang.toLowerCase()));
     const show = filtered.length ? filtered : state.voices;
   
     show.forEach(v => {
       const opt = document.createElement('option');
       opt.value = v.name;
       opt.textContent = `${v.name} (${v.lang})`;
       voiceSel.appendChild(opt);
     });
   
     applyPersonaDefaults();
   }
   
   function applyPersonaDefaults() {
     if (!state.voices.length) return;
     const persona = identitySel.value;
   
     if (persona === 'male') {
       const aaron = state.voices.find(v => (v.name || '').toLowerCase().includes('aaron') && v.lang === 'en-US');
       if (aaron) { voiceSel.value = aaron.name; langSel.value = 'en-US'; return; }
       const fallbackMale = state.voices.find(v => v.lang === 'en-US');
       if (fallbackMale) { voiceSel.value = fallbackMale.name; langSel.value = 'en-US'; }
   
     } else if (persona === 'female') {
       const female = state.voices.find(v => /(samantha|allison|female|ava|karen)/i.test(v.name || '') && v.lang === 'en-GB');
       if (female) { voiceSel.value = female.name; langSel.value = 'en-GB'; return; }
       const fallbackFemale = state.voices.find(v => v.lang === 'en-GB');
       if (fallbackFemale) { voiceSel.value = fallbackFemale.name; langSel.value = 'en-GB'; }
   
     } else {
       const accents = ['en-US', 'en-GB', 'en-IN', 'en-AU'];
       const randomAccent = accents[Math.floor(Math.random() * accents.length)];
       const accentVoices = state.voices.filter(v => v.lang === randomAccent);
       if (accentVoices.length > 0) {
         const randomVoice = accentVoices[Math.floor(Math.random() * accentVoices.length)];
         voiceSel.value = randomVoice.name; langSel.value = randomAccent;
       } else {
         const englishVoices = state.voices.filter(v => (v.lang || '').startsWith('en-'));
         if (englishVoices.length > 0) {
           const fallback = englishVoices[Math.floor(Math.random() * englishVoices.length)];
           voiceSel.value = fallback.name; langSel.value = fallback.lang || 'en-US';
         }
       }
     }
   }
   
   /* Load voices */
   updateHeaderAvatar();
   identitySel.addEventListener('change', () => { updateHeaderAvatar(); applyPersonaDefaults(); });
   if ('speechSynthesis' in window) {
     window.speechSynthesis.onvoiceschanged = () => { loadVoices(); };
     setTimeout(() => { loadVoices(); }, 300);
   }
   langSel.addEventListener('change', () => { loadVoices(); cancelSpeech(); });
   
   /* ---------- Send flow ---------- */
   send.addEventListener('click', () => {
     const text = (msg.value || '').trim();
     if (!text) return;
     unlockAudioOnce();       // ensure voice is allowed after user gesture
     cancelSpeech();
     addBubble(text, 'user');
     sendToServer(text);
     msg.value = '';
   });
   
   msg.addEventListener('keydown', (e) => {
     if (e.key === 'Enter') send.click();
   });
   
   async function sendToServer(text) {
     send.disabled = true;
     try {
       const payload = {
         message: text,
         identity: identitySel.value,
         name: nameInput.value || 'Friend',
         locale: langSel.value
       };
   
       const res = await fetch('/api/chat', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(payload)
       });
   
       const data = await res.json().catch(() => ({}));
       if (!res.ok || !data.ok) {
         addBubble('Error: ' + (data.error || `${res.status} ${res.statusText}`));
         return;
       }
   
       if (identitySel.value === 'neutral') applyPersonaDefaults();
   
       addBubble(data.reply, 'ai');
       try { speak(data.reply); } catch (_) {}
     } catch (_) {
       addBubble('Network error. Please try again.');
     } finally {
       send.disabled = false;
     }
   }
   
   /* ---------- Stop button ---------- */
   stopBtn.addEventListener('click', () => { cancelSpeech(); stopRecognition(); });
   
   /* ---------- Mic / Speech recognition ---------- */
   let recognition;
   (function initRecognition() {
     const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
     if (!SR) {
       // Mic not supported (iOS Firefox, older browsers)
       toggleMic.disabled = true;
       toggleMic.title = 'Speech recognition not supported on this browser.';
       return;
     }
   
     recognition = new SR();
     recognition.continuous = false;
     recognition.interimResults = false;
     recognition.lang = langSel.value;
   
     recognition.onstart = () => { state.isRecognizing = true; setMicUI(true); };
     recognition.onend = () => { state.isRecognizing = false; setMicUI(false); };
     recognition.onerror = (e) => {
       state.isRecognizing = false;
       setMicUI(false);
       // Permission or blocked: surface a gentle hint once
       if (String(e?.error || '').includes('not-allowed')) {
         addBubble('Mic permission blocked. Please allow microphone access.', 'ai');
       }
     };
     recognition.onresult = (e) => {
       const text = e.results?.[0]?.[0]?.transcript || '';
       if (text) {
         msg.value = text;
         send.click();
       }
     };
   
     langSel.addEventListener('change', () => {
       if (recognition) recognition.lang = langSel.value;
     });
   })();
   
   /* Permissions preflight (HTTPS only) */
   async function ensureMicPermission() {
     if (!navigator.mediaDevices?.getUserMedia) return true;
     try {
       await navigator.mediaDevices.getUserMedia({ audio: true });
       return true;
     } catch {
       addBubble('Please allow microphone access in your browser settings.', 'ai');
       return false;
     }
   }
   
   /* Mic UI helpers */
   function setMicUI(active) {
     toggleMic.textContent = active ? '🎙️…' : '🎙️';
     toggleMic.classList.toggle('active', !!active);
   }
   
   /* Hold-to-talk (mouse) */
   toggleMic.addEventListener('mousedown', async () => {
     if (!recognition) return;
     unlockAudioOnce();
     if (!(await ensureMicPermission())) return;
     cancelSpeech();
     state.recognizingManuallyStarted = true;
     try { recognition.start(); } catch (_) {}
   });
   ['mouseup', 'mouseleave'].forEach(evt => {
     toggleMic.addEventListener(evt, () => {
       if (!recognition) return;
       if (state.recognizingManuallyStarted) {
         try { recognition.stop(); } catch (_) {}
         state.recognizingManuallyStarted = false;
       }
     });
   });
   
   /* Hold-to-talk (touch) */
   toggleMic.addEventListener('touchstart', async (e) => {
     if (!recognition) return;
     e.preventDefault();
     unlockAudioOnce();
     if (!(await ensureMicPermission())) return;
     cancelSpeech();
     state.recognizingManuallyStarted = true;
     try { recognition.start(); } catch (_) {}
   }, { passive: false });
   
   ['touchend', 'touchcancel'].forEach(evt => {
     toggleMic.addEventListener(evt, () => {
       if (!recognition) return;
       if (state.recognizingManuallyStarted) {
         try { recognition.stop(); } catch (_) {}
         state.recognizingManuallyStarted = false;
       }
     });
   });
   
   /* Tap-to-toggle (for quick taps on mobile) */
   toggleMic.addEventListener('click', async (e) => {
     // Click also fires after touchend on some devices; avoid double start/stop
     if (!recognition || !state.tapToggleMode) return;
     if (state.isRecognizing) {
       stopRecognition();
     } else {
       unlockAudioOnce();
       if (!(await ensureMicPermission())) return;
       cancelSpeech();
       try { recognition.start(); } catch (_) {}
     }
   });
   