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
  
  const questions: Record<string, Record<string, Question[]>> = {
    tech: {
      'software-engineer': [
        {
          id: '1',
          question: 'Karmaşık bir yazılım projesinde karşılaştığınız bir zorluğu ve nasıl aştığınızı anlatın.',
        },
        {
          id: '2',
          question: 'Bir yazılım projesinde teknik borcu nasıl yönetirsiniz? Somut bir örnekle açıklayın.',
        }
      ],
      'frontend-developer': [
        {
          id: '1',
          question: 'Modern frontend geliştirme sürecinizi ve kullandığınız araçları açıklayın.',
        },
        {
          id: '2',
          question: 'Responsive tasarımı nasıl yaklaşırsınız? Karşılaştığınız zorluklar ve çözüm önerileriniz nelerdir?',
        }
      ],
      // Diğer teknoloji pozisyonları için 
    },
    finance: {
      'financial-analyst': [
        {
          id: '1',
          question: 'Karmaşık finansal verilerden anlamlı iç görüler çıkardığınız bir durumu anlatın.',
        },
        {
          id: '2',
          question: 'Finansal analiz yaparken hangi metodolojileri kullanıyorsunuz ve neden?',
        }
      ],
      // Diğer finans pozisyonları için
    },
    // Diğer meslek grupları
  };

  // Eğer belirli meslek/pozisyon kombinasyonu için önceden tanımlanmış sorular yoksa
  // Genel sorular üret
  if (!questions[professionId] || !questions[professionId][positionId]) {
    return [
      {
        id: '1',
        question: `Bu alandaki en büyük başarınız nedir ve bunu nasıl elde ettiniz?`,
      },
      {
        id: '2',
        question: `Bu pozisyonda karşılaşabileceğiniz zorluklar nelerdir ve bunlarla nasıl başa çıkarsınız?`,
      },
    ];
  }

  return questions[professionId][positionId];
};

/**
 * Kullanıcının cevaplarına göre geri bildirim üretir
 */
export const generateFeedback = (
  professionId: string,
  positionId: string,
  questions: Question[],
  answers: string[]
): Feedback => {
  // Gerçek bir uygulamada, burada bir API çağrısı olurdu
  // Şimdilik simüle ediyoruz
  
  // Basit bir simülasyon - Gerçekte AI analizi yapılacak
  const answerLengths = answers.map(a => a.length);
  const hasDetailedAnswers = answerLengths.every(length => length > 100);
  const hasSpecificExamples = answers.some(a => a.includes('örnek') || a.includes('durum'));
  
  // Basit bir değerlendirme algoritması
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  
  if (hasDetailedAnswers) {
    strengths.push('Detaylı ve kapsamlı cevaplar verilmiş.');
  } else {
    weaknesses.push('Cevaplar daha detaylı olabilir.');
  }
  
  if (hasSpecificExamples) {
    strengths.push('Spesifik örnekler kullanılmış, bu etkileyici.');
  } else {
    weaknesses.push('Somut örnekler eklemek cevaplarınızı güçlendirecektir.');
  }
  
  // Pozisyona özel değerlendirmeler
  if (professionId === 'tech') {
    strengths.push('Teknik becerileri açıkça ifade etme yeteneği gösterilmiş.');
    if (answers.some(a => a.includes('takım') || a.includes('işbirliği'))) {
      strengths.push('Takım çalışmasına verilen önem vurgulanmış.');
    } else {
      weaknesses.push('Takım çalışması hakkında daha fazla bilgi verilebilir.');
    }
  }
  
  const overallScore = strengths.length > weaknesses.length ? 
    7 + Math.min(strengths.length, 3) : 5 + Math.min(strengths.length, 2);
  
  // Genel geri bildirim
  let overallFeedback = '';
  if (overallScore >= 8) {
    overallFeedback = 'Mülakat performansınız oldukça iyi görünüyor. Güçlü yanlarınızı öne çıkarmışsınız ve belirtilen alanlarda deneyiminizi göstermişsiniz.';
  } else if (overallScore >= 6) {
    overallFeedback = 'İyi bir mülakat performansı gösterdiniz, ancak cevaplarınızı geliştirmek için belirtilen alanlara odaklanabilirsiniz.';
  } else {
    overallFeedback = 'Cevaplarınızı geliştirmeye odaklanmalısınız. Daha spesifik örnekler ve detaylar ekleyerek cevaplarınızı güçlendirebilirsiniz.';
  }
  
  return {
    strengths,
    weaknesses,
    overallScore,
    overallFeedback,
  };
}; 