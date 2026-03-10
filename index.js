/* ─────────────────────────────────────────────
   Momentum  –  나만의 동기부여 홈화면
   ───────────────────────────────────────────── */

/* ── Constants ── */
const STORAGE = {
    NAME:  'momentum_name',
    FOCUS: 'momentum_focus',
    TODOS: 'momentum_todos',
};

const FALLBACK_QUOTES = [
    { content: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { content: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { content: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { content: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
    { content: "Whether you think you can or think you can't, you're right.", author: "Henry Ford" },
    { content: "Act as if what you do makes a difference. It does.", author: "William James" },
    { content: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { content: "We may encounter many defeats but we must not be defeated.", author: "Maya Angelou" },
    { content: "Knowing is not enough; we must apply. Wishing is not enough; we must do.", author: "Johann Wolfgang von Goethe" },
    { content: "Imagine your life is perfect in every respect; what would it look like?", author: "Brian Tracy" },
];

const TIME_CLASSES  = ['time-night', 'time-dawn', 'time-morning', 'time-afternoon', 'time-sunset', 'time-evening'];
const WEEKDAYS      = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
const MONTHS        = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

/* WMO weather interpretation codes → emoji + label */
const WMO = {
    0:  ['☀️', 'Clear sky'],
    1:  ['🌤️', 'Mainly clear'],
    2:  ['⛅', 'Partly cloudy'],
    3:  ['☁️', 'Overcast'],
    45: ['🌫️', 'Fog'],
    48: ['🌫️', 'Icy fog'],
    51: ['🌦️', 'Light drizzle'],
    53: ['🌦️', 'Drizzle'],
    55: ['🌧️', 'Heavy drizzle'],
    61: ['🌧️', 'Slight rain'],
    63: ['🌧️', 'Rain'],
    65: ['🌧️', 'Heavy rain'],
    71: ['🌨️', 'Slight snow'],
    73: ['🌨️', 'Snow'],
    75: ['❄️', 'Heavy snow'],
    80: ['🌦️', 'Showers'],
    81: ['🌦️', 'Showers'],
    82: ['⛈️', 'Violent showers'],
    95: ['⛈️', 'Thunderstorm'],
    99: ['⛈️', 'Thunderstorm + hail'],
};

/* ── Entry point ── */
document.addEventListener('DOMContentLoaded', () => {
    initStars();
    initClock();
    initDate();
    initGreeting();
    initFocus();
    initTodos();
    initQuote();
    initWeather();
});

/* ─────────────────────────────────────────────
   CLOCK  (updates every second, local time)
   ───────────────────────────────────────────── */
function initClock() {
    updateClock();
    setInterval(updateClock, 1000);
}

function updateClock() {
    const now   = new Date();
    const h     = String(now.getHours()).padStart(2, '0');
    const m     = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('time').textContent = `${h}:${m}`;
    applyTimeBackground(now.getHours());
}

function applyTimeBackground(hour) {
    let cls;
    if (hour < 6)       cls = 'time-night';
    else if (hour < 8)  cls = 'time-dawn';
    else if (hour < 12) cls = 'time-morning';
    else if (hour < 17) cls = 'time-afternoon';
    else if (hour < 20) cls = 'time-sunset';
    else if (hour < 22) cls = 'time-evening';
    else                cls = 'time-night';

    const body = document.body;
    if (!body.classList.contains(cls)) {
        TIME_CLASSES.forEach(c => body.classList.remove(c));
        body.classList.add(cls);
    }
}

/* ─────────────────────────────────────────────
   DATE BADGE
   ───────────────────────────────────────────── */
function initDate() {
    const now = new Date();
    document.getElementById('date-day').textContent     = now.getDate();
    document.getElementById('date-month').textContent   = MONTHS[now.getMonth()];
    document.getElementById('date-weekday').textContent = WEEKDAYS[now.getDay()];
}

/* ─────────────────────────────────────────────
   STARS  (canvas-free, pure DOM)
   ───────────────────────────────────────────── */
function initStars() {
    const container = document.getElementById('stars');
    for (let i = 0; i < 120; i++) {
        const s = document.createElement('div');
        s.className = 'star';
        const size = Math.random() * 2.5 + 0.5;
        s.style.cssText = [
            `width:${size}px`,
            `height:${size}px`,
            `top:${Math.random() * 100}%`,
            `left:${Math.random() * 100}%`,
            `--dur:${(Math.random() * 3 + 2).toFixed(1)}s`,
            `animation-delay:${(Math.random() * 4).toFixed(1)}s`,
        ].join(';');
        container.appendChild(s);
    }
}

/* ─────────────────────────────────────────────
   GREETING  (editable name, saved to localStorage)
   ───────────────────────────────────────────── */
function initGreeting() {
    const el = document.getElementById('user-name');
    el.textContent = localStorage.getItem(STORAGE.NAME) || 'Josh';

    el.addEventListener('click', () => {
        const current = el.textContent;
        const input   = document.createElement('input');
        input.className   = 'edit-input';
        input.value       = current;
        input.style.fontSize = '0.9em';
        el.replaceWith(input);
        input.focus();
        input.select();

        const commit = () => {
            const val = input.value.trim() || current;
            localStorage.setItem(STORAGE.NAME, val);
            input.replaceWith(el);
            el.textContent = val;
        };
        input.addEventListener('blur',  commit);
        input.addEventListener('keydown', e => {
            if (e.key === 'Enter') input.blur();
            if (e.key === 'Escape') { input.value = current; input.blur(); }
        });
    });
}

/* ─────────────────────────────────────────────
   FOCUS STATEMENT  (editable, saved to localStorage)
   ───────────────────────────────────────────── */
function initFocus() {
    const el = document.getElementById('focus-text');
    const saved = localStorage.getItem(STORAGE.FOCUS);
    if (saved) el.textContent = saved;

    el.addEventListener('click', () => {
        el.contentEditable = 'true';
        el.classList.add('editing');
        el.focus();

        const range = document.createRange();
        range.selectNodeContents(el);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    });

    el.addEventListener('blur', () => {
        el.contentEditable = 'false';
        el.classList.remove('editing');
        const val = el.textContent.trim() || '오늘의 집중: 업무시간에 몰입하기';
        el.textContent = val;
        localStorage.setItem(STORAGE.FOCUS, val);
    });

    el.addEventListener('keydown', e => {
        if (e.key === 'Enter') { e.preventDefault(); el.blur(); }
        if (e.key === 'Escape') {
            el.textContent = localStorage.getItem(STORAGE.FOCUS) || '오늘의 집중: 업무시간에 몰입하기';
            el.blur();
        }
    });
}

/* ─────────────────────────────────────────────
   TODOS  (localStorage persistence)
   ───────────────────────────────────────────── */
let todos = [];

function initTodos() {
    todos = JSON.parse(localStorage.getItem(STORAGE.TODOS) || '[]');
    renderTodos();

    document.getElementById('btn-add').addEventListener('click', addTodo);
    document.getElementById('todo-input').addEventListener('keydown', e => {
        if (e.key === 'Enter') addTodo();
    });
}

function addTodo() {
    const input = document.getElementById('todo-input');
    const text  = input.value.trim();
    if (!text) return;
    todos.push({ id: Date.now(), text, done: false });
    saveTodos();
    renderTodos();
    input.value = '';
    input.focus();
}

function toggleTodo(id) {
    const item = todos.find(t => t.id === id);
    if (item) { item.done = !item.done; saveTodos(); renderTodos(); }
}

function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    saveTodos();
    renderTodos();
}

function saveTodos() {
    localStorage.setItem(STORAGE.TODOS, JSON.stringify(todos));
}

function renderTodos() {
    const list   = document.getElementById('todo-list');
    const footer = document.getElementById('todo-footer');
    list.innerHTML = '';

    if (todos.length === 0) {
        footer.textContent = '할 일을 추가해보세요!';
        return;
    }

    todos.forEach(todo => {
        const li  = document.createElement('li');
        li.className = `todo-item${todo.done ? ' done' : ''}`;

        const check = document.createElement('div');
        check.className = 'todo-check';
        check.addEventListener('click', () => toggleTodo(todo.id));

        const label = document.createElement('span');
        label.className   = 'todo-label';
        label.textContent = todo.text;

        const del = document.createElement('button');
        del.className   = 'todo-delete';
        del.textContent = '×';
        del.title       = '삭제';
        del.addEventListener('click', () => deleteTodo(todo.id));

        li.appendChild(check);
        li.appendChild(label);
        li.appendChild(del);
        list.appendChild(li);
    });

    const done  = todos.filter(t => t.done).length;
    const total = todos.length;
    footer.textContent = `${done} / ${total} 완료`;
}

/* ─────────────────────────────────────────────
   QUOTE  (Quotable API with fallback + refresh)
   ───────────────────────────────────────────── */
function initQuote() {
    fetchQuote();
    document.getElementById('btn-refresh').addEventListener('click', fetchQuote);
}

function fetchQuote() {
    const btn = document.getElementById('btn-refresh');
    btn.classList.add('spinning');

    fetch('https://api.quotable.io/random')
        .then(res => {
            if (!res.ok) throw new Error('API error');
            return res.json();
        })
        .then(data => {
            setQuote(data.content, data.author);
        })
        .catch(() => {
            const fb = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
            setQuote(fb.content, fb.author);
        })
        .finally(() => {
            btn.classList.remove('spinning');
        });
}

function setQuote(content, author) {
    const contentEl = document.getElementById('content');
    const authorEl  = document.getElementById('author');

    contentEl.style.opacity = '0';
    authorEl.style.opacity  = '0';

    setTimeout(() => {
        contentEl.textContent = `" ${content} "`;
        authorEl.textContent  = `— ${author} —`;
        contentEl.style.transition = 'opacity 0.5s ease';
        authorEl.style.transition  = 'opacity 0.5s ease';
        contentEl.style.opacity = '1';
        authorEl.style.opacity  = '1';
    }, 300);
}

/* ─────────────────────────────────────────────
   WEATHER  (Geolocation → Open-Meteo → Nominatim)
   ───────────────────────────────────────────── */
function initWeather() {
    if (!navigator.geolocation) {
        setWeatherFallback();
        return;
    }

    navigator.geolocation.getCurrentPosition(
        pos => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        ()  => setWeatherFallback(),
        { timeout: 8000 }
    );
}

function fetchWeather(lat, lon) {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
    const geoUrl     = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

    Promise.all([
        fetch(weatherUrl).then(r => r.json()),
        fetch(geoUrl,    { headers: { 'Accept-Language': 'ko' } }).then(r => r.json()),
    ])
    .then(([weather, geo]) => {
        const cw      = weather.current_weather;
        const code    = cw.weathercode;
        const [emoji, desc] = WMO[code] ?? ['🌡️', 'Unknown'];
        const temp    = Math.round(cw.temperature);
        const city    = geo.address?.city
                     || geo.address?.town
                     || geo.address?.county
                     || '';

        document.getElementById('weather-icon').textContent = emoji;
        document.getElementById('weather-temp').textContent = `${temp}°C`;
        document.getElementById('weather-desc').textContent = desc;
        document.getElementById('weather-city').textContent = city;
    })
    .catch(() => setWeatherFallback());
}

function setWeatherFallback() {
    document.getElementById('weather-icon').textContent = '🌍';
    document.getElementById('weather-temp').textContent = '--°C';
    document.getElementById('weather-desc').textContent = 'Unavailable';
    document.getElementById('weather-city').textContent = '';
}
