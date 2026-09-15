/**
 * Türkçe arayüz ve editoryal metin.
 *
 * Kaynak dosya `en.ts`. Bu dosya ona göre tiplenir, dolayısıyla İngilizcede
 * bulunan bir anahtarın burada eksik olması derleme hatası verir. Amaç,
 * Türkçe bir sayfada sessizce İngilizce metin görünmesini imkânsız kılmak.
 *
 * BATCH 1 çevrildi: arayüz, gezinme, ana sayfa, Hakkımda, iletişim, 404 ve bu
 * sayfalara ait meta bilgiler. Proje inceleme metinleri ile diyagram metinleri
 * sonraki partilerde çevrilecek; onlar `src/content/projects/tr/`,
 * `src/content/ongoing/tr/` ve `src/i18n/diagrams/tr.ts` içinde duruyor.
 *
 * Proje adları özel isimdir ve çevrilmez: Writing Robot, Prosodic VR,
 * İzmir Water, F1 Race Prediction, Low Cost Industrial Robot Arm,
 * Local-First Engineering Assistant. Aynı şey diploma program adları için de
 * geçerli: bunlar üniversitenin resmî program adlarıdır.
 */
import type { UIStrings } from './en';

const tr: UIStrings = {
  nav: {
    work: 'Projeler',
    ongoing: 'Devam Eden',
    about: 'Hakkımda',
    contact: 'İletişim',
    language: 'Dil',
    primaryLabel: 'Ana menü',
    footerLabel: 'Alt bilgi',
    menu: 'Menü',
    skipToContent: 'İçeriğe geç',
    appearance: 'Görünüm',
    toggleTheme: 'Renk temasını değiştir',
  },

  menus: {
    projectsLabel: 'Projeler',
    ongoingLabel: 'Devam eden projeler',
    languageLabel: 'Diller',
    viewAllWork: 'Tüm projeleri gör',
    viewOngoing: 'Devam eden projeleri gör',
    noProjects: 'Henüz proje yok.',
    noOngoing: 'Devam eden proje yok.',
  },

  evidence: {
    video: 'Demo videosu',
    code: 'Kaynak kodu',
    output: 'Üretilen çıktı',
    architecture: 'Mimari',
    data: 'Oturum verisi',
    dataset: 'Herkese açık veri seti',
    'system-design': 'Sistem tasarımı',
  },

  site: {
    title: 'Hazar Ekin Uçan · Robotik ve Akıllı Sistemler',
    description:
      'Robotik ve Akıllı Sistemler lisans öğrencisi. Gerçek makineleri hareket ettiren yazılımlar yazıyor, ardından bunları makine üzerinde test ediyorum. Endüstriyel robotik ve konuşma analizi üzerine proje incelemeleri.',
    positioning: 'Robotik ve Akıllı Sistemler öğrencisiyim; yazılım, mekanik ve fiziksel sistemlerde kendimi geliştiriyorum.',
    status:
      'B.Sc. Robotics & Intelligent Systems · Constructor University Bremen · Beklenen mezuniyet 2027',
  },

  home: {
    seeTheWork: 'Projelere bak',
    aboutMe: 'Hakkımda',
    markNote:
      'Burada gördüğünüz hareket yolu, gerçek FANUC robotunda kullandığım programla oluşturuldu. Düz çizgiler kalem kâğıda değerken yapılan yazma hareketlerini, kesikli çizgiler ise kalem kaldırıldığında yapılan geçişleri gösteriyor. Atölyede robot aynı hareket sırasını gerçek bir kalemle uygulayarak kâğıda yazdı.',
    markLink: 'Writing Robot projesini gör',
    sectionWork: '01 · Seçilmiş projeler',
    sectionOngoing: '02 · Devam eden projeler',
    sectionHow: '03 · Nasıl çalışıyorum',
    sectionCapabilities: '04 · Yetkinlikler',
    sectionBackground: '05 · Eğitim ve deneyim',
    ongoingDeck:
      'Şu anda bu projeler üzerinde çalışıyorum. Henüz tamamlanmış bir sistem veya ölçüm sonucu yok. Burada yazan hedefler, ulaşmak istediğim noktayı gösteriyor.',
    fullCapabilities: 'Tüm yetkinlikler',
    fullBackground: 'Eğitim ve deneyimimin tamamı',
    principles: [
      {
        title: 'Gerçek makinede test ediyorum',
        body: 'Simülasyon ve gerçek sistemi devreye alma farklı işler. Hücreyi RoboGuide’da planlıyor, ardından gerçek kurulumda ortaya çıkan sorunları çözüyorum.',
        label: 'Writing Robot: tutucudaki yay',
      },
      {
        title: 'Problemleri doğru yerde çözmeye çalışıyorum',
        body: 'Writing Robot’ta sorun, kalem kâğıda değdiğinde ortaya çıkıyordu. Yazılımda daha hassas kalibrasyon yapmak çözüm olmayacaktı. Kalem tutucuya yay ekleyerek küçük hataları mekanik olarak karşılamasını sağladım.',
        label: 'Writing Robot: tutucudaki yay',
      },
      {
        title: 'Yalnızca dayanağı olan sayıları paylaşıyorum',
        body: 'Bir sistemin dayanağı olmayan bir sayı vermesindense sonuç vermemesini tercih ederim. Bir özellik anlamlı bilgi sağlamıyorsa onu değerlendirmeden çıkarmak da normal.',
        label: 'Prosodic VR: yanıltıcı puanları önlemek',
      },
    ],
  },

  about: {
    metaTitle: 'Hakkımda · Hazar Ekin Uçan',
    metaDescription:
      'Constructor University Bremen’de Robotik ve Akıllı Sistemler lisans öğrencisi. Robotik, otomotiv ve havacılık mühendisliği ile fiziksel sistemlere ilgi duyuyorum.',
    heading: 'Hakkımda',
    sectionCapabilities: '01 · Yetkinlikler',
    sectionBackground: '02 · Eğitim ve deneyim',
    lede: 'En çok, yazılımın gerçek dünyada bir şeye zarar verebilecek bir makineyi kontrol ettiği işler ilgimi çekiyor.',
    paragraphs: [
      'Robotikte beni asıl ilgilendiren, yapılan işin somut bir ihtiyaca cevap vermesi. Bir işi kolaylaştırması, daha kullanışlı hale getirmesi ya da kullanan kişiye fayda sağlaması gerekiyor. Yapmak istediğim projelerin çoğu buradan doğuyor. Bazen büyük bir mühendislik problemini çözmek istiyorum, bazen de sadece günlük hayatımı kolaylaştıracak bir şey yapmak.',
      'Son birkaç yılda otomotiv mühendisliğine olan ilgim de giderek arttı. Modern arabalar sevdiğim birçok şeyi aynı anda bir araya getiriyor: mekanik, elektronik ve yazılım. Elektrikli araç teknolojisini, araç sistemlerini ve otonom sürüşü çok daha iyi anlamak istiyorum. Bu alanlarda çalışmak beni heyecanlandırıyor.',
      'Havacılık ve uzay da benzer bir sebeple ilgimi çekiyor. Mekaniği, aerodinamiği, termodinamiği ve fiziği bir araya getiriyor; hepsi öğrenmekten gerçekten keyif aldığım konular. Fizik lisede en çok önem verdiğim derslerden biriydi. Bu merakım hâlâ devam ediyor.',
      'Mekanik tarafta daha öğrenecek çok şeyim olduğunu biliyorum. Stajda fiziksel sistemlerle doğrudan çalışarak önemli bir deneyim kazandım. Şimdi başladığım projeleri de bu alanda ilerlemek için seçiyorum. CAD, mekanik tasarım ve imalatta kendimi geliştirmek, ancak bir sistemi gerçekten çalıştırmaya uğraşırken fark edilen ayrıntıları öğrenmek istiyorum.',
      'Mühendislikte kendimi tek bir alanla sınırlamak istemiyorum. Hem yazılımda hem donanımda rahat çalışabilmek ve eksiklerimi görüp öğrenebileceğim projeler bulmaya devam etmek istiyorum.',
    ],
  },

  project: {
    backToWork: 'Seçilmiş projeler',
    myRole: 'Benim rolüm',
    metaRole: 'Rol',
    metaContext: 'Proje türü',
    metaPeriod: 'Dönem',
    metaStack: 'Stack',
    glanceLabel: 'Kısaca',
    glanceWhat: 'Nedir',
    glanceBuilt: 'Ne yaptım',
    limitsHeading: 'Sınırlar ve kısıtlar',
    evidencePrefix: 'Projeyi destekleyen materyaller:',
    nextLabel: 'Sıradaki',
    nextNavLabel: 'Sonraki proje',
  },

  ongoing: {
    backToOngoing: 'Devam eden projeler',
    statusChip: 'Devam ediyor',
    lastUpdated: 'Son güncelleme:',
    targetsHeading: 'Mühendislik hedefleri',
    statusHeading: 'Güncel durum',
    statusDeck: '{date} itibarıyla projenin geldiği aşama.',
    metaContext: 'Proje türü',
    metaStarted: 'Başlangıç',
    metaFocus: 'Odak',
    metaStatus: 'Durum',
    metaStatusValue: 'Devam ediyor',
    followTheBuild: 'Yapım sürecini takip et',
    conceptToFollow: 'Konsept görseli eklenecek',
  },

  card: {
    readCaseStudy: 'Proje incelemesini oku',
  },

  contact: {
    heading:
      'Robotik, otomasyon ve fiziksel sistemlerde kullanılan yazılımlar üzerine konuşmaktan memnuniyet duyarım.',
    copy: 'Kopyala',
    copied: 'Kopyalandı',
    copiedStatus: 'E-posta adresi kopyalandı',
    copyFailed: 'Adres kopyalanamadı. Seçip elle kopyalayabilirsiniz.',
  },

  footer: {
    colophon: 'Astro ile hazırlandı. Yazı tipi: IBM Plex.',
    lastUpdated: 'Son güncelleme',
  },

  skills: [
    {
      title: 'Robotik ve endüstriyel otomasyon',
      note: '',
      items: [
        'FANUC TP ve LS programlama',
        'Teach pendant kullanımı: jog hareketleri, tool ve user frame tanımları, register ve pozisyon register’ları, dijital I/O, hareket komutları',
        'FANUC RoboGuide’da hücre kurma ve çevrim simülasyonu',
        'Robot mastering ve kalibrasyon',
        'Kontrolcü alarmlarını giderme',
        'Pnömatik ve vakumlu uç elemanlar',
        'SolidWorks çizimlerinden paletleme tutucusu montajı',
        'Endüstriyel pano montajı ve kablolama',
        'PLC, röle ve sürücülere aşinalık',
      ],
      evidenceLabel: 'Writing Robot: hareket programını oluşturma',
    },
    {
      title: 'Yazılım',
      note: '',
      items: ['Python', 'C / C++', 'MATLAB', 'FastAPI', 'Git ve GitHub', 'Komut satırı araçları'],
      evidenceLabel: 'Prosodic VR: iki referans kaydı',
    },
    {
      title: 'Sinyal, konuşma ve veri',
      note: '',
      items: [
        'Praat / parselmouth',
        'librosa',
        'Faster-Whisper',
        'NumPy',
        'pandas',
        'matplotlib',
        'Öznitelik çıkarımı',
        'Zaman serisi ve sinyal analizi',
      ],
      evidenceLabel: 'Prosodic VR: ne ölçülüyor',
    },
    {
      title: 'Makine öğrenmesi',
      note: 'Derslerde ve kendi çalışmalarımda edindiğim deneyim.',
      items: [
        'scikit-learn',
        'Gözetimli öğrenme',
        'Random forest',
        'Gradient boosting',
        'SVM',
        'Model seçimi ve hiperparametre ayarı',
        'Çapraz doğrulama ve hata analizi',
      ],
      evidenceLabel: '',
    },
  ],

  honest: [
    {
      title: 'Giriş seviyesinde deneyim',
      body: 'Siemens TIA Portal, SIMATIC STEP 7 ve SIMATIC Automation Tool. Bir elektrik mühendisiyle birlikte çalıştım ve her aracın ne işe yaradığını öğrendim. Siemens programlama bilgim ileri seviyede değil.',
    },
    {
      title: 'SolidWorks',
      body: 'SolidWorks deneyimim, mevcut çizimleri okuyup bunlara göre montaj yapmakla sınırlı. İki paletleme tutucusunu bu şekilde monte ettim. Üretime yönelik parça modellemedim.',
    },
    {
      title: 'Yapmadığım şeyler',
      body: 'Stajda ayrıntılı erişim veya çarpışma analizi yapmadım; kinematik hesaplarını da elle çözmedim. Bu hesapları kontrolcü yapıyor. Hesapların ne anlama geldiğini öğrenmek, frame ve tool tanımlarını anlamama yardımcı oldu.',
    },
  ],

  timeline: [
    {
      period: '2024 - 2027 (beklenen mezuniyet)',
      title: 'B.Sc. Robotics & Intelligent Systems',
      org: 'Constructor University Bremen',
      place: 'Bremen, Almanya',
      detail:
        'İlgili dersler: gömülü sistemler, kontrol sistemleri, C/C++ ile programlama, lineer cebir, makine öğrenmesi, otonom sistemler, otomasyon ve veriye dayalı modelleme.',
      bullets: [],
      linkLabel: '',
    },
    {
      period: '1 Haziran - 24 Temmuz 2026',
      title: 'Robotik Mühendisliği Stajyeri',
      org: 'Neksus Endüstriyel Otomasyon',
      place: 'Programlama ve Otomasyon Sistemleri Bölümü, İzmir, Türkiye',
      detail:
        'İki paletleme sisteminde ve bireysel robot projemde, parçaların montajından hücrenin çalıştırılmasına kadar tüm süreçte yer aldım.',
      bullets: [
        'FANUC TP programları yazdım, düzenledim ve robotları teach pendant üzerinden kullandım.',
        'RoboGuide’da robot hücreleri kurdum, içe aktarılan CAD modellerini konumlandırdım ve çevrimleri simüle ettim.',
        'Gözetim altında mastering, kalibrasyon ve alarm giderme işleri yaptım.',
        'SolidWorks çizimlerinden iki paletleme tutucusu monte ettim ve pnömatik ile vakum bileşenlerini taktım.',
        'Endüstriyel panoların montajını ve kablolamasını yaptım.',
      ],
      linkLabel: 've Writing Robot’u yaptım',
    },
    {
      period: 'Temmuz - Eylül 2025',
      title: 'Gönüllü Stajyer, Makine Öğrenmesi',
      org: 'Celal Bayar Üniversitesi (XRlab)',
      place: 'Manisa, Türkiye',
      detail: '',
      bullets: [],
      linkLabel: '',
    },
    {
      period: '2023 - 2024',
      title: 'B.Sc. Mechanical Engineering',
      org: 'Yaşar Üniversitesi',
      place: 'İzmir, Türkiye · Tam burslu · Constructor University’ye yatay geçiş',
      detail: '',
      bullets: [],
      linkLabel: '',
    },
  ],

  languages: 'Türkçe (ana dil) · İngilizce (C1) · Almanca (A2-B1) · Fransızca (A1-A2)',

  notFound: {
    metaTitle: 'Sayfa bulunamadı · Hazar Ekin Uçan',
    metaDescription: 'Böyle bir sayfa yok.',
    code: '404',
    heading: 'Böyle bir sayfa yok.',
    body: 'Bağlantı artık geçerli olmayabilir veya bu adreste hiç sayfa oluşturulmamış olabilir.',
    action: 'Projelere dön',
  },
};

export default tr;
