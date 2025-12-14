// Text.js - Анимированный вводный текст с эффектами
const { useState, useEffect, useRef } = React;

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
            }, 40 + Math.random() * 30); // Случайная скорость печати
            
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
                    <div className="fade-in">Нажмите для продолжения...</div>
                </div>
            )}
        </div>
    );
};

// CSS стили для анимаций (добавьте в ваш CSS файл)
const introStyles = `
.intro-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    overflow: hidden;
    font-family: 'Courier New', monospace;
}

.animated-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
}

.floating-particle {
    position: absolute;
    width: 3px;
    height: 3px;
    background: rgba(139, 69, 19, 0.6);
    border-radius: 50%;
    animation: float 8s infinite ease-in-out;
}

.floating-particle:nth-child(odd) {
    background: rgba(101, 67, 33, 0.4);
    animation-duration: 10s;
}

@keyframes float {
    0%, 100% {
        transform: translateY(0px) rotate(0deg);
        opacity: 0.3;
    }
    50% {
        transform: translateY(-20px) rotate(180deg);
        opacity: 0.8;
    }
}

.pulse-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100px;
    height: 100px;
    border: 1px solid rgba(139, 69, 19, 0.1);
    border-radius: 50%;
    animation: pulse 4s infinite linear;
    transform: translate(-50%, -50%);
}

@keyframes pulse {
    0% {
        transform: translate(-50%, -50%) scale(0.1);
        opacity: 1;
    }
    100% {
        transform: translate(-50%, -50%) scale(4);
        opacity: 0;
    }
}

.intro-text {
    color: #d4af37;
    font-size: 1.4rem;
    line-height: 1.8;
    text-align: center;
    max-width: 800px;
    padding: 2rem;
    position: relative;
    z-index: 2;
    text-shadow: 0 0 10px rgba(139, 69, 19, 0.3);
    transition: text-shadow 0.3s ease;
}

.text-line {
    margin: 0.5rem 0;
    opacity: 0;
    animation: fadeInLine 0.5s ease forwards;
}

.text-line.current-line {
    opacity: 1;
}

@keyframes fadeInLine {
    to {
        opacity: 1;
    }
}

.flicker-word {
    animation: flicker 0.3s ease 2;
    color: #ffd700;
    text-shadow: 0 0 8px rgba(255, 215, 0, 0.8);
}

@keyframes flicker {
    0%, 100% {
        opacity: 1;
        transform: scale(1);
    }
    50% {
        opacity: 0.7;
        transform: scale(1.05);
    }
}

.cursor {
    animation: blink 1s infinite;
    color: #8B4513;
    margin-left: 2px;
}

@keyframes blink {
    0%, 50% {
        opacity: 1;
    }
    51%, 100% {
        opacity: 0;
    }
}

.continue-prompt {
    position: absolute;
    bottom: 2rem;
    text-align: center;
    color: rgba(212, 175, 55, 0.7);
    font-style: italic;
}

.fade-in {
    animation: fadeInOut 2s infinite ease-in-out;
}

@keyframes fadeInOut {
    0%, 100% {
        opacity: 0.3;
    }
    50% {
        opacity: 1;
    }
}

/* Адаптивность */
@media (max-width: 768px) {
    .intro-text {
        font-size: 1.1rem;
        padding: 1rem;
    }
    
    .intro-container {
        padding: 1rem;
    }
}
`;

// Добавляем стили в документ
const styleSheet = document.createElement("style");
styleSheet.textContent = introStyles;
document.head.appendChild(styleSheet);