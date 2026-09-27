export type SupportedLanguage = 'en' | 'ta' | 'hi';

export interface Translations {
  appName: string;
  tagline: string;
  subtagline: string;
  
  // Navigation
  nav: {
    home: string;
    assistance: string;
    resqAi: string;
    requests: string;
    vehicles: string;
    safePlaces: string;
    profile: string;
    dashboard: string;
    earnings: string;
    history: string;
    adminUsers: string;
    adminProviders: string;
    adminRequests: string;
    adminAnalytics: string;
    adminServices: string;
    adminComplaints: string;
    switchRole: string;
    signIn: string;
    signOut: string;
    demoRole: string;
  };

  // Actions
  actions: {
    getAssistance: string;
    askResqAi: string;
    requestAssistance: string;
    viewFuelStations: string;
    requestTowing: string;
    cancel: string;
    confirm: string;
    back: string;
    next: string;
    save: string;
    delete: string;
    edit: string;
    callProvider: string;
    chat: string;
    shareLocation: string;
    rateService: string;
    submit: string;
    viewReceipt: string;
    acceptJob: string;
    rejectJob: string;
    updateStatus: string;
    goOnline: string;
    goOffline: string;
    triggerSos: string;
    cancelSos: string;
    verifyProvider: string;
    suspendProvider: string;
    uploadPhoto: string;
    startVoice: string;
    stopVoice: string;
  };

  // Services
  services: {
    fuel: string;
    tyre: string;
    battery: string;
    breakdown: string;
    mechanical: string;
    electrical: string;
    engine: string;
    towing: string;
    accident: string;
    other: string;
    fuelDesc: string;
    tyreDesc: string;
    batteryDesc: string;
    breakdownDesc: string;
    mechanicalDesc: string;
    towingDesc: string;
  };

  // Statuses
  status: {
    requested: string;
    searching: string;
    providerAssigned: string;
    providerOnWay: string;
    arrived: string;
    inProgress: string;
    completed: string;
    cancelled: string;
    online: string;
    offline: string;
    busy: string;
    verified: string;
    pending: string;
    rejected: string;
  };

  // AI Assistant
  ai: {
    title: string;
    badge: string;
    subtitle: string;
    welcomeMsg: string;
    placeholder: string;
    listening: string;
    analyzingImage: string;
    photoAttached: string;
    safetyAdvisory: string;
    confidenceLevel: string;
    recommendedHelp: string;
    quickPromptsLabel: string;
    samplePrompt1: string;
    samplePrompt2: string;
    samplePrompt3: string;
    samplePrompt4: string;
    diagnosticNotice: string;
  };

  // Common & SOS
  common: {
    emergencySos: string;
    sosWarning: string;
    sosDesc: string;
    currentLocation: string;
    detectingGps: string;
    myVehicles: string;
    addVehicle: string;
    noActiveRequest: string;
    estimatedPrice: string;
    distance: string;
    eta: string;
    rating: string;
    reviews: string;
    todayEarnings: string;
    totalEarnings: string;
    quickServices: string;
    nearbyHelp: string;
    emergencyContacts: string;
    lightMode: string;
    darkMode: string;
    systemMode: string;
    theme: string;
    language: string;
  };
}

export const translations: Record<SupportedLanguage, Translations> = {
  en: {
    appName: 'RoadResQ',
    tagline: 'Help when your vehicle stops.',
    subtagline: 'Smart roadside assistance, when you need it.',
    nav: {
      home: 'Home',
      assistance: 'Assistance',
      resqAi: 'ResQ AI',
      requests: 'Requests',
      vehicles: 'Vehicles',
      safePlaces: 'Safe Places',
      profile: 'Profile',
      dashboard: 'Dashboard',
      earnings: 'Earnings',
      history: 'History',
      adminUsers: 'Users',
      adminProviders: 'Providers',
      adminRequests: 'Live Incidents',
      adminAnalytics: 'Analytics',
      adminServices: 'Services',
      adminComplaints: 'Complaints',
      switchRole: 'Switch Role',
      signIn: 'Sign In',
      signOut: 'Sign Out',
      demoRole: 'Demo Role',
    },
    actions: {
      getAssistance: 'GET ROADSIDE ASSISTANCE',
      askResqAi: 'ASK RESQ AI',
      requestAssistance: 'Request Assistance',
      viewFuelStations: 'View Fuel Stations',
      requestTowing: 'Request Towing',
      cancel: 'Cancel',
      confirm: 'Confirm & Book',
      back: 'Back',
      next: 'Next',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      callProvider: 'Call Provider',
      chat: 'Message',
      shareLocation: 'Share Live Location',
      rateService: 'Rate & Review',
      submit: 'Submit',
      viewReceipt: 'View Receipt',
      acceptJob: 'Accept Job',
      rejectJob: 'Decline',
      updateStatus: 'Update Status',
      goOnline: 'Go Online',
      goOffline: 'Go Offline',
      triggerSos: 'HOLD FOR SOS (3s)',
      cancelSos: 'Cancel SOS',
      verifyProvider: 'Approve Provider',
      suspendProvider: 'Suspend',
      uploadPhoto: 'Attach Photo',
      startVoice: 'Speak to ResQ AI',
      stopVoice: 'Stop Listening',
    },
    services: {
      fuel: 'Fuel Emergency / Tow',
      tyre: 'Flat Tyre / Puncture',
      battery: 'Battery Jumpstart',
      breakdown: 'General Breakdown',
      mechanical: 'Mechanical Issue',
      electrical: 'Electrical Fault',
      engine: 'Engine Trouble',
      towing: 'Flatbed Towing',
      accident: 'Accident / SOS Support',
      other: 'Other Assistance',
      fuelDesc: 'Authorized guidance to nearby station or towing assistance',
      tyreDesc: 'Tube/tubeless puncture repair, tyre replacement on-site',
      batteryDesc: '12V/24V jumpstart, battery testing & terminal cleaning',
      breakdownDesc: 'General roadside triage, minor on-spot mechanic fixes',
      mechanicalDesc: 'Brake, clutch, chain, belt or radiator troubleshooting',
      towingDesc: 'Hydraulic flatbed & safe towing to authorized service center',
    },
    status: {
      requested: 'Requested',
      searching: 'Searching Provider...',
      providerAssigned: 'Provider Assigned',
      providerOnWay: 'Provider On The Way',
      arrived: 'Provider Arrived',
      inProgress: 'Assistance In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled',
      online: 'Online & Available',
      offline: 'Offline',
      busy: 'On Active Job',
      verified: 'Verified Partner',
      pending: 'Verification Pending',
      rejected: 'Application Rejected',
    },
    ai: {
      title: 'ResQ AI Rescue Coordinator',
      badge: 'Smart Roadside Diagnostics',
      subtitle: 'Speaks English, தமிழ், हिन्दी, & Tanglish with audio/photo analysis.',
      welcomeMsg: 'Hello! I am ResQ AI, your roadside emergency coordinator. What happened to your vehicle? You can speak, type, or upload a photo.',
      placeholder: 'Describe your breakdown in English, தமிழ், or Tanglish...',
      listening: 'ResQ AI is listening... Speak now',
      analyzingImage: 'Analyzing vehicle photo...',
      photoAttached: 'Photo attached for AI inspection',
      safetyAdvisory: 'Safety Advisory: Move vehicle to shoulder, switch on hazard lights.',
      confidenceLevel: 'AI Confidence',
      recommendedHelp: 'Recommended Service',
      quickPromptsLabel: 'Quick Scenarios:',
      samplePrompt1: 'Bike petrol empty, stranded on highway',
      samplePrompt2: 'Car tyre punctured on main road',
      samplePrompt3: 'En car start aagala, clicking sound varuthu',
      samplePrompt4: 'Battery dead, need quick jumpstart',
      diagnosticNotice: 'AI observation based on description. On-site professional mechanical inspection is required.',
    },
    common: {
      emergencySos: 'EMERGENCY SOS',
      sosWarning: 'Emergency protocol sends your GPS location immediately to emergency contacts and nearby rescue teams.',
      sosDesc: 'Need immediate police or medical assistance?',
      currentLocation: 'Current Location',
      detectingGps: 'Acquiring GPS location...',
      myVehicles: 'My Vehicles',
      addVehicle: 'Add Vehicle',
      noActiveRequest: 'No active roadside request right now.',
      estimatedPrice: 'Estimated Price',
      distance: 'Distance',
      eta: 'ETA',
      rating: 'Rating',
      reviews: 'reviews',
      todayEarnings: "Today's Earnings",
      totalEarnings: 'Total Payout',
      quickServices: 'Quick Assistance',
      nearbyHelp: 'Nearby Safe Places',
      emergencyContacts: 'Emergency Contacts',
      lightMode: 'Light',
      darkMode: 'Dark',
      systemMode: 'System',
      theme: 'Theme',
      language: 'Language',
    },
  },
  ta: {
    appName: 'RoadResQ',
    tagline: 'உங்கள் வாகனம் நின்றால், உடனடி உதவி.',
    subtagline: 'தேவையான நேரத்தில் ஸ்மார்ட் சாலையோர உதவி.',
    nav: {
      home: 'முகப்பு',
      assistance: 'உதவி கோரு',
      resqAi: 'ResQ AI',
      requests: 'கோரிக்கைகள்',
      vehicles: 'வாகனங்கள்',
      safePlaces: 'பாதுகாப்பான இடங்கள்',
      profile: 'சுயவிவரம்',
      dashboard: 'டாஷ்போர்டு',
      earnings: 'வருமானம்',
      history: 'வரலாறு',
      adminUsers: 'பயனர்கள்',
      adminProviders: 'சேவை வழங்குநர்கள்',
      adminRequests: 'நேரலை விபத்துகள்',
      adminAnalytics: 'பகுப்பாய்வு',
      adminServices: 'சேவைகள்',
      adminComplaints: 'புகார்கள்',
      switchRole: 'பங்கை மாற்று',
      signIn: 'உள்நுழைக',
      signOut: 'வெளியேறு',
      demoRole: 'டெமோ பங்கு',
    },
    actions: {
      getAssistance: 'சாலையோர உதவி பெறுக',
      askResqAi: 'RESQ AI-யிடம் கேளுங்கள்',
      requestAssistance: 'உதவி கோரு',
      viewFuelStations: 'பெட்ரோல் பங்குகளை பார்',
      requestTowing: 'டோவிங் வண்டி கோரு',
      cancel: 'ரத்து செய்',
      confirm: 'உறுதி செய்து முன்பதிவு செய்',
      back: 'பின்செல்',
      next: 'அடுத்து',
      save: 'சேமி',
      delete: 'நீக்கு',
      edit: 'திருத்து',
      callProvider: 'மெக்கானிக்கை அழை',
      chat: 'செய்தி அனுப்பு',
      shareLocation: 'இருப்பிடத்தை பகிர்',
      rateService: 'மதிப்பீடு செய்',
      submit: 'சமர்ப்பி',
      viewReceipt: 'ரசீதை பார்க்க',
      acceptJob: 'வேலையை ஏற்றுக்கொள்',
      rejectJob: 'நிராகரி',
      updateStatus: 'நிலையை மாற்று',
      goOnline: 'ஆன்லைனுக்கு வா',
      goOffline: 'ஆஃப்லைன் செல்',
      triggerSos: 'SOS-க்கு 3 வினாடி அழுத்துங்கள்',
      cancelSos: 'SOS ரத்து',
      verifyProvider: 'வழங்குநரை அங்கீகரி',
      suspendProvider: 'இடைநீக்கம்',
      uploadPhoto: 'புகைப்படம் இணைக்க',
      startVoice: 'ResQ AI-யிடம் பேசுங்கள்',
      stopVoice: 'கேட்பதை நிறுத்து',
    },
    services: {
      fuel: 'எரிபொருள் அவசரம் / டோவிங்',
      tyre: 'டயர் பஞ்சர் / பழுது',
      battery: 'பேட்டரி ஜம்ப்ஸ்டார்ட்',
      breakdown: 'பொதுவான பழுது',
      mechanical: 'மெக்கானிக்கல் கோளாறு',
      electrical: 'எலக்ட்ரிக்கல் பிரச்சனை',
      engine: 'இன்ஜின் சிக்கல்',
      towing: 'டோவிங் சேவை',
      accident: 'விபத்து / SOS அவசர உதவி',
      other: 'பிற உதவி',
      fuelDesc: 'அருகிலுள்ள பங்க் வழிகாட்டுதல் அல்லது டோவிங் உதவி',
      tyreDesc: 'பஞ்சர் ஒட்டுதல், மாற்று டயர் பொருத்துதல்',
      batteryDesc: '12V ஜம்ப்ஸ்டார்ட், பேட்டரி சார்ஜிங் உதவி',
      breakdownDesc: 'சாலையோர உடனடி மெக்கானிக் ஆய்வு மற்றும் பழுது',
      mechanicalDesc: 'பிரேக், கிளட்ச், சங்கிலி அல்லது பெல்ட் பழுது',
      towingDesc: 'அங்கீகரிக்கப்பட்ட பட்டறைக்கு பாதுகாப்பான டோவிங்',
    },
    status: {
      requested: 'கோரப்பட்டது',
      searching: 'வழங்குநரை தேடுகிறது...',
      providerAssigned: 'வழங்குநர் நியமிக்கப்பட்டார்',
      providerOnWay: 'வழங்குநர் புறப்பட்டுவிட்டார்',
      arrived: 'வந்து சேர்ந்தார்',
      inProgress: 'வேலை நடக்கிறது',
      completed: 'முடிக்கப்பட்டது',
      cancelled: 'ரத்து செய்யப்பட்டது',
      online: 'ஆன்லைனில் உள்ளார்',
      offline: 'ஆஃப்லைன்',
      busy: 'வேலையில் உள்ளார்',
      verified: 'சரிபார்க்கப்பட்ட கூட்டாளர்',
      pending: 'சரிபார்ப்பு நிலுவையில்',
      rejected: 'விண்ணப்பம் நிராகரிக்கப்பட்டது',
    },
    ai: {
      title: 'ResQ AI மீட்பு ஒருங்கிணைப்பாளர்',
      badge: 'ஸ்மார்ட் சாலையோர கண்டறிதல்',
      subtitle: 'தமிழ், ஆங்கிலம் மற்றும் தங்கிலீஷ் உரையாடலை புரிந்துகொள்ளும்.',
      welcomeMsg: 'வணக்கம்! நான் ResQ AI. உங்கள் வாகனத்திற்கு என்ன நேர்ந்தது? நீங்கள் குரல் மூலமாகவோ, தட்டச்சு செய்தோ அல்லது புகைப்படம் பதிவேற்றியோ கூறலாம்.',
      placeholder: 'உங்கள் பிரச்சனையைக் தமிழில் அல்லது Tanglish-ல் விவரிக்கவும்...',
      listening: 'ResQ AI கேட்கிறது... இப்போது பேசுங்கள்',
      analyzingImage: 'வாகன புகைப்படம் ஆராயப்படுகிறது...',
      photoAttached: 'புகைப்படம் இணைக்கப்பட்டது',
      safetyAdvisory: 'பாதுகாப்பு குறிப்பு: வாகனத்தை சாலையின் ஓரத்திற்கு நகர்த்தி ஹசார்ட் விளக்குகளை ஒளிரவிடவும்.',
      confidenceLevel: 'AI நம்பிக்கை அளவு',
      recommendedHelp: 'பரிந்துரைக்கப்பட்ட சேவை',
      quickPromptsLabel: 'விரைவு சூழல்கள்:',
      samplePrompt1: 'என் பைக்கில் பெட்ரோல் தீர்ந்துவிட்டது, ஹைவேயில் நிற்கிறேன்',
      samplePrompt2: 'கார் டயர் பஞ்சர் ஆகிவிட்டது',
      samplePrompt3: 'En car start aagala, clicking sound varuthu',
      samplePrompt4: 'பேட்டரி டெட், உடனடி ஜம்ப்ஸ்டார்ட் தேவை',
      diagnosticNotice: 'AI வழிகாட்டுதல் மட்டுமே. தளத்தில் நிபுணர் ஆய்வு அவசியம்.',
    },
    common: {
      emergencySos: 'அவசர SOS',
      sosWarning: 'அவசர நேரத்தில் உங்கள் GPS இருப்பிடம் உடனே குடும்பத்தினருக்கும் மீட்புக் குழுவிற்கும் பகிரப்படும்.',
      sosDesc: 'காவல்துறை அல்லது மருத்துவ உதவி தேவையா?',
      currentLocation: 'தற்போதைய இருப்பிடம்',
      detectingGps: 'GPS இருப்பிடத்தைக் கண்டறிகிறது...',
      myVehicles: 'என் வாகனங்கள்',
      addVehicle: 'வாகனம் சேர்க்க',
      noActiveRequest: 'செயலில் உள்ள கோரிக்கைகள் எதுவும் இல்லை.',
      estimatedPrice: 'மதிப்பிடப்பட்ட கட்டணம்',
      distance: 'தூரம்',
      eta: 'வரும் நேரம்',
      rating: 'மதிப்பீடு',
      reviews: 'மதிப்புரைகள்',
      todayEarnings: 'இன்றைய வருமானம்',
      totalEarnings: 'மொத்த வருமானம்',
      quickServices: 'விரைவு உதவிகள்',
      nearbyHelp: 'அருகிலுள்ள இடங்கள்',
      emergencyContacts: 'அவசர தொடர்புகள்',
      lightMode: 'பகல் பயன்முறை',
      darkMode: 'இரவு பயன்முறை',
      systemMode: 'இயல்புநிலை',
      theme: 'தீம்',
      language: 'மொழி',
    },
  },
  hi: {
    appName: 'RoadResQ',
    tagline: 'जब आपकी गाड़ी रुके, तुरंत सहायता।',
    subtagline: 'स्मार्ट सड़क किनारे सहायता, जब आपको सबसे ज्यादा ज़रूरत हो।',
    nav: {
      home: 'होम',
      assistance: 'सहायता लें',
      resqAi: 'ResQ AI',
      requests: 'अनुरोध',
      vehicles: 'वाहन',
      safePlaces: 'सुरक्षित स्थान',
      profile: 'प्रोफ़ाइल',
      dashboard: 'डैशबोर्ड',
      earnings: 'कमाई',
      history: 'इतिहास',
      adminUsers: 'उपयोगकर्ता',
      adminProviders: 'सर्विस प्रोवाइडर',
      adminRequests: 'लाइव घटनाएं',
      adminAnalytics: 'एनालिटिक्स',
      adminServices: 'सेवाएं',
      adminComplaints: 'शिकायतें',
      switchRole: 'भूमिका बदलें',
      signIn: 'साइन इन',
      signOut: 'साइन आउट',
      demoRole: 'डेमो रोल',
    },
    actions: {
      getAssistance: 'सड़क किनारे सहायता प्राप्त करें',
      askResqAi: 'RESQ AI से पूछें',
      requestAssistance: 'सहायता का अनुरोध करें',
      viewFuelStations: 'पेट्रोल पंप देखें',
      requestTowing: 'टोइंग का अनुरोध करें',
      cancel: 'रद्द करें',
      confirm: 'पुष्टि करें और बुक करें',
      back: 'वापस',
      next: 'आगे',
      save: 'सहेजें',
      delete: 'हटाएं',
      edit: 'संपादित करें',
      callProvider: 'मैकेनिक को कॉल करें',
      chat: 'संदेश',
      shareLocation: 'लाइव लोकेशन साझा करें',
      rateService: 'रेटिंग दें',
      submit: 'सबमिट करें',
      viewReceipt: 'रसीद देखें',
      acceptJob: 'काम स्वीकार करें',
      rejectJob: 'अस्वीकार करें',
      updateStatus: 'स्थिति अपडेट करें',
      goOnline: 'ऑनलाइन जाएं',
      goOffline: 'ऑफलाइन जाएं',
      triggerSos: 'SOS के लिए 3 सेकंड दबाएं',
      cancelSos: 'SOS रद्द करें',
      verifyProvider: 'स्वीकृत करें',
      suspendProvider: 'निलंबित करें',
      uploadPhoto: 'फ़ोटो अपलोड करें',
      startVoice: 'ResQ AI से बात करें',
      stopVoice: 'सुनना बंद करें',
    },
    services: {
      fuel: 'ईंधन आपातकाल / टोइंग',
      tyre: 'पंक्चर / टायर बदलना',
      battery: 'बैटरी जंपस्टार्ट',
      breakdown: 'सामान्य खराबी',
      mechanical: 'मैकेनिकल समस्या',
      electrical: 'इलेक्ट्रिकल समस्या',
      engine: 'इंजन की समस्या',
      towing: 'टोइंग सेवा',
      accident: 'दुर्घटना / SOS सहायता',
      other: 'अन्य सहायता',
      fuelDesc: 'पास के पंप का सुरक्षित मार्गदर्शन या टोइंग सहायता',
      tyreDesc: 'ट्यूब/ट्यूबलेस पंचर रिपेयर, मौके पर टायर रिप्लेसमेंट',
      batteryDesc: '12V जंपस्टार्ट, बैटरी टेस्टिंग और क्लीनिंग',
      breakdownDesc: 'मौके पर मैकेनिक जांच और त्वरित समाधान',
      mechanicalDesc: 'ब्रेक, क्लच, चेन या रेडिएटर संबंधी खराबी',
      towingDesc: 'सुरक्षित फ्लैटबेड टोइंग नजदीकी अधिकृत वर्कशॉप तक',
    },
    status: {
      requested: 'अनुरोध किया गया',
      searching: 'प्रोवाइडर खोज रहे हैं...',
      providerAssigned: 'प्रोवाइडर असाइन हुआ',
      providerOnWay: 'प्रोवाइडर रास्ते में है',
      arrived: 'प्रोवाइडर पहुँच चुका है',
      inProgress: 'काम प्रगति पर है',
      completed: 'पूरा हुआ',
      cancelled: 'रद्द किया गया',
      online: 'ऑनलाइन उपलब्ध',
      offline: 'ऑफलाइन',
      busy: 'व्यस्त',
      verified: 'सत्यापित पार्टनर',
      pending: 'सत्यापन लंबित',
      rejected: 'अस्वीकृत',
    },
    ai: {
      title: 'ResQ AI रेस्क्यू समन्वयक',
      badge: 'स्मार्ट वाहन डायग्नोस्टिक्स',
      subtitle: 'हिंदी, अंग्रेजी और वॉइस/फ़ोटो इनपुट के साथ समझता है।',
      welcomeMsg: 'नमस्ते! मैं ResQ AI हूँ। आपकी गाड़ी में क्या समस्या आई है? आप बोलकर, लिखकर या फोटो अपलोड करके बता सकते हैं।',
      placeholder: 'अपनी समस्या हिंदी या अंग्रेजी में बताएं...',
      listening: 'ResQ AI सुन रहा है... अब बोलें',
      analyzingImage: 'वाहन की तस्वीर जांची जा रही है...',
      photoAttached: 'तस्वीर संलग्न की गई',
      safetyAdvisory: 'सुरक्षा सलाह: वाहन को सड़क के किनारे ले जाएं और हैज़र्ड लाइट चालू करें।',
      confidenceLevel: 'AI विश्वास स्तर',
      recommendedHelp: 'अनुशंसित सेवा',
      quickPromptsLabel: 'त्वरित परिदृश्य:',
      samplePrompt1: 'मेरी बाइक का पेट्रोल खत्म हो गया है, हाईवे पर हूँ',
      samplePrompt2: 'कार का टायर पंक्चर हो गया है',
      samplePrompt3: 'कार स्टार्ट नहीं हो रही, टिक-टिक आवाज आ रही है',
      samplePrompt4: 'बैटरी डेड हो गई है, जंपस्टार्ट चाहिए',
      diagnosticNotice: 'AI अवलोकन केवल मार्गदर्शन के लिए है। मौके पर मैकेनिक जांच अनिवार्य है।',
    },
    common: {
      emergencySos: 'आपातकालीन SOS',
      sosWarning: 'आपात स्थिति में आपका GPS तुरंत परिजनों और आपातकालीन सहायता टीम को भेजा जाएगा।',
      sosDesc: 'क्या आपको तत्काल पुलिस या एम्बुलेंस सहायता चाहिए?',
      currentLocation: 'वर्तमान स्थान',
      detectingGps: 'GPS लोकेशन प्राप्त की जा रही है...',
      myVehicles: 'मेरे वाहन',
      addVehicle: 'वाहन जोड़ें',
      noActiveRequest: 'फिलहाल कोई सक्रिय अनुरोध नहीं है।',
      estimatedPrice: 'अनुमानित शुल्क',
      distance: 'दूरी',
      eta: 'पहुंचने का समय',
      rating: 'रेटिंग',
      reviews: 'समीक्षाएं',
      todayEarnings: 'आज की कमाई',
      totalEarnings: 'कुल भुगतान',
      quickServices: 'त्वरित सेवाएं',
      nearbyHelp: 'पास के सुरक्षित स्थान',
      emergencyContacts: 'आपातकालीन संपर्क',
      lightMode: 'लाइट',
      darkMode: 'डार्क',
      systemMode: 'सिस्टम डिफ़ॉल्ट',
      theme: 'थीम',
      language: 'भाषा',
    },
  },
};
