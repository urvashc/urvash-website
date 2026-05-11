(function() {
  var history = [];
  var open = false;
  var expanded = false;

  window.toggleChat = function() {
    open = !open;
    var win = document.getElementById('chatbot-window');
    if (win) win.classList.toggle('open', open);
    if (open) {
      setTimeout(function() {
        var inp = document.getElementById('chatInput');
        if (inp) inp.focus();
      }, 250);
    }
  };

  window.toggleExpand = function() {
    expanded = !expanded;
    var win = document.getElementById('chatbot-window');
    var icon = document.getElementById('expandIcon');
    if (win) win.classList.toggle('expanded', expanded);

    // Swap icon: compress arrows when expanded, expand arrows when compact
    if (expanded) {
      icon.innerHTML = '<polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="10" y1="14" x2="3" y2="21"/><line x1="21" y1="3" x2="14" y2="10"/>';
    } else {
      icon.innerHTML = '<polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>';
    }

    // Keep scroll at bottom after resize
    setTimeout(function() {
      var msgs = document.getElementById('chatMessages');
      if (msgs) msgs.scrollTop = msgs.scrollHeight;
    }, 320);
  };

  window.sendSuggestion = function(btn) {
    var text = btn.textContent;
    var sugg = document.getElementById('chatSuggestions');
    if (sugg) sugg.style.display = 'none';
    sendText(text);
  };

  window.sendMessage = function() {
    var inp = document.getElementById('chatInput');
    if (!inp || !inp.value.trim()) return;
    var text = inp.value.trim();
    inp.value = '';
    sendText(text);
  };

  function sendText(text) {
    appendMsg('user', text);
    history.push({ role: 'user', content: text });
    setLoading(true);
    callAPI();
  }

  function renderMarkdown(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');
  }

  function appendMsg(role, text) {
    var msgs = document.getElementById('chatMessages');
    if (!msgs) return;
    var div = document.createElement('div');
    div.className = 'chatbot-msg ' + role;
    var inner = document.createElement('div');
    inner.className = 'chatbot-msg-text';
    if (role === 'bot') {
      inner.innerHTML = '<p>' + renderMarkdown(text) + '</p>';
    } else {
      inner.textContent = text;
    }
    div.appendChild(inner);
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    return inner;
  }

  function showTyping() {
    var msgs = document.getElementById('chatMessages');
    if (!msgs) return;
    var div = document.createElement('div');
    div.className = 'chatbot-typing';
    div.id = 'typingIndicator';
    div.innerHTML = '<span></span><span></span><span></span>';
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function setLoading(on) {
    var btn = document.getElementById('chatSend');
    var inp = document.getElementById('chatInput');
    if (btn) btn.disabled = on;
    if (inp) inp.disabled = on;
    if (on) {
      showTyping();
    } else {
      var t = document.getElementById('typingIndicator');
      if (t) t.remove();
    }
  }

  function callAPI() {
    fetch('/.netlify/functions/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history })
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      setLoading(false);
      var text = data.reply || "Something went wrong — try again in a moment.";
      history.push({ role: 'assistant', content: text });
      appendMsg('bot', text);
    })
    .catch(function() {
      setLoading(false);
      appendMsg('bot', "Connection issue — try again in a moment.");
    });
  }

  // Enter key to send
  document.addEventListener('DOMContentLoaded', function() {
    var inp = document.getElementById('chatInput');
    if (inp) {
      inp.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendMessage();
        }
      });
    }
  });

})();