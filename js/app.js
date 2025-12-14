// app.js - Полная версия с всегда показывающимся интро-экраном
const { useState, useEffect, useRef } = React;

// 🎬 INTRO TEXT COMPONENT
const IntroText = ({ onComplete }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [currentLine, setCurrentLine] = useState(0);
    const [isTyping, setIsTyping] = useState(true);
    const [flickerWords, setFlickerWords] = useState([]);
    const textContainerRef = useRef(null);

    const fullText = [
        "Привет, путник...",
        "Ты уверен, что нашел это место сам?",
        "Или... оно нашло тебя?",
        "В тишине слышны шаги тех, кто был до нас.",
        "",
        "'Память - это единственный рай,",
        "из которого нас не могут изгнать'.",
        "",
        "Протяни руку через года...",
        "Сквозь пелену времени доносится шепот:",
        "'Мы не наследуем землю от предков,",
        "а одалживаем ее у потомков'.",
        "",
        "Что передашь ты тем, кто придет после?",
        "Свой след... или просто дату?"
    ];

    const flickerCandidates = [
        "путник", "сам", "нашло", "шаги", "память", "рай", "изгнать",
        "протяни", "шепот", "наследуем", "одалживаем", "потомков",
        "передашь", "след", "дату"
    ];

    // Эффект печатания текста
    useEffect(() => {
        if (!isTyping || currentLine >= fullText.length) {
            if (currentLine >= fullText.length) {
                setTimeout(() => {
                    setIsTyping(false);
                    if (onComplete) onComplete();
                }, 3000);
            }
            return;
        }

        const currentText = fullText[currentLine];
        if (displayedText.length < currentText.length) {
            const timer = setTimeout(() => {
                setDisplayedText(currentText.substring(0, displayedText.length + 1));
            }, 40 + Math.random() * 30);
            
            return () => clearTimeout(timer);
        } else {
            const timer = setTimeout(() => {
                setCurrentLine(prev => prev + 1);
                setDisplayedText('');
                
                // Добавляем паузу после определенных строк
                if ([3, 6, 9, 11].includes(currentLine)) {
                    setTimeout(() => {
                        setCurrentLine(prev => prev + 1);
                    }, 1000);
                }
            }, currentLine === fullText.length - 1 ? 1000 : 500);
            
            return () => clearTimeout(timer);
        }
    }, [displayedText, currentLine, isTyping]);

    // Эффект мерцания слов
    useEffect(() => {
        if (!isTyping) return;

        const flickerInterval = setInterval(() => {
            if (Math.random() > 0.7) {
                const randomWord = flickerCandidates[Math.floor(Math.random() * flickerCandidates.length)];
                setFlickerWords(prev => [...prev, randomWord]);
                
                setTimeout(() => {
                    setFlickerWords(prev => prev.filter(word => word !== randomWord));
                }, 300 + Math.random() * 400);
            }
        }, 800);

        return () => clearInterval(flickerInterval);
    }, [isTyping]);

    // Эффект "дыхания" тени
    useEffect(() => {
        const textElement = textContainerRef.current;
        if (!textElement) return;

        let animationId;
        const startTime = Date.now();

        const animateShadow = () => {
            const elapsed = Date.now() - startTime;
            const pulse = Math.sin(elapsed / 2000) * 0.1 + 0.9;
            const blur = 10 + Math.sin(elapsed / 1500) * 5;
            const shadow = `0 0 ${blur}px rgba(139, 69, 19, ${pulse * 0.3})`;
            
            textElement.style.textShadow = shadow;
            animationId = requestAnimationFrame(animateShadow);
        };

        animateShadow();
        return () => {
            if (animationId) cancelAnimationFrame(animationId);
        };
    }, []);

    const renderTextWithEffects = () => {
        if (currentLine >= fullText.length) return fullText.join('\n');

        const linesToShow = fullText.slice(0, currentLine).concat(displayedText);
        
        return linesToShow.map((line, lineIndex) => {
            if (line === '') return <br key={lineIndex} />;
            
            const words = line.split(' ');
            return (
                <p key={lineIndex} className={`text-line ${lineIndex === currentLine ? 'current-line' : ''}`}>
                    {words.map((word, wordIndex) => {
                        const isFlickering = flickerWords.includes(word.toLowerCase().replace(/[.,!?'"]/g, ''));
                        const wordClass = isFlickering ? 'flicker-word' : '';
                        
                        return (
                            <span key={wordIndex} className={wordClass}>
                                {word}{wordIndex < words.length - 1 ? ' ' : ''}
                            </span>
                        );
                    })}
                    {lineIndex === currentLine && displayedText.length < line.length && (
                        <span className="cursor">|</span>
                    )}
                </p>
            );
        });
    };

    return (
        <div className="intro-container">
            <div className="animated-background">
                <div className="floating-particle" style={{left: '10%', animationDelay: '0s'}}></div>
                <div className="floating-particle" style={{left: '30%', animationDelay: '2s'}}></div>
                <div className="floating-particle" style={{left: '50%', animationDelay: '4s'}}></div>
                <div className="floating-particle" style={{left: '70%', animationDelay: '1s'}}></div>
                <div className="floating-particle" style={{left: '90%', animationDelay: '3s'}}></div>
                
                <div className="pulse-ring"></div>
                <div className="pulse-ring" style={{animationDelay: '1.5s'}}></div>
                <div className="pulse-ring" style={{animationDelay: '3s'}}></div>
            </div>
            
            <div ref={textContainerRef} className="intro-text">
                {renderTextWithEffects()}
            </div>
            
            {!isTyping && currentLine >= fullText.length && (
                <div className="continue-prompt">
                    <div className="fade-in" onClick={onComplete}>Нажмите для продолжения...</div>
                </div>
            )}
        </div>
    );
};

// 🎵 АУДИО СИСТЕМА
const AudioSystem = {
    shortAudio: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmQeBzWK1fLMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmQeBzWK1fLMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmQeBzWK1fLMeSw=",
    
    subtitles: [
        { text: "Привет...", start: 0, end: 1500 },
        { text: "Ты попал в семейный архив Голышевых", start: 1500, end: 4000 },
        { text: "Это место хранит историю нашей семьи", start: 4000, end: 6500 },
        { text: "Для доступа нужно подтвердить родство", start: 6500, end: 9000 },
        { text: "Наслаждайся探索...", start: 9000, end: 11000 }
    ],
    
    audio: null,
    isPlaying: false,
    
    init() {
        this.audio = new Audio(this.shortAudio);
        this.audio.preload = "auto";
    },
    
    play(onProgress, onEnd) {
        if (!this.audio) this.init();
        
        this.audio.currentTime = 0;
        this.isPlaying = true;
        
        this.audio.play().then(() => {
            const progressInterval = setInterval(() => {
                if (!this.isPlaying) {
                    clearInterval(progressInterval);
                    return;
                }
                
                const currentTime = this.audio.currentTime * 1000;
                onProgress(currentTime);
                
            }, 100);
            
            this.audio.onended = () => {
                this.isPlaying = false;
                clearInterval(progressInterval);
                onEnd();
            };
            
        }).catch(error => {
            console.log('Аудио не может быть воспроизведено:', error);
            this.isPlaying = false;
            onEnd();
        });
    },
    
    stop() {
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
        }
        this.isPlaying = false;
    },
    
    getCurrentText(currentTime) {
        for (const subtitle of this.subtitles) {
            if (currentTime >= subtitle.start && currentTime <= subtitle.end) {
                return subtitle.text;
            }
        }
        return "";
    }
};

// 🎯 БАЗА ДАННЫХ СЕМЬИ
const FAMILY_DATABASE = {
    "Голышев Никита Викторович": {
        mother: "Голышева Любовь Анатольевна",
        father: "Голышев Виктор",
        birth: "18.02.2007"
    },
    "Голышева Любовь Анатольевна": {
        mother: "Голышева Елена Николаевna", 
        father: "Боронин Анатолий Никитович",
        birth: "13.09.1986"
    },
    "Голышева Елена Николаевna": {
        mother: "Голышева Александра Викторовна",
        father: "Голышев Никита Кириллович", 
        birth: "04.05.1956"
    },
    
    "Голышев Никита Кириллович": {
        wife: "Голышева Александра Викторовna"
    },
    "Голышева Александра Викторовna": {
        alsoKnownAs: ["Голышева Александра Викторова"],
        husband: "Голышев Никита Кириллович"
    },
    
    "Голышеva Наталья Сергеевna": {
        alsoKnownAs: ["Попова Наталья Сергеевna"],
        father: "Голышев Сергей Николаевич",
        mother: "Голышеva Елена Николаевna",
        children: ["Голышеva Валерия Сергеевna", "Голышев Вадим Сергеевич"]
    },
    "Попов Андрей": {
        mother: "Попова Наталья Сергеевna"
    },
    "Боронин Анатолий Никитович": {
        daughter: "Голышеva Любовь Анатольевna"
    },
    
    "Моторина Еремеева": {
        father: "Голышев Никита Кириллович"
    },
    "Голышев Виталий Владимирович": {
        mother: "Моторина Еремеева",
        wife: "Моторина Ирина Валерьевna"
    },
    "Моторина Ирина Валерьевna": {
        husband: "Голышев Виталий Владимирович"
    },
    "Голышев Евгений Витальевич": {
        mother: "Моторина Ирина Валерьевna",
        father: "Голышев Виталий Владимирович",
        birth: "11.09.1996",
        wife: "Голышеva Анна"
    },
    "Голышеva Анна": {
        husband: "Голышев Евгений Витальевич"
    },
    "Голышеva Варвара": {
        mother: "Голышеva Анna",
        father: "Голышев Евгений Витальевич"
    },
    
    "Елгин Владислав Владимирович": {},
    "Елгина Елена Геннадьевna": {
        birth: "04.03.1970",
        husband: "Елгин Владислав Владимирович"
    },
    "Елгина Светлана Владиславовna": {
        birth: "03.06.1996",
        mother: "Елгина Елена Геннадьевna",
        father: "Елгин Владислав Владимирович"
    },
    
    "Елгин Роман": {},
    "Елгин Захар": {
        father: "Елгин Роман",
        mother: "Катя"
    },
    "Елгина Мира": {
        father: "Елгин Роман", 
        mother: "Катя"
    },
    
    "Голышеva Валерия Сергеевna": {
        alsoKnownAs: ["Кадошникова Валерия Сергеевna"],
        mother: "Голышеva Наталья Серgeевna",
        father: "Голышев Сергей"
    },
    "Голышев Вадим Сергеевич": {
        alsoKnownAs: ["Кадошников Вадим Сергеевич"],
        mother: "Голышеva Наталья Серgeевna",
        father: "Голышев Сергей"
    },
    "Голышев Макар Данилович": {
        alsoKnownAs: ["Кадошников Макар Данилович"],
        mother: "Голышеva Валерия Серgeевna"
    }
};

// 🛡️ СИСТЕМА ВРЕМЕНИ
const TimeSystem = {
    startDate: new Date('2025-11-24'),
    
    getSystemInfo() {
        const now = new Date();
        const daysSinceStart = Math.floor((now.getTime() - this.startDate.getTime()) / (1000 * 60 * 60 * 24));
        
        return {
            currentTime: now,
            currentYear: now.getFullYear(),
            daysSinceStart: daysSinceStart,
            isFuture: now > this.startDate
        };
    },
    
    getTimeMessage() {
        const info = this.getSystemInfo();
        
        if (info.isFuture) {
            const daysPassed = Math.abs(info.daysSinceStart);
            return `🕰️ Система активна: ${daysPassed} дней с 24.11.2025`;
        } else {
            const daysLeft = Math.ceil((this.startDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            return `⏳ До активации системы: ${daysLeft} дней (24.11.2025)`;
        }
    }
};

// 🌍 СИСТЕМА МЕСТОПОЛОЖЕНИЯ
const LocationSystem = {
    userLocation: null,
    
    async detectLocation() {
        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                this.userLocation = this.getLocationByIP();
                resolve(this.userLocation);
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    this.userLocation = this.reverseGeocode(lat, lon);
                    resolve(this.userLocation);
                },
                () => {
                    this.userLocation = this.getLocationByIP();
                    resolve(this.userLocation);
                },
                { timeout: 5000 }
            );
        });
    },
    
    getLocationByIP() {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        if (timezone.includes('Europe/Moscow')) {
            return { city: 'Москва', region: 'Московская область', country: 'Россия' };
        } else if (timezone.includes('Asia/Novosibirsk')) {
            return { city: 'Новосибирск', region: 'Новосибирская область', country: 'Россия' };
        } else if (timezone.includes('Asia/Yekaterinburg')) {
            return { city: 'Екатеринбург', region: 'Свердловская область', country: 'Россия' };
        }
        
        return { city: 'неизвестно', region: 'неизвестно', country: 'неизвестно' };
    },
    
    reverseGeocode(lat, lon) {
        if (lat > 55.5 && lat < 56.0 && lon > 37.3 && lon < 37.8) {
            return { city: 'Москва', region: 'Московская область', country: 'Россия' };
        } else if (lat > 54.8 && lat < 55.2 && lon > 82.8 && lon < 83.2) {
            return { city: 'Новосибирск', region: 'Новосибирская область', country: 'Россия' };
        }
        
        return this.getLocationByIP();
    },
    
    getLocationMessage() {
        if (!this.userLocation) return "📍 Местоположение: определяется...";
        
        const { city, region } = this.userLocation;
        if (city === 'неизвестно') {
            return "📍 Местоположение: не определено";
        }
        
        return `📍 Вы находитесь: ${city}, ${region}`;
    }
};

// 🔎 СИСТЕМА ПРОВЕРКИ РОДСТВА
function verifyFamilyConnection(userData) {
    const { lastName, firstName, motherFirstName, fatherFirstName, birthDate } = userData;
    
    const fullName = `${lastName} ${firstName}`.trim();
    let relation = "неизвестно";
    let message = "❌ Связь с семьёй Голышевых не подтверждена";
    let success = false;

    if (!firstName || !lastName || !birthDate) {
        return {
            success: false,
            relation: "неполные данные",
            message: "❌ Пожалуйста, заполните все обязательные поля"
        };
    }

    if (FAMILY_DATABASE[fullName]) {
        success = true;
        relation = "прямой член семьи";
        message = `✅ Подтверждено: ${fullName}`;
    }

    if (!success) {
        for (const [key, data] of Object.entries(FAMILY_DATABASE)) {
            if (data.alsoKnownAs && data.alsoKnownAs.includes(fullName)) {
                success = true;
                relation = "прямой член семьи";
                message = `✅ Подтверждено: ${fullName}`;
                break;
            }
        }
    }

    if (!success && motherFirstName && fatherFirstName) {
        const familyLastNames = ["Голышев", "Голышева", "Кадошников", "Кадошникова"];
        if (familyLastNames.includes(lastName)) {
            success = true;
            relation = "потомок";
            message = `✅ Родственная связь подтверждена`;
        }
    }

    if (!success) {
        return {
            success: false,
            relation: "доступ запрещен", 
            message: "🚫 Доступ запрещен. Данные не подтверждают связь с семьёй Голышевых."
        };
    }

    return { success: true, relation, message };
}

// 🧠 БАЗА ЗНАНИЙ ПОМОЩНИКА
const AssistantKnowledge = {
    greetings: [
        "Привет! Как дела? 😊",
        "Здравствуйте! Рад вас видеть! 👋",
        "Приветствую! Как ваши дела?",
        "Добрый день! Как поживаете? 🌟"
    ],
    
    thinking: [
        "Дайте подумать... 🤔",
        "Хм, интересный вопрос... 💭",
        "Сейчас соображу... ⚡"
    ],
    
    emotions: [
        "Как здорово! 😄",
        "Вот это да! 🤩",
        "Очень интересно! 📚"
    ],
    
    getRandomPhrase(category) {
        const phrases = this[category];
        return phrases[Math.floor(Math.random() * phrases.length)];
    },
    
    addHumanTouch(text) {
        if (Math.random() > 0.7 && text.length < 150) {
            const emotion = this.getRandomPhrase('emotions');
            text += " " + emotion;
        }
        return text;
    }
};

// 🤖 КОМПОНЕНТ ПОМОЩНИКА
function SmartAssistant({ isLoggedIn, userLocation }) {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');

    const knowledgeBase = {
        "привет": "Привет! 👋 Я помощник семейного архива Голышевых. Чем могу помочь?",
        "здравствуй": "Здравствуйте! 🕰️ Я ваш проводник в мир семейной истории Голышевых.",
        
        "кто ты": "Я - умный помощник семейного архива Голышевых 🤖",
        "что ты": "Я цифровой помощник, созданный для обслуживания семейного архива 📚",
        "как тебя зовут": "Я Архивариус! 🤖 Ваш проводник в истории семьи Голышевых",
        
        "кто твой создатель": "Меня создал Голышев Никита Викторович 👦\n• Родился: 18.02.2007\n• Создатель этого архива",
        
        "как пройти дальше": isLoggedIn 
            ? "Вы уже в системе! 🎉 Можете изучать семейную информацию." 
            : "Чтобы пройти дальше:\n1. Заполните форму идентификации\n2. Подтвердите родство\n3. Введите пароль доступа",
            
        "какой сегодня день": `Сегодня: ${new Date().toLocaleDateString('ru-RU', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })} 📅`,
        
        "который час": `Текущее время: ${new Date().toLocaleTimeString('ru-RU')} ⏰`,
        
        "где я": userLocation ? `📍 Вы находитесь в: ${userLocation.city}, ${userLocation.region}` : "📍 Определяю ваше местоположение...",
        
        "никита": isLoggedIn 
            ? "👦 Голышев Никита Викторович\n• Родился: 18.02.2007\n• Место: Ленинск-Кузнецкий\n• Создатель архива" 
            : "🔒 Информация доступна после входа",
            
        "любовь": isLoggedIn 
            ? "👩 Голышева Любовь Анатольевна\n• Родилась: 13.09.1986\n• Дочь Елены Николаевны\n• Мать Никиты" 
            : "🔒 Информация доступна после входа",
            
        "дом": isLoggedIn 
            ? "🏠 Дом бабушки Елены:\n• Адрес: переулок Самарский 15\n• Деревянный дом с баней\n• Есть колодец и сад" 
            : "🔒 Информация доступна после входа",
        
        "помощь": "Я могу:\n• Рассказать о семье Голышевых\n• Подсказать как войти в систему\n• Сообщить текущее время\n• Определить ваше местоположение",
        
        "пароль": "🔐 Пароль для доступа к архиву\nПодсказка: 'ответ в прошлом...'\nЭто важная дата в истории семьи",
        
        "спасибо": "Пожалуйста! 😊 Всегда рад помочь!",
        "пока": "До свидания! 👋 Возвращайтесь для изучения семейной истории."
    };

    const getSmartResponse = (userMessage) => {
        const message = userMessage.toLowerCase().trim();
        
        if (knowledgeBase[message]) {
            return AssistantKnowledge.addHumanTouch(knowledgeBase[message]);
        }

        const keywordResponses = {
            "как": "Для навигации используйте кнопки на экране. Спросите 'как пройти дальше' 🧭",
            "что": "Я специализируюсь на семейной истории Голышевых. Спросите 'что ты умеешь' ❓",
            "где": userLocation 
                ? `Судя по данным, вы находитесь в ${userLocation.city} 🗺️` 
                : "Определяю ваше местоположение... 📍",
                
            "родители": "👨‍👩‍👦 Родители - основа семьи. В архиве хранится информация о родителях всех членов семьи.",
            "семья": isLoggedIn 
                ? "Семья Голышевых имеет богатую историю 🌳 Спросите о конкретных членах семьи" 
                : "🔒 Информация о семье доступна после подтверждения родства"
        };

        for (const [keyword, response] of Object.entries(keywordResponses)) {
            if (message.includes(keyword)) {
                return AssistantKnowledge.addHumanTouch(response);
            }
        }

        return AssistantKnowledge.addHumanTouch(isLoggedIn 
            ? "🤔 Интересный вопрос! Попробуйте спросить о членах семьи, доме или процессе идентификации." 
            : "🔒 Для доступа к информации необходимо войти в архив. Спросите 'как пройти дальше'.");
    };

    const handleSendMessage = () => {
        if (!inputMessage.trim()) return;
        
        addMessage("Вы", inputMessage);
        const userMessage = inputMessage;
        setInputMessage('');
        
        const thinkingMessage = addMessage("🕰️ Помощник", AssistantKnowledge.getRandomPhrase('thinking'), true);
        
        setTimeout(() => {
            setMessages(prev => prev.filter(msg => msg.id !== thinkingMessage.id));
            
            const response = getSmartResponse(userMessage);
            addMessage("🕰️ Помощник", response, true);
        }, 800 + Math.random() * 700);
    };

    const addMessage = (sender, text, isAssistant = false) => {
        const newMessage = { 
            id: Date.now() + Math.random(), 
            sender, 
            text, 
            isAssistant,
            timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, newMessage]);
        return newMessage;
    };

    useEffect(() => {
        if (isChatOpen && messages.length === 0) {
            setTimeout(() => {
                const greeting = userLocation 
                    ? `Привет из ${userLocation.city}! 🏠 Я ваш помощник в семейном архиве Голышевых ${isLoggedIn ? '👑' : '🔒'}` 
                    : `Привет! 👋 Я ваш помощник в семейном архиве Голышевых ${isLoggedIn ? '👑' : '🔒'}`;
                
                addMessage("🕰️ Помощник", `${greeting}\n\nСпросите меня о семье, времени или местоположении!`, true);
            }, 500);
        }
    }, [isChatOpen, userLocation]);

    return (
        <div id="assistant-container">
            <div id="assistant-button" onClick={() => setIsChatOpen(true)}>
                💬 {isLoggedIn ? 'Помощник+' : 'Помощник'}
            </div>
            
            {isChatOpen && (
                <div id="assistant-chat">
                    <div id="chat-header">
                        <span>🕰️ Помощник {isLoggedIn ? '👑' : '🔒'}</span>
                        <button id="close-chat" onClick={() => setIsChatOpen(false)}>×</button>
                    </div>
                    
                    <div id="chat-messages">
                        {messages.map(message => (
                            <div key={message.id} className={`message ${message.isAssistant ? 'assistant-message' : 'user-message'}`}>
                                <div className="message-header">
                                    <strong>{message.sender}</strong>
                                    <span className="message-time">{message.timestamp}</span>
                                </div>
                                <div className="message-content">
                                    {message.text.split('\n').map((line, i) => (
                                        <div key={i}>{line}</div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div id="chat-input-container">
                        <input 
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder={isLoggedIn ? "Задайте вопрос о семье..." : "Спросите о системе..."}
                        />
                        <button onClick={handleSendMessage}>➤</button>
                    </div>
                </div>
            )}
        </div>
    );
}

// 🎪 ОСНОВНОЙ КОМПОНЕНТ
function FamilyArchive() {
    const [showIntro, setShowIntro] = useState(true);
    const [currentScreen, setCurrentScreen] = useState('welcome');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [userRelation, setUserRelation] = useState('неизвестно');
    const [error, setError] = useState('');
    const [userData, setUserData] = useState(null);
    const [timeMessage, setTimeMessage] = useState('');
    const [audioText, setAudioText] = useState('');
    const [showAudioText, setShowAudioText] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const [locationMessage, setLocationMessage] = useState('');

    const CORRECT_PASSWORD = "18022007";

    // ВСЕГДА показываем интро при загрузке
    useEffect(() => {
        // Всегда показываем интро
        setShowIntro(true);
        
        LocationSystem.detectLocation().then(location => {
            setUserLocation(location);
            setLocationMessage(LocationSystem.getLocationMessage());
        });
    }, []);

    useEffect(() => {
        if (!showIntro) {
            setTimeMessage(TimeSystem.getTimeMessage());
            AudioSystem.init();
            
            const interval = setInterval(() => {
                setTimeMessage(TimeSystem.getTimeMessage());
            }, 60000);
            
            return () => clearInterval(interval);
        }
    }, [showIntro]);

    // 🎵 Запуск аудио при загрузке welcome экрана
    useEffect(() => {
        if (!showIntro && currentScreen === 'welcome') {
            const playAudio = () => {
                AudioSystem.play(
                    (currentTime) => {
                        const text = AudioSystem.getCurrentText(currentTime);
                        setAudioText(text);
                        setShowAudioText(true);
                    },
                    () => {
                        setTimeout(() => {
                            setShowAudioText(false);
                            setAudioText('');
                        }, 1000);
                    }
                );
            };
            playAudio();
        }
    }, [currentScreen, showIntro]);

    const handleIntroComplete = () => {
        // Убрана запись в localStorage - интро будет показываться всегда
        setShowIntro(false);
    };

    const proceedToAuth = () => {
        AudioSystem.stop();
        setCurrentScreen('authentication');
    };

    const handleAuthentication = (authData) => {
        setUserData(authData);
        const authResult = verifyFamilyConnection(authData);
        
        if (authResult.success) {
            setUserName(authData.firstName);
            setUserRelation(authResult.relation);
            setCurrentScreen('login');
        } else {
            setError(authResult.message);
        }
    };

    const checkPassword = () => {
        if (password === CORRECT_PASSWORD) {
            setIsLoggedIn(true);
            setCurrentScreen('familyInfo');
            setError('');
        } else {
            setError('❌ Неверный пароль');
            setPassword('');
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setCurrentScreen('welcome');
        setUserName('');
        setUserRelation('неизвестно');
        setPassword('');
        setUserData(null);
    };

    const replayAudio = () => {
        AudioSystem.stop();
        setTimeout(() => {
            AudioSystem.play(
                (currentTime) => {
                    const text = AudioSystem.getCurrentText(currentTime);
                    setAudioText(text);
                    setShowAudioText(true);
                },
                () => {
                    setTimeout(() => {
                        setShowAudioText(false);
                        setAudioText('');
                    }, 1000);
                }
            );
        }, 100);
    };

    return (
        <div className="react-app">
            {showIntro ? (
                <IntroText onComplete={handleIntroComplete} />
            ) : (
                <>
                    {/* 🎵 Баннер с текстом аудио */}
                    {showAudioText && (
                        <div className="audio-banner">
                            <div className="audio-text">{audioText}</div>
                            <div className="audio-pulse"></div>
                        </div>
                    )}

                    {!isLoggedIn ? (
                        <>
                            {currentScreen === 'welcome' && (
                                <WelcomeScreen 
                                    onProceed={proceedToAuth} 
                                    timeMessage={timeMessage}
                                    locationMessage={locationMessage}
                                    onReplayAudio={replayAudio} 
                                />
                            )}
                            {currentScreen === 'authentication' && (
                                <AuthenticationScreen 
                                    onAuthenticate={handleAuthentication}
                                    error={error}
                                />
                            )}
                            {currentScreen === 'login' && (
                                <LoginScreen 
                                    password={password}
                                    setPassword={setPassword}
                                    error={error}
                                    onLogin={checkPassword}
                                    userData={userData}
                                    timeMessage={timeMessage}
                                />
                            )}
                        </>
                    ) : (
                        <div className="container">
                            <FamilyInfoScreen 
                                userName={userName}
                                userRelation={userRelation}
                                userData={userData}
                                onLogout={handleLogout}
                                timeMessage={timeMessage}
                            />
                        </div>
                    )}
                    <SmartAssistant isLoggedIn={isLoggedIn} userLocation={userLocation} />
                </>
            )}
        </div>
    );
}

// 🎭 ЭКРАН ПРИВЕТСТВИЯ
function WelcomeScreen({ onProceed, timeMessage, locationMessage, onReplayAudio }) {
    return (
        <div className="welcome-container">
            <div className="welcome-overlay">
                <div className="welcome-content">
                    <div className="header-section">
                        <h1>🕰️ СЕМЕЙНЫЙ АРХИВ</h1>
                        <h2>ГОЛЫШЕВЫХ</h2>
                        <div className="time-message">{timeMessage}</div>
                        <div className="location-message">{locationMessage}</div>
                    </div>
                    
                    <div className="welcome-message">
                        <div className="message-section">
                            <h3>🔐 ЗАЩИЩЕННОЕ ХРАНИЛИЩЕ</h3>
                            <p>Цифровая летопись семьи через поколения</p>
                        </div>

                        <div className="message-section">
                            <h3>🌳 ДРЕВО ПАМЯТИ</h3>
                            <p>Истории, традиции и наследие рода Голышевых</p>
                        </div>

                        <div className="message-section">
                            <h3>🔍 ТОЛЬКО ДЛЯ СВОИХ</h3>
                            <p>Доступ предоставляется после подтверждения родства</p>
                        </div>
                    </div>

                    <div className="welcome-actions">
                        <button onClick={onProceed} className="submit-btn main-action">
                            🚀 НАЧАТЬ ИДЕНТИФИКАЦИЮ
                        </button>
                        <button onClick={onReplayAudio} className="replay-btn">
                            🔄 Повторить приветствие
                        </button>
                    </div>

                    <div className="welcome-footer">
                        <p>«Память о предках — это дар, который мы передаём потомкам»</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// 📝 КОМПОНЕНТ АУТЕНТИФИКАЦИИ
function AuthenticationScreen({ onAuthenticate, error }) {
    const [formData, setFormData] = useState({
        lastName: '',
        firstName: '',
        middleName: '',
        birthDate: '',
        motherLastName: '',
        motherFirstName: '',
        motherMiddleName: '',
        fatherLastName: '',
        fatherFirstName: '', 
        fatherMiddleName: '',
        additionalInfo: ''
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = () => {
        if (!formData.firstName || !formData.lastName || !formData.birthDate) {
            alert('❌ Пожалуйста, заполните все обязательные поля');
            return;
        }

        onAuthenticate(formData);
    };

    return (
        <div className="container">
            <div className="welcome-message">
                <div className="header-section">
                    <h2>🔍 Идентификация</h2>
                    <p className="quote">«Кровные узы не разорвать, память предков не стереть»</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="authentication-form">
                    <div className="form-section">
                        <h3>👤 Ваши данные</h3>
                        <input 
                            type="text" 
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            placeholder="Фамилия *"
                        />
                        <input 
                            type="text" 
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            placeholder="Имя *"
                        />
                        <input 
                            type="text" 
                            value={formData.middleName}
                            onChange={(e) => handleInputChange('middleName', e.target.value)}
                            placeholder="Отчество"
                        />
                        <input 
                            type="text" 
                            value={formData.birthDate}
                            onChange={(e) => handleInputChange('birthDate', e.target.value)}
                            placeholder="Дата рождения * (дд.мм.гггг)"
                        />
                    </div>
                    
                    <div className="form-section">
                        <h3>👩 Данные матери</h3>
                        <input 
                            type="text" 
                            value={formData.motherLastName}
                            onChange={(e) => handleInputChange('motherLastName', e.target.value)}
                            placeholder="Фамилия матери"
                        />
                        <input 
                            type="text" 
                            value={formData.motherFirstName}
                            onChange={(e) => handleInputChange('motherFirstName', e.target.value)}
                            placeholder="Имя матери"
                        />
                        <input 
                            type="text" 
                            value={formData.motherMiddleName}
                            onChange={(e) => handleInputChange('motherMiddleName', e.target.value)}
                            placeholder="Отчество матери"
                        />
                    </div>

                    <div className="form-section">
                        <h3>👨 Данные отца</h3>
                        <input 
                            type="text" 
                            value={formData.fatherLastName}
                            onChange={(e) => handleInputChange('fatherLastName', e.target.value)}
                            placeholder="Фамилия отца"
                        />
                        <input 
                            type="text" 
                            value={formData.fatherFirstName}
                            onChange={(e) => handleInputChange('fatherFirstName', e.target.value)}
                            placeholder="Имя отца"
                        />
                        <input 
                            type="text" 
                            value={formData.fatherMiddleName}
                            onChange={(e) => handleInputChange('fatherMiddleName', e.target.value)}
                            placeholder="Отчество отца"
                        />
                    </div>

                    <div className="form-section">
                        <h3>ℹ️ Дополнительно</h3>
                        <textarea 
                            value={formData.additionalInfo}
                            onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                            placeholder="Дополнительная информация о связи с семьёй Голышевых"
                            className="form-textarea"
                        />
                    </div>
                    
                    <button onClick={handleSubmit} className="submit-btn">
                        🔍 Проверить родственную связь
                    </button>
                </div>
            </div>
        </div>
    );
}

// 🔐 КОМПОНЕНТ ВХОДА
function LoginScreen({ password, setPassword, error, onLogin, userData, timeMessage }) {
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') onLogin();
    };

    return (
        <div className="container">
            <div id="login">
                <div className="header-section">
                    <h1>🔒 Семейный архив Голышевых</h1>
                    <p className="quote">"Доступ предоставлен после проверки родства"</p>
                    <div className="time-message">{timeMessage}</div>
                    
                    {userData && (
                        <div className="success-box">
                            <strong>✅ Идентификация пройдена</strong><br/>
                            <span>{userData.firstName} {userData.middleName || ''}</span>
                        </div>
                    )}
                </div>
                
                <div className="password-info">
                    <p><strong>Пароль для доступа</strong></p>
                    <div className="password-hint">
                        🔍 Подсказка: <em>ответ в прошлом...</em>
                    </div>
                </div>
                
                <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Введите пароль доступа"
                />
                
                <button onClick={onLogin}>Войти в архив</button>
                
                {error && <div id="error" className="error">{error}</div>}
            </div>
        </div>
    );
}

// 🏠 КОМПОНЕНТ ИНФОРМАЦИИ О СЕМЬЕ
function FamilyInfoScreen({ userName, userRelation, userData, onLogout, timeMessage }) {
    return (
        <div className="welcome-message">
            <div className="header-section">
                <h2>🕰️ Добро пожаловать в семейный архив!</h2>
                <p className="quote">«Прошлое — это фундамент, настоящее — строительство, будущее — наследие»</p>
                <div className="time-message">{timeMessage}</div>
                <div className="user-badge">Статус: {userRelation}</div>
                {userData && (
                    <div className="user-info">
                        👤 {userData.firstName} {userData.middleName || ''} {userData.lastName || ''}
                    </div>
                )}
                <button onClick={onLogout} className="logout-btn">Выйти из архива</button>
            </div>
            
            <div className="message-section">
                <h3>👋 Кто я?</h3>
                <p><strong>Голышев Никита Викторович</strong><br/>
                Родился 18.02.2007 года в Ленинске-Кузнецком</p>
            </div>
            
            <div className="message-section">
                <h3>👨‍👩‍👦 Ближайшая семья</h3>
                <p><strong>Мать:</strong> Голышева Любовь Анатольевна (13.09.1986 г.р.)</p>
                <p><strong>Бабушка:</strong> Голышева Елена Николаевна (04.05.1956 г.р.)</p>
            </div>

            <div className="message-section">
                <h3>👨‍👩‍👧‍👦 Двоюродные родственники</h3>
                <p><strong>Двоюродная сестра:</strong> Голышева/Кадошникова Валерия Сергеевна</p>
                <p><strong>Двоюродный брат:</strong> Голышев/Кадошников Вадим Сергеевич</p>
                <p><strong>Сын Валерии:</strong> Голышев/Кадошников Макар Данилович</p>
            </div>

            <div className="message-section">
                <h3>🏠 Дом бабушки</h3>
                <p>Переулок Самарский 15 - деревянный дом с баней, колодцем и садом.</p>
            </div>
        </div>
    );
}

ReactDOM.render(<FamilyArchive />, document.getElementById('root'));