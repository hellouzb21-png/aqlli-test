// Question bank — 100+ savol, 10 mavzu, 3 daraja
// Format: {q, opts, correct, topic, difficulty: 1|2|3, explain}

window.QUESTION_BANK = [
  // ═════════ ALGORITMLAR ═════════
  { q: "Binary search vaqt murakkabligi?", opts: ["O(n)", "O(log n)", "O(n\u00b2)", "O(1)"], correct: 1, topic: "algo", difficulty: 1, explain: "Har bosqichda ma'lumotni yarmiga bo'ladi." },
  { q: "Qaysi saralash o'rtacha O(n log n)?", opts: ["Bubble", "Merge Sort", "Selection", "Insertion"], correct: 1, topic: "algo", difficulty: 1, explain: "Merge Sort doimiy O(n log n)." },
  { q: "Hash collision hal qilish usuli EMAS:", opts: ["Chaining", "Open addressing", "Linear probing", "Binary rotation"], correct: 3, topic: "algo", difficulty: 2, explain: "'Binary rotation' mavjud emas." },
  { q: "Dijkstra qaysi graf'da ishlamaydi?", opts: ["Weighted", "Directed", "Negative weights", "Undirected"], correct: 2, topic: "algo", difficulty: 3, explain: "Salbiy og'irliklar Bellman-Ford talab qiladi." },
  { q: "Nested loop + binary search:", opts: ["O(n)", "O(n log n)", "O(n\u00b2)", "O(log\u00b2 n)"], correct: 1, topic: "algo", difficulty: 2, explain: "O(n) \u00d7 O(log n) = O(n log n)." },
  { q: "Stack qanday ishlaydi?", opts: ["FIFO", "LIFO", "Priority", "Random"], correct: 1, topic: "algo", difficulty: 1, explain: "Last In First Out." },
  { q: "Recursion stack overflow sababi?", opts: ["TCO bilan", "Base case yo'q", "Iterative loop", "Hash table"], correct: 1, topic: "algo", difficulty: 2, explain: "Base case'ga yetilmasa — cheksiz." },
  { q: "Queue qaysi printsip?", opts: ["FIFO", "LIFO", "LRU", "Random"], correct: 0, topic: "algo", difficulty: 1, explain: "First In First Out." },
  { q: "Heap sort murakkabligi?", opts: ["O(n)", "O(n log n)", "O(n\u00b2)", "O(log n)"], correct: 1, topic: "algo", difficulty: 2, explain: "Heap sort doimiy O(n log n)." },
  { q: "BFS vs DFS — qaysi stack ishlatadi?", opts: ["BFS", "DFS", "Ikkalasi", "Hech qaysi"], correct: 1, topic: "algo", difficulty: 2, explain: "DFS — stack (yoki recursion). BFS — queue." },
  { q: "Dynamic Programming asosiy g'oyasi?", opts: ["Random", "Overlapping subproblems + memoization", "Sorting", "Graph traversal"], correct: 1, topic: "algo", difficulty: 3, explain: "DP = qaytariluvchi kichik muammolarni saqlash." },
  { q: "Greedy algoritm nima qiladi?", opts: ["Global optimum kafolatlaydi", "Har qadamda lokal optimal tanlov", "Faqat graflar uchun", "Exponensial"], correct: 1, topic: "algo", difficulty: 2, explain: "Har qadamda lokal optimal — global optimum kafolatlanmaydi." },

  // ═════════ SQL / DB ═════════
  { q: "TRUNCATE vs DELETE:", opts: ["Farq yo'q", "TRUNCATE tez, rollback cheklangan", "DELETE jadvalni o'chiradi", "TRUNCATE faqat MSSQL"], correct: 1, topic: "sql", difficulty: 2, explain: "TRUNCATE DDL — tez, lekin rollback cheklangan." },
  { q: "INNER JOIN natijasi?", opts: ["Chap jadval", "Ikki jadvalda mos keladigan satrlar", "Hamma satrlar", "Faqat NULL'siz"], correct: 1, topic: "sql", difficulty: 1, explain: "Mos keladigan satrlar qaytariladi." },
  { q: "Index qaysini tezlashtiradi?", opts: ["INSERT", "UPDATE", "SELECT WHERE", "DELETE"], correct: 2, topic: "sql", difficulty: 1, explain: "SELECT tez. Boshqalarni sekinlashtiradi." },
  { q: "ACID'dagi D:", opts: ["Distributed", "Durability", "Dynamic", "Deferred"], correct: 1, topic: "sql", difficulty: 2, explain: "Durability — commit'dan keyin doimiy saqlanadi." },
  { q: "NULL tekshirish:", opts: ["= NULL", "== NULL", "IS NULL", "NULL()"], correct: 2, topic: "sql", difficulty: 1, explain: "Faqat IS NULL / IS NOT NULL." },
  { q: "N+1 query problem qayerda?", opts: ["Raw SQL", "ORM lazy loading", "Index yo'q", "Transaction"], correct: 1, topic: "sql", difficulty: 3, explain: "ORM'da alohida query — N+1." },
  { q: "LEFT JOIN qanday ishlaydi?", opts: ["Chap jadvalning barcha satrlari + mos o'ngdagi", "Faqat ikkita mos satr", "O'ng jadvaldan hammasi", "Random"], correct: 0, topic: "sql", difficulty: 2, explain: "Chap jadvaldagi barcha + mos keladigan o'ngdagi." },
  { q: "GROUP BY nimaga ishlatiladi?", opts: ["Saralash", "Agregat funksiyalar bilan guruhlash", "Filtrlash", "Jadval yaratish"], correct: 1, topic: "sql", difficulty: 1, explain: "Natijani guruhlash — ko'pincha COUNT/SUM/AVG bilan." },
  { q: "Transaction isolation level — Read Uncommitted muammosi?", opts: ["Tez", "Dirty reads mumkin", "Boshqa bazalar bilan ishlamaydi", "NULL'lar yo'qoladi"], correct: 1, topic: "sql", difficulty: 3, explain: "Boshqa tranzaksiyaning commit qilmagan o'zgarishlari ko'rinadi." },
  { q: "PRIMARY KEY xususiyati?", opts: ["NULL bo'lishi mumkin", "Har doim unique va NOT NULL", "Faqat string", "Bir nechta bo'la oladi jadvalda"], correct: 1, topic: "sql", difficulty: 1, explain: "Unique + NOT NULL. Jadvalda faqat bitta." },
  { q: "Normalization nima uchun kerak?", opts: ["Tezlik", "Redundantlikni kamaytirish + integrity", "Faqat hajm uchun", "Security"], correct: 1, topic: "sql", difficulty: 2, explain: "Redundant ma'lumotni kamaytirish + update anomaliyalardan saqlash." },

  // ═════════ GIT ═════════
  { q: "Oxirgi commit xabarini o'zgartirish:", opts: ["git commit --amend", "git commit --edit", "git rebase", "git push -f"], correct: 0, topic: "git", difficulty: 1, explain: "git commit --amend." },
  { q: "git pull = ?", opts: ["fetch + merge", "clone + checkout", "add + commit", "push reverse"], correct: 0, topic: "git", difficulty: 1, explain: "git fetch + git merge." },
  { q: "Merge conflict natijasi?", opts: ["Linear history", "Merge commit (2 parent)", "Yangi branch", "Hech narsa"], correct: 1, topic: "git", difficulty: 2, explain: "2 parent'li merge commit." },
  { q: "rebase vs merge:", opts: ["Rebase tezroq", "Rebase linear history, merge strukturani saqlaydi", "Merge local", "Farq yo'q"], correct: 1, topic: "git", difficulty: 3, explain: "Rebase commits qayta yozadi." },
  { q: "Local o'zgarishlarni tashlash:", opts: ["git reset --hard origin/master", "git pull --force", "git commit --cancel", "git undo"], correct: 0, topic: "git", difficulty: 2, explain: "Ogoh: work yo'qoladi." },
  { q: "git stash nima uchun?", opts: ["Branch o'chirish", "WIP'ni vaqtincha saqlash", "Push", "History tozalash"], correct: 1, topic: "git", difficulty: 1, explain: "Work-in-progress'ni olib turish." },
  { q: "git cherry-pick nimaga kerak?", opts: ["Bitta commit'ni boshqa branch'ga o'tkazish", "Barcha branch'larni birlashtirish", "Eski commit'lar o'chirish", "Remote qo'shish"], correct: 0, topic: "git", difficulty: 2, explain: "Tanlangan bitta (yoki bir necha) commit'ni boshqa branch'ga olib o'tish." },
  { q: "HEAD nimani bildiradi?", opts: ["Oxirgi fayl", "Joriy branch'ning oxirgi commit'iga ishora", "Remote URL", "Staging area"], correct: 1, topic: "git", difficulty: 1, explain: "HEAD — joriy commit'ga pointer." },
  { q: "Detached HEAD qachon?", opts: ["Commit hash'ga checkout qilganda", "Branch'da ishlayotganda", "Git init'dan keyin", "Hech qachon"], correct: 0, topic: "git", difficulty: 2, explain: "Commit hash yoki tag'ga checkout — branch emas, detached." },
  { q: "force push qachon xavfli?", opts: ["Hech qachon", "Shared branch'da history qayta yozadi", "Faqat privat repo'da", "Merge bilan"], correct: 1, topic: "git", difficulty: 3, explain: "Boshqalarning ishini yo'q qilishi mumkin." },

  // ═════════ C TILI ═════════
  { q: "int *p[10]; — bu:", opts: ["10 pointer array", "10 int'ga pointer", "Pointer to array[10]", "Xato"], correct: 0, topic: "c", difficulty: 2, explain: "10 ta int pointer massivi." },
  { q: "malloc() xato bo'lsa?", opts: ["-1", "0", "NULL", "errno"], correct: 2, topic: "c", difficulty: 1, explain: "NULL. Tekshirish shart." },
  { q: "sizeof(int) standart?", opts: ["Har doim 4", "Har doim 8", "Platformaga bog'liq", "2"], correct: 2, topic: "c", difficulty: 2, explain: "Platformaga bog'liq." },
  { q: "static global farqi?", opts: ["Kompilyatsiya tezroq", "Fayldan tashqari ko'rinmaydi", "Xotira joylashuvi", "const shart"], correct: 1, topic: "c", difficulty: 2, explain: "Internal linkage." },
  { q: "Dangling pointer:", opts: ["NULL", "Init bo'lmagan", "free() qilingan xotiraga pointer", "const"], correct: 2, topic: "c", difficulty: 2, explain: "free() keyin saqlangan pointer." },
  { q: "int arr[] vs int *arr (param):", opts: ["Farq yo'q", "arr[] tez", "*arr NULL mumkin", "arr[] stack"], correct: 0, topic: "c", difficulty: 2, explain: "Parametrda ikkalasi ham pointer." },
  { q: "memcpy vs memmove:", opts: ["Farq yo'q", "memmove overlap-safe", "memcpy string uchun", "memmove eskirgan"], correct: 1, topic: "c", difficulty: 3, explain: "memmove overlapping mintaqada ham ishlaydi." },
  { q: "struct packing nima?", opts: ["Compiler xotira hizalanish", "Ma'lumotni shifrlash", "Optimizatsiya flag", "POSIX standard"], correct: 0, topic: "c", difficulty: 3, explain: "Padding qo'shilishi — alignment uchun." },
  { q: "const char *p va char *const p:", opts: ["Farq yo'q", "Birinchi — data const, ikkinchi — pointer const", "Ikkalasi ham o'zgarmas", "Kompilyator xatosi"], correct: 1, topic: "c", difficulty: 3, explain: "const char *p — ma'lumot o'zgarmas. char *const p — pointer o'zgarmas." },
  { q: "volatile kalit so'zi qachon kerak?", opts: ["Tezroq kod uchun", "Optimizatsiyaga qarshi (hardware registers, signals)", "Xavfsizlik uchun", "Multi-threading"], correct: 1, topic: "c", difficulty: 3, explain: "Compiler optimizatsiyalarini cheklash — external source o'zgartirishi mumkin." },

  // ═════════ WEB / API ═════════
  { q: "POST vs PUT:", opts: ["POST tez", "PUT idempotent", "POST JSON uchun", "Farq yo'q"], correct: 1, topic: "web", difficulty: 2, explain: "PUT bir xil so'rov natija o'zgartirmaydi." },
  { q: "CORS qisqartmasi:", opts: ["Content Origin", "Cross-Origin Resource Sharing", "CSS Oriented", "Client-Origin"], correct: 1, topic: "web", difficulty: 1, explain: "Bir domen boshqasidan resource." },
  { q: "HTTP 401 vs 403:", opts: ["Farq yo'q", "401=auth kerak, 403=ruxsat yo'q", "401 server", "403 eski"], correct: 1, topic: "web", difficulty: 2, explain: "401 noma'lum. 403 ma'lum lekin ruxsat yo'q." },
  { q: "JWT qismlari:", opts: ["Header.Payload.Signature", "Public.Private.Secret", "User.Data.Hash", "Name.Email"], correct: 0, topic: "web", difficulty: 2, explain: "base64 bilan 3 qism." },
  { q: "WebSocket afzalligi:", opts: ["Tezroq", "Persistent full-duplex", "Xavfsizroq", "Farq yo'q"], correct: 1, topic: "web", difficulty: 3, explain: "Ochiq connection, ikki tomonlama." },
  { q: "CDN vazifasi:", opts: ["DB", "Edge serverlar — latency", "IDE", "Deploy"], correct: 1, topic: "web", difficulty: 1, explain: "Foydalanuvchiga yaqin yetkazib berish." },
  { q: "GraphQL vs REST asosiy farq?", opts: ["Bir xil", "GraphQL — client kerak ma'lumotni so'raydi", "REST eskirgan", "GraphQL faqat React"], correct: 1, topic: "web", difficulty: 3, explain: "Client aynan nima kerakligini belgilaydi — over-fetch yo'q." },
  { q: "HTTPS nima qo'shadi HTTP'ga?", opts: ["Tezlik", "TLS/SSL shifrlash", "Yangi metodlar", "JSON qo'llab-quvvatlash"], correct: 1, topic: "web", difficulty: 1, explain: "TLS — ma'lumot shifrlangan kanal." },
  { q: "Same-Origin Policy nima uchun?", opts: ["Tezlik", "XSS/CSRF hujumlardan himoya", "SEO", "Kesh uchun"], correct: 1, topic: "web", difficulty: 2, explain: "Xavfsizlik — boshqa origin'dan resurs cheklangan." },
  { q: "localStorage vs sessionStorage:", opts: ["Farq yo'q", "localStorage doimiy, sessionStorage tab yopilsa tozalanadi", "localStorage server'da", "sessionStorage xavfsizroq"], correct: 1, topic: "web", difficulty: 2, explain: "Umri bo'yicha farq." },
  { q: "HTTP/2 asosiy yangiligi?", opts: ["Text protocol", "Multiplexing + binary + server push", "Faqat HTTPS", "JSON default"], correct: 1, topic: "web", difficulty: 3, explain: "Bir connection'da parallel stream'lar." },

  // ═════════ OS ═════════
  { q: "fork() va execve():", opts: ["fork yaratadi, execve almashtiradi", "Farq yo'q", "fork Linux only", "execve tez"], correct: 0, topic: "os", difficulty: 2, explain: "Child yaratish vs process image almashtirish." },
  { q: "ls -la 'd' belgisi:", opts: ["Deleted", "Directory", "Driver", "Device"], correct: 1, topic: "os", difficulty: 1, explain: "d = directory." },
  { q: "Mutex vs Semaphore:", opts: ["Farq yo'q", "Mutex 1, Semaphore N thread", "Mutex sekin", "Semaphore eski"], correct: 1, topic: "os", difficulty: 3, explain: "Binary lock vs counter." },
  { q: "Kernel vs user space:", opts: ["User ko'proq privilege", "Kernel protected — OS", "Farq yo'q", "Kernel internet"], correct: 1, topic: "os", difficulty: 2, explain: "Kernel privileged — OS core." },
  { q: "Pipe (|) vazifasi:", opts: ["To'xtatish", "stdout stdin'ga", "Fayl yaratish", "Background"], correct: 1, topic: "os", difficulty: 1, explain: "Bir command output boshqasiga." },
  { q: "Process vs Thread farqi?", opts: ["Farq yo'q", "Process o'z xotira, thread'lar xotira taqsimlaydi", "Thread tez ishlaydi", "Process faqat Unix"], correct: 1, topic: "os", difficulty: 2, explain: "Thread'lar bir process xotirasini taqsimlaydi." },
  { q: "Virtual memory nima?", opts: ["Disk keshi", "Abstraktsiya — har process o'z address space", "RAM turi", "Cloud xizmat"], correct: 1, topic: "os", difficulty: 3, explain: "Har process ko'pga o'xshash xotira ko'radi." },
  { q: "chmod 755 nima anglatadi?", opts: ["Hamma yoza oladi", "Owner: rwx, Group/Others: rx", "Faqat owner o'qiydi", "Sintaksis xato"], correct: 1, topic: "os", difficulty: 2, explain: "7=rwx, 5=rx (owner, group, others)." },
  { q: "systemd vs init?", opts: ["Bir xil", "systemd — parallel boot, service manager", "init tez", "systemd faqat Ubuntu"], correct: 1, topic: "os", difficulty: 3, explain: "Zamonaviy init replacement — parallel, dependency-aware." },

  // ═════════ OOP ═════════
  { q: "SOLID 'S':", opts: ["Simple", "Single Responsibility", "State", "Structured"], correct: 1, topic: "oop", difficulty: 1, explain: "Har sinf bir maqsad." },
  { q: "Encapsulation:", opts: ["Meros", "Ma'lumot + metodlar yashirish/birlashtirish", "Polimorfizm", "Abstract"], correct: 1, topic: "oop", difficulty: 1, explain: "Data hiding + bundling." },
  { q: "Singleton pattern:", opts: ["Bir sinf — bitta instance", "Static metodlar", "Abstract", "Interface"], correct: 0, topic: "oop", difficulty: 2, explain: "Global bitta instance." },
  { q: "Observer pattern:", opts: ["DB", "Obyekt o'zgarsa ko'plari xabardor", "UI only", "Threading"], correct: 1, topic: "oop", difficulty: 2, explain: "Subject notifies observers." },
  { q: "Composition vs Inheritance:", opts: ["Har doim inheritance", "Prefer composition", "Farq yo'q", "Faqat Java"], correct: 1, topic: "oop", difficulty: 3, explain: "GoF printsipi." },
  { q: "Polymorphism nima?", opts: ["Ko'p meros", "Bir interface — turli implementatsiya", "Operator qaytarish", "Instansiyalash"], correct: 1, topic: "oop", difficulty: 1, explain: "Bir interface, ko'p shakl." },
  { q: "Abstract class vs Interface?", opts: ["Bir xil", "Abstract — qisman implementatsiya, Interface — faqat contract (an'ana)", "Interface eski", "Abstract faqat Java"], correct: 1, topic: "oop", difficulty: 2, explain: "Abstract implementatsiya qism, Interface faqat shakl (tildan tilga farqlanadi)." },
  { q: "Factory pattern maqsadi?", opts: ["Instance yaratish logikasini yashirish", "UI render", "Test qilish", "Performance"], correct: 0, topic: "oop", difficulty: 2, explain: "Obyekt yaratishni centralize/abstract qilish." },
  { q: "Open/Closed Principle:", opts: ["Har doim ochiq", "Extension uchun ochiq, modifikatsiya uchun yopiq", "Closed source", "Faqat OOP'da"], correct: 1, topic: "oop", difficulty: 3, explain: "SOLID 'O'." },

  // ═════════ TESTING ═════════
  { q: "Unit test sinaydi:", opts: ["Tizim integratsiyasi", "Bir funktsiya izolyatsiyada", "UI", "Production"], correct: 1, topic: "test", difficulty: 1, explain: "Eng kichik birlik." },
  { q: "Mock vs Stub:", opts: ["Farq yo'q", "Stub=javob, Mock=chaqiriqlarni tekshirish", "Mock Java only", "Stub eski"], correct: 1, topic: "test", difficulty: 3, explain: "Stub value. Mock behavior." },
  { q: "TDD tartibi:", opts: ["Code-Test-Refactor", "Test-Code-Refactor (Red-Green)", "Refactor-Test", "Test only"], correct: 1, topic: "test", difficulty: 2, explain: "Red-Green-Refactor." },
  { q: "100% coverage kafolatlaydi:", opts: ["Bug yo'qligi", "Har qator 1 marta ishlaydi", "Production", "Performance"], correct: 1, topic: "test", difficulty: 2, explain: "Qamrov metrikasi, bug yo'qligi emas." },
  { q: "Integration test nima sinaydi?", opts: ["Bir funktsiya", "Bir nechta modul birga", "UI pixel", "Typing"], correct: 1, topic: "test", difficulty: 1, explain: "Modullar o'rtasidagi aloqa." },
  { q: "Flaky test nima?", opts: ["Tez test", "Ba'zan passes ba'zan fails", "Eski test", "UI test"], correct: 1, topic: "test", difficulty: 2, explain: "Nondeterministic — race condition, timing, external deps." },
  { q: "E2E test afzalligi?", opts: ["Tez", "Real user flow'ni butun stack orqali sinaydi", "Oson", "CI'da kerak emas"], correct: 1, topic: "test", difficulty: 2, explain: "Haqiqiy foydalanuvchi tajribasi." },

  // ═════════ PYTHON ═════════
  { q: "Python list vs tuple:", opts: ["Farq yo'q", "List mutable, tuple immutable", "Tuple tez", "List faqat sonlar"], correct: 1, topic: "python", difficulty: 1, explain: "Mutable vs immutable." },
  { q: "GIL nima?", opts: ["Global Interface Library", "Global Interpreter Lock — bir vaqtda 1 thread", "Graphic Interface", "None"], correct: 1, topic: "python", difficulty: 2, explain: "CPython'da bir thread at a time (I/O bound'da yaxshi)." },
  { q: "is vs ==:", opts: ["Bir xil", "is = identity (same object), == = equality", "is eskirgan", "== str uchun"], correct: 1, topic: "python", difficulty: 2, explain: "is — xotira identifikatsiya, == — qiymat." },
  { q: "List comprehension:", opts: ["Loop + append dan tez", "Faqat sonlar", "Eskirgan", "Farq yo'q"], correct: 0, topic: "python", difficulty: 1, explain: "Optimizlangan, qisqa va tezroq." },
  { q: "Decorator @ qanday ishlaydi?", opts: ["Annotation", "Funksiyani wrap qiluvchi higher-order function", "Kompilyator direktivasi", "Class marker"], correct: 1, topic: "python", difficulty: 3, explain: "func = decorator(func) — funktsiya wrap." },
  { q: "*args va **kwargs:", opts: ["Bir xil", "*args — positional tuple, **kwargs — keyword dict", "*args eski", "Faqat Python 3"], correct: 1, topic: "python", difficulty: 2, explain: "Cheksiz argument qabul qilish." },
  { q: "Python dict o'rtacha lookup:", opts: ["O(n)", "O(log n)", "O(1)", "O(n\u00b2)"], correct: 2, topic: "python", difficulty: 2, explain: "Hash table — o'rtacha O(1)." },
  { q: "Generator vs List:", opts: ["Bir xil", "Generator lazy — xotira kam", "List tez", "Generator eski"], correct: 1, topic: "python", difficulty: 2, explain: "Yield — bir-birlab beradi, memory-efficient." },

  // ═════════ JAVASCRIPT ═════════
  { q: "var vs let vs const:", opts: ["Bir xil", "var function-scoped, let/const block-scoped", "let eski", "const faqat son"], correct: 1, topic: "js", difficulty: 2, explain: "Scope farqi — let/const modern." },
  { q: "== vs ===:", opts: ["Bir xil", "=== qat'iy (type + value), == coerce qiladi", "=== eski", "== faqat string"], correct: 1, topic: "js", difficulty: 1, explain: "Strict vs loose equality." },
  { q: "Promise holatlari:", opts: ["pending/fulfilled/rejected", "start/end", "true/false", "loading only"], correct: 0, topic: "js", difficulty: 2, explain: "3 ta holat mavjud." },
  { q: "async/await asosi:", opts: ["Callback shakli", "Promise ustidagi syntax sugar", "Parallel thread", "Eski standart"], correct: 1, topic: "js", difficulty: 2, explain: "Promise bilan sinxron ko'rinishdagi kod." },
  { q: "Event loop nima?", opts: ["DOM event", "Call stack + task queue ishlash mexanizmi", "UI render loop", "Error handler"], correct: 1, topic: "js", difficulty: 3, explain: "Async — microtask/macrotask queue'lardan olinadi." },
  { q: "closure nima?", opts: ["Class qismi", "Funktsiya + uning leksik environment'i", "Event handler", "Private method"], correct: 1, topic: "js", difficulty: 3, explain: "Inner function outer variables'ga erishadi — lexical scope." },
  { q: "JavaScript typeof null:", opts: ["null", "undefined", "object", "boolean"], correct: 2, topic: "js", difficulty: 2, explain: "Tarixiy bug — 'object' qaytaradi." },
  { q: "Arrow function farqi:", opts: ["Bir xil", "Hech qanday 'this' binding, qisqa syntax", "Tez ishlaydi", "Faqat React'da"], correct: 1, topic: "js", difficulty: 2, explain: "this'ni enclosing scope'dan oladi." },
  { q: "Hoisting nima?", opts: ["DOM o'zgarish", "var/function deklaratsiyalari scope boshiga ko'tariladi", "Import", "Optimize"], correct: 1, topic: "js", difficulty: 2, explain: "Declaration visible, lekin let/const — TDZ." }
];

window.TOPICS = {
  algo:   { uz: "Algoritmlar",    ru: "Алгоритмы",    en: "Algorithms",  emoji: "\ud83e\uddee" },
  sql:    { uz: "SQL / DB",       ru: "SQL / БД",     en: "SQL / DB",    emoji: "\ud83d\uddc4\ufe0f" },
  git:    { uz: "Git",            ru: "Git",          en: "Git",         emoji: "\ud83c\udf3f" },
  c:      { uz: "C tili",         ru: "Язык C",       en: "C language",  emoji: "\u2699\ufe0f" },
  web:    { uz: "Web / API",      ru: "Web / API",    en: "Web / API",   emoji: "\ud83c\udf10" },
  os:     { uz: "OS / Unix",      ru: "ОС / Unix",    en: "OS / Unix",   emoji: "\ud83d\udc27" },
  oop:    { uz: "OOP / Patterns", ru: "ООП",          en: "OOP",         emoji: "\ud83e\udde9" },
  test:   { uz: "Testlash",       ru: "Тестирование", en: "Testing",     emoji: "\u2705" },
  python: { uz: "Python",         ru: "Python",       en: "Python",      emoji: "\ud83d\udc0d" },
  js:     { uz: "JavaScript",     ru: "JavaScript",   en: "JavaScript",  emoji: "\u26a1" }
};
