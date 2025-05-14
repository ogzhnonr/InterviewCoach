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

/**
 * Belirli bir meslek ve pozisyona göre mülakat soruları üretir
 */
export const generateQuestions = (
  professionId: string,
  positionId: string
): Question[] => {
  // Gerçek bir uygulamada, burada bir API çağrısı olurdu
  // Şimdilik simüle ediyoruz
  
  // Özelleştirilmiş meslek ve pozisyonlar için ID kontrolü
  const isCustomProfession = professionId.startsWith('custom-');
  const isCustomPosition = positionId.startsWith('custom-');
  
  // Özel meslek veya pozisyon varsa, uygun soruları seçmek için
  if (isCustomProfession || isCustomPosition) {
    return [
      {
        id: 'custom-1',
        question: 'Bu alandaki kariyeriniz boyunca karşılaştığınız en büyük zorluk neydi ve bunu nasıl aştınız?',
      },
      {
        id: 'custom-2',
        question: 'Bu alandaki becerilerinizi geliştirmek için ne tür eğitimler aldınız veya kendinizi nasıl geliştirdiniz?',
      },
    ];
  }
  
  const questions: Record<string, Record<string, Question[]>> = {
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
      'backend-developer': [
        {
          id: '1',
          question: 'Yüksek trafikli bir API servisi ölçeklendirmek için kullandığınız stratejileri anlatın.',
        },
        {
          id: '2',
          question: 'Veritabanı tasarımında dikkat ettiğiniz güvenlik önlemleri nelerdir?',
        },
      ],
      'mobile-developer': [
        {
          id: '1',
          question: 'Mobil uygulama performansını artırmak için kullandığınız teknikler nelerdir?',
        },
        {
          id: '2',
          question: 'Cross-platform ve native geliştirme arasındaki tercihiniz nedir ve neden?',
        },
      ],
      'devops-engineer': [
        {
          id: '1',
          question: 'CI/CD pipeline tasarlarken dikkat ettiğiniz hususlar nelerdir?',
        },
        {
          id: '2',
          question: 'Bir üretim ortamında yaşanan kesinti durumunu nasıl ele alırsınız?',
        },
      ],
      'data-scientist': [
        {
          id: '1',
          question: 'Çalıştığınız en zorlu veri bilimi projesi neydi ve nasıl çözdünüz?',
        },
        {
          id: '2',
          question: 'Model performansını değerlendirmek için hangi metrikleri kullanırsınız?',
        },
      ],
      'product-manager': [
        {
          id: '1',
          question: 'Ürün vizyonunu teknik ekibe nasıl etkili bir şekilde aktarırsınız?',
        },
        {
          id: '2',
          question: 'Kullanıcı geri bildirimlerini ürün geliştirme sürecine nasıl dahil edersiniz?',
        },
      ],
      'qa-engineer': [
        {
          id: '1',
          question: 'Test otomasyonu stratejinizi nasıl belirlersiniz?',
        },
        {
          id: '2',
          question: 'Karşılaştığınız en zorlu hata neydi ve nasıl tespit ettiniz?',
        },
      ],
    },
    finance: {
      'financial-analyst': [
        {
          id: '1',
          question: 'Yatırım kararları alırken kullandığınız analiz yöntemleri nelerdir?',
        },
        {
          id: '2',
          question: 'Finansal model oluştururken dikkat ettiğiniz temel unsurlar nelerdir?',
        },
      ],
      // Diğer finance pozisyonları...
    },
    // Diğer meslekler...
  };

  try {
    return questions[professionId][positionId] || [
      {
        id: 'default-1',
        question: 'Bu alandaki deneyimlerinizi ve uzmanlığınızı anlatır mısınız?',
      },
      {
        id: 'default-2',
        question: 'Kariyerinizde karşılaştığınız en büyük zorluk neydi ve bunu nasıl aştınız?',
      },
    ];
  } catch (error) {
    // Seçilen meslek-pozisyon kombinasyonu için soru bulunamadığında varsayılan sorular
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
export const generateFeedback = (
  professionId: string,
  positionId: string,
  questions: Question[],
  answers: string[]
): Feedback => {
  // Gerçek bir uygulamada, burada bir AI API çağrısı olurdu
  // Şimdilik simüle ediyoruz
  
  // Cevapların uzunluğunu ve içeriğini kontrol ederek basit bir değerlendirme
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
}; 