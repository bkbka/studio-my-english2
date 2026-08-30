import { ListeningExercise, SpeakingScenario, ReadingPassage, WritingPrompt, LevelInfo, SavedWord, UserStats } from '../types';

export const LEVEL_DEFINITIONS: LevelInfo[] = [
  {
    id: 'beginner',
    titleAr: 'مستوى مبتدئ',
    titleEn: 'Beginner',
    cefr: 'A1 - A2',
    badge: '🌱',
    descriptionAr: 'للطالب الذي يرغب في بناء الأساسيات القوية: جمل بسيطة، محادثات يومية شائعة، ومفردات أساسية.',
  },
  {
    id: 'intermediate',
    titleAr: 'مستوى متوسط',
    titleEn: 'Intermediate',
    cefr: 'B1 - B2',
    badge: '🚀',
    descriptionAr: 'للطالب القادر على التفاهم في مواقف العمل والسفر، والتعبير عن الآراء والتجارب بشكل مستقل.',
  },
  {
    id: 'advanced',
    titleAr: 'مستوى متقدم',
    titleEn: 'Advanced',
    cefr: 'C1 - C2',
    badge: '👑',
    descriptionAr: 'للطالب الذي يطمح للإتقان الأكاديمي والمهني العالي والتحدث بسلاسة وثقة دون تردد.',
  },
];

export const LISTENING_LESSONS: ListeningExercise[] = [
  {
    id: 'l_beg_1',
    titleAr: 'المقابلة الأولى في المقهى',
    titleEn: 'First Meeting at a Cafe',
    level: 'beginner',
    durationMinutes: 3,
    topic: 'Daily Life',
    audioText: `Sarah: Hi! Is this seat taken?
David: No, go ahead and sit down. I'm David, by the way.
Sarah: Thanks, David! I'm Sarah. Are you waiting for a friend?
David: No, just having some coffee and reading a book. Do you come here often?
Sarah: Yes, I love their iced cappuccino. What are you drinking?
David: Just black coffee. It keeps me awake for my afternoon study session!`,
    transcriptText: `Sarah: Hi! Is this seat taken?
David: No, go ahead and sit down. I'm David, by the way.
Sarah: Thanks, David! I'm Sarah. Are you waiting for a friend?
David: No, just having some coffee and reading a book. Do you come here often?
Sarah: Yes, I love their iced cappuccino. What are you drinking?
David: Just black coffee. It keeps me awake for my afternoon study session!`,
    fillInBlanksText: 'Is this ___ taken? No, go ahead and sit ___. I am David, by the ___.',
    missingWords: ['seat', 'down', 'way'],
    questions: [
      {
        id: 'l_beg_1_q1',
        questionAr: 'ماذا يشرب ديفيد؟',
        questionEn: 'What is David drinking?',
        options: ['Tea', 'Iced Cappuccino', 'Black Coffee', 'Orange Juice'],
        correctAnswer: 2,
        explanationAr: 'ديفيد قال: "Just black coffee" (قهوة سوداء فقط).',
      },
      {
        id: 'l_beg_1_q2',
        questionAr: 'لماذا يشرب ديفيد القهوة؟',
        questionEn: 'Why is David drinking coffee?',
        options: ['To sleep well', 'To stay awake for studying', 'Because it is free', 'He does not like it'],
        correctAnswer: 1,
        explanationAr: 'قال ديفيد أن القهوة تبقيه مستيقظاً لجلسة المذاكرة بعد الظهر.',
      },
    ],
    keyVocabulary: [
      { word: 'Is this seat taken?', translationAr: 'هل هذا المقعد مشغول؟', meaningEn: 'Asking if someone is sitting here' },
      { word: 'Go ahead', translationAr: 'تفضل / تفضلي', meaningEn: 'Proceed or feel free to do so' },
      { word: 'Keep awake', translationAr: 'يبقي مستيقظاً', meaningEn: 'To prevent someone from sleeping' },
    ],
  },
  {
    id: 'l_int_1',
    titleAr: 'التخطيط لرحلة عمل طارئة',
    titleEn: 'Planning an Urgent Business Trip',
    level: 'intermediate',
    durationMinutes: 4,
    topic: 'Business & Travel',
    audioText: `Manager: Alex, we have a major presentation in Dubai next Thursday. Can you adjust your schedule?
Alex: Of course! I will need to reschedule my team syncs, but I can manage. Have the flight details been finalized?
Manager: Not yet. The travel team is looking at morning flights on Tuesday so you have time to settle in.
Alex: That sounds reasonable. Should I prepare the quarterly presentation slides today?
Manager: Yes please, emphasize our regional growth metrics and client testimonials.`,
    transcriptText: `Manager: Alex, we have a major presentation in Dubai next Thursday. Can you adjust your schedule?
Alex: Of course! I will need to reschedule my team syncs, but I can manage. Have the flight details been finalized?
Manager: Not yet. The travel team is looking at morning flights on Tuesday so you have time to settle in.
Alex: That sounds reasonable. Should I prepare the quarterly presentation slides today?
Manager: Yes please, emphasize our regional growth metrics and client testimonials.`,
    questions: [
      {
        id: 'l_int_1_q1',
        questionAr: 'أين ستقام العرض التقديمي؟',
        questionEn: 'Where will the presentation take place?',
        options: ['London', 'Dubai', 'Tokyo', 'Riyadh'],
        correctAnswer: 1,
        explanationAr: 'قال المدير أن لديهم عرضاً تقديمياً رئيسياً في دبي.',
      },
      {
        id: 'l_int_1_q2',
        questionAr: 'ما الذي يجب على أليكس التركيز عليه في الشرائح؟',
        questionEn: 'What should Alex emphasize in the presentation slides?',
        options: ['Budget cuts', 'Regional growth metrics and client testimonials', 'Office supplies', 'Competitor weaknesses'],
        correctAnswer: 1,
        explanationAr: 'طلب المدير التركيز على مقاييس النمو الإقليمي وشهادات العملاء.',
      },
    ],
    keyVocabulary: [
      { word: 'Adjust schedule', translationAr: 'تعديل الجدول الزمني', meaningEn: 'Change planned activities' },
      { word: 'Settle in', translationAr: 'الاستقرار / التأقلم بعد الوصول', meaningEn: 'Become comfortable in a new place' },
      { word: 'Metrics', translationAr: 'مقاييس / مؤشرات', meaningEn: 'Standards of measurement' },
    ],
  },
  {
    id: 'l_adv_1',
    titleAr: 'تأثير الذكاء الاصطناعي على مستقبل الوظائف',
    titleEn: 'The Impact of AI on Future Workforce',
    level: 'advanced',
    durationMinutes: 5,
    topic: 'Technology & Philosophy',
    audioText: `Speaker: As artificial intelligence penetrates various sectors, workforce dynamics are undergoing an unprecedented paradigm shift. Rather than outright replacement, the prevailing trend suggests a collaborative model where automation handles routine analytical tasks while humans pivot towards creative problem solving, strategic vision, and emotional intelligence. However, continuous reskilling remains paramount to mitigate potential economic friction.`,
    transcriptText: `Speaker: As artificial intelligence penetrates various sectors, workforce dynamics are undergoing an unprecedented paradigm shift. Rather than outright replacement, the prevailing trend suggests a collaborative model where automation handles routine analytical tasks while humans pivot towards creative problem solving, strategic vision, and emotional intelligence. However, continuous reskilling remains paramount to mitigate potential economic friction.`,
    questions: [
      {
        id: 'l_adv_1_q1',
        questionAr: 'ما هو النموذج السائد المذكور بشأن الذكاء الاصطناعي وسوق العمل؟',
        questionEn: 'What is the prevailing trend regarding AI and the workforce?',
        options: [
          'Complete human job destruction',
          'A collaborative model between humans and automation',
          'AI taking over emotional decisions',
          'A return to manual labor',
        ],
        correctAnswer: 1,
        explanationAr: 'ذكر المتحدث أن الاتجاه السائد هو نموذج تعاوري (collaborative model) حيث تتولى الأتمتة المهام الروتينية بينما يركز البشر على حل المشكلات والإبداع.',
      },
    ],
    keyVocabulary: [
      { word: 'Paradigm shift', translationAr: 'تحول جذري في النموذج', meaningEn: 'A fundamental change in approach or underlying assumptions' },
      { word: 'Paramount', translationAr: 'بالغ الأهمية / جوهري', meaningEn: 'More important than anything else; supreme' },
      { word: 'Mitigate', translationAr: 'التخفيف من أثر', meaningEn: 'Make less severe, serious, or painful' },
    ],
  },
];

export const SPEAKING_SCENARIOS: SpeakingScenario[] = [
  {
    id: 's_beg_1',
    titleAr: 'الطلب في المقهى',
    titleEn: 'Ordering at a Cafe',
    level: 'beginner',
    situationAr: 'أنت في مطعم أو مقهى وتريد طلب مشروب ووجبة خفيفة من النادل.',
    situationEn: 'You are at a cafe and want to order a warm drink and a snack from the barista.',
    promptToUser: 'Order a medium latte with almond milk and a blueberry muffin. Ask how much it costs.',
    suggestedPhrases: [
      "I'd like a medium latte, please.",
      'Could I get almond milk instead of regular milk?',
      'Is the blueberry muffin fresh?',
      'How much is that in total?',
    ],
    sampleResponse: "Hello! I'd like a medium latte with almond milk, and one blueberry muffin please. How much is the total?",
    aiPersonaRole: 'Barista at Coffee Haven',
  },
  {
    id: 's_beg_2',
    titleAr: 'التعريف بنفسك والمهنة',
    titleEn: 'Self Introduction & Job',
    level: 'beginner',
    situationAr: 'لقاء شخص جديد في ورشة عمل أو تعارف.',
    situationEn: 'Meeting a new colleague at an introductory event.',
    promptToUser: 'Introduce yourself (your name, your job or major, and one hobby you enjoy in your free time).',
    suggestedPhrases: [
      'Nice to meet you, my name is...',
      'I work as a software engineer / designer...',
      'In my free time, I really enjoy reading and swimming.',
    ],
    sampleResponse: 'Hi there! Nice to meet you. My name is Kareem. I work as a graphics designer, and in my spare time I love playing football.',
    aiPersonaRole: 'Friendly attendee at an international networking event',
  },
  {
    id: 's_int_1',
    titleAr: 'مقابلة عمل: التحدث عن نقطة قوة',
    titleEn: 'Job Interview: Strengths',
    level: 'intermediate',
    situationAr: 'المقابِل يسألك عن أكبر نقطة قوة لديك وكيف استخدمتها في حل مشكلة سابقة.',
    situationEn: 'An interviewer asks you to describe your greatest strength with a real example.',
    promptToUser: 'Explain your greatest professional strength (e.g. problem solving, teamwork, adaptability) and give a brief example.',
    suggestedPhrases: [
      'One of my core strengths is clear communication under pressure.',
      'For instance, in my previous role I managed to...',
      'This experience taught me how to pivot quickly when deadlines shift.',
    ],
    sampleResponse: 'I would say my main strength is adaptability. In my last project, when a client changed requirements two days before launch, I reorganized our workflow and delivered on time without compromising quality.',
    aiPersonaRole: 'Hiring Manager at a Tech Company',
  },
  {
    id: 's_adv_1',
    titleAr: 'نقاش حول العمل عن بعد وقوة الإنتاجية',
    titleEn: 'Debating Remote Work Dynamics',
    level: 'advanced',
    situationAr: 'مناظرة مهنية حول إيجابيات وسلبيات العمل الكامل عن بعد مقارنة بالعمل الهجين.',
    situationEn: 'Expressing a nuanced viewpoint on remote versus hybrid work culture.',
    promptToUser: 'Present a balanced argument on remote work, highlighting flexibility for employees while considering team cohesion challenges.',
    suggestedPhrases: [
      'While remote work indisputably enhances work-life flexibility...',
      'On the flip side, organic serendipitous collaboration can suffer.',
      'A hybrid model often strikes the optimal equilibrium.',
    ],
    sampleResponse: 'While fully remote work empowers employees with unprecedented flexibility and eliminates grueling commutes, it can inadvertently weaken spontaneous creative collaboration. Consequently, I believe a structured hybrid paradigm offers the ideal balance between individual autonomy and team synergy.',
    aiPersonaRole: 'Senior HR Director',
  },
];

export const READING_PASSAGES: ReadingPassage[] = [
  {
    id: 'r_beg_1',
    titleAr: 'عادات الصباح لمستقبل ناجح',
    titleEn: 'Morning Habits for a Great Day',
    level: 'beginner',
    topic: 'Personal Growth',
    contentEn: `How you start your morning can shape your entire day. Successful people often follow simple, positive habits right after waking up.

First, drink a large glass of clean water. Your body loses water during the night, so hydrating immediately gives you fresh energy. Second, avoid checking your smartphone for the first thirty minutes. Looking at emails or social media right away can create unnecessary stress.

Finally, take ten minutes to stretch or go for a short walk in the fresh air. Moving your body releases helpful hormones that boost your mood and focus for the rest of the day.`,
    paragraphTranslationsAr: [
      'كيف تبدأ صباحك يمكن أن يشكّل يومك بالكامل. غالبًا ما يتبع الأشخاص الناجحون عادات بسيطة وإيجابية فور استيقاظهم.',
      'أولاً، اشرب كوباً كبيراً من الماء النظيف. يفقد جسمك الماء خلال الليل، لذا فإن الترطيب الفوري يمنحك طاقة متجددة. ثانياً، تجنب تفقد هاتفك الذكي خلال أول ثلاثين دقيقة. فمراجعة البريد أو وسائل التواصل فوراً يمكن أن يسبب توتراً غير ضروري.',
      'أخيراً، خصص عشر دقائق للتمدد أو المشي القصير في الهواء النقي. تحريك جسمك يطلق هرمونات مفيدة تعزز مزاجك وتركيزك لبقية اليوم.',
    ],
    questions: [
      {
        id: 'r_beg_1_q1',
        questionAr: 'ما هي النتيجة الإيجابية لشرب الماء فور الاستيقاظ؟',
        questionEn: 'What is the benefit of drinking water right after waking up?',
        options: ['It makes you sleep longer', 'It gives you fresh energy through hydration', 'It removes all headaches', 'It replaces exercise'],
        correctAnswer: 1,
        explanationAr: 'النص يذكر أن ترطيب الجسم بالماء فور الاستيقاظ يمنح طاقة متجددة (fresh energy).',
      },
      {
        id: 'r_beg_1_q2',
        questionAr: 'لماذا يُنصح بعدم تفقد الهاتف فور الاستيقاظ؟',
        questionEn: 'Why should you avoid checking your phone immediately?',
        options: ['It wastes money', 'It breaks the phone', 'It can create unnecessary stress', 'It makes you late for school'],
        correctAnswer: 2,
        explanationAr: 'ذكر النص أن مراجعة الرسائل والمواقع فوراً تسبب توتراً غير ضروري (unnecessary stress).',
      },
    ],
    vocabularyList: [
      { word: 'Hydrating', translationAr: 'ترطيب الجسم', partOfSpeech: 'verb / adjective', example: 'Hydrating in the morning is essential.' },
      { word: 'Unnecessary', translationAr: 'غير ضروري', partOfSpeech: 'adjective', example: 'Don’t worry about unnecessary details.' },
      { word: 'Boost', translationAr: 'يزيد / يعزز', partOfSpeech: 'verb', example: 'A healthy breakfast boosts your concentration.' },
    ],
  },
  {
    id: 'r_int_1',
    titleAr: 'سحر الطاقة المتجددة ومدن المستقبل',
    titleEn: 'Renewable Energy and Smart Cities',
    level: 'intermediate',
    topic: 'Environment & Tech',
    contentEn: `Across the globe, metropolitan regions are undergoing a massive transformation toward sustainability. Traditional fossil fuels are being systematically phased out in favor of solar, wind, and geothermal energy sources.

Smart grids now utilize advanced algorithms to monitor energy consumption in real time. For instance, streetlights adjust their brightness depending on pedestrian activity, and public transportation buses operate on zero-emission electric batteries recharged during off-peak hours.

Despite these advancements, urban planners face significant infrastructure hurdles. Upgrading old power distribution networks requires substantial financial investment and policy cooperation across local government agencies.`,
    paragraphTranslationsAr: [
      'في جميع أنحاء العالم، تشهد المناطق الحضرية تحولاً هائلاً نحو الاستدامة. يتم الاستغناء التدريجي والمنهجي عن الوقود الأحفوري التقليدي لصالح مصادر الطاقة الشمسية والرياح والطاقة الجوفية.',
      'تستخدم الشبكات الذكية الآن خوارزميات متقدمة لمراقبة استهلاك الطاقة في الوقت الفعلي. على سبيل المثال، تعدل أضواء الشوارع سطوعها بناءً على حركة المشاة، وتعمل حافلات النقل العام ببطاريات كهربائية خالية من الانبعاثات يتم إعادة شحنها خارج ساعات الذروة.',
      'على الرغم من هذه التطورات، يواجه مخططو المدن عقبات كبيرة في البنية التحتية. يتطلب تحديث شبكات توزيع الكهرباء القديمة استثمارات مالية ضخمة وتعاوناً سياسياً بين الهيئات الحكومية المحلية.',
    ],
    questions: [
      {
        id: 'r_int_1_q1',
        questionAr: 'كيف تعمل إنارة الشوارع الذكية المذكورة في النص؟',
        questionEn: 'How do smart streetlights function according to the text?',
        options: [
          'They stay at maximum brightness all night',
          'They adjust brightness based on pedestrian movement',
          'They turn off when cars drive past',
          'They are powered by gasoline generators',
        ],
        correctAnswer: 1,
        explanationAr: 'ذكر النص أن أضواء الشوارع تعدل سطوعها تلقائياً بحسب نشاط المشاة.',
      },
    ],
    vocabularyList: [
      { word: 'Metropolitan', translationAr: 'حضري / متعلق بالمدن الكبرى', partOfSpeech: 'adjective', example: 'The metropolitan transport system is fast.' },
      { word: 'Phase out', translationAr: 'التخلي التدريجي عن', partOfSpeech: 'phrasal verb', example: 'They plan to phase out plastic bags.' },
      { word: 'Off-peak', translationAr: 'خارج ساعات الذروة', partOfSpeech: 'adjective', example: 'Electricity is cheaper during off-peak hours.' },
    ],
  },
  {
    id: 'r_adv_1',
    titleAr: 'سيكولوجية اتخاذ القرار في الأزمات',
    titleEn: 'Cognitive Biases in High-Stakes Decision Making',
    level: 'advanced',
    topic: 'Psychology',
    contentEn: `Under conditions of severe pressure and ambiguity, human cognition frequently relies on mental shortcuts known as heuristics. While these cognitive mechanisms expedite decision making, they also expose individuals to systematic judgment errors.

One prominent bias is the confirmation bias, where leaders unconsciously seek out information that validates their pre-existing hypotheses while disregarding contradictory evidence. In critical scenarios—such as financial market volatility or public health crises—this tendency can cascade into catastrophic miscalculations.

To counteract these cognitive traps, organization theorists advocate for adversarial collaboration—a deliberate structural process where designated 'red teams' actively challenge core assumptions prior to strategy execution.`,
    paragraphTranslationsAr: [
      'تحت ظروف الضغط الشديد والغموض، يعتمد التفكير البشري متكرراً على اختصارات ذهنية تُعرف بـ "الاستكشافات الهادفة". في حين أن هذه الآليات الإدراكية تسارع اتخاذ القرار، فإنها تعرض الأفراد أيضاً لأخطاء منهجية في التقدير.',
      'أحد الانحيازات البارزة هو "انحياز التأكيد"، حيث يبحث القادة لا شعورياً عن المعلومات التي تؤكد فرضياتهم المسبقة مع إهمال الأدلة المناقضة. في السيناريوهات الحرجة — مثل تقلبات الأسواق المالية أو الأزمات الصحية — يمكن أن يتداعى هذا الاتجاه إلى حسابات خاطئة كارثية.',
      'لمواجهة هذه المصائد الإدراكية، يدعو نظريو التنظيم إلى "التعاون التنافسي" — وهي عملية هيكلية متعمدة حيث تتحدى "الفرق الحمراء" المعينة الفرضيات الأساسية بشكل فعال قبل تنفيذ الاستراتيجية.',
    ],
    questions: [
      {
        id: 'r_adv_1_q1',
        questionAr: 'ما هو انحياز التأكيد (Confirmation Bias) كما وُصف في النص؟',
        questionEn: 'What is confirmation bias as described in the passage?',
        options: [
          'Checking information from multiple neutral sources',
          'Seeking information that supports existing beliefs while ignoring opposing evidence',
          'Refusing to make any decision during a crisis',
          'Believing everything read on social media',
        ],
        correctAnswer: 1,
        explanationAr: 'انحياز التأكيد هو البحث عن أدلة تؤيد الرأي المسبق وتجاهل أي أدلة تناقضه.',
      },
    ],
    vocabularyList: [
      { word: 'Cognition', translationAr: 'الإدراك / التفكير الذهني', partOfSpeech: 'noun', example: 'Stress can affect human cognition.' },
      { word: 'Heuristics', translationAr: 'قواعد الاستكشاف الذهني السريع', partOfSpeech: 'noun', example: 'Heuristics allow fast but sometimes flawed judgments.' },
      { word: 'Adversarial', translationAr: 'تنافسي / مواجهة نقدية', partOfSpeech: 'adjective', example: 'Adversarial testing strengthens software stability.' },
    ],
  },
];

export const WRITING_PROMPTS: WritingPrompt[] = [
  {
    id: 'w_beg_1',
    titleAr: 'كتابة بريد إلكتروني لصديق عن يومك المفضّل',
    titleEn: 'Email to a Friend About Your Favorite Day',
    level: 'beginner',
    promptAr: 'اكتب بريداً إلكترونياً قصيراً لصديق تصف فيه يومك المفضّل في الأسبوع وما تفعله فيه.',
    promptEn: 'Write a short email (50–100 words) to a friend describing your favorite day of the week and what you usually do.',
    minWords: 50,
    maxWords: 120,
    guidedQuestionsAr: [
      'ما هو يومك المفضل ولماذا؟',
      'ما هي الأنشطة التي تقوم بها صباحاً ومساءً؟',
      'مع من تقضي هذا اليوم؟',
    ],
    helpfulVocabulary: ['Dear friend', 'My favorite day is...', 'In the morning I usually...', 'I enjoy spending time with...', 'Best wishes'],
    sampleGoodWriting: `Hi Alex,

I hope you are doing well! My favorite day of the week is Friday. On Friday mornings, I love waking up late and drinking hot coffee on the balcony. After lunch, I usually meet my friends at the park to play football. In the evening, my family gets together for a delicious home-cooked dinner. It is always a relaxed and happy day for me!

How about you? What is your favorite day?

Best wishes,
Kareem`,
  },
  {
    id: 'w_int_1',
    titleAr: 'مقال رأي: إيجابيات وسلبيات التعلم عبر الإنترنت',
    titleEn: 'Opinion Essay: Online Learning Advantages and Disadvantages',
    level: 'intermediate',
    promptAr: 'اكتب مقال رأي حول فوائد وتحديات التعلم عن بعد مقارنة بالفصول التقليدية.',
    promptEn: 'Write a balanced opinion response (120–200 words) discussing the benefits and challenges of online education.',
    minWords: 120,
    maxWords: 220,
    guidedQuestionsAr: [
      'ما هي أهم ميزة للتعلم عبر الإنترنت؟ (مثل مرونة الوقت والراحة)',
      'ما هي السلبية الرئيسية؟ (مثل قلة التفاعل الاجتماعي المباشر)',
      'ما هو انطباعك النهائي؟',
    ],
    helpfulVocabulary: ['On one hand', 'Furthermore', 'Flexibility', 'Self-discipline', 'On the other hand', 'In conclusion'],
    sampleGoodWriting: `In recent years, online learning has transformed how students access education worldwide.

On one hand, digital education offers unprecedented convenience and flexibility. Learners can access study materials anytime and avoid long daily commutes. Furthermore, online platforms provide access to diverse courses taught by global instructors.

On the other hand, distance learning requires high self-discipline. Without face-to-face interaction, some students feel isolated or struggle to stay motivated. Technical issues can also hinder progress.

In conclusion, while online learning has clear drawbacks, its benefits make it an indispensable tool for modern learners.`,
  },
  {
    id: 'w_adv_1',
    titleAr: 'رسالة تحفيزية لطلب منحة دراسية أو عمل',
    titleEn: 'Formal Cover Letter for Scholarship or Job',
    level: 'advanced',
    promptAr: 'اكتب رسالة رسمية تقنع فيها لجنة القبول باستحقاقك لمنحة دراسية أو وظيفة قيادية.',
    promptEn: 'Write a compelling formal cover letter (180–300 words) articulating your academic accomplishments and leadership potential.',
    minWords: 180,
    maxWords: 350,
    guidedQuestionsAr: [
      'الافتتاحية الرسمية والهدف من الرسالة',
      'استعراض إنجازين رئيسيين بالدلائل والأرقام',
      'كيف ستساهم في هذه المؤسسة/المستقبل؟',
    ],
    helpfulVocabulary: ['I am writing to express my strong enthusiasm for...', 'Throughout my academic journey...', 'Substantial experience in...', 'I am confident that my background aligns with...', 'Sincerely yours'],
    sampleGoodWriting: `Dear Selection Committee,

I am writing to express my enthusiastic application for the Global Excellence Leadership Scholarship. Having recently completed my Bachelor's degree in Data Science with top honors, I am eager to contribute my technical rigor and community initiative to your esteemed institution.

Throughout my undergraduate studies, I led a cross-functional student team that developed an AI-assisted literacy app for underprivileged primary schools. This initiative benefited over 1,200 young learners and honed my capabilities in project management and cross-cultural communication. Additionally, my research on predictive analytics was accepted at the Regional Tech Conference.

I am thoroughly confident that this program will serve as a catalyst for my goal of establishing accessible educational technology across developing regions. Thank you for considering my application.

Sincerely,
Sarah Al-Mansoor`,
  },
];

export const INITIAL_USER_STATS: UserStats = {
  level: 'beginner',
  xp: 320,
  streakDays: 4,
  completedExercises: ['l_beg_1'],
  totalListeningMinutes: 12,
};

export const INITIAL_SAVED_WORDS: SavedWord[] = [
  {
    id: 'w1',
    word: 'resilience',
    translationAr: 'المرونة والقدرة على التكيف',
    partOfSpeech: 'noun',
    contextSentence: 'Resilience is crucial for overcoming difficult obstacles in life.',
    dateAdded: new Date().toISOString(),
    masteryLevel: 3,
  },
  {
    id: 'w2',
    word: 'articulate',
    translationAr: 'يعبر بوضوح وسلاسة',
    partOfSpeech: 'verb',
    contextSentence: 'She was able to articulate her thoughts during the interview.',
    dateAdded: new Date().toISOString(),
    masteryLevel: 4,
  },
  {
    id: 'w3',
    word: 'sustainable',
    translationAr: 'مستدام وصديق للبيئة',
    partOfSpeech: 'adjective',
    contextSentence: 'We need to find sustainable solutions to climate change.',
    dateAdded: new Date().toISOString(),
    masteryLevel: 2,
  },
];

