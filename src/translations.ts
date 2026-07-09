export type Language = 'en' | 'ar';

export interface TranslationSet {
  // Auth Screen
  portalTitle: string;
  supervisedBy: string;
  mohamedSalah: string;
  hagarAfifi: string;
  teachingPrim: string;
  teachingPrepSec: string;
  studentLogin: string;
  register: string;
  staffPortal: string;
  studentFullName: string;
  gradeLevel: string;
  chooseAvatar: string;
  uploadPhoto: string;
  customPhotoUploaded: string;
  phoneNumber: string;
  password: string;
  usernameOrPhone: string;
  logInSecurely: string;
  registerAccount: string;
  demoCredentials: string;
  pendingApproval: string;
  pendingApprovalDesc: string;

  // Stages
  primStage: string;
  prepStage: string;
  secStage: string;
  summerCourses: string;
  isTrial: string;

  // Sidebar / Navigation
  studentDirectory: string;
  lessonsVideos: string;
  interactiveTests: string;
  booksWorkbooks: string;
  vocabularySpelling: string;
  solvedLogs: string;
  teacherStaff: string;
  refreshData: string;
  signOut: string;

  // Student Dashboard
  yourSupervisor: string;
  supervisorDesc: string;
  activeSupervisor: string;
  welcomeBack: string;
  gradeLabel: string;
  viewsRemaining: string;
  unlimitedViews: string;
  noVideos: string;
  noTests: string;
  noBooks: string;
  noWords: string;
  solveTest: string;
  score: string;
  solvedOn: string;
  viewResult: string;
  interactiveTool: string;
  pdfDocument: string;
  openBooklet: string;
  downloadPdf: string;
  pronounce: string;
  launchStudyTool: string;
  backToDashboard: string;

  // Teacher Dashboard
  mainAdmin: string;
  teacherStaffBadge: string;
  registeredStudents: string;
  approveStudent: string;
  approveUnlimited: string;
  approveMonth: string;
  activeStatus: string;
  pendingStatus: string;
  suspendedStatus: string;
  addInstructor: string;
  makeAdmin: string;
  instructorRole: string;
  staffUsername: string;
  statusLabel: string;
  cancel: string;
  saveProfile: string;
  deleteConfirm: string;
  changePassword: string;
  newPassword: string;
  passwordChangedSuccess: string;
  confirmNewPassword: string;
  passwordsDoNotMatch: string;
  enterNewPassword: string;
  announcements: string;
  addAnnouncement: string;
  announcementTitle: string;
  announcementContent: string;
  announcementType: string;
  reviewType: string;
  scheduleType: string;
  honorType: string;
  generalType: string;
  targetGrade: string;
  announcementCreated: string;
  announcementDeleted: string;
  allGrades: string;
}

export const translations: Record<Language, TranslationSet> = {
  en: {
    portalTitle: 'English House Portal',
    supervisedBy: 'Supervised by',
    mohamedSalah: 'Mr. Mohamed Salah',
    hagarAfifi: 'Ms. Hagar Afifi',
    teachingPrim: 'Teaching Primary stage (Grades 1-6)',
    teachingPrepSec: 'Teaching Preparatory & Secondary stages (Grades 7-12)',
    studentLogin: 'Student Login',
    register: 'Register',
    staffPortal: 'Staff Portal',
    studentFullName: 'Student Full Name',
    gradeLevel: 'Grade (Level)',
    chooseAvatar: 'Choose Avatar or Upload Picture',
    uploadPhoto: 'Upload your own photo',
    customPhotoUploaded: 'Custom picture uploaded!',
    phoneNumber: 'Phone Number',
    password: 'Password',
    usernameOrPhone: 'Username or Phone',
    logInSecurely: 'Log In Securely',
    registerAccount: 'Register Account',
    demoCredentials: 'Demo Access Credentials',
    pendingApproval: 'Registration Pending',
    pendingApprovalDesc: 'Your registration request has been successfully submitted! Please wait for Mr. Mohamed Salah or Ms. Hagar Afifi to approve your account.',
    
    primStage: 'Primary Stage (Grades 1-6)',
    prepStage: 'Preparatory Stage (Grades 7-9)',
    secStage: 'Secondary Stage (Grades 10-12)',
    summerCourses: 'Summer Courses',
    isTrial: 'Trial Student / Content',

    studentDirectory: 'Student Directory',
    lessonsVideos: 'Lessons Videos',
    interactiveTests: 'Interactive Tests',
    booksWorkbooks: 'Books & Workbooks',
    vocabularySpelling: 'Vocabulary & Spelling',
    solvedLogs: 'Solved Attempts Logs',
    teacherStaff: 'Teacher Staff Directory',
    refreshData: 'Refresh Data',
    signOut: 'Sign Out',

    yourSupervisor: 'Your Supervisor / Teacher',
    supervisorDesc: 'In charge of your stage and grading your interactive activities.',
    activeSupervisor: 'Supervisor Profile',
    welcomeBack: 'Welcome back',
    gradeLabel: 'Grade',
    viewsRemaining: 'views left',
    unlimitedViews: 'Unlimited views',
    noVideos: 'No video lessons listed for your Grade yet.',
    noTests: 'No interactive exams listed for your Grade yet.',
    noBooks: 'No book documents uploaded for your Grade yet.',
    noWords: 'No vocabulary words listed for your Grade yet.',
    solveTest: 'Solve Exam',
    score: 'Score',
    solvedOn: 'Solved on',
    viewResult: 'View Result',
    interactiveTool: 'Interactive Booklet',
    pdfDocument: 'PDF Document',
    openBooklet: 'Open Booklet',
    downloadPdf: 'Download PDF',
    pronounce: 'Pronounce',
    launchStudyTool: 'Launch Study Tool',
    backToDashboard: 'Back to Dashboard',

    mainAdmin: 'MAIN ADMIN',
    teacherStaffBadge: 'TEACHER STAFF',
    registeredStudents: 'Registered Students List',
    approveStudent: 'Approve Student Access',
    approveUnlimited: 'Unlimited Access',
    approveMonth: '1-Month Access',
    activeStatus: 'Active',
    pendingStatus: 'Pending',
    suspendedStatus: 'Suspended',
    addInstructor: 'Add Instructor Staff',
    makeAdmin: 'Make Admin (Full Control)',
    instructorRole: 'Staff Access Level',
    staffUsername: 'Staff Username',
    statusLabel: 'Account Status',
    cancel: 'Cancel',
    saveProfile: 'Save Profile',
    deleteConfirm: 'Are you absolutely sure you want to delete this user? This action is irreversible.',
    changePassword: 'Change Password',
    newPassword: 'New Password',
    passwordChangedSuccess: 'Password updated successfully!',
    confirmNewPassword: 'Confirm New Password',
    passwordsDoNotMatch: 'Passwords do not match!',
    enterNewPassword: 'Enter your new password',
    announcements: 'Announcements',
    addAnnouncement: 'Create New Announcement',
    announcementTitle: 'Announcement Title',
    announcementContent: 'Announcement Message Details',
    announcementType: 'Announcement Category',
    reviewType: 'Exam Review / revision',
    scheduleType: 'Classes / Deadlines schedule',
    honorType: 'Honor / Award Ceremony 🏆',
    generalType: 'General Announcement',
    targetGrade: 'Target Grade Level',
    announcementCreated: 'Announcement created successfully!',
    announcementDeleted: 'Announcement deleted successfully.',
    allGrades: 'All Grades / Stages'
  },
  ar: {
    portalTitle: 'بوابة إنجلش هاوس التعليمية',
    supervisedBy: 'تحت إشراف المعلمين',
    mohamedSalah: 'أ. محمد صلاح',
    hagarAfifi: 'أ. هاجر عفيفي',
    teachingPrim: 'تدريس المرحلة الابتدائية (الصفوف ١-٦)',
    teachingPrepSec: 'تدريس المرحلتين الإعدادية والثانوية (الصفوف ٧-١٢)',
    studentLogin: 'دخول الطلاب',
    register: 'تسجيل جديد',
    staffPortal: 'بوابة المعلمين',
    studentFullName: 'اسم الطالب ثلاثي',
    gradeLevel: 'الصف الدراسي',
    chooseAvatar: 'اختر صورة رمزية أو ارفع صورتك',
    uploadPhoto: 'رفع صورتك الشخصية',
    customPhotoUploaded: 'تم رفع الصورة بنجاح!',
    phoneNumber: 'رقم الهاتف (الواتساب)',
    password: 'كلمة المرور',
    usernameOrPhone: 'اسم المستخدم أو رقم الهاتف',
    logInSecurely: 'تسجيل الدخول بأمان',
    registerAccount: 'إنشاء الحساب الآن',
    demoCredentials: 'بيانات الدخول التجريبية للوحة التحكم',
    pendingApproval: 'طلب التسجيل معلق',
    pendingApprovalDesc: 'تم إرسال طلب تسجيلك بنجاح! يرجى الانتظار حتى يقوم أ. محمد صلاح أو أ. هاجر عفيفي بتفعيل حسابك.',
    
    primStage: 'المرحلة الابتدائية (الصفوف ١-٦)',
    prepStage: 'المرحلة الإعدادية (الصفوف ٧-٩)',
    secStage: 'المرحلة الثانوية (الصفوف ١٠-١٢)',
    summerCourses: 'كورسات صيفية',
    isTrial: 'حساب تجريبي / محتوى تجريبي',

    studentDirectory: 'سجل الطلاب',
    lessonsVideos: 'فيديوهات الدروس',
    interactiveTests: 'الاختبارات التفاعلية',
    booksWorkbooks: 'الكتب والمذكرات',
    vocabularySpelling: 'الكلمات والإملاء',
    solvedLogs: 'سجل إجابات الطلاب',
    teacherStaff: 'طاقم معلمين المنصة',
    refreshData: 'تحديث البيانات',
    signOut: 'تسجيل الخروج',

    yourSupervisor: 'المعلم المشرف عليك',
    supervisorDesc: 'المسؤول المباشر عن مرحلتك التعليمية ومتابعة تقييماتك.',
    activeSupervisor: 'المعلم المشرف',
    welcomeBack: 'أهلاً بك يا',
    gradeLabel: 'الصف',
    viewsRemaining: 'مشاهدات متبقية',
    unlimitedViews: 'مشاهدة غير محدودة',
    noVideos: 'لا توجد دروس فيديو مضافة لصفك الدراسي حالياً.',
    noTests: 'لا توجد اختبارات تفاعلية مضافة لصفك الدراسي حالياً.',
    noBooks: 'لا توجد كتب أو مذكرات مرفوعة لصفك الدراسي حالياً.',
    noWords: 'لا توجد كلمات أو مفردات مضافة لصفك الدراسي حالياً.',
    solveTest: 'ابدأ حل الاختبار',
    score: 'النتيجة',
    solvedOn: 'تاريخ الحل',
    viewResult: 'عرض الإجابات',
    interactiveTool: 'كتيب تفاعلي',
    pdfDocument: 'ملف PDF',
    openBooklet: 'افتح الكتيب التفاعلي',
    downloadPdf: 'تحميل ملف PDF',
    pronounce: 'نطق الكلمة',
    launchStudyTool: 'تشغيل أداة الدراسة',
    backToDashboard: 'العودة للرئيسية',

    mainAdmin: 'مدير عام المنصة',
    teacherStaffBadge: 'معلم المنصة',
    registeredStudents: 'قائمة الطلاب المسجلين بالمنصة',
    approveStudent: 'تفعيل حساب الطالب ودخوله',
    approveUnlimited: 'تفعيل دائم ومفتوح',
    approveMonth: 'تفعيل لمدة شهر واحد',
    activeStatus: 'نشط ومفعل',
    pendingStatus: 'قيد الانتظار',
    suspendedStatus: 'موقوف مؤقتاً',
    addInstructor: 'إضافة معلم أو مشرف جديد',
    makeAdmin: 'منح صلاحيات مدير المنصة الكاملة',
    instructorRole: 'رتبة ومستوى صلاحية المشرف',
    staffUsername: 'اسم المستخدم للدخول',
    statusLabel: 'حالة الحساب',
    cancel: 'إلغاء',
    saveProfile: 'حفظ الملف الشخصي',
    deleteConfirm: 'هل أنت متأكد تماماً من حذف هذا الحساب؟ هذا الإجراء لا يمكن التراجع عنه.',
    changePassword: 'تغيير كلمة المرور',
    newPassword: 'كلمة المرور الجديدة',
    passwordChangedSuccess: 'تم تحديث كلمة المرور بنجاح!',
    confirmNewPassword: 'تأكيد كلمة المرور الجديدة',
    passwordsDoNotMatch: 'كلمتا المرور غير متطابقتين!',
    enterNewPassword: 'أدخل كلمة المرور الجديدة',
    announcements: 'لوحة الإعلانات والتنويهات',
    addAnnouncement: 'إضافة إعلان جديد للمراحل',
    announcementTitle: 'عنوان الإعلان أو التنويه',
    announcementContent: 'تفاصيل ونص التنويه الهام',
    announcementType: 'نوع وتصنيف التنويه',
    reviewType: 'مراجعة ليلة الامتحان 📝',
    scheduleType: 'مواعيد وجدول حصص ⏰',
    honorType: 'حفلة تكريم المتفوقين 🏆',
    generalType: 'إعلان وتنبيه عام 📢',
    targetGrade: 'المرحلة / الصف المستهدف',
    announcementCreated: 'تم إضافة الإعلان بنجاح واستهدافه للمراحل بنجاح!',
    announcementDeleted: 'تم حذف وإزالة الإعلان بنجاح.',
    allGrades: 'كل المراحل والصفوف الدراسية'
  }
};
