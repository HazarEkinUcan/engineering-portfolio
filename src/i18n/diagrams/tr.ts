/**
 * Diyagram metinleri, Türkçe.
 *
 * Kaynak dosya `en.ts`; bu dosya ona göre tiplenir.
 *
 * BATCH 2 çevrildi: Writing Robot diyagramları (üretim akışı, kalem hareketi
 * durum makinesi, mekanik esneklik) ve Prosodic VR diyagramları (kişisel
 * kalibrasyon, sistem mimarisi, kalite kapıları).
 *
 * Sayılar, birimler ve teknik tanımlayıcılar burada değil: hızlar, yükseklikler,
 * frekanslar, FINE, CNT10, TRAVEL, PEN_DOWN, /PROG ve benzerleri bileşenlerin
 * içinde duruyor. Bir diyagramı çevirmek içindeki hiçbir değeri değiştiremez.
 */
import type { DiagramStrings } from './en';

const tr: DiagramStrings = {
  pipeline: {
    label: 'Diyagram: metinden hareket programına',
    caption:
      'Harici kütüphane gerektirmeyen tek bir Python dosyası, metni FANUC hareket programına dönüştürüyor. Çıktılar kaydedilmeden önce koordinatlar kontrol ediliyor. Kâğıt sınırlarını aşan bir koordinat varsa işlem duruyor; bu nokta robota ulaşmıyor. Her çalıştırmada üç dosya oluşturuluyor. SVG, robotu çalıştırmadan önce hareket yolunu kontrol etmek için var.',
    outputsLabel: 'Çıktılar',
    stages: [
      { key: 'Girdi', title: 'Metin', note: 'A-Z, a-z, 0-9, Türkçe harfler, noktalama' },
      {
        key: 'Font',
        title: 'Çizgilerle tanımlı harfler',
        note: 'birim kutu, y=0 harf üst sınırı, y=1 taban çizgisi',
      },
      {
        key: 'Yerleşim',
        title: 'Milimetre cinsinden çizgiler',
        note: 'imleç ilerlemesi, boşluklar, satır sonları',
      },
      {
        key: 'Otomatik sığdırma',
        title: 'Sığan en büyük harf boyu',
        note: 'ikili arama, 3 mm altında reddediyor',
      },
      {
        key: 'Noktalar',
        title: 'Sıralı robot noktaları',
        note: 'TRAVEL · PEN_DOWN · DRAW · PEN_UP',
      },
      {
        key: 'Kontrol',
        title: 'Çalışma alanı doğrulaması',
        note: 'sınır aşımında hata, koordinatı sınıra çekme yok',
      },
    ],
    outputNotes: [
      'robota bir şey ulaşmadan önce kontrol ediliyor',
      'hareket tipi ve hızıyla birlikte nokta listesi',
      '/PROG /ATTR /APPL /MN /POS /END',
    ],
  },

  penMotion: {
    label: 'Diyagram: kalem hareketi durum makinesi',
    caption:
      'Her çizgi aynı dört aşamayla çiziliyor. Kalemin indiği ve kalktığı noktalarda FINE kullanılıyor; uç bu konumlara tam olarak ulaşmalı. Aradaki köşelerde CNT10 kullanılarak geçişler yumuşatılıyor. Böylece robot her köşede durmadan düzgün çizgi çizebiliyor. Güvenli yükseklik, çizim yüksekliği ve iki hız değeri, programın varsayılan ayarları.',
    plotAlt:
      'Yükseklik profili: güvenli yükseklikte hareket, iniş, yüzey boyunca çizim, sonra tekrar güvenli yüksekliğe kalkış.',
    safe: 'güvenli',
    paper: 'kâğıt',
    states: [
      { name: 'Geçiş', desc: 'Sonraki çizginin ilk noktasının üzerine git' },
      { name: 'Kalem iniyor', desc: 'Yazma düzlemine in' },
      { name: 'Çiz', desc: 'Çizginin köşelerinden sırayla geç' },
      { name: 'Kalem kalkıyor', desc: 'Sonraki çizgiden önce yukarı kalk' },
    ],
  },

  compliance: {
    label: 'Diyagram: mekanik esneklik',
    caption:
      'Rijit bir tutucuda temas kuvvetini, ucun yüzeye ne kadar bastırıldığı belirliyor. Biraz az olursa çizgi kayboluyor, biraz fazla olursa yük hızla artıyor. Tutucuya eklenen yay, aynı yükseklik hatası aralığında kuvvetin daha az değişmesini sağlıyor; küçük kalibrasyon ve düzlemsellik farkları önemini yitiriyor. Eğriler mekanizmayı gösteriyor, hiçbir kuvvet ölçülmedi.',
    rigidTitle: 'Rijit tutucu',
    rigidAlt:
      'Rijit tutucuda yükseklik hatası arttıkça temas kuvveti hızla yükseliyor. Kalemin hiç iz bırakmadığı durumdan aşırı basınca kısa sürede geçiliyor.',
    rigidLegend:
      'Kullanılabilir bir çizgi yalnızca dar bir yükseklik hatası bandında çıkıyor. Bu aralığın dışında kalem ya çizgiyi kesiyor ya da fazla bastırıyor.',
    sprungTitle: 'Yaylı tutucu',
    sprungAlt:
      'Tutucuda yay varken temas kuvveti, çok daha geniş bir yükseklik hatası aralığında kullanılabilir bandın içinde kalıyor.',
    sprungLegend:
      'Yay, yükseklik farklarını karşılayarak düzgün çizgi çizilebilen aralığı genişletiyor. Küçük kalibrasyon hataları artık belirleyici olmuyor.',
    axisForce: 'Temas kuvveti',
    axisError: 'Yükseklik hatası',
  },

  calibration: {
    label: 'Diyagram: kişisel kalibrasyon',
    caption:
      'Her konuşmacının sakin kaydı baseline, belirgin biçimde aceleci kaydı upperline olarak kullanılıyor. Puan, herkese uygulanan sabit bir seviyeyi değil, kişinin bu iki referans arasındaki değişimini gösteriyor. Yukarıdaki iki konuşmacının ses perdesi farklı olsa da puanları aynı. Üçüncü eksende farkın negatif olduğu örnek var: bir özellikte upperline, baseline değerinden düşükse ölçek ters yönde ilerliyor. Gösterilen değerler yöntemi açıklayan örnekler; ölçüm sonucu değil.',
    baseline: 'Baseline',
    upperline: 'Upperline',
    speakerA: 'Konuşmacı A',
    speakerANote: 'daha gür, daha tiz',
    speakerB: 'Konuşmacı B',
    speakerBNote: 'daha kısık, daha pes',
    signed: 'İşaretli fark',
    signedNote: 'acele ederken yavaşlıyor',
  },

  calibrationMini: {
    speakerA: 'Konuşmacı A',
    speakerB: 'Konuşmacı B',
    legend: 'baseline → upperline · aynı puan, farklı sesler',
  },

  architecture: {
    label: 'Diyagram: sistem mimarisi',
    caption:
      'VR ve Python katmanları bir bağlantı üzerinden haberleşiyor. VR tarafı kullanıcı etkileşimini ve sonuçların gösterilmesini yönetiyor; tüm analiz Python’da yapılıyor. Ses kütüphanelerini C# ile tekrar yazmak gerekmiyor, ölçümler tek bir uygulamadan geliyor. Analiz motorundaki adımlar her kayıt için sırayla çalışıyor.',
    vrLayer: 'VR katmanı',
    headsetNote: 'Quest Link · kumanda tuşu',
    sceneName: 'Unity sahnesi',
    sceneNote: 'etkileşim ve sonuç paneli',
    engineLayer: 'Python analiz motoru',
    engineFoot: 'Başlık bağlı olmadan da çalışıyor',
    stages: [
      '16 kHz mono kayıt',
      'Metne dönüştür · Faster-Whisper',
      'Prozodik özellikleri çıkar',
      'Kalite kontrolleri',
      'Kişisel kalibrasyon',
      'Puan 0-100',
    ],
  },

  qualityGate: {
    label: 'Diyagram: puanlama ve kalite kontrolleri',
    caption:
      'Puan hesaplanmadan önce dört kontrol yapılıyor. Herhangi biri başarısız olduğunda ne yapılacağı belli. Sistem, dayanağı olmayan bir sayı vermek yerine sonuç vermiyor. Bir özelliğin elenmesi, kalibrasyonun kabul edilmemesi veya referans kaydının tekrarlanması normal.',
    passLabel: 'Tüm kontroller geçilirse',
    gates: [
      {
        check: 'Kayıt kullanılabilir mi?',
        detail: 'Tepe değeri ≥ 0.99 ise kırpılma, 0.02 altındaysa fazla kısık, ötümlü çerçeveler %20 altında',
        exit: 'Uyar ve kaydı tekrar iste',
      },
      {
        check: 'Kalibrasyon cümlesi söylendi mi?',
        detail: 'Konuşmadan çıkarılan metin, istenen cümleyle karşılaştırılıyor',
        exit: 'Referans kaydını tekrarla',
      },
      {
        check: 'Bu özellikte yeterli fark var mı?',
        detail: 'Baseline ile upperline arasındaki fark, bu özellik için belirlenen minimum eşiği karşılamalı',
        exit: 'Özelliği puanlamadan çıkar',
      },
      {
        check: 'Puan için yeterli bilgi kaldı mı?',
        detail: 'En az iki özellik kalmalı, toplam ağırlık en az 0.40 olmalı',
        exit: 'Kalibrasyonu reddet',
      },
    ],
    scoring: [
      'Her özellikte iki referans arasındaki değişim, kişinin gösterdiği yön korunarak hesaplanıyor',
      'Ters yöndeki değişim puana katkı yapmıyor',
      'Tek bir özelliğin katkısı 1.25 ile sınırlanıyor; toplam puanı aşırı yükseltemiyor',
      'Ağırlıklar uygulanıyor, sonuç 0-100 aralığında tutuluyor',
    ],
  },
};

export default tr;
