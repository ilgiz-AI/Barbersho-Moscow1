/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scissors, 
  Clock, 
  MapPin, 
  Phone, 
  Instagram, 
  Facebook, 
  Menu, 
  X, 
  ChevronRight, 
  Star,
  Award,
  Users,
  MessageSquare,
  Send,
  Minimize2,
  Loader2,
  Upload,
  Camera,
  RefreshCw,
  Download,
  Image as ImageIcon,
  Video,
  Play,
  Film
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const TRANSLATIONS = {
  ru: {
    nav: { services: 'Услуги', tryon: 'Примерка', masters: 'Мастера', gallery: 'Галерея', contact: 'Контакты', book: 'Записаться' },
    hero: { subtitle: 'Искусство мужского груминга', title: 'Премиум Барбершоп', city: 'в центре Москвы', desc: 'Мы объединяем вековые традиции классического бритья с современными техниками мужских стрижек.', cta1: 'Забронировать визит', cta2: 'Наши услуги' },
    stats: { clients: 'Довольных клиентов', awards: 'Наград индустрии', rating: 'Средний рейтинг', time: 'Минут на стрижку' },
    services: { subtitle: 'Наше меню', title: 'Услуги и Цены', desc: 'Каждая услуга включает в себя консультацию, премиальный уход и напиток на ваш выбор.', quote: '"Стрижка — это не просто процедура, это ритуал."', s1: 'Классическая стрижка', s1d: 'Индивидуальный подбор формы, мытье головы и укладка.', s2: 'Моделирование бороды', s2d: 'Создание четких контуров и уход за бородой с использованием масел.', s3: 'Королевское бритье', s3d: 'Традиционное бритье опасной бритвой с горячими компрессами.', s4: 'Комплекс (Стрижка + Борода)', s4d: 'Полное преображение вашего образа.', min: 'мин' },
    masters: { subtitle: 'Команда экспертов', title: 'Наши Мастера', experience: 'Опыт', years: 'лет', r1: 'Топ-барбер', r2: 'Арт-директор', r3: 'Барбер', m1: 'Александр', m2: 'Дмитрий', m3: 'Артем' },
    tryon: { subtitle: 'AI Примерочная', title: 'Примерьте новый образ', desc: 'Загрузите свое фото и выберите стиль, чтобы увидеть, как вы будете выглядеть с новой стрижкой.', upload: 'Загрузить фото', change: 'Сменить фото', styles: 'Выберите стиль', generate: 'Создать образ', processing: 'Стилист работает...', result: 'Ваш новый образ', download: 'Скачать', error: 'Не удалось создать образ. Попробовать снова?', placeholder: 'Нажмите, чтобы выбрать файл или перетащите фото сюда', modeImage: 'Фото', modeVideo: 'Видео', videoDesc: 'Создайте короткое видео с новым образом', videoWait: 'Генерация видео может занять до 2 минут...', selectKey: 'Выберите API ключ для видео' },
    contact: { subtitle: 'Свяжитесь с нами', title: 'Ждем вас в гости', address: 'Адрес', phone: 'Телефон', hours: 'Часы работы', daily: 'Ежедневно', booking: 'Онлайн Запись', name: 'Ваше Имя', namePlaceholder: 'Иван Иванов', service: 'Услуга', submit: 'Подтвердить запись', city: 'г. Москва, ул. Арбат, 15/2', bc: 'Бизнес-центр "Премиум"' },
    chat: { welcome: 'Привет! Я ваш персональный ассистент Arbat Grooming. Чем я могу вам помочь сегодня?', placeholder: 'Задайте вопрос...', assistant: 'Arbat Assistant', error: 'Извините, я не смог обработать ваш запрос. Пожалуйста, попробуйте еще раз.', serverError: 'Произошла ошибка при связи с сервером. Пожалуйста, позвоните нам напрямую.' },
    footer: { rights: 'Все права защищены.', privacy: 'Политика конфиденциальности', offer: 'Оферта' }
  },
  en: {
    nav: { services: 'Services', tryon: 'Try-On', masters: 'Masters', gallery: 'Gallery', contact: 'Contact', book: 'Book Now' },
    hero: { subtitle: 'The Art of Male Grooming', title: 'Premium Barbershop', city: 'in the heart of Moscow', desc: 'We combine centuries-old traditions of classic shaving with modern male haircutting techniques.', cta1: 'Book a Visit', cta2: 'Our Services' },
    stats: { clients: 'Happy Clients', awards: 'Industry Awards', rating: 'Average Rating', time: 'Minutes per Cut' },
    services: { subtitle: 'Our Menu', title: 'Services & Prices', desc: 'Each service includes a consultation, premium care, and a drink of your choice.', quote: '"A haircut is not just a procedure, it is a ritual."', s1: 'Classic Haircut', s1d: 'Individual shape selection, hair washing, and styling.', s2: 'Beard Modeling', s2d: 'Creating sharp contours and beard care using oils.', s3: 'Royal Shave', s3d: 'Traditional straight razor shave with hot compresses.', s4: 'Full Package (Haircut + Beard)', s4d: 'A complete transformation of your look.', min: 'min' },
    masters: { subtitle: 'Expert Team', title: 'Our Masters', experience: 'Experience', years: 'years', r1: 'Top Barber', r2: 'Art Director', r3: 'Barber', m1: 'Alexander', m2: 'Dmitry', m3: 'Artem' },
    tryon: { subtitle: 'AI Try-On', title: 'Try a New Look', desc: 'Upload your photo and choose a style to see how you would look with a new haircut.', upload: 'Upload Photo', change: 'Change Photo', styles: 'Choose Style', generate: 'Generate Look', processing: 'Stylist is working...', result: 'Your New Look', download: 'Download', error: 'Failed to generate look. Try again?', placeholder: 'Click to select or drag & drop photo here', modeImage: 'Photo', modeVideo: 'Video', videoDesc: 'Create a short video with your new look', videoWait: 'Video generation may take up to 2 minutes...', selectKey: 'Select API Key for Video' },
    contact: { subtitle: 'Contact Us', title: 'Visit Us', address: 'Address', phone: 'Phone', hours: 'Opening Hours', daily: 'Daily', booking: 'Online Booking', name: 'Your Name', namePlaceholder: 'John Doe', service: 'Service', submit: 'Confirm Booking', city: 'Moscow, Arbat st., 15/2', bc: 'Business Center "Premium"' },
    chat: { welcome: 'Hello! I am your personal Arbat Grooming assistant. How can I help you today?', placeholder: 'Ask a question...', assistant: 'Arbat Assistant', error: 'Sorry, I could not process your request. Please try again.', serverError: 'An error occurred while connecting to the server. Please call us directly.' },
    footer: { rights: 'All rights reserved.', privacy: 'Privacy Policy', offer: 'Terms of Service' }
  },
  ky: {
    nav: { services: 'Кызматтар', tryon: 'Примерка', masters: 'Мастерлер', gallery: 'Галерея', contact: 'Байланыш', book: 'Жазылуу' },
    hero: { subtitle: 'Эркектердин кам көрүү искусствосу', title: 'Премиум Барбершоп', city: 'Москванын борборунда', desc: 'Биз классикалык сакал алуунун кылымдык салтын заманбап эркектердин чач жасалгалоо ыкмалары менен айкалыштырабыз.', cta1: 'Визитке жазылуу', cta2: 'Биздин кызматтар' },
    stats: { clients: 'Ыраазы болгон кардарлар', awards: 'Индустрия сыйлыктары', rating: 'Орточо рейтинг', time: 'Чач алуу мүнөтү' },
    services: { subtitle: 'Биздин меню', title: 'Кызматтар жана Баалар', desc: 'Ар бир кызмат консультацияны, премиум кам көрүүнү жана сиз тандаган суусундукту камтыйт.', quote: '"Чач алуу — бул жөн гана процедура эмес, бул ритуал."', s1: 'Классикалык чач алуу', s1d: 'Жеке форма тандоо, чач жуу жана жасалгалоо.', s2: 'Сакалды моделдөө', s2d: 'Так контурларды түзүү жана майларды колдонуу менен сакалга кам көрүү.', s3: 'Падышалык сакал алуу', s3d: 'Ысык компресстер менен салттуу коркунучтуу устара менен сакал алуу.', s4: 'Комплекс (Чач + Сакал)', s4d: 'Сиздин образыңыздын толук өзгөрүшү.', min: 'мүн' },
    masters: { subtitle: 'Эксперттер командасы', title: 'Биздин Мастерлер', experience: 'Тажрыйба', years: 'жыл', r1: 'Топ-барбер', r2: 'Арт-директор', r3: 'Барбер', m1: 'Александр', m2: 'Дмитрий', m3: 'Артем' },
    tryon: { subtitle: 'AI Примерочная', title: 'Жаңы образды байкап көрүңүз', desc: 'Сүрөтүңүздү жүктөп, жаңы чач жасалгасы менен кандай көрүнөрүңүздү көрүү үчүн стилди тандаңыз.', upload: 'Сүрөт жүктөө', change: 'Сүрөттү алмаштыруу', styles: 'Стилди тандаңыз', generate: 'Образ түзүү', processing: 'Стилист иштеп жатат...', result: 'Сиздин жаңы образыңыз', download: 'Жүктөө', error: 'Образ түзүү ишке ашкан жок. Кайра аракет кыласызбы?', placeholder: 'Тандоо үчүн басыңыз же сүрөттү бул жерге сүйрөңүз', modeImage: 'Сүрөт', modeVideo: 'Видео', videoDesc: 'Жаңы образ менен кыска видео түзүңүз', videoWait: 'Видео түзүү 2 мүнөткө чейин созулушу мүмкүн...', selectKey: 'Видео үчүн API ачкычын тандаңыз' },
    contact: { subtitle: 'Биз менен байланышыңыз', title: 'Бизге конокко келиңиз', address: 'Дарек', phone: 'Телефон', hours: 'Иштөө убактысы', daily: 'Күн сайын', booking: 'Онлайн жазылуу', name: 'Сиздин атыңыз', namePlaceholder: 'Асан Үсөн', service: 'Кызмат', submit: 'Жазылууну ырастоо', city: 'Москва ш., Арбат көч., 15/2', bc: '"Премиум" бизнес-борбору' },
    chat: { welcome: 'Салам! Мен сиздин Arbat Grooming жеке ассистентиңизмин. Бүгүн сизге кантип жардам бере алам?', placeholder: 'Суроо бериңиз...', assistant: 'Arbat Assistant', error: 'Кечиресиз, мен сиздин сурооңузду иштеп чыга алган жокмун. Сураныч, кайра аракет кылып көрүңүз.', serverError: 'Сервер менен байланышууда ката кетти. Сураныч, бизге түз чалыңыз.' },
    footer: { rights: 'Бардык укуктар корголгон.', privacy: 'Купуялык саясаты', offer: 'Оферта' }
  }
};

type Language = 'ru' | 'en' | 'ky';

const ChatBot = ({ lang }: { lang: Language }) => {
  const t = TRANSLATIONS[lang].chat;
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: t.welcome }
  ]);

  useEffect(() => {
    setMessages([{ role: 'bot', text: t.welcome }]);
  }, [lang]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: `You are a premium assistant for 'Arbat Grooming Co.' barbershop in Moscow. Current language: ${lang}. 
          Help clients with services, prices, masters, and booking. Be polite and professional.
          Services: Classic Haircut (3500r), Beard (2500r), Shave (4000r), Full Package (5000r). 
          Masters: Alexander, Dmitry, Artem. Address: Arbat st., 15/2. Hours: 10:00-22:00.
          Respond in the language the user is using or in ${lang}.`,
        },
      });

      const response = await chat.sendMessage({ message: userMessage });
      const botResponse = response.text || t.error;
      
      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'bot', text: t.serverError }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="bg-dark border border-gold/30 w-[350px] md:w-[400px] h-[500px] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-gold/20 bg-gold/5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-dark">
                  <Scissors size={16} />
                </div>
                <div>
                  <h4 className="serif text-sm font-bold tracking-wider uppercase">{t.assistant}</h4>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest">Online</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gold transition-colors">
                <Minimize2 size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gold/20">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 text-sm ${
                    msg.role === 'user' 
                      ? 'bg-gold text-dark font-medium rounded-l-xl rounded-tr-xl' 
                      : 'bg-white/5 text-gray-300 border border-white/10 rounded-r-xl rounded-tl-xl'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-3 rounded-r-xl rounded-tl-xl border border-white/10">
                    <Loader2 className="w-4 h-4 animate-spin text-gold" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gold/20 bg-gold/5">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={t.placeholder}
                  className="w-full bg-dark border border-white/10 py-3 pl-4 pr-12 text-sm outline-none focus:border-gold transition-colors"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-gold hover:text-white transition-colors disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 bg-gold text-dark rounded-full shadow-2xl flex items-center justify-center hover:bg-white transition-all duration-300 group"
          >
            <MessageSquare className="w-8 h-8 group-hover:scale-110 transition-transform" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-dark"></div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

const TryOn = ({ lang }: { lang: Language }) => {
  const t = TRANSLATIONS[lang].tryon;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [resultVideo, setResultVideo] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<string>('fade');
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'image' | 'video'>('image');
  const [showBefore, setShowBefore] = useState(false);

  const styles = [
    { id: 'fade', name: lang === 'ru' ? 'Классический Фейд' : lang === 'en' ? 'Classic Fade' : 'Классикалык Фейд', prompt: 'classic fade haircut' },
    { id: 'undercut', name: lang === 'ru' ? 'Андеркат' : lang === 'en' ? 'Undercut' : 'Андеркат', prompt: 'modern undercut haircut' },
    { id: 'buzz', name: lang === 'ru' ? 'Базз Кат' : lang === 'en' ? 'Buzz Cut' : 'Базз Кат', prompt: 'short buzz cut haircut' },
    { id: 'pompadour', name: lang === 'ru' ? 'Помпадур' : lang === 'en' ? 'Pompadour' : 'Помпадур', prompt: 'stylish pompadour haircut' },
    { id: 'slicked', name: lang === 'ru' ? 'Зачес назад' : lang === 'en' ? 'Slicked Back' : 'Артка тараган', prompt: 'classic slicked back haircut' },
    { id: 'sidepart', name: lang === 'ru' ? 'Пробор набок' : lang === 'en' ? 'Side Part' : 'Капталга тараган', prompt: 'classic side part haircut' },
    { id: 'crew', name: lang === 'ru' ? 'Кроп' : lang === 'en' ? 'Crew Cut' : 'Кроп', prompt: 'modern crew cut haircut' },
    { id: 'quiff', name: lang === 'ru' ? 'Квифф' : lang === 'en' ? 'Quiff' : 'Квифф', prompt: 'stylish quiff haircut' },
    { id: 'long', name: lang === 'ru' ? 'Длинные волосы' : lang === 'en' ? 'Long Hair' : 'Узун чач', prompt: 'stylish long hair for men' },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResultImage(null);
        setResultVideo(null);
        setError(null);
        setShowBefore(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTryOn = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    setError(null);

    try {
      const base64Data = selectedImage.split(',')[1];
      const stylePrompt = styles.find(s => s.id === selectedStyle)?.prompt || 'new haircut';

      if (mode === 'image') {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [
              {
                inlineData: {
                  data: base64Data,
                  mimeType: 'image/jpeg',
                },
              },
              {
                text: `Apply a ${stylePrompt} to the person in this photo. Maintain the person's facial features, skin tone, and background exactly as they are. Only modify the hair to match the ${stylePrompt} style. The result should look natural and professional.`,
              },
            ],
          },
        });

        let foundImage = false;
        for (const part of response.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
            setResultImage(`data:image/png;base64,${part.inlineData.data}`);
            foundImage = true;
            break;
          }
        }

        if (!foundImage) throw new Error("No image returned from AI");
      } else {
        // Video Mode
        // @ts-ignore
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
          // @ts-ignore
          await window.aistudio.openSelectKey();
        }

        const stylePrompt = styles.find(s => s.id === selectedStyle)?.name || 'new haircut';
        
        let operation = await ai.models.generateVideos({
          model: 'veo-3.1-lite-generate-preview',
          prompt: `A cinematic 4k video of a man with a ${stylePrompt}. The man is turning his head slightly to show the haircut from different angles. Professional lighting, barbershop background.`,
          image: {
            imageBytes: base64Data,
            mimeType: 'image/jpeg',
          },
          config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio: '9:16'
          }
        });

        while (!operation.done) {
          await new Promise(resolve => setTimeout(resolve, 5000));
          operation = await ai.operations.getVideosOperation({ operation: operation });
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (downloadLink) {
          const response = await fetch(downloadLink, {
            method: 'GET',
            headers: {
              'x-goog-api-key': process.env.GEMINI_API_KEY || "",
            },
          });
          const blob = await response.blob();
          setResultVideo(URL.createObjectURL(blob));
        } else {
          throw new Error("No video returned from AI");
        }
      }
    } catch (err) {
      console.error("Try-on error:", err);
      setError(t.error);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadResult = () => {
    const result = mode === 'image' ? resultImage : resultVideo;
    if (!result) return;
    const link = document.createElement('a');
    link.href = result;
    link.download = mode === 'image' ? 'arbat-grooming-look.png' : 'arbat-grooming-look.mp4';
    link.click();
  };

  return (
    <section id="tryon" className="py-32 bg-[#0A0A0A] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gold/5 blur-[120px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-gold/5 blur-[100px] -z-10"></div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-gold uppercase tracking-[0.3em] text-sm mb-4 block font-semibold"
          >
            {t.subtitle}
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="serif text-5xl md:text-6xl font-light mb-6"
          >
            {t.title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            {t.desc}
          </motion.p>

          <div className="flex justify-center mt-10 gap-4">
            <button 
              onClick={() => { setMode('image'); setResultImage(null); setResultVideo(null); }}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-xs uppercase tracking-widest transition-all ${mode === 'image' ? 'bg-gold text-dark font-bold' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}
            >
              <ImageIcon size={16} />
              {t.modeImage}
            </button>
            <button 
              onClick={() => { setMode('video'); setResultImage(null); setResultVideo(null); }}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-xs uppercase tracking-widest transition-all ${mode === 'video' ? 'bg-gold text-dark font-bold' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}
            >
              <Video size={16} />
              {t.modeVideo}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <div className="bg-dark/50 border border-white/5 p-8 rounded-2xl backdrop-blur-sm">
              <h3 className="serif text-2xl mb-6 flex items-center gap-3">
                <Upload className="text-gold" size={24} />
                {t.upload}
              </h3>
              
              {!selectedImage ? (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-gold/50 hover:bg-gold/5 transition-all group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-12 h-12 text-gray-500 group-hover:text-gold transition-colors mb-4" />
                    <p className="text-sm text-gray-400 text-center px-4">{t.placeholder}</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              ) : (
                <div className="relative group">
                  <img src={selectedImage} alt="Original" className="w-full h-64 object-cover rounded-xl border border-white/10" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                    <label className="cursor-pointer bg-gold text-dark px-6 py-2 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-white transition-colors flex items-center gap-2">
                      <RefreshCw size={14} />
                      {t.change}
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                  </div>
                </div>
              )}

              <div className="mt-10">
                <h3 className="serif text-2xl mb-6 flex items-center gap-3">
                  <Scissors className="text-gold" size={24} />
                  {t.styles}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {styles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      className={`px-4 py-3 text-xs uppercase tracking-widest border transition-all duration-300 ${
                        selectedStyle === style.id 
                          ? 'border-gold bg-gold text-dark font-bold' 
                          : 'border-white/10 text-gray-400 hover:border-gold/50'
                      }`}
                    >
                      {style.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 mt-10">
                <button
                  onClick={handleTryOn}
                  disabled={!selectedImage || isProcessing}
                  className="flex-grow py-5 bg-gold text-dark font-bold uppercase tracking-widest hover:bg-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl shadow-gold/10"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      {t.processing}
                    </>
                  ) : (
                    <>
                      {mode === 'image' ? <Camera size={20} /> : <Film size={20} />}
                      {t.generate}
                    </>
                  )}
                </button>
                
                {selectedImage && !isProcessing && (
                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      setResultImage(null);
                      setResultVideo(null);
                      setError(null);
                    }}
                    className="px-6 border border-white/10 text-gray-400 hover:border-red-500/50 hover:text-red-500 transition-all"
                    title={lang === 'ru' ? 'Сбросить' : lang === 'en' ? 'Reset' : 'Калыбына келтирүү'}
                  >
                    <RefreshCw size={20} />
                  </button>
                )}
              </div>
              
              {error && (
                <p className="mt-4 text-red-500 text-sm text-center font-medium">{error}</p>
              )}

              {mode === 'video' && !isProcessing && !resultVideo && (
                <p className="mt-4 text-gray-500 text-[10px] text-center uppercase tracking-widest">
                  {t.videoDesc}
                </p>
              )}
            </div>
          </div>

          <div className="relative h-full min-h-[400px]">
            <div className="sticky top-32">
              <div className="bg-dark/50 border border-white/5 p-4 rounded-2xl backdrop-blur-sm h-full">
                <div className="aspect-[3/4] relative overflow-hidden rounded-xl bg-black/40 flex items-center justify-center border border-white/5">
                  {mode === 'image' ? (
                    resultImage ? (
                      <div className="relative w-full h-full">
                        <motion.img 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: showBefore ? 0 : 1 }}
                          src={resultImage} 
                          alt="Result" 
                          className="absolute inset-0 w-full h-full object-cover" 
                        />
                        <motion.img 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: showBefore ? 1 : 0 }}
                          src={selectedImage || ""} 
                          alt="Original" 
                          className="absolute inset-0 w-full h-full object-cover" 
                        />
                        
                        <div className="absolute bottom-6 left-6 flex gap-2">
                          <button 
                            onMouseDown={() => setShowBefore(true)}
                            onMouseUp={() => setShowBefore(false)}
                            onMouseLeave={() => setShowBefore(false)}
                            onTouchStart={() => setShowBefore(true)}
                            onTouchEnd={() => setShowBefore(false)}
                            className="bg-dark/80 backdrop-blur-md text-white px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold border border-white/10 hover:bg-gold hover:text-dark transition-colors"
                          >
                            {lang === 'ru' ? 'Зажать: До' : lang === 'en' ? 'Hold: Before' : 'Кармап тур: Чейин'}
                          </button>
                        </div>
                      </div>
                    ) : isProcessing ? (
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 border-4 border-gold/20 border-t-gold rounded-full animate-spin"></div>
                        <p className="text-gold uppercase tracking-[0.2em] text-xs font-bold animate-pulse">{t.processing}</p>
                      </div>
                    ) : (
                      <div className="text-center p-10">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Camera className="text-gray-600" size={40} />
                        </div>
                        <p className="text-gray-500 uppercase tracking-widest text-sm">{t.result}</p>
                      </div>
                    )
                  ) : (
                    // Video Result
                    resultVideo ? (
                      <video 
                        src={resultVideo} 
                        autoPlay 
                        loop 
                        muted 
                        playsInline 
                        className="w-full h-full object-cover"
                      />
                    ) : isProcessing ? (
                      <div className="flex flex-col items-center gap-6 p-10 text-center">
                        <div className="w-16 h-16 border-4 border-gold/20 border-t-gold rounded-full animate-spin"></div>
                        <div>
                          <p className="text-gold uppercase tracking-[0.2em] text-xs font-bold animate-pulse mb-2">{t.processing}</p>
                          <p className="text-gray-500 text-[10px] uppercase tracking-widest">{t.videoWait}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-10">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Play className="text-gray-600" size={40} />
                        </div>
                        <p className="text-gray-500 uppercase tracking-widest text-sm">{t.result}</p>
                      </div>
                    )
                  )}

                  {(resultImage || resultVideo) && !isProcessing && (
                    <div className="absolute bottom-6 right-6">
                      <button 
                        onClick={downloadResult}
                        className="w-12 h-12 bg-gold text-dark rounded-full flex items-center justify-center shadow-2xl hover:bg-white transition-colors"
                        title={t.download}
                      >
                        <Download size={20} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Navbar = ({ lang, setLang }: { lang: Language, setLang: (l: Language) => void }) => {
  const t = TRANSLATIONS[lang].nav;
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-dark/95 backdrop-blur-md py-4 border-b border-gold/20' : 'bg-transparent py-8'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Scissors className="text-gold w-8 h-8" />
          <span className="serif text-2xl font-bold tracking-widest uppercase">Arbat Grooming</span>
        </div>

        <div className="hidden md:flex items-center gap-10 text-sm font-medium tracking-widest uppercase">
          <a href="#services" className="hover:text-gold transition-colors">{t.services}</a>
          <a href="#tryon" className="hover:text-gold transition-colors">{t.tryon}</a>
          <a href="#masters" className="hover:text-gold transition-colors">{t.masters}</a>
          <a href="#gallery" className="hover:text-gold transition-colors">{t.gallery}</a>
          <a href="#contact" className="hover:text-gold transition-colors">{t.contact}</a>
          
          <div className="flex items-center gap-3 border-l border-white/10 pl-10">
            {(['ru', 'en', 'ky'] as Language[]).map((l) => (
              <button 
                key={l} 
                onClick={() => setLang(l)}
                className={`text-xs hover:text-gold transition-colors ${lang === l ? 'text-gold font-bold' : 'text-gray-500'}`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          <button className="px-6 py-2 border border-gold text-gold hover:bg-gold hover:text-dark transition-all duration-300">
            {t.book}
          </button>
        </div>

        <button className="md:hidden text-gold" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-dark border-b border-gold/20 py-10 flex flex-col items-center gap-6 md:hidden"
          >
            <a href="#services" onClick={() => setIsOpen(false)} className="text-xl uppercase tracking-widest">{t.services}</a>
            <a href="#tryon" onClick={() => setIsOpen(false)} className="text-xl uppercase tracking-widest">{t.tryon}</a>
            <a href="#masters" onClick={() => setIsOpen(false)} className="text-xl uppercase tracking-widest">{t.masters}</a>
            <a href="#gallery" onClick={() => setIsOpen(false)} className="text-xl uppercase tracking-widest">{t.gallery}</a>
            <a href="#contact" onClick={() => setIsOpen(false)} className="text-xl uppercase tracking-widest">{t.contact}</a>
            
            <div className="flex gap-6 py-4">
              {(['ru', 'en', 'ky'] as Language[]).map((l) => (
                <button 
                  key={l} 
                  onClick={() => { setLang(l); setIsOpen(false); }}
                  className={`text-sm ${lang === l ? 'text-gold font-bold' : 'text-gray-500'}`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>

            <button className="mt-4 px-10 py-3 bg-gold text-dark font-bold uppercase tracking-widest">
              {t.book}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ lang }: { lang: Language }) => {
  const t = TRANSLATIONS[lang].hero;
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 grid grid-cols-2 md:grid-cols-4 h-full">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="relative h-full overflow-hidden">
            <img 
              src={`https://picsum.photos/seed/haircut-${i}/800/1200?grayscale`} 
              alt={`Haircut ${i}`} 
              className="w-full h-full object-cover opacity-25"
              referrerPolicy="no-referrer"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-dark/90 via-dark/60 to-dark"></div>
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-gold uppercase tracking-[0.4em] text-sm mb-6 block font-semibold">{t.subtitle}</span>
          <h1 className="serif text-6xl md:text-8xl font-light mb-8 leading-tight">
            {t.title} <br /> <span className="italic text-gold">{t.city}</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            {t.desc}
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <button className="w-full md:w-auto px-10 py-4 bg-gold text-dark font-bold uppercase tracking-widest hover:bg-white transition-all duration-300 shadow-xl shadow-gold/10">
              {t.cta1}
            </button>
            <button className="w-full md:w-auto px-10 py-4 border border-white/20 text-white uppercase tracking-widest hover:border-gold hover:text-gold transition-all duration-300">
              {t.cta2}
            </button>
          </div>
        </motion.div>
      </div>

      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gold/50"
      >
        <div className="w-px h-16 bg-gradient-to-b from-gold/50 to-transparent mx-auto"></div>
      </motion.div>
    </section>
  );
};

const Services = ({ lang }: { lang: Language }) => {
  const t = TRANSLATIONS[lang].services;
  const servicesList = [
    { id: 1, name: t.s1, price: '3 500 ₽', duration: `60 ${t.min}`, desc: t.s1d },
    { id: 2, name: t.s2, price: '2 500 ₽', duration: `45 ${t.min}`, desc: t.s2d },
    { id: 3, name: t.s3, price: '4 000 ₽', duration: `60 ${t.min}`, desc: t.s3d },
    { id: 4, name: t.s4, price: '5 000 ₽', duration: `90 ${t.min}`, desc: t.s4d },
  ];

  return (
    <section id="services" className="py-32 bg-dark relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <span className="text-gold uppercase tracking-widest text-sm mb-4 block">{t.subtitle}</span>
            <h2 className="serif text-5xl md:text-6xl font-light">{t.title}</h2>
          </div>
          <p className="text-gray-500 max-w-sm text-right hidden md:block">
            {t.desc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12">
          {servicesList.map((service, index) => (
            <motion.div 
              key={service.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="flex justify-between items-baseline mb-4">
                <h3 className="serif text-2xl group-hover:text-gold transition-colors">{service.name}</h3>
                <div className="flex-grow mx-4 border-b border-white/10 border-dotted"></div>
                <span className="text-gold font-medium">{service.price}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 uppercase tracking-wider">
                <p className="max-w-xs normal-case">{service.desc}</p>
                <span>{service.duration}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <p className="serif italic text-2xl text-gray-400 mb-8">{t.quote}</p>
        </div>
      </div>
    </section>
  );
};

const Masters = ({ lang }: { lang: Language }) => {
  const t = TRANSLATIONS[lang].masters;
  return (
    <section id="masters" className="py-32 bg-[#0F0F0F]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-gold uppercase tracking-widest text-sm mb-4 block">{t.subtitle}</span>
          <h2 className="serif text-5xl md:text-6xl font-light">{t.title}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { id: 1, name: t.m1, role: t.r1, experience: `8 ${t.years}`, image: 'https://picsum.photos/seed/barber1/400/500' },
            { id: 2, name: t.m2, role: t.r2, experience: `12 ${t.years}`, image: 'https://picsum.photos/seed/barber2/400/500' },
            { id: 3, name: t.m3, role: t.r3, experience: `5 ${t.years}`, image: 'https://picsum.photos/seed/barber3/400/500' },
          ].map((master) => (
            <motion.div 
              key={master.id}
              whileHover={{ y: -10 }}
              className="relative group"
            >
              <div className="aspect-[4/5] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                <img 
                  src={master.image} 
                  alt={master.name} 
                  className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-dark to-transparent">
                <span className="text-gold text-xs uppercase tracking-widest mb-2 block">{master.role}</span>
                <h3 className="serif text-3xl mb-1">{master.name}</h3>
                <p className="text-gray-400 text-sm">{t.experience}: {master.experience}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Stats = ({ lang }: { lang: Language }) => {
  const t = TRANSLATIONS[lang].stats;
  const stats = [
    { icon: <Users className="w-8 h-8" />, label: t.clients, value: '5000+' },
    { icon: <Award className="w-8 h-8" />, label: t.awards, value: '12' },
    { icon: <Star className="w-8 h-8" />, label: t.rating, value: '4.9' },
    { icon: <Clock className="w-8 h-8" />, label: t.time, value: '60' },
  ];

  return (
    <section className="py-20 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
        {stats.map((stat, i) => (
          <div key={i} className="text-center">
            <div className="text-gold flex justify-center mb-4">{stat.icon}</div>
            <div className="serif text-4xl font-light mb-2">{stat.value}</div>
            <div className="text-gray-500 text-xs uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

const Contact = ({ lang }: { lang: Language }) => {
  const t = TRANSLATIONS[lang].contact;
  return (
    <section id="contact" className="py-32 bg-dark">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <span className="text-gold uppercase tracking-widest text-sm mb-4 block">{t.subtitle}</span>
            <h2 className="serif text-5xl md:text-6xl font-light mb-12">{t.title}</h2>
            
            <div className="space-y-10">
              <div className="flex gap-6">
                <div className="w-12 h-12 border border-gold/30 flex items-center justify-center text-gold shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="serif text-xl mb-2">{t.address}</h4>
                  <p className="text-gray-400">{t.city}<br />{t.bc}</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-12 h-12 border border-gold/30 flex items-center justify-center text-gold shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className="serif text-xl mb-2">{t.phone}</h4>
                  <p className="text-gray-400">+7 (495) 000-00-00</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-12 h-12 border border-gold/30 flex items-center justify-center text-gold shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="serif text-xl mb-2">{t.hours}</h4>
                  <p className="text-gray-400">{t.daily}: 10:00 — 22:00</p>
                </div>
              </div>
            </div>

            <div className="mt-16 flex gap-6">
              <a href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:border-gold hover:text-gold transition-all">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:border-gold hover:text-gold transition-all">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          <div className="bg-[#0F0F0F] p-10 md:p-16 border border-white/5">
            <h3 className="serif text-3xl mb-8">{t.booking}</h3>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="text-xs uppercase tracking-widest text-gray-500 mb-2 block">{t.name}</label>
                <input type="text" className="w-full bg-transparent border-b border-white/10 py-3 focus:border-gold outline-none transition-colors" placeholder={t.namePlaceholder} />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-gray-500 mb-2 block">{t.phone}</label>
                <input type="tel" className="w-full bg-transparent border-b border-white/10 py-3 focus:border-gold outline-none transition-colors" placeholder="+7 (___) ___-__-__" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-gray-500 mb-2 block">{t.service}</label>
                <select className="w-full bg-transparent border-b border-white/10 py-3 focus:border-gold outline-none transition-colors appearance-none">
                  <option className="bg-dark">{TRANSLATIONS[lang].services.s1}</option>
                  <option className="bg-dark">{TRANSLATIONS[lang].services.s2}</option>
                  <option className="bg-dark">{TRANSLATIONS[lang].services.s3}</option>
                  <option className="bg-dark">{TRANSLATIONS[lang].services.s4}</option>
                </select>
              </div>
              <button className="w-full py-5 bg-gold text-dark font-bold uppercase tracking-widest hover:bg-white transition-all duration-300 mt-8">
                {t.submit}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const Map = () => {
  return (
    <section className="h-[450px] w-full relative grayscale hover:grayscale-0 transition-all duration-700">
      <iframe 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2245.385311234567!2d37.5912345!3d55.7512345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46b54a5a5a5a5a5a%3A0x5a5a5a5a5a5a5a5a!2z0YPQuy4g0JDRgNCx0LDRgiwgMTUsINCc0L7RgdC60LLQsCwgMTIxMDE5!5e0!3m2!1sru!2sru!4v1711812345678!5m2!1sru!2sru" 
        width="100%" 
        height="100%" 
        style={{ border: 0 }} 
        allowFullScreen={true} 
        loading="lazy" 
        referrerPolicy="no-referrer-when-downgrade"
        title="Arbat Grooming Location"
      ></iframe>
      <div className="absolute inset-0 pointer-events-none border-y border-white/5"></div>
    </section>
  );
};

const Footer = ({ lang }: { lang: Language }) => {
  const t = TRANSLATIONS[lang].footer;
  return (
    <footer className="py-12 border-t border-white/5 bg-dark">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2">
          <Scissors className="text-gold w-6 h-6" />
          <span className="serif text-xl font-bold tracking-widest uppercase">Arbat Grooming</span>
        </div>
        <p className="text-gray-600 text-sm">© 2026 Arbat Grooming Co. {t.rights}</p>
        <div className="flex gap-8 text-xs uppercase tracking-widest text-gray-500">
          <a href="#" className="hover:text-gold">{t.privacy}</a>
          <a href="#" className="hover:text-gold">{t.offer}</a>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  const [lang, setLang] = useState<Language>('ru');

  return (
    <div className="min-h-screen selection:bg-gold selection:text-dark">
      <Navbar lang={lang} setLang={setLang} />
      <Hero lang={lang} />
      <Stats lang={lang} />
      <Services lang={lang} />
      <TryOn lang={lang} />
      <Masters lang={lang} />
      
      {/* Gallery Preview */}
      <section id="gallery" className="grid grid-cols-2 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="aspect-square overflow-hidden relative group">
            <img 
              src={`https://picsum.photos/seed/gallery${i}/800/800?grayscale`} 
              alt="Gallery" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
              <Instagram className="text-white w-8 h-8" />
            </div>
          </div>
        ))}
      </section>

      <Contact lang={lang} />
      <Map />
      <ChatBot lang={lang} />
      <Footer lang={lang} />
    </div>
  );
}
