/**
 * قاموس شامل للعبة إنسان حيوان نبات جماد بلاد
 * يشمل الحروف العربية الأساسية والتصنيفات الشائعة
 */

const ARABIC_DICTIONARY = {
  // حرف الألف
  'ا': {
    human: ['احمد', 'اسامة', 'امير', 'ايمن', 'امجد', 'ابراهيم', 'اسماعيل', 'ايوب', 'امين', 'انيس', 'ادهم', 'اوس', 'اسعد', 'انس', 'امل', 'اسماء', 'ايمان', 'اسيل', 'اروى', 'اماني', 'احلام', 'اميرة', 'اية', 'الهام', 'ابتسام', 'اميمة', 'افنان', 'انفال', 'اصالة', 'اسير', 'اصم', 'اباء', 'اصايل', 'الهنوف', 'العنود', 'اريج', 'امنة', 'انور', 'اكرم', 'الفت', 'انجي', 'ابتهال', 'انتصار', 'اشرف'],
    animal: ['اسد', 'ارنب', 'افعى', 'اخطبوط', 'اوزة', 'ابن اوى', 'ارماديلو', 'الايقور', 'انقليس', 'اسقمري', 'ابابيل', 'اوراق الشجر (حشرة)', 'ابل', 'انثى الاسد', 'اوكابي', 'ابن عرس', 'اوريكس', 'افريقي', 'الخرتيت', 'اسفنج البحر'],
    plant: ['ارز', 'اناناس', 'اجاص', 'افوكادو', 'اقحوان', 'اثيل', 'اوركيد', 'الوفيرا', 'اسكدنيا', 'اركان', 'اشنيات', 'ابصال', 'اكاسيا', 'اكليل الجبل', 'اترج', 'اوريغانو', 'اشنان', 'اذخر', 'اكليل', 'ارطا', 'انجاص'],
    object: ['ابرة', 'اريكة', 'ابريق', 'انبوب', 'اسوارة', 'اله حاسبة', 'اشارة', 'اناء', 'اباجورة', 'استيكة', 'انتركوم', 'اوتاد', 'اسفنجة', 'ارجيحة', 'اكواب', 'اسوار', 'اراشيف', 'ابواب', 'اقلام', 'اجهزة', 'اغطية', 'اعمدة', 'اواني'],
    country: ['المانيا', 'امريكا', 'استراليا', 'اسبانيا', 'ايطاليا', 'الاردن', 'الامارات', 'الجزائر', 'ارجنتين', 'انجلترا', 'اسكتلندا', 'اوكرانيا', 'اثيوبيا', 'انغولا', 'اوروغواي', 'اوزبكستان', 'اذربيجان', 'انقرة', 'اثينا', 'امستردام', 'اربيل', 'اسوان', 'اسكندرية', 'اوغندا', 'اندونيسيا', 'ايران', 'العراق', 'الرياض', 'ابوظبي', 'القاهرة', 'الدوحة', 'الكويت', 'المنامة', 'القدس', 'الخرطوم'],
    job: ['استاذ', 'امين مكتبة', 'اديب', 'اخصائي', 'امام', 'امين سر', 'اقتصادي', 'اعلامي', 'اكاديمي', 'امين صندوق', 'اداري', 'امين متحف', 'امين مخزن', 'استشاري', 'اصولي', 'اخباري'],
    food: ['ارز', 'اندومي', 'اومليت', 'ازانيا', 'اضلاع', 'استيك', 'ايدام', 'ايسكريم', 'استاكوزا', 'انجل كيك', 'اضلاع مشوية', 'ارز بخاري', 'ارز برياني', 'ام علي']
  },
  // حرف الباء
  'ب': {
    human: ['باسل', 'باسم', 'بدر', 'بلال', 'بشار', 'براء', 'بهاء', 'برهان', 'بكر', 'بيان', 'بسمة', 'بتول', 'بشرى', 'بثينة', 'بلقيس', 'بانة', 'بهية', 'بارعة', 'بدرية', 'بسنت', 'بيسان', 'باهي', 'بهجت', 'بدران', 'بريك', 'بندر', 'بشاير'],
    animal: ['بقرة', 'بطة', 'بطريق', 'بلبل', 'باز', 'برغوث', 'بغاوة', 'ببغاء', 'بغل', 'ببر', 'بومة', 'بوسم', 'بلهارسيا', 'بوني', 'بابون', 'بجع', 'بازي', 'براق', 'بومة قرناء', 'بصيلي'],
    plant: ['برتقال', 'بصل', 'بطيخ', 'باذنجان', 'بازلاء', 'بقدونس', 'بامية', 'بيلسان', 'بن', 'بابايا', 'بلوط', 'بنجر', 'بندق', 'بامبو', 'بابونج', 'بروكلي', 'بردي', 'بلسان', 'بصل اخضر', 'بقلة', 'برقوق', 'بشملة', 'بنفسج', 'بهارات'],
    object: ['باب', 'برميل', 'بندقية', 'بساط', 'باخرة', 'بطانية', 'بوصلة', 'برواز', 'بوق', 'بالون', 'بسكليت', 'براية', 'بطارية', 'بلوزة', 'براد', 'براد شاي', 'بلورة', 'براويز', 'بروش', 'بدلة', 'بوابة', 'بيانو', 'بندول', 'بلاط', 'بوري'],
    country: ['بريطانيا', 'بلجيكا', 'برازيل', 'بولندا', 'بلغاريا', 'بيرو', 'باكستان', 'بحرين', 'بيروت', 'بغداد', 'باريس', 'بكين', 'بانكوك', 'برلين', 'بودابست', 'برن', 'بوسطن', 'برشلونة', 'بوسنة', 'بحر الميت', 'بريدة', 'بعلبك', 'بومباي', 'بيرمنغهام', 'بيلاروسيا', 'بنين', 'بوتان'],
    job: ['بقال', 'بستاني', 'بحار', 'بناء', 'برمجي', 'بائع', 'بصريات', 'بيطري', 'بوليس', 'بائع زهور', 'بواب', 'بروفيسور', 'بصاص', 'بديل', 'بائع عطور'],
    food: ['بيتزا', 'برجر', 'بامية', 'برياني', 'بليلة', 'بشاميل', 'بصارة', 'بان كيك', 'بقلاوة', 'بوشار', 'بف باستري', 'بسكويت', 'بابا غنوج', 'بليلة حجازية', 'بريوش', 'بيستو']
  },
  // حرف التاء
  'ت': {
    human: ['تامر', 'تميم', 'تيمور', 'توفيق', 'تاج', 'تيسير', 'تقي', 'تهامي', 'تسنيم', 'تالا', 'تولين', 'تغريد', 'تهاني', 'تقوى', 'تارا', 'تاليا', 'تماضر', 'توبا', 'تركي', 'تيا', 'تولاي', 'تيم', 'تالد', 'تحسين', 'تقية'],
    animal: ['تمساح', 'تنين', 'تيس', 'تونة', 'تدرج', 'تابير', 'تارانتولا', 'توتياء', 'تنك', 'تيتل', 'توتياء البحر'],
    plant: ['تفاح', 'تمر', 'توت', 'تين', 'ترمس', 'تبغ', 'توليب', 'ترنج', 'تمرهندي', 'ترخون', 'توابل', 'ترنجان', 'تمر صقعي', 'تمر سكري', 'تمر خلاص', 'تفاح اخضر', 'توت بري'],
    object: ['تلفاز', 'تلفون', 'تاج', 'تابوت', 'تمثال', 'تخت', 'تنورة', 'تحفة', 'ترمس', 'توربين', 'تلسكوب', 'تذكرة', 'تاكسي', 'تانكي', 'توصيلة', 'تكتك', 'تيرموميتر', 'ترولي', 'تلفريك', 'تيربو', 'تيلة'],
    country: ['تونس', 'تركيا', 'تايلاند', 'تشيلي', 'تنزانيا', 'تشيك', 'توفالو', 'توغو', 'طاجيكستان', 'تبليسي', 'تورنتو', 'طوكيو', 'تطوان', 'تبوك', 'تركمانستان', 'تيمور الشرقية', 'تايوان', 'تريبولي', 'طرابلس', 'تولوز', 'تورينو'],
    job: ['تاجر', 'تقني', 'تربوي', 'طبيب', 'تمريض', 'ترجمان', 'تطوير', 'تقني حاسوب', 'طيار', 'تاجر مجوهرات', 'تربوي قدير', 'تطريز'],
    food: ['تبولة', 'تكة', 'تورتة', 'تمرية', 'تيراميسو', 'تشيز كيك', 'تورتيلا', 'تاكو', 'توفو', 'تارت', 'تمر محشي', 'تونا']
  },
  // حرف الثاء
  'ث': {
    human: ['ثابت', 'ثامر', 'ثائر', 'ثروت', 'ثنيان', 'ثمامة', 'ثريا', 'ثناء', 'ثمرة', 'ثويبة', 'ثروة', 'ثائرة', 'ثمال', 'ثيودور'],
    animal: ['ثعلب', 'ثور', 'ثعبان', 'ثعلب البحر', 'ثيتل', 'ثرثار', 'ثعبان الماء', 'ثور البحر', 'ثعلب قطبي', 'ثقف'],
    plant: ['ثوم', 'ثمامة', 'ثفاء', 'ثمر الورد', 'ثيل', 'ثويا', 'ثوم معمر', 'ثمام', 'ثمرة العليق', 'ثوم قصبي'],
    object: ['ثوب', 'ثلاجة', 'ثريا', 'ثقل', 'ثقب', 'ثرموستات', 'ثقالة', 'ثلاثي القوائم', 'ثقب المفتاح', 'ثغرة', 'ثروستات'],
    country: ['ثيساليا', 'ثاسوس', 'ثيسالونيكي', 'ثيمفو', 'ثريسور', 'ثاج', 'ثول', 'ثمامة', 'ثقيف', 'ثربان'],
    job: ['ثوري', 'ثرثار', 'ثابت خطى', 'ثري'],
    food: ['ثريد', 'ثومية', 'ثلج', 'ثريد لحم', 'ثلج مجروش']
  },
  // حرف الجيم
  'ج': {
    human: ['جمال', 'جعفر', 'جلال', 'جاسم', 'جابر', 'جميل', 'جهاد', 'جواد', 'جراح', 'جميلة', 'جنى', 'جود', 'جوانا', 'جوهرة', 'جلنار', 'جيهان', 'جوليا', 'جهينة', 'جهير', 'جمانه', 'جليلة', 'جبير', 'جبران', 'جسار'],
    animal: ['جمل', 'جاموس', 'جرو', 'جندب', 'جرذ', 'جربوع', 'جمبري', 'جعار', 'جلمود', 'جندب اخضر', 'جاموس بحري', 'جلعود', 'جاحظ'],
    plant: ['جزر', 'جوز', 'جوافة', 'جرجير', 'جلجلان', 'جاردينيا', 'جهنمية', 'جنزبيل', 'جريب فروت', 'جوز الهند', 'جرجير بري', 'جلنار', 'جاوة', 'جنكة'],
    object: ['جرس', 'جورب', 'جوال', 'جرار', 'جسر', 'جدار', 'جريدة', 'جلد', 'جوهرة', 'جلباب', 'جاكيت', 'جركن', 'جهاز', 'جركل', 'جام', 'جراب', 'جبس', 'جائزة', 'جرافة', 'جعبة'],
    country: ['جزائر', 'جورجيا', 'جامايكا', 'جيبوتي', 'جزر القمر', 'جنوب افريقيا', 'جنيف', 'جدة', 'جاكرتا', 'جوبا', 'جرش', 'جنين', 'جنوب السودان', 'جيرسي', 'جينيف', 'جنينة', 'جعلان'],
    job: ['جزار', 'جاسوس', 'جندي', 'جراح', 'جيولوجي', 'جمركي', 'جرسون', 'جابي', 'جوهرجي', 'جنايني', 'جراح مخ'],
    food: ['جبنة', 'جريش', 'جمبري', 'جاتو', 'جلاش', 'جلاب', 'جبنة موزاريلا', 'جبنة فيتا', 'جلاش باللحمة', 'جمبري مقلي']
  },
  // حرف الحاء
  'ح': {
    human: ['حسن', 'حسين', 'حمزة', 'حازم', 'حسام', 'حاتم', 'حبيب', 'حمد', 'حامد', 'حيدر', 'حفصة', 'حنين', 'حنان', 'حبيبة', 'حليمة', 'حواء', 'حسناء', 'حورية', 'حلا', 'حور', 'حكيم', 'حريث', 'حمدان', 'حميد', 'حفيظ'],
    animal: ['حصان', 'حمار', 'حوت', 'حمامة', 'حلزون', 'حرباء', 'حجل', 'حريش', 'حفش', 'حمامة زاجل', 'حباري', 'حوت ازرق', 'حريشة', 'حسون'],
    plant: ['حمص', 'حنطة', 'حبق', 'حلبة', 'حناء', 'حنظل', 'حمضيات', 'حرمل', 'حبة البركة', 'حبة سوداء', 'حب العزيز', 'حميض', 'حرشف', 'حور'],
    object: ['حقيبة', 'حبل', 'حزام', 'حذاء', 'حاسوب', 'حائط', 'حوض', 'حلقة', 'حجر', 'حاوية', 'حنفية', 'حدوة', 'حصيرة', 'حلق', 'حاوية نفايات', 'حبر', 'حجلة', 'حربة'],
    country: ['حلب', 'حماة', 'حمص', 'حائل', 'حضرموت', 'حيدر اباد', 'حيفا', 'حلوان', 'حمام الانف', 'حفر الباطن', 'حقل', 'حوران', 'حجة'],
    job: ['حارس', 'حلاق', 'حداد', 'حاكم', 'حقوقي', 'حفار', 'حمّال', 'حرفي', 'حلواني', 'حاوي', 'حكواتي', 'حساباتي'],
    food: ['حمص', 'حلاوة', 'حلوى', 'حواوشي', 'حنيذ', 'حساء', 'حنيفي', 'حمص بالطحينة', 'حلاوة طحينية', 'حنيني', 'حلبسة']
  },
  // حرف الخاء
  'خ': {
    human: ['خالد', 'خليل', 'خطاب', 'خضر', 'خميس', 'خلدون', 'خيري', 'خديجة', 'خولة', 'خلود', 'خنساء', 'خزيمة', 'خزاعي', 'خضير', 'خيرات', 'خميسة', 'خواطر'],
    animal: ['خروف', 'خنزير', 'خفاش', 'خلد', 'خنفساء', 'خيل', 'خطاف', 'خردل البحر', 'خنزير بري', 'خرنق', 'خفاش الفاكهة', 'خطاف البحر'],
    plant: ['خس', 'خيار', 'خوخ', 'خرشوف', 'خردل', 'خزامى', 'خروع', 'خروب', 'خشخاش', 'خردل اصفر', 'خبيزة خضراء', 'خوخ مجفف', 'خيار مخلل'],
    object: ['خاتم', 'خزانة', 'خيمة', 'خيط', 'خوذة', 'خرطوم', 'خريطة', 'خلخال', 'خشبة', 'خنجر', 'خرامة', 'خلاط', 'خزان ماء', 'خرز', 'خشخيشة'],
    country: ['خرطوم', 'خراسان', 'خان يونس', 'خميس مشيط', 'خورفكان', 'خيبر', 'خميس', 'خور', 'خيتافي', 'خريص'],
    job: ['خياط', 'خباز', 'خطاط', 'خفير', 'خبير', 'خادم', 'خراط', 'خادم مسجد', 'خطيب', 'خبير اقتصادي'],
    food: ['خبز', 'خشاف', 'خبيزة', 'خروف محشي', 'خل', 'خبز رقاق', 'خبز تميس', 'خبز صامولي', 'خليط كيك']
  },
  // حرف الدال
  'د': {
    human: ['داود', 'دانيال', 'دريد', 'دياب', 'دحام', 'داليا', 'دينا', 'درة', 'دعاء', 'دلال', 'دانية', 'ديمة', 'دارين', 'درويش', 'داغر', 'دليم'],
    animal: ['دب', 'دجاجة', 'دلفين', 'ديك', 'دود', 'دبور', 'دراج', 'دراجون', 'ديناصور', 'دب قطبي', 'دب بني', 'دودة القز', 'دجاج رومي', 'دراغون'],
    plant: ['دوار الشمس', 'دراق', 'دوم', 'دخن', 'دفلى', 'دبق', 'دندور', 'دفلة', 'دوار', 'دراق بلدي', 'دم الأخوين'],
    object: ['دفتر', 'درج', 'دراجة', 'دولاب', 'درع', 'دلو', 'دبوس', 'دبابة', 'دف', 'دمية', 'دستور', 'دريل', 'دبدوب', 'دعامة', 'دروازة', 'دراجة هوائية'],
    country: ['دنمارك', 'دبي', 'دمشق', 'دوحة', 'دبلن', 'دهوك', 'دكار', 'دلهي', 'ديترويت', 'دار السلام', 'دمنهور', 'دوما', 'درعا', 'دير الزور', 'دنفر'],
    job: ['دكتور', 'دهان', 'دبلوماسي', 'دليل', 'درزي', 'درويش', 'دلال عقار', 'دراماتيكي', 'دريول', 'دي جي'],
    food: ['دجاج', 'دولمة', 'دونات', 'داوود باشا', 'دبس', 'دونات كراميل', 'دجاج شواية', 'دجاج مضغوط', 'دجاج مندي']
  },
  // حرف الذال
  'ذ': {
    human: ['ذياب', 'ذكير', 'ذو الفقار', 'ذكوان', 'ذكاء', 'ذكرى', 'ذكريات', 'ذمار'],
    animal: ['ذئب', 'ذباب', 'ذبابة', 'ذرح', 'ذعرة'],
    plant: ['ذرة', 'ذيل الحصان', 'ذرق', 'ذانون'],
    object: ['ذراع', 'ذهب', 'ذخيرة', 'ذبالة'],
    country: ['ذي قار', 'ذمار', 'ذراع بن خدة'],
    job: ['ذباح', 'ذواقة'],
    food: ['ذرة مشوية', 'ذرة مسلوقة']
  },
  // حرف الراء
  'ر': {
    human: ['راشد', 'رامي', 'رياض', 'رضا', 'رائد', 'رفيق', 'رعد', 'رستم', 'ريان', 'رانيا', 'ريم', 'رهف', 'رشا', 'روان', 'رغد', 'رحاب', 'رقية', 'رباب', 'روعة', 'رغدة', 'رنيم', 'رسيل', 'رواء', 'رولان', 'راكان', 'رائف', 'رافع'],
    animal: ['راكون', 'رنة', 'ربيان', 'رميح', 'رخمة', 'رشا', 'رنة قطبية', 'راكون امريكي', 'ربيان بحري', 'ريم'],
    plant: ['رمان', 'ريحان', 'رشاد', 'راوند', 'رند', 'رطبة', 'روزماري', 'روزماري عطري', 'ريحان ايطالي', 'رمان يمني', 'رشاد حب'],
    object: ['رف', 'راديو', 'رسالة', 'رمح', 'ريشة', 'رداء', 'رادار', 'رصاصة', 'رصيف', 'رولمان', 'ريموت', 'ريش', 'رول', 'رصيف شارع', 'رولكس'],
    country: ['روسيا', 'رومانيا', 'رواندا', 'رياض', 'روما', 'رباط', 'رام الله', 'ريو دي جانيرو', 'ريكيافيك', 'راس الخيمة', 'روتردام', 'رفحاء', 'رفح', 'رشت'],
    job: ['رسام', 'راعي', 'رياضي', 'رائد فضاء', 'رئيس', 'ربان', 'راقص', 'رئيس قسم', 'رائد اعمال', 'روائي', 'روبوتي'],
    food: ['رز', 'روستو', 'رافيولي', 'رقاق', 'رنجة', 'رز معمر', 'رز كابلي', 'رز بخاري', 'رز صيادية', 'رواني']
  },
  // حرف الزاي
  'ز': {
    human: ['زياد', 'زيد', 'زكريا', 'زهير', 'زاهي', 'زين', 'زينب', 'زهراء', 'زينة', 'زهور', 'زمردة', 'زبيدة', 'زليخة'],
    animal: ['زرافة', 'زنبور', 'زبابة', 'زرزور', 'زيبرا'],
    plant: ['زيتون', 'زعتر', 'زنجبيل', 'زعفران', 'زنبق', 'زهور', 'زبادي بحري'],
    object: ['زر', 'زجاجة', 'زورق', 'زمزمية', 'زلاجة', 'زخرفة', 'زاوية', 'زناد'],
    country: ['زامبيا', 'زيمبابوي', 'زغرب', 'زنجبار', 'زيورخ', 'زاخو', 'زليتن'],
    job: ['زارع', 'زعيم', 'زجاج'],
    food: ['زبادي', 'زلابية', 'زربيان', 'زعتر بزيت', 'زيت وزعتر']
  },
  // حرف السين
  'س': {
    human: ['سعيد', 'سامي', 'سالم', 'سمير', 'سليمان', 'سعد', 'سيف', 'سامر', 'سراج', 'سارة', 'سلمى', 'سناء', 'سهى', 'سميرة', 'سحر', 'سندس', 'سوزان', 'سدرة', 'سما', 'سلاف', 'سيرين', 'سماهر', 'سهيل', 'سنان', 'سطام', 'سري'],
    animal: ['سمكة', 'سنجاب', 'سلحفاة', 'سرطان', 'سبع', 'سمان', 'سردين', 'سلمون', 'سمندل', 'سمك قرش', 'سمكة تونة', 'سنجاب طائر', 'سلاحف نينجا', 'سحلية'],
    plant: ['سبانخ', 'سمسم', 'سدر', 'سوسن', 'سرو', 'سكر', 'سماق', 'سنط', 'سنبلة'],
    object: ['سيارة', 'ساعة', 'سفينة', 'سكين', 'سرير', 'ستارة', 'سيف', 'سوط', 'سلك', 'سبورة', 'سجادة', 'سلم', 'سلسلة', 'سيف معدني', 'سماعة', 'سلة'],
    country: ['سوريا', 'سعودية', 'سودان', 'سويد', 'سويسرا', 'سنغال', 'سنغافورة', 'سريلانكا', 'سيول', 'سيدني', 'سراييفو', 'سامراء', 'سوسة', 'ساموا', 'سياتل'],
    job: ['سائق', 'سباك', 'سمسار', 'سكرتير', 'سفير', 'ساحر', 'سجان', 'سمكري'],
    food: ['سمك', 'سوشي', 'سلطة', 'سندويش', 'سمبوسة', 'سحلب', 'سبانخ', 'سليق', 'سينابون']
  },
  // حرف الشين
  'ش': {
    human: ['شادي', 'شريف', 'شاكر', 'شوقي', 'شهاب', 'شهم', 'شامخ', 'شهد', 'شيماء', 'شروق', 'شمس', 'شيرين', 'شاهيناز', 'شذى'],
    animal: ['شامبانزي', 'شاهين', 'شبل', 'شيمبانزي', 'شنشيلة', 'شيطان البحر'],
    plant: ['شاي', 'شعير', 'شمام', 'شمر', 'شوك', 'شيران', 'شجرة الدردار'],
    object: ['شباك', 'شاحنة', 'شوكة', 'شمعة', 'شاشة', 'شريط', 'شارع', 'شال', 'شماعة', 'شمسية'],
    country: ['شيلي', 'شارقة', 'شيكاغو', 'شنغهاي', 'شرم الشيخ', 'شفشاون', 'شتوتغارت'],
    job: ['شرطي', 'شاعر', 'شيف', 'شاويش', 'شيخ'],
    food: ['شوربة', 'شاورما', 'شكشوكة', 'شيش طاووق', 'شيش برك', 'شوكولاتة']
  },
  // حرف الصاد
  'ص': {
    human: ['صالح', 'صادق', 'صباح', 'صابر', 'صفوان', 'صهيب', 'صلاح', 'صفاء', 'صباح', 'صابرة', 'صوفيا', 'صفية'],
    animal: ['صقر', 'صرصور', 'صعوة', 'صل', 'صيدناني'],
    plant: ['صبار', 'صنوبر', 'صندل', 'صفصاف', 'صعتر'],
    object: ['صحن', 'صندوق', 'صاروخ', 'صنبور', 'صورة', 'صينية', 'صوف', 'صفيحة', 'صفارة'],
    country: ['صين', 'صومال', 'صربيا', 'صنعاء', 'صيدا', 'صفاقس', 'صوفيا'],
    job: ['صياد', 'صحفي', 'صيدلي', 'صائغ', 'صانع'],
    food: ['صيادية', 'صفيحة', 'صينية بطاطس', 'صب القفشة']
  },
  // حرف الضاد
  'ض': {
    human: ['ضياء', 'ضرار', 'ضاحي', 'ضامر', 'ضحى', 'ضمير', 'ضاوية'],
    animal: ['ضبع', 'ضفدع', 'ضب', 'ضأن'],
    plant: ['ضرو', 'ضمران', 'ضرم', 'ضيمران'],
    object: ['ضمادة', 'ضريح', 'ضوء', 'ضرس صناعي'],
    country: ['ضفة غربية', 'ضاحية', 'ضرما', 'ضبا'],
    job: ['ضابط', 'ضامن', 'ضاروري'],
    food: ['ضلوع', 'ضأن محمر']
  },
  // حرف الطاء
  'ط': {
    human: ['طارق', 'طلال', 'طه', 'طاهر', 'طلعت', 'طرفة', 'طيبة', 'طيف', 'طاهرة'],
    animal: ['طاووس', 'طائر', 'طوقان', 'طنان', 'طربوت'],
    plant: ['طماطم', 'طرخون', 'طلح', 'طحالب', 'طرفاء'],
    object: ['طاولة', 'طائرة', 'طوق', 'طبلة', 'طربوش', 'طنجرة', 'طرد', 'طاحونة', 'طوق نجاة'],
    country: ['طاجيكستان', 'طوكيو', 'طرابلس', 'طنجة', 'طهران', 'طيبة', 'طرطوس'],
    job: ['طبيب', 'طيار', 'طاهي', 'طالب', 'طابع'],
    food: ['طعمية', 'طاجن', 'طحينة', 'طرشي', 'طرمبة']
  },
  // حرف الظاء
  'ظ': {
    human: ['ظافر', 'ظريف', 'ظاهر', 'ظبيان', 'ظريفة', 'ظلال', 'ظبية'],
    animal: ['ظبي', 'ظربان'],
    plant: ['ظيان', 'ظفرة'],
    object: ['ظرف', 'ظلة', 'ظفر صناعي'],
    country: ['ظفار', 'ظهران'],
    job: ['ظابط', 'ظريف'],
    food: ['ظبي مشوي']
  },
  // حرف العين
  'ع': {
    human: ['علي', 'عمر', 'عثمان', 'عبدالله', 'عادل', 'عصام', 'علاء', 'عماد', 'عمار', 'عدنان', 'عائشة', 'عبير', 'علا', 'عفاف', 'عزة', 'عهود', 'عنود'],
    animal: ['عصفور', 'عقرب', 'عنكبوت', 'عجل', 'عقاب', 'عرسة', 'عندليب', 'عثة'],
    plant: ['عنب', 'عدس', 'عصفر', 'عرعر', 'عكوب', 'عود', 'عرقسوس'],
    object: ['عربة', 'علبة', 'علم', 'عصا', 'عقد', 'عطر', 'عجلة', 'عمامة', 'عدسة', 'عكاز'],
    country: ['عراق', 'عمان', 'عمان (الاردن)', 'عنابة', 'عكا', 'عجمان', 'عرعر'],
    job: ['عامل', 'عالم', 'عسكري', 'عازف', 'عطار', 'عمدة'],
    food: ['عدس', 'عجة', 'عصيدة', 'عيش', 'عريكة', 'علي نازك']
  },
  // حرف الغين
  'غ': {
    human: ['غسان', 'غالب', 'غازي', 'غيث', 'غياث', 'غادة', 'غالية', 'غيداء', 'غزل', 'غفران'],
    animal: ['غزال', 'غراب', 'غوريلا', 'غرير', 'غنم'],
    plant: ['غار', 'غاف', 'غردق', 'غبيرية'],
    object: ['غواصة', 'غسالة', 'غطاء', 'غليون', 'غرفة', 'غراء', 'غمد'],
    country: ['غانا', 'غينيا', 'غواتيمالا', 'غزة', 'غرناطة', 'جلاسكو'],
    job: ['غواص', 'غسال', 'غفير'],
    food: ['غريبة', 'غموس', 'غوزي']
  },
  // حرف الفاء
  'ف': {
    human: ['فهد', 'فيصل', 'فارس', 'فؤاد', 'فراس', 'فاضل', 'فاروق', 'فاطمة', 'فرح', 'فريدة', 'فاتن', 'فدوى', 'فادية', 'فيروز', 'فادي'],
    animal: ['فيل', 'فهد', 'فأر', 'فراشة', 'فرس', 'فقمة', 'فلامنجو', 'فاحوش', 'فهد اسود', 'فار', 'فرس النهر'],
    plant: ['فراولة', 'فول', 'فستق', 'فلفل', 'فجل', 'فاصولياء', 'فل', 'فطر', 'فاصوليا'],
    object: ['فانوس', 'فستان', 'فرشاة', 'فنجان', 'فأس', 'فرن', 'فلاش', 'فيديو', 'فلتر', 'فاس', 'فيش'],
    country: ['فرنسا', 'فلسطين', 'فنلندا', 'فلبين', 'فنزويلا', 'فاس', 'فيلادلفيا', 'فرانكفورت', 'فيتنام'],
    job: ['فلاح', 'فنان', 'فيزيائي', 'فيلسوف', 'فني', 'فلكي'],
    food: ['فول', 'فلافل', 'فتوش', 'فتة', 'فطيرة', 'فاهيتا', 'فوسيلي', 'فول مدمس', 'فوتوتشيني']
  },
  // حرف القاف
  'ق': {
    human: ['قاسم', 'قيس', 'قصي', 'قتيبة', 'قنديل', 'قمر', 'قسمة', 'قوت', 'قدري', 'قطر الندى'],
    animal: ['قرد', 'قط', 'قنفذ', 'قرش', 'قنديل البحر', 'قندس', 'قمري', 'قطا', 'قرقف'],
    plant: ['قصب', 'قرنبيط', 'قمح', 'قرع', 'قرفة', 'قرنفل', 'قلقاس', 'قهوة', 'قصب السكر', 'قورو'],
    object: ['قلم', 'قبعة', 'قارب', 'قفل', 'قميص', 'قنبلة', 'قفل', 'قدر', 'قرط', 'قطار', 'قرطاسية'],
    country: ['قطر', 'قبرص', 'قاهرة', 'قدس', 'قيرغيزستان', 'قسنطينة', 'قونية', 'قرطبة'],
    job: ['قاضي', 'قائد', 'قصاب', 'قبطان', 'قارئ', 'قناص'],
    food: ['قراصيا', 'قطايف', 'قشطة', 'قوزي', 'قرنبيط مقلي', 'قهوة', 'قرصان']
  },
  // حرف الكاف
  'ك': {
    human: ['كريم', 'كمال', 'كاظم', 'كنان', 'كرم', 'كارم', 'كوثر', 'كارمن', 'كنزي', 'كاميليا', 'كريمة', 'كندة'],
    animal: ['كلب', 'كنغر', 'كوالا', 'كروان', 'كتكوت', 'كركدن', 'كوبرا', 'كناري'],
    plant: ['كرز', 'كوسة', 'كمثرى', 'كيوي', 'كرنب', 'كاكاو', 'كركديه', 'كزبرة', 'كركم', 'كرفس', 'كوسا'],
    object: ['كرسي', 'كتاب', 'كرة', 'كوب', 'كاميرا', 'كمبيوتر', 'كابل', 'كشاف', 'كيس', 'كفر', 'كورة', 'كيبورد'],
    country: ['كويت', 'كندا', 'كولومبيا', 'كوريا', 'كرواتيا', 'كينيا', 'كوبا', 'كييف', 'كولونيا', 'كوالالمبور', 'كيب تاون'],
    job: ['كاتب', 'كهربائي', 'كابتن', 'كيميائي', 'كوافير', 'كاشير', 'كوميديان'],
    food: ['كبسة', 'كفتة', 'كشري', 'كنافة', 'كوسا محشي', 'كريب', 'كرواسون', 'كباب', 'كوكيز', 'كيك']
  },
  // حرف اللام
  'ل': {
    human: ['ليث', 'لؤي', 'لقمان', 'لطفي', 'لبيد', 'ليلى', 'لمى', 'لين', 'لطيفة', 'لمياء', 'لبنى', 'لجين', 'لورا'],
    animal: ['ليمور', 'لقلق', 'لاما', 'لوريس', 'ليث'],
    plant: ['ليمون', 'لوز', 'لوبياء', 'لفت', 'لافندر', 'لسان الحمل', 'لوتس'],
    object: ['لوح', 'لمبة', 'لعبة', 'لحاف', 'لوحة', 'لجام', 'لاقط', 'لافتة'],
    country: ['لبنان', 'ليبيا', 'لندن', 'لشبونة', 'لوكسمبورغ', 'لاتفيا', 'ليتوانيا', 'لاوس', 'ليما'],
    job: ['لاعب', 'لحام', 'لواء', 'لغوي'],
    food: ['لازانيا', 'لحم', 'لقيمات', 'لبنة', 'لوبيا', 'لسان عصفور']
  },
  // حرف الميم
  'م': {
    human: ['محمد', 'محمود', 'مصطفى', 'ماجد', 'مهند', 'معاذ', 'مروان', 'موسي', 'مراد', 'منصور', 'مريم', 'منى', 'مي', 'منار', 'ميساء', 'ملاك', 'مرام', 'مها', 'ميرنا', 'منيرة', 'ميس'],
    animal: ['ماعز', 'مهر', 'مها', 'مدرع', 'ميمون', 'مارموت', 'مهرة', 'ماموث', 'مرجان', 'ميركات', 'ميدوزا'],
    plant: ['موز', 'مانجو', 'مشمش', 'ملوخية', 'ميرمية', 'مستكة', 'مرامية', 'مرمية', 'مورينجا'],
    object: ['مفتاح', 'مرآة', 'ملعقة', 'مقص', 'مكتب', 'مروحة', 'مظلة', 'منشفة', 'مسبحة', 'مجهر', 'مسطرة', 'منشار', 'محفظة', 'مصباح', 'موبايل'],
    country: ['مصر', 'مغرب', 'مكسيك', 'ماليزيا', 'موريتانيا', 'مدريد', 'مكة', 'مدينة منورة', 'موسكو', 'منامة', 'مسقط', 'ميلانو', 'مالديف', 'موناكو', 'مدينة'],
    job: ['مهندس', 'معلم', 'محامي', 'محاسب', 'مزارع', 'مدير', 'ممرض', 'ميكانيكي', 'مذيع', 'مؤلف'],
    food: ['ملوخية', 'منسف', 'مندي', 'مقلوبة', 'معكرونة', 'مسقعة', 'محشي', 'مطابق', 'مظبي', 'مقلقل', 'مطبق', 'ملوخية بالدجاج', 'مهلبية']
  },
  // حرف النون
  'ن': {
    human: ['ناصر', 'نادر', 'نبيل', 'نورس', 'نهاد', 'نواف', 'نزار', 'نجيب', 'نور', 'ندى', 'نورا', 'نهى', 'نجلاء', 'نسرين', 'نغم', 'نوال', 'نادية', 'نرمين', 'نورة', 'نادين', 'نيرمين'],
    animal: ['نمر', 'نسر', 'نورس', 'نحلة', 'نملة', 'نعامة', 'نيص', 'نو'],
    plant: ['نخلة', 'نعناع', 'نرجس', 'نسرين', 'نبق', 'ناردين'],
    object: ['نافذة', 'نظارة', 'نرد', 'ناي', 'نجم', 'نفق', 'نقود', 'نصل', 'نحاس', 'نعل', 'نار', 'نجفة', 'نبراس'],
    country: ['نرويج', 'نيبال', 'نيجيريا', 'نيوزيلندا', 'نمسا', 'نيويورك', 'نابلس', 'نجف', 'نيودلهي', 'نيروبي', 'نجران'],
    job: ['نجار', 'نحات', 'نوخذة', 'ناقد', 'نادل', 'نقاش', 'ناشر', 'نقيب'],
    food: ['ناجتس', 'نودلز', 'نمورة', 'نيفا', 'نيوتيلا', 'ناشف لحم']
  },
  // حرف الهاء
  'ه': {
    human: ['هشام', 'هاني', 'هيثم', 'هارون', 'همام', 'هاشم', 'هادي', 'هدى', 'هند', 'هناء', 'هيا', 'هالة', 'هاجر', 'همسة'],
    animal: ['هر', 'هدهد', 'هامستر', 'هيبوبوتاموس', 'هجين'],
    plant: ['هيل', 'هندباء', 'هشيم', 'هيدرانجيا', 'هليون'],
    object: ['هاتف', 'هرم', 'هلال', 'هاون', 'هيكل', 'هودج', 'هوائي'],
    country: ['هند', 'هولندا', 'هندوراس', 'هلسنكي', 'هيروشيما', 'هامبورغ', 'هونغ كونغ'],
    job: ['مهندس', 'هيدرولوجي', 'هاو'],
    food: ['همبرغر', 'هريس', 'هريسة', 'هوت دوغ']
  },
  // حرف الواو
  'و': {
    human: ['وليد', 'وائل', 'وسيم', 'وديع', 'وهيب', 'وجدي', 'وفاء', 'وردة', 'وئام', 'وعد', 'وسن', 'وجدان', 'ولاء'],
    animal: ['وعل', 'وطواط', 'وزة', 'ورل', 'وحيد القرن', 'وشق'],
    plant: ['ورد', 'ورس', 'وهط', 'وسمة', 'ونكا'],
    object: ['ورقة', 'وسادة', 'وعاء', 'وشاح', 'ولاعة', 'واير', 'وتد'],
    country: ['واشنطن', 'وارسو', 'ويلز', 'وجدة', 'وهران', 'ويندهوك'],
    job: ['وزير', 'وكيل', 'وسيط', 'وجيه'],
    food: ['ورق عنب', 'وافل', 'وجبة سريعة']
  },
  // حرف الياء
  'ي': {
    human: ['ياسر', 'يوسف', 'يونس', 'يحيى', 'يعقوب', 'يزيد', 'يمان', 'يسرى', 'ياسمين', 'يارا', 'يمامة', 'يمنى', 'يسرا'],
    animal: ['يمامة', 'يعسوب', 'يربوع', 'يحمور', 'يؤيؤ'],
    plant: ['ياسمين', 'يانسون', 'يقطين', 'يوكا', 'يوسفي'],
    object: ['يخت', 'ياقة', 'يرقة زجاجية', 'يد باب', 'ياقوت'],
    country: ['يمن', 'يونان', 'يابسة', 'يانغون', 'يريفان', 'يثرب', 'ينبع'],
    job: ['ياور', 'يوغي'],
    food: ['يخنة', 'يغمش', 'يانسون مغلي']
  }
};

/**
 * دالة تطبيع النصوص العربية لإزالة التشكيل والزوائد وتوحيد الهمزات
 */
function normalizeArabic(text) {
  if (!text) return '';
  return text
    .trim()
    .toLowerCase()
    // إزالة التشكيل والتنوين
    .replace(/[\u064B-\u065F\u0670]/g, '')
    // إزالة التطويل
    .replace(/\u0640/g, '')
    // توحيد الألف
    .replace(/[أإآا]/g, 'ا')
    // توحيد الياء
    .replace(/[ىي]/g, 'ي')
    // توحيد التاء المربوطة والهاء في النهاية
    .replace(/ة$/g, 'ه');
}



/**
 * قاموس اللغة الإنجليزية الشامل للتصنيفات
 */
const ENGLISH_DICTIONARY = {
  'A': {
    human: ['Alex', 'Adam', 'Alice', 'Amanda', 'Andrew', 'Arthur', 'Anna', 'Aaron', 'Anthony', 'Ashley'],
    animal: ['Alligator', 'Ant', 'Anteater', 'Ape', 'Armadillo', 'Albatross', 'Antelope'],
    plant: ['Apple', 'Apricot', 'Avocado', 'Aloe vera', 'Acacia', 'Aster', 'Asparagus'],
    object: ['Airplane', 'Anchor', 'Axe', 'Arrow', 'Alarm clock', 'Album', 'Anvil'],
    country: ['America', 'Argentina', 'Australia', 'Austria', 'Algeria', 'Amsterdam', 'Athens'],
    job: ['Actor', 'Architect', 'Artist', 'Astronaut', 'Accountant', 'Author'],
    food: ['Apple pie', 'Avocado toast', 'Alfredo pasta', 'Almonds', 'Asparagus soup']
  },
  'B': {
    human: ['Bob', 'Ben', 'Brian', 'Bella', 'Brandon', 'Barbara', 'Benjamin', 'Brooke'],
    animal: ['Bear', 'Bat', 'Beaver', 'Bee', 'Buffalo', 'Butterfly', 'Baboon', 'Boar'],
    plant: ['Banana', 'Bamboo', 'Basil', 'Bean', 'Blueberry', 'Begonia', 'Broccoli'],
    object: ['Ball', 'Bed', 'Book', 'Bottle', 'Box', 'Bridge', 'Bicycle', 'Belt'],
    country: ['Brazil', 'Britain', 'Belgium', 'Bulgaria', 'Bahrain', 'Berlin', 'Beirut'],
    job: ['Baker', 'Barber', 'Builder', 'Biologist', 'Butcher', 'Bartender'],
    food: ['Burger', 'Bread', 'Burrito', 'Bacon', 'Bagel', 'Brownie']
  },
  'C': {
    human: ['Charlie', 'Chris', 'Clara', 'Chloe', 'Cameron', 'Catherine', 'Caleb'],
    animal: ['Cat', 'Cow', 'Camel', 'Cheetah', 'Chimpanzee', 'Crab', 'Crocodile'],
    plant: ['Cactus', 'Carrot', 'Cherry', 'Clover', 'Corn', 'Cucumber', 'Cabbage'],
    object: ['Car', 'Chair', 'Clock', 'Computer', 'Cup', 'Camera', 'Coin', 'Candle'],
    country: ['Canada', 'China', 'Chile', 'Colombia', 'Croatia', 'Cairo', 'Chicago'],
    job: ['Chef', 'Carpenter', 'Cashier', 'Coach', 'Cleaner', 'Chemist'],
    food: ['Cake', 'Cheese', 'Chicken', 'Cookie', 'Chocolate', 'Curry']
  },
  'D': {
    human: ['David', 'Daniel', 'Diana', 'Dylan', 'Daisy', 'Dean', 'Dominic'],
    animal: ['Dog', 'Dolphin', 'Duck', 'Deer', 'Donkey', 'Dragonfly', 'Dingo'],
    plant: ['Daisy', 'Dandelion', 'Date', 'Dill', 'Dragon fruit', 'Dahlia'],
    object: ['Door', 'Desk', 'Drum', 'Dice', 'Diamond', 'Dish', 'Drone'],
    country: ['Denmark', 'Dominica', 'Dublin', 'Dubai', 'Dallas', 'Delhi'],
    job: ['Doctor', 'Driver', 'Dentist', 'Detective', 'Diver', 'Designer'],
    food: ['Donut', 'Dumpling', 'Duck roast', 'Dark chocolate', 'Dill pickle']
  },
  'E': {
    human: ['Emma', 'Ethan', 'Edward', 'Emily', 'Eric', 'Elena', 'Elijah'],
    animal: ['Elephant', 'Eagle', 'Eel', 'Emu', 'Elk', 'Earthworm', 'Echidna'],
    plant: ['Eggplant', 'Elderberry', 'Elm', 'Eucalyptus', 'Echinacea'],
    object: ['Envelope', 'Eraser', 'Engine', 'Earrings', 'Elevator', 'Eye glasses'],
    country: ['Egypt', 'Ecuador', 'Estonia', 'Ethiopia', 'England', 'Edinburgh'],
    job: ['Engineer', 'Electrician', 'Economist', 'Editor', 'Educator'],
    food: ['Eggs', 'Enchilada', 'Eclair', 'Edamame', 'Egg salad']
  },
  'F': {
    human: ['Frank', 'Fiona', 'Felix', 'Faith', 'Finn', 'Fred', 'Francesca'],
    animal: ['Fox', 'Frog', 'Fish', 'Flamingo', 'Falcon', 'Ferret', 'Firefly'],
    plant: ['Fern', 'Fig', 'Fax', 'Fuchsia', 'Fennel', 'Fir'],
    object: ['Fork', 'Fan', 'Flag', 'Flashlight', 'Frame', 'Fence', 'Flute'],
    country: ['France', 'Finland', 'Fiji', 'Frankfurt', 'Florence'],
    job: ['Firefighter', 'Farmer', 'Fisherman', 'Florist', 'Flight attendant'],
    food: ['Fries', 'Fish and chips', 'Falafel', 'Fudge', 'Fruit salad']
  },
  'G': {
    human: ['George', 'Grace', 'Gabriel', 'Gloria', 'Gavin', 'Gina'],
    animal: ['Giraffe', 'Goat', 'Gorilla', 'Goose', 'Goldfish', 'Gazelle'],
    plant: ['Grape', 'Garlic', 'Geranium', 'Ginger', 'Grapefruit', 'Grass'],
    object: ['Guitar', 'Glass', 'Glove', 'Gun', 'Gate', 'Gift', 'Glasses'],
    country: ['Germany', 'Greece', 'Ghana', 'Guatemala', 'Geneva'],
    job: ['Gardener', 'Geologist', 'Graphic designer', 'Guard', 'Guide'],
    food: ['Guacamole', 'Garlic bread', 'Gelato', 'Gnocchi', 'Grapes']
  },
  'H': {
    human: ['Henry', 'Hannah', 'Harry', 'Harper', 'Helen', 'Hunter'],
    animal: ['Horse', 'Hyena', 'Hamster', 'Hawk', 'Hippopotamus', 'Hedgehog'],
    plant: ['Hibiscus', 'Hazelnut', 'Honeysuckle', 'Hemp', 'Hydrangea'],
    object: ['Hat', 'Hammer', 'Helicopter', 'House', 'Hook', 'Helmet'],
    country: ['Holland', 'Honduras', 'Hungary', 'Havana', 'Helsinki', 'Houston'],
    job: ['Hairdresser', 'Historian', 'Hotel manager', 'Herbalist'],
    food: ['Hot dog', 'Hamburger', 'Hummus', 'Honey', 'Hash browns']
  },
  'I': {
    human: ['Ian', 'Isabella', 'Isaac', 'Iris', 'Ivan', 'Ivy'],
    animal: ['Iguana', 'Impala', 'Ibex', 'Insect', 'Ibis'],
    plant: ['Ivy', 'Iris', 'Iceberg lettuce', 'Indigo'],
    object: ['Iron', 'Ink', 'Island model', 'Instrument', 'Igloo'],
    country: ['Italy', 'India', 'Ireland', 'Iceland', 'Indonesia', 'Istanbul'],
    job: ['Instructor', 'Inspector', 'Illustrator', 'Interpreter'],
    food: ['Ice cream', 'Irish stew', 'Italian pasta', 'Iced tea']
  },
  'J': {
    human: ['Jack', 'James', 'Jessica', 'John', 'Julia', 'Joseph', 'Jasmine'],
    animal: ['Jaguar', 'Jellyfish', 'Jackal', 'Jaybird'],
    plant: ['Jasmine', 'Juniper', 'Jalapeno', 'Jade plant'],
    object: ['Jacket', 'Jar', 'Jeep', 'Jet', 'Jewelry', 'Jug'],
    country: ['Japan', 'Jordan', 'Jamaica', 'Jakarta', 'Jerusalem'],
    job: ['Judge', 'Journalist', 'Janitor', 'Jeweler', 'Jockey'],
    food: ['Jam', 'Jelly', 'Jambalaya', 'Jerky']
  },
  'K': {
    human: ['Kevin', 'Kate', 'Kyle', 'Karen', 'Ken', 'Kayla'],
    animal: ['Kangaroo', 'Koala', 'Kingfisher', 'Kiwi bird', 'Killer whale'],
    plant: ['Kiwi', 'Kale', 'Kelp', 'Kumquat'],
    object: ['Key', 'Knife', 'Kite', 'Kettle', 'Keyboard'],
    country: ['Kenya', 'Kuwait', 'Korea', 'Kazakhstan', 'Kyiv', 'Kyoto'],
    job: ['Kitchen chef', 'Karate instructor', 'Kinesiologist'],
    food: ['Kebab', 'Kimchi', 'Key lime pie', 'Ketchup']
  },
  'L': {
    human: ['Leo', 'Liam', 'Lucy', 'Lucas', 'Lily', 'Luke', 'Laura'],
    animal: ['Lion', 'Leopard', 'Llama', 'Lobster', 'Lizard', 'Lemur'],
    plant: ['Lemon', 'Lime', 'Lavender', 'Lotus', 'Lettuce', 'Lilac'],
    object: ['Lamp', 'Ladder', 'Laptop', 'Lock', 'Leaves', 'Locket'],
    country: ['Lebanon', 'Libya', 'Luxembourg', 'London', 'Lisbon', 'Lima'],
    job: ['Lawyer', 'Librarian', 'Lifeguard', 'Lecturer', 'Laborer'],
    food: ['Lasagna', 'Lobster roll', 'Lemon cake', 'Lentil soup']
  },
  'M': {
    human: ['Michael', 'Mia', 'Matthew', 'Maya', 'Mark', 'Mary', 'Max'],
    animal: ['Monkey', 'Mouse', 'Moose', 'Mole', 'Moth', 'Mantis'],
    plant: ['Mango', 'Mint', 'Maple', 'Mushroom', 'Melon', 'Marigold'],
    object: ['Mirror', 'Magnet', 'Mask', 'Map', 'Motorcycle', 'Mug'],
    country: ['Mexico', 'Morocco', 'Malaysia', 'Madrid', 'Moscow', 'Miami'],
    job: ['Mechanic', 'Musician', 'Manager', 'Miner', 'Model'],
    food: ['Macaroni', 'Muffin', 'Mashed potatoes', 'Meatballs']
  },
  'N': {
    human: ['Noah', 'Nora', 'Nathan', 'Nina', 'Nicholas', 'Nicole'],
    animal: ['Newt', 'Nightingale', 'Narwhal', 'Numbat'],
    plant: ['Nettle', 'Nutmeg', 'Narcissus', 'Nectarine'],
    object: ['Needle', 'Notebook', 'Net', 'Nail', 'Necklace'],
    country: ['Norway', 'Nepal', 'New Zealand', 'Nigeria', 'New York', 'Nairobi'],
    job: ['Nurse', 'Naval officer', 'Nutritionist', 'News anchor'],
    food: ['Noodles', 'Nachos', 'Nuggets', 'Nutella']
  },
  'O': {
    human: ['Oliver', 'Olivia', 'Oscar', 'Owen', 'Ophelia', 'Omar'],
    animal: ['Owl', 'Octopus', 'Ostrich', 'Otter', 'Ox', 'Oyster'],
    plant: ['Oak', 'Olive', 'Orchid', 'Orange', 'Onion', 'Oregano'],
    object: ['Oven', 'Oar', 'Oil lamp', 'Organ', 'Ornament'],
    country: ['Oman', 'Oslo', 'Ottawa', 'Orlando', 'Osaka'],
    job: ['Optometrist', 'Officer', 'Operator', 'Orthodontist'],
    food: ['Omelette', 'Onion rings', 'Oatmeal', 'Orange chicken']
  },
  'P': {
    human: ['Peter', 'Paul', 'Penny', 'Patrick', 'Philip', 'Paula'],
    animal: ['Penguin', 'Panda', 'Parrot', 'Pig', 'Peacock', 'Panther'],
    plant: ['Pineapple', 'Peach', 'Pea', 'Poppy', 'Palm', 'Potato'],
    object: ['Pen', 'Pencil', 'Piano', 'Phone', 'Plate', 'Pillow'],
    country: ['Portugal', 'Poland', 'Peru', 'Paris', 'Prague', 'Philly'],
    job: ['Pilot', 'Police officer', 'Painter', 'Plumber', 'Pharmacist'],
    food: ['Pizza', 'Pancake', 'Pasta', 'Pie', 'Popcorn']
  },
  'Q': {
    human: ['Quinn', 'Quentin', 'Queen', 'Quincy'],
    animal: ['Quail', 'Quokka', 'Quoll'],
    plant: ['Quince', 'Quinoa', 'Queen Anne lace'],
    object: ['Quilt', 'Quiver', 'Quarter coin'],
    country: ['Qatar', 'Quebec', 'Quito'],
    job: ['Quality inspector', 'Quantum physicist'],
    food: ['Quesadilla', 'Quiche', 'Quinoa bowl']
  },
  'R': {
    human: ['Ryan', 'Rachel', 'Robert', 'Rose', 'Richard', 'Ruby'],
    animal: ['Rabbit', 'Racoon', 'Rhino', 'Rat', 'Raven', 'Reindeer'],
    plant: ['Rose', 'Rice', 'Rosemary', 'Radish', 'Raspberry'],
    object: ['Radio', 'Rope', 'Ring', 'Rocket', 'Ruler', 'Robot'],
    country: ['Russia', 'Romania', 'Rwanda', 'Rome', 'Riyadh'],
    job: ['Reporter', 'Researcher', 'Radiologist', 'Roofer'],
    food: ['Ramen', 'Ravioli', 'Roast beef', 'Rice bowl', 'Risotto']
  },
  'S': {
    human: ['Sam', 'Sarah', 'Simon', 'Sophia', 'Steve', 'Stella'],
    animal: ['Snake', 'Shark', 'Sheep', 'Squirrel', 'Swan', 'Spider'],
    plant: ['Sunflower', 'Spinach', 'Strawberry', 'Sage', 'Sugar cane'],
    object: ['Sword', 'Scissors', 'Spoon', 'Ship', 'Shoe', 'Soap'],
    country: ['Spain', 'Sweden', 'Switzerland', 'Syria', 'Sydney', 'Seoul'],
    job: ['Scientist', 'Singer', 'Sailor', 'Surgeon', 'Soldier'],
    food: ['Salad', 'Sandwich', 'Soup', 'Steak', 'Sushi', 'Spaghetti']
  },
  'T': {
    human: ['Tom', 'Thomas', 'Taylor', 'Tina', 'Toby', 'Tara'],
    animal: ['Tiger', 'Turtle', 'Toucan', 'Turkey', 'Trout', 'Toad'],
    plant: ['Tulip', 'Tomato', 'Tea', 'Thyme', 'Tobacco'],
    object: ['Table', 'Telephone', 'Telescope', 'Train', 'Tent'],
    country: ['Turkey', 'Thailand', 'Tunisia', 'Tokyo', 'Toronto'],
    job: ['Teacher', 'Tailor', 'Technician', 'Therapist', 'Taxi driver'],
    food: ['Tacos', 'Toast', 'Tiramisu', 'Tuna salad', 'Tart']
  },
  'U': {
    human: ['Uma', 'Uri', 'Ulysses', 'Ursula'],
    animal: ['Urchin', 'Urial', 'Umbrellabird'],
    plant: ['Ugli fruit', 'Umbrella pine', 'Uva'],
    object: ['Umbrella', 'Uniform', 'Urn', 'Ukulele'],
    country: ['Uganda', 'Ukraine', 'Uruguay', 'Ubekistan', 'Utrecht'],
    job: ['Umpire', 'Urologist', 'Urban planner'],
    food: ['Udon noodles', 'Upside down cake']
  },
  'V': {
    human: ['Victor', 'Victoria', 'Vincent', 'Vanessa', 'Violet'],
    animal: ['Vulture', 'Viper', 'Vole', 'Vicuna'],
    plant: ['Vanilla', 'Violet', 'Vine', 'Verbena'],
    object: ['Violin', 'Vase', 'Van', 'Vest', 'Valve'],
    country: ['Vietnam', 'Venezuela', 'Vatican', 'Vienna', 'Venice'],
    job: ['Veterinarian', 'Violinist', 'Valet', 'Voice actor'],
    food: ['Vanilla ice cream', 'Veal cutlet', 'Vegetable soup']
  },
  'W': {
    human: ['William', 'Wendy', 'Walter', 'Willow', 'Wayne'],
    animal: ['Wolf', 'Whale', 'Walrus', 'Worm', 'Wasp', 'Woodpecker'],
    plant: ['Watermelon', 'Wheat', 'Willow', 'Walnut', 'Wasabi'],
    object: ['Watch', 'Wheel', 'Window', 'Whistle', 'Wallet'],
    country: ['Wales', 'Warsaw', 'Washington', 'Wellington'],
    job: ['Writer', 'Waiter', 'Welder', 'Web developer'],
    food: ['Waffles', 'Wings', 'Wrap', 'Watermelon slice']
  },
  'X': {
    human: ['Xavier', 'Xander', 'Xenia'],
    animal: ['X-ray fish', 'Xerus', 'Xenops'],
    plant: ['Xanthium', 'Xerophyte'],
    object: ['Xylophone', 'X-ray machine'],
    country: ['Xi\'an', 'Xalapa'],
    job: ['Xylophonist', 'X-ray technician'],
    food: ['Xacuti curry', 'Xiao long bao']
  },
  'Y': {
    human: ['Yasmine', 'Yusuf', 'Yara', 'Yves'],
    animal: ['Yak', 'Yellowjacket', 'Yorkie'],
    plant: ['Yam', 'Yucca', 'Yarrow', 'Yew'],
    object: ['Yacht', 'Yo-yo', 'Yarn'],
    country: ['Yemen', 'Yerevan', 'Yokohama'],
    job: ['Yoga instructor', 'Youtuber'],
    food: ['Yogurt', 'Yorkshire pudding', 'Yams']
  },
  'Z': {
    human: ['Zack', 'Zoe', 'Zara', 'Zane'],
    animal: ['Zebra', 'Zebu', 'Zorilla'],
    plant: ['Zucchini', 'Zinnia'],
    object: ['Zipper', 'Zeppelin'],
    country: ['Zambia', 'Zimbabwe', 'Zagreb', 'Zurich'],
    job: ['Zoologist', 'Zookeeper'],
    food: ['Zucchini bread', 'Ziti pasta']
  }
};

/**
 * دالة التحقق الشاملة (عربي وإنجليزي)
 */
function validateWord(word, targetLetter, category) {
  if (!word || !targetLetter || !category) return { valid: false, reason: 'حقل فارغ' };

  // فحص هل الحرف والكلمة بالإنجليزية
  const isEnglish = /^[A-Za-z]/.test(targetLetter);

  if (isEnglish) {
    const cleanWord = word.trim().toUpperCase();
    const cleanTarget = targetLetter.trim().toUpperCase();

    // تجاهل أدوات التعريف الإنجليزية 'THE ' أو 'A '
    let stripped = cleanWord;
    if (cleanWord.startsWith('THE ') && cleanWord.length > 4) {
      stripped = cleanWord.substring(4);
    } else if (cleanWord.startsWith('A ') && cleanWord.length > 2) {
      stripped = cleanWord.substring(2);
    }

    const starts = cleanWord.startsWith(cleanTarget) || stripped.startsWith(cleanTarget);
    if (!starts) {
      return { valid: false, reason: `Word does not start with (${targetLetter.toUpperCase()})` };
    }

    const dict = ENGLISH_DICTIONARY[cleanTarget];
    if (dict && dict[category]) {
      const list = dict[category].map(w => w.toUpperCase());
      const found = list.some(w => w === cleanWord || w === stripped);
      if (found) {
        return { valid: true, exactMatch: true, reason: 'Matched standard dictionary' };
      }
    }

    return { valid: false, exactMatch: false, reason: `Word not recognized in dictionary for (${category})` };
  }

  // وإلا فحص باللغة العربية
  const normTarget = normalizeArabic(targetLetter);
  let cleanWord = normalizeArabic(word);

  let strippedWord = cleanWord;
  if (cleanWord.startsWith('ال') && cleanWord.length > 2) {
    strippedWord = cleanWord.substring(2);
  }

  const startsDirect = cleanWord.startsWith(normTarget);
  const startsStripped = strippedWord.startsWith(normTarget);

  if (!startsDirect && !startsStripped) {
    return {
      valid: false,
      exactMatch: false,
      reason: `الكلمة لا تبدأ بحرف (${targetLetter})`
    };
  }

  const letterDict = ARABIC_DICTIONARY[normTarget];
  if (!letterDict || !letterDict[category]) {
    return { valid: false, exactMatch: false, reason: 'تصنيف أو حرف غير متوفر في المعجم' };
  }

  const categoryWords = letterDict[category].map(normalizeArabic);

  // مطابقة صريحة دقيقة (إما الكلمة كاملة أو بعد تجريد الـ التعريف)
  const found = categoryWords.some(dictWord => {
    return dictWord === cleanWord || dictWord === strippedWord;
  });

  if (found) {
    return { valid: true, exactMatch: true, reason: 'اللفظ مطابق ومثبت في المعجم العربي' };
  }

  return { valid: false, exactMatch: false, reason: 'الكلمة غير مسجلة في معجم هذا التصنيف' };
}

/**
 * الحصول على كلمة عشوائية للذكاء الاصطناعي (AI Opponent) - تدعم العربي والإنجليزي
 */
function getAiWord(letter, category, difficulty = 'medium') {
  const isEnglish = /^[A-Za-z]/.test(letter);

  if (isEnglish) {
    const l = letter.toUpperCase();
    const dict = ENGLISH_DICTIONARY[l];
    if (!dict || !dict[category]) return '';
    const words = dict[category];
    const rand = Math.random();
    if (difficulty === 'easy' && rand < 0.35) return '';
    if (difficulty === 'medium' && rand < 0.15) return '';
    return words[Math.floor(Math.random() * words.length)];
  }

  const normLetter = normalizeArabic(letter);
  const letterDict = ARABIC_DICTIONARY[normLetter];
  if (!letterDict || !letterDict[category]) return '';

  const words = letterDict[category];
  const rand = Math.random();
  if (difficulty === 'easy' && rand < 0.35) return '';
  if (difficulty === 'medium' && rand < 0.15) return '';

  return words[Math.floor(Math.random() * words.length)];
}
