import { generateInterviewQuestions, generateInterviewFeedback } from './openaiService';

export interface Question {
  id: string;
  question: string;
}

export interface Feedback {
  strengths: string[];
  weaknesses: string[];
  overallScore: number;
  overallFeedback: string;
}

// Sabit sorular - API çağrısı başarısız olduğunda kullanılacak
const fallbackQuestions: Record<string, Record<string, Question[]>> = {
  tech: {
    'software-engineer': [
      {
        id: '1',
        question: 'Karmaşık bir yazılım projesinde karşılaştığınız bir zorluğu ve nasıl aştığınızı anlatın.',
      },
      {
        id: '2',
        question: 'Bir yazılım projesinde teknik borcu nasıl yönetirsiniz? Somut bir örnekle açıklar mısınız?',
      },
    ],
    'frontend-developer': [
      {
        id: '1',
        question: 'Responsive bir web uygulaması geliştirirken dikkat ettiğiniz temel prensipleri açıklayın.',
      },
      {
        id: '2',
        question: 'Frontend performans optimizasyonu için kullandığınız yöntemler nelerdir?',
      },
    ],
    // Diğer pozisyonlar için sabit sorular...
  },
  // Diğer meslek grupları için sabit sorular...
};

/**
 * Belirli bir meslek ve pozisyona göre mülakat soruları üretir
 */
export const generateQuestions = async (
  professionId: string,
  positionId: string
): Promise<Question[]> => {
  try {
    // Özelleştirilmiş meslek ve pozisyonlar için ID kontrolü
    const isCustomProfession = professionId.startsWith('custom-');
    const isCustomPosition = positionId.startsWith('custom-');
    
    let professionTitle = professionId;
    let positionTitle = positionId;
    
    // Özel meslek veya pozisyon varsa, uygun başlıkları kullan
    if (isCustomProfession) {
      professionTitle = professionId.replace('custom-', '');
    }
    
    if (isCustomPosition) {
      positionTitle = positionId.replace('custom-', '');
    }
    
    // OpenAI API'yi kullanarak dinamik sorular oluştur
    const dynamicQuestions = await generateInterviewQuestions(
      professionTitle,
      positionTitle,
      3 // 3 soru oluştur
    );
    
    // Oluşturulan soruları Question formatına dönüştür
    return dynamicQuestions.map((question, index) => ({
      id: `dynamic-${index + 1}`,
      question,
    }));
  } catch (error) {
    console.error('Soru üretme hatası:', error);
    
    // Hata durumunda sabit soruları kullan
    try {
      // Sabit sorular varsa onları kullan
      if (fallbackQuestions[professionId]?.[positionId]) {
        return fallbackQuestions[professionId][positionId];
      }
    } catch (innerError) {
      // Hiçbir şey bulunamazsa varsayılan soruları döndür
    }
    
    // Varsayılan sorular
    return [
      {
        id: 'default-1',
        question: 'Bu alandaki deneyimlerinizi ve uzmanlığınızı anlatır mısınız?',
      },
      {
        id: 'default-2',
        question: 'Kariyerinizde karşılaştığınız en büyük zorluk neydi ve bunu nasıl aştınız?',
      },
    ];
  }
};

/**
 * Mülakat cevaplarına göre geri bildirim oluşturur
 */
export const generateFeedback = async (
  professionId: string,
  positionId: string,
  questions: Question[],
  answers: string[]
): Promise<Feedback> => {
  try {
    // Özelleştirilmiş meslek ve pozisyonlar için ID kontrolü
    const isCustomProfession = professionId.startsWith('custom-');
    const isCustomPosition = positionId.startsWith('custom-');
    
    let professionTitle = professionId;
    let positionTitle = positionId;
    
    // Özel meslek veya pozisyon varsa, uygun başlıkları kullan
    if (isCustomProfession) {
      professionTitle = professionId.replace('custom-', '');
    }
    
    if (isCustomPosition) {
      positionTitle = positionId.replace('custom-', '');
    }
    
    // Soruları string dizisine dönüştür
    const questionStrings = questions.map(q => q.question);
    
    // OpenAI API'yi kullanarak dinamik geri bildirim oluştur
    return await generateInterviewFeedback(
      professionTitle,
      positionTitle,
      questionStrings,
      answers
    );
  } catch (error) {
    console.error('Geri bildirim oluşturma hatası:', error);
    
    // Hata durumunda basit bir değerlendirme yap
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    
    let totalScore = 0;
    
    // Her bir cevap için değerlendirme
    answers.forEach((answer, index) => {
      const answerLength = answer.trim().length;
      
      if (answerLength > 200) {
        strengths.push(`Soru ${index + 1} için detaylı ve kapsamlı bir cevap verdiniz.`);
        totalScore += 5;
      } else if (answerLength > 100) {
        strengths.push(`Soru ${index + 1} için yeterli uzunlukta bir cevap verdiniz.`);
        totalScore += 3;
      } else if (answerLength > 50) {
        weaknesses.push(`Soru ${index + 1} için cevabınız biraz kısa, daha fazla detay ekleyebilirdiniz.`);
        totalScore += 2;
      } else {
        weaknesses.push(`Soru ${index + 1} için cevabınız çok kısa ve yetersiz.`);
        totalScore += 1;
      }
      
      // Cevap içeriğinde anahtar kelimeler var mı kontrolü
      const keywords = ['örnek', 'tecrübe', 'deneyim', 'proje', 'başarı', 'çözüm', 'analiz'];
      let keywordCount = 0;
      
      keywords.forEach(keyword => {
        if (answer.toLowerCase().includes(keyword)) {
          keywordCount++;
        }
      });
      
      if (keywordCount >= 3) {
        strengths.push(`Soru ${index + 1} için somut örnekler ve deneyimler paylaştınız.`);
        totalScore += 2;
      } else if (keywordCount > 0) {
        totalScore += 1;
      } else {
        weaknesses.push(`Soru ${index + 1} için daha somut örnekler verebilirdiniz.`);
      }
    });
    
    // Varsayılan güçlü yönler ve zayıf yönler
    if (strengths.length === 0) {
      strengths.push('Soruları yanıtlamaya çalıştınız.');
    }
    
    if (weaknesses.length === 0) {
      weaknesses.push('Daha da geliştirilebilecek belirgin bir zayıf yön bulunamadı.');
    }
    
    // Toplam puanı 1-10 arasında normalize et
    const normalizedScore = Math.min(10, Math.max(1, Math.floor(totalScore / (questions.length * 1.4))));
    
    // Genel geri bildirim
    let overallFeedback = '';
    
    if (normalizedScore >= 8) {
      overallFeedback = `Tebrikler! Mülakat sorularına verdiğiniz cevaplar çok iyi. ${professionId.startsWith('custom-') ? 'Belirttiğiniz meslek grubu' : 'Teknoloji'} alanında ${positionId.startsWith('custom-') ? 'belirttiğiniz pozisyon' : 'yazılım geliştirme'} pozisyonu için güçlü bir aday olduğunuzu gösterdiniz. Cevaplarınızda somut örnekler verdikçe ve deneyimlerinizi detaylandırdıkça başarı şansınız artacaktır.`;
    } else if (normalizedScore >= 5) {
      overallFeedback = `Mülakat performansınız ortalama düzeyde. Cevaplarınızda bazı güçlü yönler var, ancak geliştirilebilecek alanlar da mevcut. Daha somut örnekler vermek ve deneyimlerinizi daha detaylı anlatmak, mülakatlarınızda size avantaj sağlayacaktır.`;
    } else {
      overallFeedback = `Mülakat performansınızı geliştirmeye ihtiyacınız var. Cevaplarınız genellikle kısa ve yeterince detay içermiyor. STAR (Durum, Görev, Eylem, Sonuç) tekniğini kullanarak cevaplarınızı yapılandırmayı deneyebilirsiniz. Ayrıca, sektör terminolojisini daha fazla kullanmanız ve somut başarı örnekleri vermeniz faydalı olacaktır.`;
    }
    
    return {
      strengths,
      weaknesses,
      overallScore: normalizedScore,
      overallFeedback,
    };
  }
}; 