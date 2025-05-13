export interface Position {
  id: string;
  title: string;
}

export interface Profession {
  id: string;
  title: string;
  positions: Position[];
}

export const professions: Profession[] = [
  {
    id: 'tech',
    title: 'Teknoloji',
    positions: [
      { id: 'software-engineer', title: 'Yazılım Mühendisi' },
      { id: 'frontend-developer', title: 'Frontend Geliştirici' },
      { id: 'backend-developer', title: 'Backend Geliştirici' },
      { id: 'mobile-developer', title: 'Mobil Uygulama Geliştirici' },
      { id: 'devops-engineer', title: 'DevOps Mühendisi' },
      { id: 'data-scientist', title: 'Veri Bilimci' },
      { id: 'product-manager', title: 'Ürün Yöneticisi' },
      { id: 'qa-engineer', title: 'Test Mühendisi' },
    ],
  },
  {
    id: 'finance',
    title: 'Finans',
    positions: [
      { id: 'financial-analyst', title: 'Finansal Analist' },
      { id: 'investment-banker', title: 'Yatırım Bankacısı' },
      { id: 'accountant', title: 'Muhasebeci' },
      { id: 'financial-advisor', title: 'Finansal Danışman' },
      { id: 'risk-manager', title: 'Risk Yöneticisi' },
      { id: 'portfolio-manager', title: 'Portföy Yöneticisi' },
    ],
  },
  {
    id: 'healthcare',
    title: 'Sağlık',
    positions: [
      { id: 'doctor', title: 'Doktor' },
      { id: 'nurse', title: 'Hemşire' },
      { id: 'pharmacist', title: 'Eczacı' },
      { id: 'physical-therapist', title: 'Fizik Terapist' },
      { id: 'medical-researcher', title: 'Tıbbi Araştırmacı' },
      { id: 'healthcare-administrator', title: 'Sağlık Yöneticisi' },
    ],
  },
  {
    id: 'marketing',
    title: 'Pazarlama',
    positions: [
      { id: 'marketing-manager', title: 'Pazarlama Müdürü' },
      { id: 'digital-marketer', title: 'Dijital Pazarlamacı' },
      { id: 'content-creator', title: 'İçerik Üreticisi' },
      { id: 'seo-specialist', title: 'SEO Uzmanı' },
      { id: 'brand-manager', title: 'Marka Yöneticisi' },
      { id: 'social-media-manager', title: 'Sosyal Medya Yöneticisi' },
    ],
  },
  {
    id: 'education',
    title: 'Eğitim',
    positions: [
      { id: 'teacher', title: 'Öğretmen' },
      { id: 'professor', title: 'Profesör' },
      { id: 'education-administrator', title: 'Eğitim Yöneticisi' },
      { id: 'curriculum-developer', title: 'Müfredat Geliştirici' },
      { id: 'educational-consultant', title: 'Eğitim Danışmanı' },
      { id: 'special-education-teacher', title: 'Özel Eğitim Öğretmeni' },
    ],
  },
  {
    id: 'legal',
    title: 'Hukuk',
    positions: [
      { id: 'lawyer', title: 'Avukat' },
      { id: 'judge', title: 'Hâkim' },
      { id: 'legal-consultant', title: 'Hukuk Danışmanı' },
      { id: 'patent-attorney', title: 'Patent Avukatı' },
      { id: 'corporate-counsel', title: 'Şirket Avukatı' },
      { id: 'legal-researcher', title: 'Hukuk Araştırmacısı' },
    ],
  }
]; 