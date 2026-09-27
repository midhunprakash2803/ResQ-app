import { IssueCategory, UrgencyLevel, VehicleType, GeoLocation, ServiceProvider, SafePlace } from '../types';
import { storageService } from './storageService';

export interface AiDiagnosticResult {
  issueType: IssueCategory;
  vehicleType: VehicleType;
  urgency: UrgencyLevel;
  confidence: number;
  recommendedService: string;
  estimatedCost: number;
  explanation: string;
  safetyGuidance?: string;
  followUpQuestions?: string[];
  suggestedActions: {
    label: string;
    action: 'request_service' | 'view_fuel_stations' | 'call_towing' | 'call_emergency';
    payload?: any;
  }[];
}

export interface AiAnalysisOptions {
  userText: string;
  vehicleType?: VehicleType;
  location?: GeoLocation;
  photoUrl?: string;
  language?: 'en' | 'ta' | 'hi' | 'tanglish';
  conversationHistory?: { sender: string; content: string }[];
}

export class ResQAIService {
  // Detect language or dialect
  public detectLanguage(text: string): 'en' | 'ta' | 'hi' | 'tanglish' {
    const tamilRegex = /[\u0B80-\u0BFF]/;
    const devanagariRegex = /[\u0900-\u097F]/;

    if (tamilRegex.test(text)) return 'ta';
    if (devanagariRegex.test(text)) return 'hi';

    // Tanglish detection
    const tanglishKeywords = [
      'theernthu',
      'pochu',
      'aagala',
      'eriyuthu',
      'varuthu',
      'anna',
      'illai',
      'irukku',
      'poiduchu',
      'nikkuthu',
      'vandi',
      'vandiye',
      'start aagala',
      'puncture aayiduchu',
    ];
    const lower = text.toLowerCase();
    if (tanglishKeywords.some((kw) => lower.includes(kw))) {
      return 'tanglish';
    }

    return 'en';
  }

  // Parse natural language (English, Tamil, Tanglish, Hindi) into structured roadside problem
  public analyzeProblem(options: AiAnalysisOptions): AiDiagnosticResult {
    const { userText, vehicleType: initialVehicleType = 'car', photoUrl } = options;
    const text = userText.toLowerCase();
    const lang = this.detectLanguage(userText);

    let issueType: IssueCategory = 'breakdown';
    let urgency: UrgencyLevel = 'NORMAL';
    let confidence = 85;
    let detectedVehicleType: VehicleType = initialVehicleType;

    // Detect vehicle type mentions
    if (
      text.includes('bike') ||
      text.includes('பைக்கில்') ||
      text.includes('பைக்') ||
      text.includes('बाइक') ||
      text.includes('scooter') ||
      text.includes('activa') ||
      text.includes('bullet') ||
      text.includes('royal enfield') ||
      text.includes('motorcycle')
    ) {
      detectedVehicleType = 'bike';
    } else if (
      text.includes('truck') ||
      text.includes('டிரக்') ||
      text.includes('lorry') ||
      text.includes('லாரி') ||
      text.includes('ट्रक')
    ) {
      detectedVehicleType = 'truck';
    } else if (text.includes('ev') || text.includes('electric') || text.includes('nexon ev') || text.includes('ather')) {
      detectedVehicleType = 'ev';
    }

    // Emergency detection
    if (
      text.includes('accident') ||
      text.includes('விபத்து') ||
      text.includes('துர்சம்பவம்') ||
      text.includes('दुर्घटना') ||
      text.includes('crash') ||
      text.includes('injury') ||
      text.includes('blood') ||
      text.includes('hit and run') ||
      text.includes('flipped') ||
      text.includes('danger')
    ) {
      issueType = 'accident';
      urgency = 'EMERGENCY';
      confidence = 98;
    }
    // Fuel detection
    else if (
      text.includes('fuel') ||
      text.includes('petrol') ||
      text.includes('diesel') ||
      text.includes('பெட்ரோல்') ||
      text.includes('எரிபொருள்') ||
      text.includes('पेट्रोल') ||
      text.includes('theernthu') ||
      text.includes('empty') ||
      text.includes('ran out') ||
      text.includes('tank empty')
    ) {
      issueType = 'fuel';
      confidence = 94;
      urgency = text.includes('highway') || text.includes('dark') || text.includes('bypass') ? 'URGENT' : 'NORMAL';
    }
    // Tyre / Puncture detection
    else if (
      text.includes('tyre') ||
      text.includes('tire') ||
      text.includes('puncture') ||
      text.includes('பஞ்சர்') ||
      text.includes('டயர்') ||
      text.includes('पंक्चर') ||
      text.includes('टायर') ||
      text.includes('flat') ||
      text.includes('air leak')
    ) {
      issueType = 'tyre';
      confidence = 96;
      urgency = text.includes('highway') || text.includes('expressway') ? 'URGENT' : 'NORMAL';
    }
    // Battery detection
    else if (
      text.includes('battery') ||
      text.includes('பேட்டரி') ||
      text.includes('बैटरी') ||
      text.includes('jumpstart') ||
      text.includes('jump start') ||
      text.includes('crank') ||
      text.includes('clicking') ||
      text.includes('dead') ||
      text.includes('no power')
    ) {
      issueType = 'battery';
      confidence = 92;
      urgency = 'NORMAL';
    }
    // Towing detection
    else if (
      text.includes('tow') ||
      text.includes('towing') ||
      text.includes('டோவிங்') ||
      text.includes('टोइंग') ||
      text.includes('flatbed') ||
      text.includes('pull')
    ) {
      issueType = 'towing';
      confidence = 95;
      urgency = 'NORMAL';
    }
    // Engine / Overheating detection
    else if (
      text.includes('engine') ||
      text.includes('smoke') ||
      text.includes('steam') ||
      text.includes('overheat') ||
      text.includes('radiator') ||
      text.includes('இன்ஜின்') ||
      text.includes('புகை') ||
      text.includes('इंजन') ||
      text.includes('धुआं')
    ) {
      issueType = 'engine';
      confidence = 90;
      urgency = 'URGENT';
    }
    // Mechanical / Brakes / Clutch
    else if (
      text.includes('brake') ||
      text.includes('clutch') ||
      text.includes('gear') ||
      text.includes('பிரேக்') ||
      text.includes('கிளட்ச்') ||
      text.includes('ब्रेक') ||
      text.includes('noise') ||
      text.includes('chain') ||
      text.includes('belt')
    ) {
      issueType = 'mechanical';
      confidence = 88;
      urgency = 'URGENT';
    }
    // Electrical fault
    else if (
      text.includes('light') ||
      text.includes('lights') ||
      text.includes('fuse') ||
      text.includes('spark') ||
      text.includes('short') ||
      text.includes('மின்சாரம்')
    ) {
      issueType = 'electrical';
      confidence = 86;
      urgency = 'NORMAL';
    }

    // Photo condition adjustment if photo is supplied
    if (photoUrl) {
      confidence = Math.min(99, confidence + 5);
    }

    // Build specialized guidance, follow-up questions, and actions
    return this.buildDiagnosticResponse(issueType, detectedVehicleType, urgency, confidence, lang, text, photoUrl);
  }

  private buildDiagnosticResponse(
    issueType: IssueCategory,
    vehicleType: VehicleType,
    urgency: UrgencyLevel,
    confidence: number,
    lang: 'en' | 'ta' | 'hi' | 'tanglish',
    rawText: string,
    photoUrl?: string
  ): AiDiagnosticResult {
    let recommendedService = 'Roadside Breakdown Inspection';
    let estimatedCost = 450;
    let explanation = '';
    let safetyGuidance = '';
    const followUpQuestions: string[] = [];
    const suggestedActions: AiDiagnosticResult['suggestedActions'] = [];

    // General highway safety alert if context implies stranded on road
    if (urgency === 'URGENT' || urgency === 'EMERGENCY' || rawText.includes('highway')) {
      safetyGuidance =
        lang === 'ta'
          ? 'பாதுகாப்பு எச்சரிக்கை: வாகனத்தை உடனடியாக சாலையின் ஓரத்திற்கு (Shoulder) நகர்த்தவும். அபாய விளக்குகளை (Hazard Lights) எரியவிடவும். வாகனத்திற்குள் அமராமல் பாதுகாப்பான தூரத்தில் நிற்கவும்.'
          : lang === 'hi'
          ? 'सुरक्षा सलाह: वाहन को तुरंत सड़क के किनारे (शोल्डर) सुरक्षित स्थान पर ले जाएं। हैज़र्ड लाइट ऑन करें और चलती गाड़ियों से दूर रहें।'
          : 'Safety Advisory: If stopped on a highway or high-speed lane, safely steer vehicle to the road shoulder if movable. Switch on hazard warning lights and stand safely away from traffic behind the crash barrier.';
    }

    switch (issueType) {
      case 'fuel':
        recommendedService = 'Nearby Fuel Station Navigation & Escort / Towing';
        estimatedCost = vehicleType === 'bike' ? 350 : 650;
        explanation =
          lang === 'ta' || lang === 'tanglish'
            ? 'வாகனத்தில் எரிபொருள் தீர்ந்துவிட்டதாக தெரிகிறது. பாதுகாப்பு மற்றும் சட்ட விதிமுறைகளின்படி அங்கீகரிக்கப்படாத கேன்களில் எரிபொருள் விநியோகம் பரிந்துரைக்கப்படுவதில்லை. அருகிலுள்ள 24/7 பெட்ரோல் நிலையத்திற்கு செல்ல அல்லது பாதுகாப்பான டோவிங் சேவைக்கு உதவ முடியும்.'
            : lang === 'hi'
            ? 'लगता है कि वाहन का ईंधन समाप्त हो गया है। सुरक्षा मानकों के अनुसार अनधिकृत रूप से ईंधन ले जाना सुरक्षित नहीं है। हम आपको निकटतम अधिकृत पेट्रोल पंप तक मार्गदर्शन या सुरक्षित टोइंग सेवा उपलब्ध करा रहे हैं।'
            : 'Vehicle appears to have experienced fuel exhaustion. For safety and regulatory compliance, RoadResQ provides authorized escort to nearby certified fuel stations or safe flatbed towing rather than hazardous open fuel carrying.';
        
        followUpQuestions.push(
          lang === 'ta'
            ? 'வாகனம் இப்போது நெடுஞ்சாலையிலா அல்லது குடியிருப்பு பகுதியிலா நிற்கிறது?'
            : 'Is the vehicle currently stopped on an active highway lane or near a service road?'
        );

        suggestedActions.push({
          label: lang === 'ta' ? 'அருகிலுள்ள பங்குகளை பார்' : 'View Nearby Fuel Stations',
          action: 'view_fuel_stations',
        });
        suggestedActions.push({
          label: lang === 'ta' ? 'சாலையோர உதவி கோரு' : 'Request Roadside Tow / Escort',
          action: 'request_service',
          payload: { issueCategory: 'fuel', serviceType: recommendedService, estimatedCost },
        });
        break;

      case 'tyre':
        recommendedService = vehicleType === 'bike' ? 'Two-Wheeler Puncture Repair' : 'Mobile Flat Tyre & Puncture Assist';
        estimatedCost = vehicleType === 'bike' ? 250 : 450;
        explanation =
          lang === 'ta' || lang === 'tanglish'
            ? 'டயர் காற்று இறங்குதல் அல்லது பஞ்சர் ஏற்பட்டிருக்கலாம். எங்கள் மொபைல் தொழில்நுட்ப வல்லுநர் ஏர் கம்ப்ரசர் மற்றும் பஞ்சர் கிட்டுடன் உங்கள் இடத்திற்கே வருவார்.'
            : lang === 'hi'
            ? 'टायर में पंक्चर या दबाव कम होने की संभावना है। मैकेनिक मोबाइल कंप्रेसर और पंक्चर रिपेयर किट के साथ आपके पास पहुंचेगा।'
            : 'Observed signs of tyre puncture or loss of pressure. An equipped mobile tyre unit with on-board air compressor can reach your location.';

        followUpQuestions.push('Do you have an inflated spare wheel available in the boot?');
        suggestedActions.push({
          label: lang === 'ta' ? 'டயர் மெக்கானிக்கை அழைக்க' : 'Book Tyre Assistance',
          action: 'request_service',
          payload: { issueCategory: 'tyre', serviceType: recommendedService, estimatedCost },
        });
        suggestedActions.push({
          label: 'Call Towing Alternative',
          action: 'call_towing',
        });
        break;

      case 'battery':
        recommendedService = 'Heavy-Duty Battery Jumpstart & Diagnostic';
        estimatedCost = vehicleType === 'truck' ? 950 : 550;
        explanation =
          lang === 'ta' || lang === 'tanglish'
            ? 'பேட்டரி மின்னூட்டம் (Charge) குறைந்து ஸ்டார்ட்டிங் மோட்டார் சுழலாமல் இருக்கலாம். 12V போர்ட்டபிள் ஜம்ப்ஸ்டார்ட் பூஸ்டர் மூலம் சரிசெய்யலாம்.'
            : lang === 'hi'
            ? 'बैटरी डिस्चार्ज होने के लक्षण हैं। 12V पोर्टेबल बूस्टर पैक के साथ तत्काल जंपस्टार्ट और अल्टरनेटर जांच की जाएगी।'
            : 'Symptoms indicate discharged auxiliary battery or loose terminal connection. A technician with a 12V high-amperage booster pack can jumpstart and test the charging circuit on site.';

        followUpQuestions.push('Do the dashboard lights dim completely when you turn the key or press the start button?');
        suggestedActions.push({
          label: lang === 'ta' ? 'ஜம்ப்ஸ்டார்ட் முன்பதிவு செய்' : 'Request Jumpstart Dispatch',
          action: 'request_service',
          payload: { issueCategory: 'battery', serviceType: recommendedService, estimatedCost },
        });
        break;

      case 'accident':
        recommendedService = 'Emergency Accident First-Response & Hydraulic Towing';
        estimatedCost = 1800;
        explanation =
          lang === 'ta'
            ? 'அவசர விபத்து பதிவு செய்யப்பட்டுள்ளது. யாருக்கேனும் காயம் ஏற்பட்டிருந்தால் உடனடியாக 108 ஆம்புலன்ஸை அழைக்கவும். உங்கள் GPS இருப்பிடம் பதிவு செய்யப்பட்டுள்ளது.'
            : lang === 'hi'
            ? 'दुर्घटना की आपातकालीन स्थिति दर्ज की गई है। यदि कोई घायल है तो तुरंत 108 पर कॉल करें। सुरक्षित फ्लैटबेड वाहन सहायता पर है।'
            : 'High-priority emergency protocol activated. If anyone is injured, call 108 Ambulance immediately. We have recorded your precise GPS coordinate.';

        suggestedActions.push({
          label: 'Call Police 112 / Ambulance 108',
          action: 'call_emergency',
        });
        suggestedActions.push({
          label: 'Dispatch Emergency Flatbed',
          action: 'request_service',
          payload: { issueCategory: 'accident', serviceType: recommendedService, estimatedCost },
        });
        break;

      case 'towing':
        recommendedService = 'Hydraulic Flatbed Towing Service';
        estimatedCost = 1600;
        explanation = 'Safe hydraulic flatbed towing suitable for non-drivable vehicles, EV breakdowns, or mechanical lockup.';
        suggestedActions.push({
          label: 'Book Flatbed Towing',
          action: 'request_service',
          payload: { issueCategory: 'towing', serviceType: recommendedService, estimatedCost },
        });
        break;

      default:
        recommendedService = 'Roadside Mechanic Inspection & Triage';
        estimatedCost = 500;
        explanation =
          lang === 'ta'
            ? 'வாகனத்தில் பொதுவான மெக்கானிக்கல் அல்லது எலக்ட்ரிக்கல் கோளாறு ஏற்பட்டுள்ளது. தளத்தில் தொழில்முறை மெக்கானிக் ஆய்வு தேவை.'
            : 'Vehicle is unable to run normally. An authorized roadside mechanic will perform on-site diagnosis and repair.';
        suggestedActions.push({
          label: 'Request Mechanic Dispatch',
          action: 'request_service',
          payload: { issueCategory: issueType, serviceType: recommendedService, estimatedCost },
        });
        suggestedActions.push({
          label: 'Request Towing',
          action: 'call_towing',
        });
        break;
    }

    if (photoUrl) {
      explanation += ` [Verified with visual condition analysis: ${photoUrl ? 'Visible exterior condition reviewed' : ''}]`;
    }

    return {
      issueType,
      vehicleType,
      urgency,
      confidence,
      recommendedService,
      estimatedCost,
      explanation,
      safetyGuidance,
      followUpQuestions,
      suggestedActions,
    };
  }

  // AI Action Tools
  public getUserLocation(): Promise<GeoLocation> {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            resolve({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              address: 'GPS Identified Location (Current Device)',
            });
          },
          () => {
            // Fallback to Chennai OMR default if permission denied
            resolve({
              lat: 12.9249,
              lng: 80.2272,
              address: 'OMR Road near Sholinganallur Junction, Chennai',
            });
          },
          { timeout: 5000 }
        );
      } else {
        resolve({
          lat: 12.9249,
          lng: 80.2272,
          address: 'OMR Road near Sholinganallur Junction, Chennai',
        });
      }
    });
  }

  public findNearbyProviders(category?: IssueCategory): ServiceProvider[] {
    const all = storageService.getProviders();
    return all.filter((p) => {
      if (p.workStatus !== 'ONLINE') return false;
      if (p.verificationStatus !== 'VERIFIED') return false;
      if (category && !p.serviceCategories.includes(category)) return false;
      return true;
    });
  }

  public findNearbyFuelStations(): SafePlace[] {
    return storageService.getSafePlaces().filter((sp) => sp.type === 'fuel_station');
  }

  public findNearbyTowingProviders(): ServiceProvider[] {
    return storageService.getProviders().filter((p) => p.serviceCategories.includes('towing') && p.workStatus === 'ONLINE');
  }

  public estimateServiceCost(category: IssueCategory, distanceKm: number = 3.5): number {
    const rates: Record<IssueCategory, { base: number; perKm: number }> = {
      fuel: { base: 350, perKm: 30 },
      tyre: { base: 300, perKm: 25 },
      battery: { base: 450, perKm: 30 },
      breakdown: { base: 400, perKm: 35 },
      mechanical: { base: 500, perKm: 40 },
      electrical: { base: 450, perKm: 35 },
      engine: { base: 600, perKm: 45 },
      towing: { base: 1200, perKm: 80 },
      accident: { base: 1500, perKm: 90 },
      unknown: { base: 400, perKm: 30 },
    };

    const r = rates[category] || rates.unknown;
    return Math.round(r.base + r.perKm * distanceKm);
  }
}

export const resqAiService = new ResQAIService();
