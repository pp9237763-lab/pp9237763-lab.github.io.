// world.js - База знаний русского языка для помощника
const RussianKnowledge = {
    alphabet: {
        vowels: ['а', 'е', 'ё', 'и', 'о', 'у', 'ы', 'э', 'ю', 'я'],
        consonants: ['б', 'в', 'г', 'д', 'ж', 'з', 'й', 'к', 'л', 'м', 'н', 'п', 'р', 'с', 'т', 'ф', 'х', 'ц', 'ч', 'ш', 'щ'],
        letters: ['а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ъ', 'ы', 'ь', 'э', 'ю', 'я']
    },

    dictionary: [
        'семья', 'мать', 'отец', 'брат', 'сестра', 'бабушка', 'дедушка', 'родители', 'дети',
        'муж', 'жена', 'сын', 'дочь', 'внук', 'внучка', 'дядя', 'тётя', 'племянник', 'племянница',
        'родственник', 'предок', 'потомок', 'генерация', 'поколение', 'наследник', 'династия',
        'дом', 'квартира', 'комната', 'кухня', 'спальня', 'гостиная', 'баня', 'сауна', 'двор',
        'сад', 'огород', 'колодец', 'крыльцо', 'подвал', 'чердак', 'мебель', 'посуда', 'техника',
        'время', 'год', 'месяц', 'неделя', 'день', 'час', 'минута', 'секунда', 'сезон', 'весна',
        'лето', 'осень', 'зима', 'праздник', 'деньрождения', 'годовщина', 'память', 'история',
        'прошлое', 'настоящее', 'будущее', 'воспоминание', 'традиция', 'обычай', 'наследие',
        'город', 'деревня', 'село', 'улица', 'переулок', 'проспект', 'площадь', 'район', 'область',
        'страна', 'родина', 'место', 'адрес', 'карта', 'путь', 'дорога', 'путешествие', 'рождение',
        'любовь', 'радость', 'счастье', 'грусть', 'тоска', 'ностальгия', 'гордость', 'уважение',
        'забота', 'поддержка', 'помощь', 'внимание', 'чувство', 'эмоция', 'настроение', 'спокойствие',
        'тревога', 'надежда', 'вера', 'мечта', 'цель', 'желание', 'жить', 'родиться', 'расти',
        'учиться', 'работать', 'любить', 'помнить', 'хранить', 'создавать', 'строить', 'развивать',
        'продолжать', 'сохранять', 'передавать', 'рассказывать', 'слушать', 'смотреть', 'чувствовать',
        'думать', 'понимать', 'знать', 'верить', 'мечтать', 'семейный', 'родной', 'близкий', 'дорогой',
        'любимый', 'старый', 'новый', 'молодой', 'взрослый', 'детский', 'теплый', 'уютный', 'добрый',
        'сильный', 'мудрый', 'важный', 'главный', 'основной', 'исторический', 'традиционный', 'памятный',
        'значительный', 'архив', 'документ', 'фотография', 'запись', 'информация', 'знание', 'факт',
        'дата', 'событие', 'биография', 'автобиография', 'летопись', 'хроника', 'каталог', 'база',
        'коллекция', 'хранилище', 'памятник', 'наследие', 'ценность', 'богатство', 'пароль', 'доступ',
        'безопасность', 'конфиденциальность', 'секрет', 'тайна', 'защита', 'приватность'
    ],

    grammar: {
        pluralRules: {
            'а': 'ы', 'я': 'и', 'ь': 'и', 'й': 'и', 'о': 'а', 'е': 'я'
        }
    },

    synonyms: {
        'семья': ['род', 'фамилия', 'династия', 'семейство'],
        'дом': ['жилье', 'жилище', 'кров', 'очаг', 'гнездо'],
        'память': ['воспоминание', 'мемориал', 'напоминание'],
        'история': ['летопись', 'хроника', 'прошлое'],
        'любовь': ['привязанность', 'нежность', 'чувство'],
        'радость': ['счастье', 'восторг', 'удовольствие'],
        'помощь': ['поддержка', 'содействие', ' assistance'],
        'пароль': ['код', 'ключ', 'шифр', 'доступ'],
        'время': ['момент', 'период', 'эпоха', 'времена']
    }
};

const LanguageProcessor = {
    similarity(word1, word2) {
        if (!word1 || !word2) return 0;
        word1 = word1.toLowerCase();
        word2 = word2.toLowerCase();
        if (word1 === word2) return 1;
        
        const track = Array(word2.length + 1).fill(null).map(() =>
            Array(word1.length + 1).fill(null));
        
        for (let i = 0; i <= word1.length; i += 1) track[0][i] = i;
        for (let j = 0; j <= word2.length; j += 1) track[j][0] = j;
        
        for (let j = 1; j <= word2.length; j += 1) {
            for (let i = 1; i <= word1.length; i += 1) {
                const indicator = word1[i - 1] === word2[j - 1] ? 0 : 1;
                track[j][i] = Math.min(
                    track[j][i - 1] + 1,
                    track[j - 1][i] + 1,
                    track[j - 1][i - 1] + indicator
                );
            }
        }
        
        const maxLength = Math.max(word1.length, word2.length);
        return maxLength === 0 ? 1 : (maxLength - track[word2.length][word1.length]) / maxLength;
    },

    findSimilarWords(query, threshold = 0.6) {
        const similar = [];
        for (const word of RussianKnowledge.dictionary) {
            const similarity = this.similarity(query, word);
            if (similarity >= threshold) {
                similar.push({ word, similarity });
            }
        }
        return similar.sort((a, b) => b.similarity - a.similarity);
    },

    findSynonyms(query) {
        for (const [key, synonyms] of Object.entries(RussianKnowledge.synonyms)) {
            if (key === query || synonyms.includes(query)) {
                return key;
            }
        }
        return null;
    },

    extractKeywords(text) {
        const words = text.toLowerCase()
            .replace(/[^\w\sа-яё]/gi, ' ')
            .split(/\s+/)
            .filter(word => word.length > 2);
        
        return words.filter(word => 
            RussianKnowledge.dictionary.includes(word) ||
            Object.keys(RussianKnowledge.synonyms).includes(word)
        );
    },

    generateHybridResponse(query, context = {}) {
        const keywords = this.extractKeywords(query);
        const similarWords = this.findSimilarWords(query, 0.5);
        
        if (keywords.length > 0) {
            const mainKeyword = keywords[0];
            const synonym = this.findSynonyms(mainKeyword);
            const finalKeyword = synonym || mainKeyword;
            
            return {
                type: 'exact',
                keyword: finalKeyword,
                confidence: 0.9,
                suggestions: similarWords.slice(0, 3).map(item => item.word)
            };
        }
        
        if (similarWords.length > 0) {
            const bestMatch = similarWords[0];
            return {
                type: 'similar',
                keyword: bestMatch.word,
                confidence: bestMatch.similarity,
                suggestions: similarWords.slice(0, 5).map(item => item.word)
            };
        }
        
        return {
            type: 'unknown',
            keyword: null,
            confidence: 0,
            suggestions: RussianKnowledge.dictionary.slice(0, 8)
        };
    }
};