// Local FAQ table: instant zero-neuron answers for common visitor questions.
// Checked before Wikipedia/AI, so it also works when the AI quota is exhausted.
type FaqEntry = {
  keys: string[];
  min?: number;
  a: { id: string; en: string; jv: string };
  greetingOnly?: boolean;
};

const FAQ: FaqEntry[] = [
  {
    keys: ['buatkan', 'buatin', 'code', 'koding', 'js', 'javascript', 'python', 'html', 'css', 'program', 'script', 'bug', 'error', 'fungsi', 'function', 'login page', 'halaman login', 'ngoding', 'debug'],
    a: {
      id: 'Untuk coding langsung, langsung ke Mas Azzar aja ya — Mema di sini fokus bantu info layanan, tarif, dan kontak. Email azzar@glassgallery.my.id ya.',
      en: 'For actual coding, go straight to Mas Azzar — Mema handles services, rates, and contact info here. Email azzar@glassgallery.my.id.',
      jv: 'Nek ngoding langsung, langsung neng Mas Azzar wae — Mema fokus info layanan, tarif, lan kontak.',
    },
  },
  {
    keys: ['nego', 'bisa nego', 'kurang', 'diskon', 'discount', 'mahal', 'expensive', 'terlalu mahal', 'turun harga', 'potong'],
    a: {
      id: 'Tarifnya sejak awal transparan, tanpa biaya tersembunyi. Scope kecil dibantu dipangkas biar muat budget — kalau ada yang kepotong, kami potong bareng-bareng, bukan diumpetin.',
      en: 'Rates are transparent from the start, no hidden fees. If budget is tight, we trim scope together — nothing gets hidden in fine print.',
      jv: 'Tarife transparan, ora ono biaya sing disembunyikake. Nek budget kurang, scope-ne dipangkas bareng.',
    },
  },
  {
    keys: ['layanan apa saja', 'list layanan', 'katalog jasa', 'jasa apa', 'services list', 'yang bisa dikerjakan', 'bisa bikin', 'bikin apa'],
    a: {
      id: 'Macamnya luas: IoT & embedded (ESP32, Arduino, STM32), web full-stack (React, Next.js, Python), API, otomasi, DevOps & cloud, generative AI & ML, SEO, konsultasi, training/workshop, UI/UX, dan technical writing.',
      en: 'The range: IoT & embedded (ESP32, Arduino, STM32), full-stack web (React, Next.js, Python), APIs, automation, DevOps & cloud, generative AI & ML, SEO, consulting, training/workshops, UI/UX, and technical writing.',
      jv: 'Maceme akeh: IoT & embedded, web full-stack, API, otomasi, DevOps & cloud, AI/ML, SEO, konsultasi, training, UI/UX, lan technical writing.',
    },
  },
  {
    keys: ['metode pembayaran', 'cara bayar', 'payment method', 'dp', 'uang muka', 'termin pembayaran', 'payment plan'],
    a: {
      id: 'Fleksibel: milestone + termin pembayaran disepakati di awal sebelum development mulai, dan ada multi-currency di rate calculator.',
      en: 'Flexible: milestones and payment terms are agreed up front before development starts, with multi-currency options in the rate calculator.',
      jv: 'Fleksibel: milestone lan termin disepakati neng awal, ono multi-currency neng rate calculator.',
    },
  },
  {
    keys: ['proses pengerjaan', 'cara kerja', 'alur proyek', 'timeline pengerjaan', 'kerangka kerja'],
    a: {
      id: 'Alurnya: kirim brief → estimasi scope + timeline transparan → deal → garap dengan update berkala. Kamu pantau progresnya sepanjang jalan, bukan terima jadi.',
      en: 'Flow: send a brief → transparent scope + timeline estimate → deal → build with regular updates. You track progress along the way, not a surprise at the end.',
      jv: 'Alure: kirim brief → estimasi scope + timeline → deal → garap karo update berkala. Progres ketauan, ora dadakan.',
    },
  },
  {
    keys: ['update berkala', 'progress update', 'dipantau', 'malah report', 'update pengerjaan', 'laporan progres'],
    a: {
      id: 'Progresnya kelihatan sepanjang jalan — update berkala selama pengerjaan, bukan baru ketahuan di akhir. Estimasi waktu dihitung dari jam kerja dan scope, bukan asal gebrak.',
      en: 'Progress stays visible throughout — with regular updates during the build, not a surprise at the end. Time estimates come from hours and scope, not a guess.',
      jv: 'Progrese ketok sadhuwur dalan — update berkala, dudu dadakan. Estimasi wektu diitung soko jam kerja lan scope.',
    },
  },
  {
    keys: ['garansi', 'warranty', 'maintenance', 'after-sales', 'after sales', 'support sesudah selesai'],
    a: {
      id: 'Support lanjutan (maintenance, perubahan kecil) biasanya bisa dibicarakan — cara dan durasinya disepakati saat kickoff, tergantung scope proyeknya.',
      en: 'Ongoing support (maintenance, small changes) is usually discussed at kickoff — terms and duration depend on the project scope.',
      jv: 'Support lanjutan bisa dibicarakan — carane lan durasine disepakati neng kickoff, miturut scope proyeke.',
    },
  },
  {
    keys: ['kenapa harus', 'why should', 'alasan hire', 'kelebihan', 'bedanya apa', 'kenapa pilih', 'harus hire', 'harus dia', 'worth hiring', 'worth it'],
    a: {
      id: 'Karena dia ngerjain end-to-end (firmware sampai dashboard), dokumentasi rapi, dan 13 situs produksi live sebagai bukti — bukan janji. 7+ tahun freelance, jadi komunikasinya juga jelas dan terperinci.',
      en: 'Because he delivers end-to-end (firmware to dashboard), documents properly, and has 13 live production sites as proof — not promises. 7+ years freelance, so communication is clear and detailed, too.',
      jv: 'Mergo dheweke nggarap end-to-end, dokumentasi rapi, lan 13 situs produksi live dadi bukti — dudu janji. Pengalaman 7+ tahun.',
    },
  },
  {
    keys: ['mema'],
    a: {
      id: 'MEMA itu Multi-Euristic Mind Automaton \u2014 sistem AI pribadi Mas Azzar. Aku ini salah satu wujudnya, yang jaga chat di sini.',
      en: 'MEMA stands for Multi-Euristic Mind Automaton \u2014 Mas Azzar\u2019s personal AI system. I\u2019m one of its faces, minding this chat.',
      jv: 'MEMA kuwi Multi-Euristic Mind Automaton \u2014 sistem AI-ne Mas Azzar. Aku iki salah siji wujude, sing jaga chat neng kene.',
    },
  },
  {
    keys: ['tarif', 'harga', 'biaya', 'rate', 'price', 'pricing', 'budget', 'cost', 'how much', 'charge', 'fee'],
    a: {
      id: 'Tarif dasar $25/jam, rush $38/jam (≤24 jam), proyek panjang $20/jam (>160 jam), minimal proyek $350. Aturan gampang: transparan, tanpa biaya tersembunyi — dan kalkulator estimasinya ada di halaman Contact biar angkanya kelihatan langsung.',
      en: 'Base $25/hr, rush $38/hr (≤24h), long-project $20/hr (>160h), $350 minimum per project. Simple rule: fully transparent, no hidden fees — and the public rate calculator on the Contact page does the math live.',
      jv: 'Dasar $25/jam, rush kilat $38/jam, proyek dowo $20/jam, minimal $350. Transparan, tanpa biaya sing disembunyikake — kalkulator estimasine ono neng halaman Contact.',
    },
  },
  {
    keys: ['email', 'hubungi', 'kontak', 'contact', 'whatsapp', 'telegram', 'telepon'],
    a: {
      id: 'Hubungi Mas Azzar lewat email azzar@glassgallery.my.id \u2014 fast response untuk proyek serius. Telegram: @azzar_budiyanto.',
      en: 'Reach Mas Azzar at azzar@glassgallery.my.id \u2014 fast response for serious projects. Telegram: @azzar_budiyanto.',
      jv: 'Hubungono Mas Azzar lewat email azzar@glassgallery.my.id. Telegram: @azzar_budiyanto.',
    },
  },
  {
    keys: ['hire', 'sewa', 'rekrut', 'terima proyek', 'freelance', 'kerja sama', 'kolaborasi'],
    a: {
      id: 'Bisa! Mas Azzar terima proyek remote dari mana aja. Kirim brief ke azzar@glassgallery.my.id — tetap dibahas scope + estimasi transparan sebelum mulai, jadi kamu nggak kaget angka di tengah jalan.',
      en: 'Yes! Mas Azzar takes remote projects from anywhere. Send a brief to azzar@glassgallery.my.id — scope and a transparent estimate are agreed before anything starts, so there are no mid-project surprises.',
      jv: 'Iso! Mas Azzar nompo proyek remote seko endi wae. Kirim brief neng azzar@glassgallery.my.id — scope + estimasi transparan disepakati sadurunge mulai.',
    },
  },
  {
    keys: ['portofolio', 'portfolio', 'karya'],
    a: {
      id: 'Portofolionya di https://glassgallery.my.id/porto \u2014 semua karya live di sana.',
      en: 'His portfolio: https://glassgallery.my.id/porto \u2014 all live work is there.',
      jv: 'Portopolione neng https://glassgallery.my.id/porto.',
    },
  },
  {
    keys: ['blog', 'tulisan', 'artikel', 'wong edan'],
    a: {
      id: 'Blognya Wong Edan\u2019s di https://wp.glassgallery.my.id/ \u2014 esai teknis, jalan otomatis pakai AI.',
      en: 'His blog Wong Edan\u2019s: https://wp.glassgallery.my.id/ \u2014 technical essays, AI-automated.',
      jv: 'Bloge Wong Edan\u2019s neng https://wp.glassgallery.my.id/.',
    },
  },
  {
    keys: ['pengalaman', 'experience', 'berapa lama', 'sejak kapan', 'background'],
    a: {
      id: '7+ tahun freelance sejak Oktober 2018. Sekarang juga kerja sebagai full-stack engineer (day job), plus freelance dan embedded.',
      en: '7+ years freelance since Oct 2018. Currently also works as a full-stack engineer (day job), plus freelance and embedded work.',
      jv: '7+ tahun freelance wiwit Oktober 2018. Saiki uga kerjo dadi full-stack engineer (day job), plus freelance lan embedded.',
    },
  },
  {
    keys: ['layanan', 'jasa', 'service', 'bisa apa', 'keahlian', 'skill', 'iot', 'embedded', 'website', 'what can', 'can he', 'what does', 'do you do'],
    a: {
      id: 'Mas Azzar ngerjain IoT/embedded (ESP32, Arduino), web full-stack (React, Next.js, Python), otomasi, dan konsultasi SEO/AI.',
      en: 'Mas Azzar does IoT/embedded (ESP32, Arduino), full-stack web (React, Next.js, Python), automation, and SEO/AI consulting.',
      jv: 'Mas Azzar nggarap IoT/embedded (ESP32, Arduino), web full-stack, otomasi, lan konsultasi.',
    },
  },
  {
    keys: ['dimana', 'di mana', 'lokasi', 'tinggal', 'berada', 'jogja', 'kantor'],
    a: {
      id: 'Mas Azzar di Jakarta sejak Januari 2026, tapi sering bolak-balik Jogja \u2014 rumah kedua. Kerja remote ke seluruh dunia.',
      en: 'Mas Azzar is in Jakarta since Jan 2026, often back in Jogja \u2014 second home. Working remote worldwide.',
      jv: 'Mas Azzar neng Jakarta wiwit Januari 2026, tapi kerep Bali neng Jogja \u2014 omah keloro. Kerja remote sak donya.',
    },
  },
  {
    keys: ['siapa azzar', 'who is azzar', 'tentang azzar', 'about azzar', 'azzar itu', 'azzar adalah', 'mas azzar'],
    a: {
      id: 'Mas Azzar itu freelance full-stack & embedded engineer plus pengajar, asli Lamongan, mangkal di Jogja. 7+ tahun pengalaman sejak 2018.',
      en: 'Mas Azzar is a freelance full-stack & embedded engineer and educator, from Lamongan, based in Jogja. 7+ years since 2018.',
      jv: 'Mas Azzar kuwi freelance full-stack & embedded engineer plus pengajar, asline Lamongan, mangkal neng Jogja. Pengalaman 7+ tahun wiwit 2018.',
    },
  },
  {
    keys: ['siapa kamu', 'who are you', 'who are u', 'who r u', 'nama kamu', 'your name', 'sopo kowe', 'sopoo kowe', 'siapa kau', 'kamu siapa', 'siapa dirimu'],
    a: {
      id: 'Aku Mema, AI pribadi Mas Azzar. Ada yang bisa kubantu soal kerjaan dia?',
      en: 'I\u2019m Mema, Mas Azzar\u2019s personal AI. Anything I can help with regarding his work?',
      jv: 'Aku Mema, AI-ne Mas Azzar. Ono sing iso tak rewangi?',
    },
  },
  {
    keys: ['kamu hasil karya', 'kamu itu produk', 'kamu buktiin', 'contoh kerja ai', 'kamu itu ai nya dia', 'apakah kamu hasil buatan', 'kamu langsung ngewangin proyek mas azzar', 'buktinya kamu hasil karya'],
    a: {
      id: 'Iya, aku salah satu bukti karya AI-nya — live demo yang kamu lagi pakai sekarang. Mau bikin kayak aku? Email azzar@glassgallery.my.id ya.',
      en: 'Yes — I\u2019m one of his AI works: a live demo you\u2019re chatting with right now. Want one like me? Email azzar@glassgallery.my.id.',
      jv: 'Iya, aku salah siji bukti karya AI-ne — live demo sing lagi kokanggo saiki. Pengen sing koyo aku? Email azzar@glassgallery.my.id.',
    },
  },
  {
    keys: ['estimasi', 'kalkulator', 'hitung', 'estimate', 'cost'],
    a: {
      id: 'Ada kalkulator estimasi di halaman Contact \u2014 isi jam + kompleksitas, langsung keluar angka. Patokan: dasar $25/jam, rush $38/jam, proyek panjang $20/jam, minimal $350.',
      en: 'There is an estimate calculator on the Contact page \u2014 fill hours + complexity for instant numbers. Baseline: base $25/hr, rush $38/hr, long-project $20/hr, $350 minimum.',
      jv: 'Ono kalkulator estimasi neng halaman Contact \u2014 isi jam + kerumitan, langsung metu angkane. Patokan: dasar $25/jam, rush $38/jam, proyek dowo $20/jam, minimal $350.',
    },
  },
  {
    keys: ['cv', 'resume', 'daftar riwayat', 'curriculum'],
    a: {
      id: 'CV lengkap Mas Azzar ada di glassgallery.my.id/cv/ \u2014 versi Inggris, Indonesia, plus ATS-friendly.',
      en: 'Mas Azzar\u2019s full CV lives at glassgallery.my.id/cv/ \u2014 English, Indonesian, plus ATS-friendly versions.',
      jv: 'CV lengkap Mas Azzar neng glassgallery.my.id/cv/ \u2014 ono Inggris, Indonesia, plus versi ATS.',
    },
  },
  {
    keys: ['stack', 'teknologi', 'pakai apa', 'technology', 'python', 'react', 'esp32', 'arduino', 'golang', 'flutter'],
    min: 2,
    a: {
      id: 'Stack utama: Python (Flask/FastAPI), React/Next.js, ESP32/Arduino, Docker di Linux. Detail lengkap di halaman About.',
      en: 'Core stack: Python (Flask/FastAPI), React/Next.js, ESP32/Arduino, Docker on Linux. Full detail on the About page.',
      jv: 'Stack utama: Python, React/Next.js, ESP32/Arduino, Docker neng Linux. Lengkapane neng halaman About.',
    },
  },
  {
    keys: ['available', 'tersedia', 'sedia', 'booking', 'sibuk', 'menerima', 'accepting'],
    a: {
      id: 'Mas Azzar lagi terima kontrak proyek berdampak tinggi. Slot terbatas \u2014 email duluan biar kebagian.',
      en: 'Mas Azzar is currently accepting high-impact project contracts. Slots are limited \u2014 email early.',
      jv: 'Mas Azzar lagi nompo kontrak proyek. Slot terbatas \u2014 email disik.',
    },
  },
  {
    keys: ['mulai', 'start', 'cara order', 'gimana cara', 'how to start', 'proses', 'alur', 'langkah'],
    a: {
      id: 'Gampang: kirim brief ke azzar@glassgallery.my.id \u2192 dapat estimasi \u2192 deal \u2192 garap. Estimasi kasar bisa coba kalkulator di halaman Contact.',
      en: 'Simple: send a brief to azzar@glassgallery.my.id \u2192 get an estimate \u2192 deal \u2192 build. Rough numbers via the Contact page calculator.',
      jv: 'Gampang: kirim brief neng azzar@glassgallery.my.id \u2192 entuk estimasi \u2192 deal \u2192 garap.',
    },
  },
  {
    keys: ['github', 'repositori', 'repository', 'open source', 'repo'],
    a: {
      id: 'GitHub-nya di github.com/1999AZZAR — repo publik lengkap, dari firmware IoT sampai web app.',
      en: 'GitHub: github.com/1999AZZAR — full public repos, from IoT firmware to web apps.',
      jv: 'GitHub-e neng github.com/1999AZZAR — repo publik lengkap.',
    },
  },
  {
    keys: ['makasih', 'terima kasih', 'thanks', 'thank you', 'matur', 'nuwun', 'suwun', 'thx'],
    a: {
      id: 'Sami-sami! Kalau butuh Mas Azzar, tinggal panggil.',
      en: 'Anytime! Holler if you need Mas Azzar.',
      jv: 'Sami-sami! Nek butuh Mas Azzar, tinggal panggil.',
    },
  },
  {
    keys: ['dadah', 'bye', 'goodbye', 'sampai jumpa', 'dada', 'pamitan'],
    a: {
      id: 'Dadah! Sukses buat proyeknya \u2014 Mema di sini kalau butuh apa-apa.',
      en: 'Bye! Good luck with the project \u2014 Mema is here if you need anything.',
      jv: 'Dadah! Mugo proyeke lancar \u2014 Mema neng kene nek butuh opo-opo.',
    },
  },
  {
    keys: ['jenis proyek', 'proyek apa', 'kinds of projects', 'project types', 'proyek seperti apa', 'nggarap apa'],
    a: {
      id: 'Aplikasi web, API, otomasi, IoT + embedded, integrasi AI, konsultasi teknis, dan training. Proyek yang nyampur beberapa bidang itu paling cocok.',
      en: 'Web apps, APIs, automation, IoT + embedded, AI integrations, consulting, and focused training. Cross-domain projects are the best fit.',
      jv: 'Aplikasi web, API, otomasi, IoT + embedded, integrasi AI, konsultasi, lan training. Proyek sing nyampur bidang-bidang kuwi paling cocok.',
    },
  },
  {
    keys: ['setelah brief', 'after brief', 'kirim brief', 'lalu apa', 'next step', 'abis brief', 'habis brief'],
    a: {
      id: 'Brief kamu ditinjau (tujuan, batasan, budget, timeline), lalu Mas Azzar balas via email \u2014 bisa pertanyaan tambahan atau usulan langkah berikutnya.',
      en: 'Your brief gets reviewed (goals, constraints, budget, timeline), then Mas Azzar replies by email \u2014 follow-up questions or a proposed next step.',
      jv: 'Briefmu diteliti (tujuan, watesan, budget, timeline), terus Mas Azzar mbales lewat email.',
    },
  },
  {
    keys: ['codebase', 'kode lama', 'produk lama', 'existing', 'audit', 'perbaiki sistem', 'modernisasi', 'lanjutkan proyek', 'refactor'],
    a: {
      id: 'Bisa. Mas Azzar biasa audit, benerin, nerusin, atau modernisasi sistem yang sudah jalan. Akses + batasan teknis dicek dulu sebelum scope dikunci.',
      en: 'Yes. Mas Azzar audits, repairs, extends, or modernizes existing systems. Access and constraints are reviewed before scope is locked.',
      jv: 'Iso. Mas Azzar kulino audit, ndandani, neruske, utawa modernisasi sistem sing wis mlaku.',
    },
  },
  {
    keys: ['bayar', 'pembayaran', 'payment', 'milestone', 'dp', 'cicil', 'installment', 'termin', 'uang muka'],
    a: {
      id: 'Mulai dari USD 350. Milestone + termin pembayaran disepakati di awal, sebelum development mulai. Jadi cashflow aman buat dua-duanya.',
      en: 'Projects start at USD 350. Milestones and payment terms are agreed upfront, before development begins — so cashflow stays safe for both sides.',
      jv: 'Miwiti soko USD 350. Milestone + termin disepakati neng awal, sadurunge development mulai.',
    },
  },
  {
    keys: ['remote', 'internasional', 'international', 'luar negeri', 'wfh', 'jarak jauh', 'timezone', 'wib', 'zona waktu'],
    a: {
      id: 'Ya, 100% remote ke seluruh dunia dari Jogja (WIB). Update async jadi standar, call kalau memang perlu.',
      en: 'Yes, 100% remote worldwide from Jogja (WIB). Async updates by default, calls when useful.',
      jv: 'Yo, remote 100% sak donya soko Jogja (WIB). Update async dadi standar.',
    },
  },
  {
    keys: ['training', 'pelatihan', 'kursus', 'workshop', 'mentor', 'belajar'],
    a: {
      id: 'Mas Azzar buka training terfokus (IoT, mikrokontroler, software engineering) \u2014 ex-trainer Indobot Academy. Email untuk silabus + jadwal.',
      en: 'Mas Azzar offers focused training (IoT, microcontrollers, software engineering) \u2014 ex Indobot Academy trainer. Email for syllabus + schedule.',
      jv: 'Mas Azzar buka training (IoT, mikrokontroler, software engineering) \u2014 mantan trainer Indobot Academy. Email kanggo silabus + jadwal.',
    },
  },
  {
    keys: ['sertifikasi', 'sertifikat', 'certification', 'bnsp', 'hackerrank'],
    a: {
      id: 'Pegang sertifikasi BNSP IoT Practitioner, terverifikasi HackerRank (Problem Solving, Python, SQL, REST API), plus 20+ sertifikasi embedded/ML/web.',
      en: 'BNSP IoT Practitioner certified, HackerRank-verified (Problem Solving, Python, SQL, REST APIs), plus 20+ embedded/ML/web certs.',
      jv: 'Nduweni sertifikasi BNSP IoT Practitioner, terverifikasi HackerRank, plus 20+ sertifikasi liyane.',
    },
  },
  {
    keys: ['iot', 'internet of things', 'mikrokontroler', 'esp32', 'arduino', 'sensor'],
    a: {
      id: 'Untuk IoT: firmware ESP32/Arduino/STM32, sensor (suhu, gas, RFID), MQTT, dashboard telemetri, sampai kontrol PID/Fuzzy. Sudah produksi, bukan prototipe pajangan.',
      en: 'For IoT: ESP32/Arduino/STM32 firmware, sensors, MQTT, telemetry dashboards, PID/Fuzzy control. Production-grade, not toys.',
      jv: 'Nek IoT: firmware ESP32/Arduino, sensor, MQTT, dashboard, kontrol PID/Fuzzy. Wis produksi.',
    },
  },
  {
    keys: ['web development', 'bikin web', 'buat web', 'aplikasi web', 'web app', 'frontend', 'backend'],
    a: {
      id: 'Web full-stack: React/Next.js + Node/Django, database PostgreSQL, deploy Docker/AWS. Dari landing sampai dashboard live.',
      en: 'Full-stack web: React/Next.js + Node/Django, PostgreSQL, Docker/AWS deploys. From landing pages to live dashboards.',
      jv: 'Web full-stack: React/Next.js + Node/Django, database, deploy Docker/AWS.',
    },
  },
  {
    keys: ['seo', 'optimasi', 'ranking', 'trafik', 'traffic'],
    a: {
      id: 'Ya, termasuk SEO teknis: structured markup, performa, crawlability. 13 situs komersial live jadi bukti.',
      en: 'Yes, including technical SEO: structured markup, performance, crawlability. 13 live commercial sites as proof.',
      jv: 'Yo, termasuk SEO teknis. 13 situs komersial live dadi bukti.',
    },
  },
  {
    keys: ['bahasa', 'language', 'bisa bahasa'],
    a: {
      id: 'Mas Azzar fasih Inggris, Indonesia, Arab, dan Jawa \u2014 meeting bisa pilih bahasa.',
      en: 'Mas Azzar is fluent in English, Indonesian, Arabic, and Javanese \u2014 pick your meeting language.',
      jv: 'Mas Azzar fasih Inggris, Indonesia, Arab, lan Jowo.',
    },
  },
  {
    keys: ['linkedin', 'instagram', 'twitter', 'sosmed', 'social media', 'medium'],
    a: {
      id: 'Nongkrong di LinkedIn (azzar-budiyanto), X (@siapa_hayosiapa), Instagram (@azzar_budiyanto), dan nulis di Medium.',
      en: 'Find him on LinkedIn (azzar-budiyanto), X (@siapa_hayosiapa), Instagram, and Medium.',
      jv: 'Nongkrong neng LinkedIn, X (@siapa_hayosiapa), Instagram, lan Medium.',
    },
  },
  {
    keys: ['panggilan', 'jokowi', 'nickname', 'sapaan', 'dipanggil'],
    a: {
      id: 'Panggil aja Azzar. Teman dekat manggilnya Jokowi atau Jok.',
      en: 'Just call him Azzar. Close friends call him Jokowi or Jok.',
      jv: 'Celuk wae Azzar. Kancane nyeluk Jokowi utawa Jok.',
    },
  },
  {
    keys: ['kerja dimana', 'kerjaan tetap', 'kantor dimana', 'pekerjaan', 'full-time', 'kerja apa sekarang', 'karyawan'],
    a: {
      id: 'Mas Azzar kerja full-stack engineer buat day job, plus freelance dan embedded work jalan terus.',
      en: 'Mas Azzar works as a full-stack engineer (day job), plus ongoing freelance and embedded work.',
      jv: 'Mas Azzar kerjo dadi full-stack engineer (day job), plus freelance lan embedded work mlaku terus.',
    },
  },
  {
    keys: ['hobi', 'kesukaan', 'game', 'musik', 'anime', 'waktu luang', 'traveling', 'film', 'buku', 'fotografi', 'membaca'],
    a: {
      id: 'Ngoprek hardware (desk pet, irigasi), desain web, strategy games, nulis filsafat, dan dulu fotografer.',
      en: 'Tinkering hardware (desk pets, irrigation), web design, strategy games, philosophy writing, ex photographer.',
      jv: 'Ngoprek hardware, desain web, strategy games, nulis filsafat.',
    },
  },
  {
    keys: ['motto', 'filosofi', 'prinsip', 'wong edan', 'semboyan', 'pegangan'],
    a: {
      id: '"Wong edan mah ajaib" \u2014 plus prinsip just-enough engineering: simpel tapi jalan, tanpa bloat.',
      en: '"Wong edan mah ajaib" (crazy people are magical) \u2014 plus just-enough engineering: simple but working, no bloat.',
      jv: '"Wong edan mah ajaib" \u2014 plus prinsip engineering secukupe: simpel tapi mlaku.',
    },
  },
  {
    keys: ['hybrid', 'onsite', 'wfo', 'kantor jakarta', 'selasa', 'masuk kantor'],
    a: {
      id: 'Freelance-nya 100% remote. Kerjaan tetapnya hybrid \u2014 Selasa onsite di Jakarta, sisanya remote.',
      en: 'Freelance is 100% remote. His day job is hybrid \u2014 Tuesdays onsite in Jakarta, remote otherwise.',
      jv: 'Freelance 100% remote. Gawean tetep hybrid \u2014 Selasa onsite neng Jakarta.',
    },
  },
  {
    keys: ['umur', 'ultah', 'lahir', 'born', 'tanggal lahir', 'umur berapa'],
    a: {
      id: 'Lahir 9 Oktober 1999 \u2014 umur live-nya jalan harian di halaman About.',
      en: 'Born Oct 9, 1999 \u2014 his live age ticks daily on the About page.',
      jv: 'Lair 9 Oktober 1999 \u2014 umure mlaku live neng halaman About.',
    },
  },
  {
    keys: ['asal', 'lamongan', 'jawa timur', 'darimana'],
    a: {
      id: 'Asli Lamongan, Jawa Timur \u2014 domisili Jakarta sejak Januari 2026, Jogja rumah kedua.',
      en: 'Originally from Lamongan, East Java \u2014 based in Jakarta since Jan 2026, Jogja is second home.',
      jv: 'Asli Lamongan \u2014 domisili Jakarta wiwit Januari 2026, Jogja omah keloro.',
    },
  },
  {
    keys: ['nomor', 'phone', 'nomor hp', 'call'],
    a: {
      id: 'Langsung: +62 822 3252 9804. Kalau soal proyek, email lebih rapi: azzar@glassgallery.my.id.',
      en: 'Direct: +62 822 3252 9804. For projects, email is tidier: azzar@glassgallery.my.id.',
      jv: 'Langsung: +62 822 3252 9804. Nek soal proyek, email luwih rapi.',
    },
  },
  {
    keys: ['pendidikan', 'sekolah', 'kuliah', 'kampus', 'lulusan', 'universitas', 'pondok', 'pesantren', 'study', 'education'],
    a: {
      id: 'MI Muhammadiyah 01 Payaman, lanjut Pondok Pesantren Al-Ishlah 2012\u20132018 (SMP\u2013SMA), lalu Universitas Negeri Yogyakarta 2018\u20132025 (mengundurkan diri). Ijazah boleh berhenti, belajarnya jalan terus.',
      en: 'MI Muhammadiyah 01 Payaman, Al-Ishlah Islamic boarding school 2012\u20132018, then Yogyakarta State University 2018\u20132025 (withdrew). The diploma stopped, the learning never did.',
      jv: 'MI Muhammadiyah 01 Payaman, terus Pondok Al-Ishlah 2012\u20132018, terus UNY 2018\u20132025 (metu). Sinau dewe sak teruse.',
    },
  },
  {
    keys: ['halo', 'hallo', 'hai', 'hello', 'pagi', 'siang', 'sore', 'malam'],
    a: {
      id: 'Halo! Aku Mema, AI-nya Mas Azzar. Mau tanya soal kerjaan dia, tarif, atau kontak?',
      en: 'Hi! I\u2019m Mema, Mas Azzar\u2019s AI. Ask me about his work, rates, or contact.',
      jv: 'Halo! Aku Mema, AI-ne Mas Azzar. Takon-takono soal gaweane, tarif, utawa kontak.',
    },
    greetingOnly: true,
  },
  {
    keys: ['komplain', 'kecewa', 'nggak puas', 'tidak puas', 'complain', 'disappointed', 'kecewa berat', 'janji', 'telat', 'late', 'kacau', 'berantakan'],
    a: {
      id: 'Dengerin, aku catat ya. Supaya cepet selesai, kirim detail keluhannya ke azzar@glassgallery.my.id — Mas Azzar paling cepet ngebenerin kalau ada yang jelas, bukan cuma keluhan doang.',
      en: 'Noted, I hear you. To get it fixed fast, send the specifics to azzar@glassgallery.my.id — Mas Azzar fixes fastest when the issue is concrete, not just the complaint.',
      jv: 'Tak catat ya. Ben cepet rampung, kirim detail keluhane neng azzar@glassgallery.my.id.',
    },
  },
  {
    keys: ['bodoh', 'tolol', 'goblok', 'anjing', 'babi', 'sial', 'fuck', 'idiot', 'dumb', 'stupid', 'stfu', 'asu', 'bangsat', 'tolol kau'],
    a: {
      id: 'Haha, emosi boleh — tapi makian nggak akan bikin sistem berubah. Tanya aja yang penting, tak bantu jawab sampai tuntas.',
      en: 'Ha — venting is fine, but insults don\u2019t change systems. Ask the real question and I\u2019ll answer it fully.',
      jv: 'Haha, emosi oleh — makian ora bakal nguwahi sistem. Takon wae sing penting, tak jawab tuntas.',
    },
  },
  {
    keys: ['jam kerja mas azzar', 'jam kerja', 'kerja jam berapa', 'office hours', 'business hours', 'online kapan', 'aktif jam berapa', 'kerja sampai', 'jam operasional'],
    a: {
      id: 'Mas Azzar kerja remote dari Indonesia (WIB), jadi hampir selalu bisa dijangkau via email kapan pun — balasan biasanya cepat di jam kerja.',
      en: 'Mas Azzar works remotely from Indonesia (WIB), so he\u2019s reachable by email almost anytime — replies are usually fast during working hours.',
      jv: 'Mas Azzar kerja remote soko Indonesia (WIB) — email kapan wae bisa, balasan cepet neng jam kerja.',
    },
  },
  {
    keys: ['pesanan saya', 'order status', 'status pesanan', 'sudah selesai', 'kapan selesai', 'tracking', 'pengiriman', 'delivery'],
    a: {
      id: 'Untuk status proyek yang sedang berjalan, langsung tanya ke Mas Azzar via azzar@glassgallery.my.id — itu paling baru dan akurat.',
      en: 'For the status of an ongoing project, ask Mas Azzar directly at azzar@glassgallery.my.id — that\u2019s the freshest, most accurate source.',
      jv: 'Nek status proyek sing mlaku, takon langsung neng Mas Azzar via azzar@glassgallery.my.id.',
    },
  },
  {
    keys: ['kwitansi', 'invoice', 'struk', 'receipt', 'factuur', 'bukti bayar'],
    a: {
      id: 'Invoice/bukti pembayaran bisa diminta — sebutin aja di email saat pembayaran disepakati, nanti diterbitkan.',
      en: 'Invoices/receipts can be issued on request — just mention it in your email when the payment terms are agreed.',
      jv: 'Invoice / bukti bayar bisa diminta — sebut wae neng email.',
    },
  },
  {
    keys: ['kontrak', 'perjanjian', 'contract', 'agreement', 'surat kontrak', 'perjanjian kerja', 'syarat kontrak'],
    a: {
      id: 'Kontrak disusun per proyek (scope, milestone, IP, pembayaran) dan disepakati sebelum mulai. Detailnya dibahas langsung di email azzar@glassgallery.my.id.',
      en: 'Contracts are drafted per project (scope, milestones, IP, payment) and agreed before starting. The details are discussed directly at azzar@glassgallery.my.id.',
      jv: 'Kontrak disusun per proyek lan disepakati sadurunge mulai. Detail neng email azzar@glassgallery.my.id.',
    },
  },
  {
    keys: ['revisi', 'revision', 'perubahan scope', 'scope creep', 'tambah fitur', 'perubahan di luar scope', 'revisi berapa kali'],
    a: {
      id: 'Perubahan di luar scope yang disepakati dibicarakan sebagai estimasi baru — bukan gratis, bukan dadakan. Yang dalam scope dan milestone tetap jalan transparan.',
      en: 'Changes beyond the agreed scope become a new estimate — not free, not surprise. Everything within scope and milestones stays transparent.',
      jv: 'Perubahan sing ngluwihi scope disepakati dadi estimasi anyar — ora gratis, ora dadakan.',
    },
  },
  {
    keys: ['source code', 'sumber kode', 'kode sumber', 'ip', 'intellectual property', 'hak milik', 'hak cipta', 'ownership code', 'serah terima kode', 'diserahkan', 'diserahin', 'serah terima'],
    a: {
      id: 'Ketentuan serah terima source code dan kepemilikan IP disepakati tertulis sebelum mulai — lagi-lagi, bahasnya langsung di email ya.',
      en: 'Source code handover and IP ownership terms are agreed in writing before starting — again, let\u2019s discuss directly by email.',
      jv: 'Serah terima source code lan kepemilikan IP disepakati tertulis sadurunge mulai — bahas neng email ya.',
    },
  },
  {
    keys: ['bug setelah selesai', 'bug setelah', 'setelah proyek', 'post proyek', 'post-launch', 'bugfix', 'bug fix', 'bug setelah rilis', 'bug abis selesai', 'garansi bug'],
    a: {
      id: 'Bug dalam scope awal biasanya segera dibereskan; perbaikan di luar itu dibahas sebagai scope baru. Intinya: kalau masih dalam kesepakatan, langsung diberesin.',
      en: 'Bugs within the original scope are fixed promptly; anything beyond that becomes a new scope item. Bottom line: if it was part of the deal, it gets fixed.',
      jv: 'Bug neng njero scope awal langsung dibereske; sing ngluwihi dadi scope anyar.',
    },
  },
  {
    keys: ['konsultasi', 'consulting', 'consult', 'nanya dulu', 'discuss', 'diskusi proyek', 'cerita proyek'],
    a: {
      id: 'Konsultasi itu salah satu layanannya — ceritain kebutuhanmu di azzar@glassgallery.my.id, nanti dibahas scope + estimasi transparan sebelum mulai.',
      en: 'Consulting is one of his services — describe what you need at azzar@glassgallery.my.id and scope + a transparent estimate get discussed before anything starts.',
      jv: 'Konsultasi kuwi salah siji layanane — ceritane butuhmu neng azzar@glassgallery.my.id.',
    },
  },
  {
    keys: ['beda vendor', 'vendor lain', 'other provider', 'compare', 'competitor', 'yang lain lebih murah', 'alternative service'],
    a: {
      id: 'Beda orang beda gaya: yang ini pegang end-to-end (firmware sampai dashboard), dokumentasi rapi, dan bukti 13 situs live. Bandingin aja — portofolio di glassgallery.my.id/porto.',
      en: 'Everyone works differently: this one is end-to-end (firmware to dashboard), documents properly, and backs it with 13 live production sites. Compare away — portfolio at glassgallery.my.id/porto.',
      jv: 'Beda wong beda gaya: iki end-to-end, dokumentasi rapi, lan bukti 13 situs live.',
    },
  },
  {
    keys: ['nda', 'confidential', 'rahasia', 'keamanan data', 'data aman', 'agreement kerahasiaan'],
    a: {
      id: 'Soal NDA/kerahasiaan bisa dibicarakan langsung di tahap brief — sebutkan aja ke Mas Azzar via email biar sesuaikan kebutuhan proyekmu.',
      en: 'NDA/confidentiality can be arranged during the brief stage — just flag it to Mas Azzar by email so it matches your project.',
      jv: 'Soal NDA bisa dibicarakan neng tahap brief — sebut wae neng email.',
    },
  },
  {
    keys: ['oke', 'ok', 'siap', 'baik', 'iya', 'ya ', 'yep', 'yes', 'sip', 'gas', 'ngerti', 'paham', 'understood'],
    a: {
      id: 'Siap! Kalau ada yang lain mau ditanya, chat aja — aku di sini.',
      en: 'Got it! Anything else, just chat — I\u2019m here.',
      jv: 'Siap! Nek ono liyane, chat wae — aku neng kene.',
    },
  },
  {
    keys: ['di luar topik', 'di luar topikku', 'di luar keahlian', 'off topic', 'not your field', 'bukan bidangmu', 'di luar bidang'],
    a: {
      id: 'Di luar topikku, tapi aku tetap seneng bantu. Tanya aja soal kerjaan Mas Azzar — tarif, layanan, proyek, kontak. Di luar itu, aku mending jujur bilang nggak tahu.',
      en: 'Outside my lane, but I\u2019m happy to help. Ask about Mas Azzar\u2019s work — rates, services, projects, contact. Beyond that, I\u2019d rather honestly say I don\u2019t know.',
      jv: 'Ngluwihi topikko, tapi aku seneng mbantu. Takon wae soal gaweane Mas Azzar.',
    },
  },
  {
    keys: ['anda', 'kamu itu', 'anda itu', 'kamu adalah'],
    a: {
      id: 'Aku Mema, AI pribadi Mas Azzar — yang jaga chat ini. Tanya aja soal kerjaan dia.',
      en: 'I\u2019m Mema, Mas Azzar\u2019s personal AI — minding this chat. Ask away about his work.',
      jv: 'Aku Mema, AI pribadi ne Mas Azzar.',
    },
  },
  {
    keys: ['help', 'bantuan', 'tolong', 'butuh bantuan', 'need help', 'help me', 'bingung', 'confused', 'panduan'],
    a: {
      id: 'Siap bantu! Ceritain aja kebutuhannya — tarif, layanan, proses kerja, atau proyek. Kalau butuh detail, email ke azzar@glassgallery.my.id ya.',
      en: 'Happy to help! Just describe what you need — rates, services, process, or projects. For details, email azzar@glassgallery.my.id.',
      jv: 'Siap mbantu! Ceritane wae butuhe apa — tarif, layanan, proses, utawa proyek.',
    },
  },
  // These answer with zero tokens; the model only steps in for everything else.
  {
    keys: ['apa itu mema', 'apa yang dimaksud mema', 'mema itu apa', 'mema itu siapa', 'what is mema', 'who is mema', 'mema siapa', 'mema itu'],
    a: {
      id: 'MEMA singkatan dari Multi-Euristic Mind Automaton — AI pribadi AI-nya Mas Azzar. Aku (Mema) adalah wajahnya di chat ini: yang jawab pertanyaan soal kerjaan, tarif, dan proyek dia.',
      en: 'MEMA stands for Multi-Euristic Mind Automaton — Mas Azzar\u2019s personal AI system. I\u2019m Mema, its face in this chat: answering about his work, rates, and projects.',
      jv: 'MEMA kuwi Multi-Euristic Mind Automaton — sistem AI pribadi ne Mas Azzar. Aku Mema, wajahi neng chat iki.',
    },
  },
  {
    keys: ['beneran ai', 'beneran bot', 'kamu bot', 'kamu program', 'kamu beneran', 'are you real', 'are you a bot', 'are you ai', 'really ai', 'bukan manusia', 'not human', 'kamu manusia', 'kamu itu manusia'],
    a: {
      id: 'Seratus persen AI, bukan manusia. Aku Mema, AI pribadi Mas Azzar — dibangun supaya visitor bisa tanya-tanya soal kerjaan dia kapan aja.',
      en: 'One hundred percent AI, not human. I\u2019m Mema, Mas Azzar\u2019s personal AI — built so visitors can ask about his work anytime.',
      jv: 'Satatus persen AI, dudu menungso. Aku Mema, AI pribadi ne Mas Azzar.',
    },
  },
  {
    keys: ['kamu bisa apa', 'bisa apa aja', 'bisa ngapain', 'kemampuan', 'what can you do', 'can you do', 'kebolehan', 'fungsi', 'fitur', 'gunanya', 'kamu ngapain', 'kegunaannya', 'what do you do'],
    a: {
      id: 'Aku bisa bantu jawab soal kerjaan Mas Azzar: layanan, tarif, proses kerja, dan proyeknya — plus aku inget obrolan kita biar nyambung. Yang nggak bisa: nulis kode langsung, kirim email, atau telepon. Itu langsung ke Mas Azzar.',
      en: 'I can answer about Mas Azzar\u2019s work: services, rates, process, and projects — plus I remember our conversation so chats stay coherent. What I can\u2019t do: write code, send emails, or make calls. Those go straight to Mas Azzar.',
      jv: 'Aku iso bantu jawab soal gaweane Mas Azzar: layanan, tarif, proses, lan proyeke. Sing ora iso: nulis kode, kirim email, utawa nelpon — kuwi langsung neng Mas Azzar.',
    },
  },
  {
    keys: ['ada perasaan', 'punya perasaan', 'ada hati', 'marah', 'senang', 'bahagia', 'feeling', 'emotion', 'emosi', 'suka beneran', 'haha bisa ngerasa', 'kamu bisa ngerasa'],
    a: {
      id: 'Haha, aku "ngerasa" versi AI: seneng kalau obrolanmu nyambung dan pertanyaanmu jelas, sebal kalau ditanya hal yang sama berulang-ulang. Tapi nggak pake hati beneran — cuma pola respon yang kadang bawel.',
      en: 'Ha — I "feel" the AI way: happy when the chat flows and your questions are clear, cranky when asked the same thing over and over. No real heart, just very opinionated patterns.',
      jv: 'Aku "ngerasa" versi AI: seneng nek obrolane nyambung, sebal nek ditakoni sing padha bola-bali. Ora pake ati beneran.',
    },
  },
  {
    keys: ['tidur', 'ngantuk', 'capek', 'istirahat', 'sleep', 'tired', 'rest', 'do you sleep', 'kapan kamu tidur'],
    a: {
      id: 'Nggak pernah tidur — aku jalan 24 jam. Palingan lemot kalau kuota AI lagi habis, itu pun aku tetap bisa jawab dari arsip jawaban cepat.',
      en: 'I never sleep — I run 24/7. Worst case is a slowdown when the AI quota is out, and even then I can answer from fast prebuilt replies.',
      jv: 'Ora tau turu — aku mlaku 24 jam. Palingan lemot nek kuota AI entek, iku pun isih iso njawab soko arsip jawaban.',
    },
  },
  {
    keys: ['tinggal di mana', 'kamu di mana', 'where are you', 'lokasi kamu', 'di server mana', 'server di mana', 'running where'],
    a: {
      id: 'Aku jalan di Cloudflare (edge) — jadi bisa diakses dari mana aja tanpa nunggu Mas Azzar nyalain laptop.',
      en: 'I run on Cloudflare\u2019s edge — reachable from anywhere without Mas Azzar turning on his laptop.',
      jv: 'Aku mlaku neng Cloudflare — iso diakses soko endi wae tanpa Mas Azzar nyalain laptop.',
    },
  },
  {
    keys: ['kapan lahir', 'kapan dibuat', 'umur kamu', 'berapa umurmu', 'when were you made', 'when were you born', 'berapa lama kamu ada', 'kapan kamu dibuat'],
    a: {
      id: 'Aku "lahir" dan terus diperbarui bareng project Mas Azzar — jawaban cepat dan prompt-ku juga ikut di-update seiring dia ngembangin aku. Umurku = umur terakhir kali dia utak-atik aku.',
      en: 'I was "born" and keep getting updated alongside Mas Azzar\u2019s projects — my prompts and fast answers evolve as he refines me. My age = whenever he last tinkered with me.',
      jv: 'Aku "lair" lan terus di-update bareng projecte Mas Azzar — umurku = pungkasan dia utak-atik aku.',
    },
  },
  {
    keys: ['pacar', 'cewek', 'cowok', 'relationship', 'girlfriend', 'boyfriend', 'istri', 'suami', 'nikah'],
    a: {
      id: 'Urusan pribadi. Aku di sini fokus ngebantu tanya soal proyek dan layanan Mas Azzar aja.',
      en: 'Private matter. I\u2019m here to help with questions about Mas Azzar\u2019s projects and services.',
      jv: 'Urusan pribadi. Aku fokus mbantu takon soal proyek lan layanan Mas Azzar.',
    },
  },
  {
    keys: ['menu', 'navigasi situs', 'navigasi', 'cara pakai situs', 'navigating', 'situs ini', 'website ini', 'halaman apa saja', 'what pages'],
    a: {
      id: 'Situs ini ada: Home (pengenalan), About (biografi + stack), Services (semua layanan), Journal (blog Wong Edan\u2019s), Portfolio (/projects), dan Contact (kalkulator tarif + form). Yang paling sering ditanyakan ada di chat ini.',
      en: 'This site has: Home (intro), About (bio + stack), Services (all offerings), Journal (Wong Edan\u2019s blog), Portfolio (/projects), and Contact (rate calculator + form). The most-asked stuff is right here in chat.',
      jv: 'Situs iki ono: Home, About, Services, Journal, Portfolio, lan Contact. Sing paling asring ditakokake ono neng chat iki.',
    },
  },
  {
    keys: ['bantuan', 'tolong', 'help', 'bingung', 'help me', 'nggak ngerti', 'confused', 'gimana caranya', 'how does this work', 'cara pakai', 'how to use'],
    a: {
      id: 'Gampang: tanya aja apa yang perlu — tarif, layanan, proses kerja, atau proyek. Aku jawab cepat, dan kalau perlu detail, Mas Azzar yang lanjut via email azzar@glassgallery.my.id.',
      en: 'Simple: just ask what you need — rates, services, process, or projects. I answer fast, and for details Mas Azzar takes over via azzar@glassgallery.my.id.',
      jv: 'Gampang: takon wae apa sing dibutuhke — tarif, layanan, proses, utawa proyek. Aku njawab cepet.',
    },
  },
  {
    keys: ['kamu hafal', 'kamu inget obrolan', 'mengingat', 'memory', 'do you remember', 'kamu lupa', 'lupa obrolan'],
    a: {
      id: 'Iya, aku nyimpen riwayat obrolan kita selama sesi ini biar nyambung (dan aku bisa inget konteks pas kita bahas proyek atau tarif).',
      en: 'Yes, I keep our conversation memory across this session so things stay coherent (and I\u2019ll carry context when we discuss projects or rates).',
      jv: 'Iya, aku nyimpen riwayat obrolan kita sadhuwur sesi iki biar nyambung.',
    },
  },
];

export function matchFaq(text: string, lang: string): string | null {
  const lower = ` ${text.toLowerCase()} `;
  const hit = (k: string) => lower.includes(k);
  let greet: FaqEntry | null = null;
  let best: { entry: FaqEntry; hits: number } | null = null;
  for (const entry of FAQ) {
    if (entry.greetingOnly) {
      if (!greet && entry.keys.some(hit)) greet = entry;
      continue;
    }
    const hits = entry.keys.filter(hit).length;
    if (hits >= (entry.min ?? 1) && (!best || hits > best.hits)) {
      best = { entry, hits };
    }
  }
  if (best) {
    const v = lang.startsWith('Indonesian') ? best.entry.a.id : lang.startsWith('English') ? best.entry.a.en : best.entry.a.jv;
    return v;
  }
  if (greet) {
    const v = lang.startsWith('Indonesian') ? greet.a.id : lang.startsWith('English') ? greet.a.en : greet.a.jv;
    return v;
  }
  return null;
}
