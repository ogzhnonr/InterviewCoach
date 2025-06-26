import OpenAI from 'openai';
import { OPENAI_API_KEY, OPENAI_ORG_ID } from '@env';

// OpenAI istemcisi
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  baseURL: 'https://api.openai.com/v1',
  organization: OPENAI_ORG_ID,
});

/**
 * OpenAI API'ye doğrudan HTTP isteği gönderir
 * @param messages Mesajlar
 * @returns API yanıtı
 */
async function callOpenAIDirectly(messages: any[]) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'OpenAI-Organization': OPENAI_ORG_ID,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API hatası: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('OpenAI API doğrudan çağrı hatası:', error);
    throw error;
  }
}

// Meslek ve pozisyona göre örnek sorular
interface QuestionSet {
  [key: string]: string[];
}

interface ProfessionQuestions {
  [key: string]: QuestionSet;
}

const exampleQuestions: ProfessionQuestions = {
  "yazılım": {
    "geliştirici": [
      "Karmaşık bir teknik sorunu çözmek için kullandığınız yaklaşımı adım adım anlatır mısınız?",
      "Yazılım geliştirme sürecinde karşılaştığınız en zorlu hata ayıklama deneyiminizi ve nasıl çözdüğünüzü paylaşır mısınız?"
    ],
    "mühendis": [
      "Büyük ölçekli bir yazılım projesinde performans sorunlarını nasıl tespit eder ve optimize edersiniz?",
      "Yazılım mimarisi tasarlarken dikkat ettiğiniz temel prensipler nelerdir ve neden önemlidirler?"
    ],
    "default": [
      "Yazılım alanında kendinizi geliştirmek için kullandığınız kaynaklar ve yöntemler nelerdir?",
      "Bir yazılım projesinde takım çalışması ve iletişimin önemini örneklerle açıklar mısınız?"
    ]
  },
  "pazarlama": {
    "uzman": [
      "Başarısız olmuş bir pazarlama kampanyasından neler öğrendiniz ve bu deneyimi nasıl gelecekteki projelerinize yansıttınız?",
      "Dijital pazarlama stratejilerini geleneksel pazarlama yöntemleriyle nasıl entegre ediyorsunuz?"
    ],
    "yönetici": [
      "Bir pazarlama ekibini yönetirken karşılaştığınız zorluklar nelerdir ve bunları nasıl aşıyorsunuz?",
      "Pazarlama bütçesini optimize etmek için kullandığınız stratejiler nelerdir?"
    ],
    "default": [
      "Pazarlama alanında trend takibi ve rekabet analizi için kullandığınız yöntemler nelerdir?",
      "Hedef kitle analizi yaparken dikkat ettiğiniz faktörler nelerdir ve bu analizleri kampanyalarınıza nasıl yansıtırsınız?"
    ]
  },
  "default": {
    "default": [
      "Bu alandaki profesyonel deneyimlerinizden bahseder misiniz?",
      "Kariyeriniz boyunca karşılaştığınız en büyük zorluk neydi ve bunu nasıl aştınız?"
    ]
  }
};

/**
 * Meslek ve pozisyona göre örnek sorular döndürür
 * @param profession Meslek grubu
 * @param position Pozisyon
 * @returns Örnek sorular
 */
const getExampleQuestions = (profession: string, position: string): string[] => {
  const professionKey = profession.toLowerCase() in exampleQuestions ? 
    profession.toLowerCase() : 'default';
  
  const questions = exampleQuestions[professionKey];
  const positionKey = position.toLowerCase() in questions ? 
    position.toLowerCase() : 'default';
  
  return questions[positionKey] || exampleQuestions.default.default;
};

/**
 * Meslek ve pozisyona göre dinamik mülakat soruları oluşturur
 * @param profession Meslek grubu
 * @param position Pozisyon
 * @param count İstenen soru sayısı
 * @returns Oluşturulan soruların listesi
 */
export const generateInterviewQuestions = async (
  profession: string,
  position: string,
  count: number = 2
): Promise<string[]> => {
  try {
    const prompt = `
      Sen bir mülakat koçusun. ${profession} alanında ${position} pozisyonu için ${count} adet mülakat sorusu oluştur.
      
      Sorular:
      1. Adayın teknik bilgisini ölçen sorular olmalı
      2. Adayın problem çözme becerisini ölçen sorular olmalı
      3. Adayın deneyimlerini paylaşmasını sağlayan sorular olmalı
      4. Sorular açık uçlu olmalı
      5. Sorular Türkçe olmalı
      
      Lütfen sadece soruları liste halinde döndür, başka açıklama ekleme.
    `;

    try {
      // Doğrudan API çağrısı yap
      const apiResponse = await callOpenAIDirectly([
        {
          role: "system",
          content: "Sen profesyonel bir mülakat koçusun. Verilen meslek ve pozisyona göre mülakat soruları üretiyorsun."
        },
        {
          role: "user",
          content: prompt
        }
      ]);

      // API yanıtından soruları ayıkla
      const content = apiResponse.choices[0]?.message?.content || '';
      
      // Yanıtı satırlara böl ve numaralandırma veya madde işaretlerini temizle
      const questions = content
        .split('\n')
        .filter((line: string) => line.trim().length > 0)
        .map((line: string) => line.replace(/^\d+\.|\*|\-/g, '').trim());

      // İstenen sayıda soru döndür
      return questions.slice(0, count);
    } catch (apiError: any) {
      console.error('OpenAI API hatası (detaylı):', apiError);
      
      // OpenAI SDK ile deneme yap
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "Sen profesyonel bir mülakat koçusun. Verilen meslek ve pozisyona göre mülakat soruları üretiyorsun."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 500,
        });

        // API yanıtından soruları ayıkla
        const content = response.choices[0]?.message?.content || '';
        
        // Yanıtı satırlara böl ve numaralandırma veya madde işaretlerini temizle
        const questions = content
          .split('\n')
          .filter((line: string) => line.trim().length > 0)
          .map((line: string) => line.replace(/^\d+\.|\*|\-/g, '').trim());

        // İstenen sayıda soru döndür
        return questions.slice(0, count);
      } catch (sdkError) {
        console.error('OpenAI SDK hatası:', sdkError);
        // Her iki yöntem de başarısız olursa örnek soruları döndür
        return getExampleQuestions(profession, position);
      }
    }
  } catch (error) {
    console.error('OpenAI API hatası:', error);
    
    // Hata durumunda örnek soruları döndür
    return getExampleQuestions(profession, position);
  }
};

/**
 * Örnek geri bildirim oluşturur
 * @param profession Meslek grubu
 * @param position Pozisyon
 * @returns Örnek geri bildirim
 */
const getExampleFeedback = (profession: string, position: string) => {
  return {
    strengths: [
      "Soruları detaylı ve örneklerle yanıtladınız.",
      "Teknik bilginizi iyi ifade ettiniz.",
      "İletişim beceriniz güçlü."
    ],
    weaknesses: [
      "Bazı cevaplar daha kısa ve öz olabilirdi.",
      "Somut örnekler daha fazla kullanılabilirdi."
    ],
    overallScore: 7,
    overallFeedback: `${profession} alanında ${position} pozisyonu için mülakat performansınız genel olarak iyiydi. Teknik bilginizi ve deneyimlerinizi etkili bir şekilde aktardınız. Gelecek mülakatlarda daha fazla somut örnek kullanmanız ve cevaplarınızı daha kısa tutmanız faydalı olabilir.`
  };
};

/**
 * Mülakat cevaplarına göre geri bildirim oluşturur
 * @param profession Meslek grubu
 * @param position Pozisyon
 * @param questions Sorular
 * @param answers Cevaplar
 * @returns Geri bildirim
 */
export const generateInterviewFeedback = async (
  profession: string,
  position: string,
  questions: string[],
  answers: string[]
): Promise<{
  strengths: string[];
  weaknesses: string[];
  overallScore: number;
  overallFeedback: string;
}> => {
  try {
    // Sorular ve cevapları birleştir
    const questionsAndAnswers = questions.map((q, i) => 
      `Soru ${i + 1}: ${q}\nCevap ${i + 1}: ${answers[i] || 'Cevap verilmedi'}`
    ).join('\n\n');

    const prompt = `
      Sen bir mülakat koçusun. Aşağıdaki ${profession} alanında ${position} pozisyonu için mülakat sorularını ve cevaplarını değerlendir:

      ${questionsAndAnswers}

      Değerlendirmeni şu formatta yap:
      1. Güçlü yönler (madde işaretleriyle liste halinde)
      2. Geliştirilmesi gereken yönler (madde işaretleriyle liste halinde)
      3. Genel puan (1-10 arası)
      4. Genel geri bildirim (bir paragraf)

      Değerlendirme yaparken şunlara dikkat et:
      - Cevapların detay seviyesi
      - Somut örnekler ve deneyimler paylaşılmış mı
      - Teknik yetkinlik
      - İletişim becerisi
      - Problem çözme yaklaşımı
    `;

    try {
      // Doğrudan API çağrısı yap
      const apiResponse = await callOpenAIDirectly([
        {
          role: "system",
          content: "Sen profesyonel bir mülakat koçusun. Mülakat cevaplarını değerlendiriyorsun."
        },
        {
          role: "user",
          content: prompt
        }
      ]);

      const content = apiResponse.choices[0]?.message?.content || '';
      
      // Geri bildirimi ayrıştır
      const strengthsMatch = content.match(/Güçlü yönler[:\s]+([\s\S]*?)(?=Geliştirilmesi gereken yönler|Genel puan|$)/i);
      const weaknessesMatch = content.match(/Geliştirilmesi gereken yönler[:\s]+([\s\S]*?)(?=Genel puan|Genel geri bildirim|$)/i);
      const scoreMatch = content.match(/Genel puan[:\s]+(\d+)/i);
      const feedbackMatch = content.match(/Genel geri bildirim[:\s]+([\s\S]*?)(?=$)/i);

      // Güçlü yönleri ayıkla
      const strengths = strengthsMatch ? 
        strengthsMatch[1].split(/\n/)
          .map((item: string) => item.replace(/^[-*•]\s*/, '').trim())
          .filter((item: string) => item.length > 0) : 
        ['Değerlendirme yapılamadı.'];

      // Zayıf yönleri ayıkla
      const weaknesses = weaknessesMatch ? 
        weaknessesMatch[1].split(/\n/)
          .map((item: string) => item.replace(/^[-*•]\s*/, '').trim())
          .filter((item: string) => item.length > 0) : 
        ['Değerlendirme yapılamadı.'];

      // Puanı ayıkla
      const score = scoreMatch ? 
        Math.min(10, Math.max(1, parseInt(scoreMatch[1]))) : 
        5;

      // Genel geri bildirimi ayıkla
      const feedback = feedbackMatch ? 
        feedbackMatch[1].trim() : 
        'Mülakat performansınızı değerlendirmek için yeterli veri bulunamadı.';

      return {
        strengths,
        weaknesses,
        overallScore: score,
        overallFeedback: feedback
      };
    } catch (apiError: any) {
      console.error('OpenAI API hatası (detaylı):', apiError);
      
      // OpenAI SDK ile deneme yap
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "Sen profesyonel bir mülakat koçusun. Mülakat cevaplarını değerlendiriyorsun."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        });

        const content = response.choices[0]?.message?.content || '';
        
        // Geri bildirimi ayrıştır
        const strengthsMatch = content.match(/Güçlü yönler[:\s]+([\s\S]*?)(?=Geliştirilmesi gereken yönler|Genel puan|$)/i);
        const weaknessesMatch = content.match(/Geliştirilmesi gereken yönler[:\s]+([\s\S]*?)(?=Genel puan|Genel geri bildirim|$)/i);
        const scoreMatch = content.match(/Genel puan[:\s]+(\d+)/i);
        const feedbackMatch = content.match(/Genel geri bildirim[:\s]+([\s\S]*?)(?=$)/i);

        // Güçlü yönleri ayıkla
        const strengths = strengthsMatch ? 
          strengthsMatch[1].split(/\n/)
            .map((item: string) => item.replace(/^[-*•]\s*/, '').trim())
            .filter((item: string) => item.length > 0) : 
          ['Değerlendirme yapılamadı.'];

        // Zayıf yönleri ayıkla
        const weaknesses = weaknessesMatch ? 
          weaknessesMatch[1].split(/\n/)
            .map((item: string) => item.replace(/^[-*•]\s*/, '').trim())
            .filter((item: string) => item.length > 0) : 
          ['Değerlendirme yapılamadı.'];

        // Puanı ayıkla
        const score = scoreMatch ? 
          Math.min(10, Math.max(1, parseInt(scoreMatch[1]))) : 
          5;

        // Genel geri bildirimi ayıkla
        const feedback = feedbackMatch ? 
          feedbackMatch[1].trim() : 
          'Mülakat performansınızı değerlendirmek için yeterli veri bulunamadı.';

        return {
          strengths,
          weaknesses,
          overallScore: score,
          overallFeedback: feedback
        };
      } catch (sdkError) {
        console.error('OpenAI SDK hatası:', sdkError);
        // Her iki yöntem de başarısız olursa örnek geri bildirim döndür
        return getExampleFeedback(profession, position);
      }
    }
  } catch (error) {
    console.error('OpenAI API hatası:', error);
    // Hata durumunda örnek geri bildirim döndür
    return getExampleFeedback(profession, position);
  }
}; 