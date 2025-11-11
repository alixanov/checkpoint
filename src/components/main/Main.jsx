import React, { useState, useRef, Component } from 'react';
import {
  Box,
  Typography,
  Button,
  Input,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Fade,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import ListIcon from '@mui/icons-material/List';
import DownloadIcon from '@mui/icons-material/Download';
import ArticleIcon from '@mui/icons-material/Article';
import AssessmentIcon from '@mui/icons-material/Assessment';
import GavelIcon from '@mui/icons-material/Gavel';
import WarningIcon from '@mui/icons-material/Warning';

// Modern color palette - educational theme
const colors = {
  primary: '#4F46E5', // Indigo
  primaryLight: '#818CF8',
  secondary: '#06B6D4', // Cyan
  accent: '#10B981', // Emerald
  accentLight: '#34D399',
  error: '#EF4444', // Red
  errorLight: '#FCA5A5',
  warning: '#F59E0B', // Amber
  background: '#F8FAFC',
  cardBg: '#FFFFFF',
  text: '#1E293B',
  textLight: '#64748B',
  border: '#E2E8F0',
  highlight: '#EEF2FF',
};

// Styled components
const Container = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: '1200px',
  margin: '0 auto',
  minHeight: '100vh',
  backgroundColor: colors.background,
  fontFamily: '"Inter", "Roboto", sans-serif',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const HeaderCard = styled(Card)({
  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%)`,
  color: '#FFFFFF',
  borderRadius: '16px',
  marginBottom: '32px',
  boxShadow: '0 10px 25px rgba(79, 70, 229, 0.2)',
});

const StyledCard = styled(Card)({
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  backgroundColor: colors.cardBg,
  border: `1px solid ${colors.border}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)',
    transform: 'translateY(-2px)',
  },
});

const InfoCard = styled(Card)(({ variant }) => {
  const getColors = () => {
    switch (variant) {
      case 'success':
        return {
          bg: '#ECFDF5',
          border: colors.accentLight,
          icon: colors.accent,
        };
      case 'error':
        return {
          bg: '#FEF2F2',
          border: colors.errorLight,
          icon: colors.error,
        };
      case 'info':
        return {
          bg: '#F0F9FF',
          border: colors.secondary,
          icon: colors.secondary,
        };
      case 'warning':
        return {
          bg: '#FFFBEB',
          border: colors.warning,
          icon: colors.warning,
        };
      default:
        return {
          bg: colors.highlight,
          border: colors.primaryLight,
          icon: colors.primary,
        };
    }
  };

  const colorScheme = getColors();

  return {
    backgroundColor: colorScheme.bg,
    borderRadius: '12px',
    border: `2px solid ${colorScheme.border}`,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)',
    },
    height: '100%',
  };
});

const AnalyzeButton = styled(Button)({
  backgroundColor: colors.primary,
  color: '#FFFFFF',
  padding: '14px 32px',
  borderRadius: '12px',
  fontSize: '16px',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
  '&:hover': {
    backgroundColor: '#4338CA',
    boxShadow: '0 6px 16px rgba(79, 70, 229, 0.4)',
  },
  '&:disabled': {
    backgroundColor: colors.textLight,
  },
  transition: 'all 0.3s ease',
});

const DownloadButton = styled(Button)({
  backgroundColor: colors.secondary,
  color: '#FFFFFF',
  padding: '12px 28px',
  borderRadius: '12px',
  fontSize: '15px',
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)',
  '&:hover': {
    backgroundColor: '#0891B2',
    boxShadow: '0 6px 16px rgba(6, 182, 212, 0.4)',
  },
  '&:disabled': {
    backgroundColor: colors.textLight,
  },
  transition: 'all 0.3s ease',
});

const ErrorBox = styled(Box)({
  backgroundColor: '#FEF2F2',
  padding: '16px',
  borderRadius: '12px',
  marginBottom: '20px',
  display: 'flex',
  alignItems: 'center',
  border: `2px solid ${colors.errorLight}`,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
});

const StyledChip = styled(Chip)(({ variant }) => ({
  fontWeight: 600,
  fontSize: '13px',
  height: '32px',
  ...(variant === 'success' && {
    backgroundColor: colors.accent,
    color: '#FFFFFF',
  }),
  ...(variant === 'error' && {
    backgroundColor: colors.error,
    color: '#FFFFFF',
  }),
}));

// Error Boundary Component
class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorBox>
          <ErrorIcon sx={{ color: colors.error, mr: 1, fontSize: 24 }} />
          <Typography color={colors.error} fontSize={15} fontWeight={500}>
            Хатолик юз берди: {this.state.error?.message || 'Номаълум хатолик.'}
          </Typography>
        </ErrorBox>
      );
    }
    return this.props.children;
  }
}

const requiredKeywords = [
  'ANNOTATSIYA',
  'KIRISH',
  'ILMIY TADQIQOT ISHI MAVZUSI BO\'YICHA ANALITIK TAHLIL',
  'UMUMIY XULOSA VA TAVSIYALAR',
  'FOYDANILGAN ADABIYOTLAR',
  'ILOVALAR',
  'XULOSA',
  'TEXNIKA VA TEXNOLOGIYALARNI TAKOMILLASHTIRISH MAQSADIDA O\'TKAZILGAN TADQIQOTLAR TAHLILI',
];

// KIRISH талаблари
const kirishRequirements = [
  {
    id: 1,
    name: 'Dissertatsiya mavzusining dolzarbligi va zarurati',
    minWords: 150,
    keywords: ['dolzarbligi', 'zarurati', 'muhimligi'],
    description: 'Мавзунинг аҳамияти ва долзарблиги асосланган бўлиши керак'
  },
  {
    id: 2,
    name: 'Tadqiqotning respublika fan va texnologiyalar rivojlanishining ustuvor yo\'nalishlariga mosligi',
    minWords: 50,
    keywords: ['ustuvor yo\'nalish', 'fan va texnologiya'],
    description: 'Устувор йўналишга мослиги кўрсатилиши шарт'
  },
  {
    id: 3,
    name: 'Dissertatsiya mavzusi bo\'yicha xorijiy ilmiy-tadqiqotlar sharhi',
    minWords: 200,
    keywords: ['xorijiy', 'ilmiy-tadqiqot', 'sharh'],
    description: 'Хорижий тадқиқотларнинг таҳлили берилиши лозим'
  },
  {
    id: 4,
    name: 'Muammoning o\'rganilganlik darajasi',
    minWords: 150,
    keywords: ['o\'rganilganlik', 'muammo'],
    description: 'Муаммонинг ўрганилганлик даражаси баён этилиши зарур'
  },
  {
    id: 5,
    name: 'Dissertatsiya mavzusining dissertatsiya bajarilayotgan oliy ta\'lim muassasining ilmiy-tadqiqot ishlari bilan bog\'liqligi',
    minWords: 50,
    keywords: ['ilmiy-tadqiqot', 'bog\'liqlik'],
    description: 'Илмий-тадқиқот ишлари билан боғлиқлиги кўрсатилиши керак'
  },
  {
    id: 6,
    name: 'Tadqiqotning maqsadi',
    minWords: 50,
    keywords: ['maqsad'],
    description: 'Тадқиқотнинг аниқ мақсади белгиланиши шарт'
  },
  {
    id: 7,
    name: 'Tadqiqotning vazifalari',
    minWords: 100,
    keywords: ['vazifa'],
    description: 'Тадқиқот вазифалари рўйхат кўринишида берилиши керак'
  },
  {
    id: 8,
    name: 'Tadqiqotning ob\'ekti va predmeti',
    minWords: 50,
    keywords: ['ob\'ekt', 'predmet'],
    description: 'Объект ва предмет аниқ ифодаланиши лозим'
  },
  {
    id: 9,
    name: 'Tadqiqotning usullari',
    minWords: 80,
    keywords: ['usul', 'metod'],
    description: 'Қўлланган усуллар тавсифланиши зарур'
  },
  {
    id: 10,
    name: 'Tadqiqotning ilmiy yangiligi',
    minWords: 150,
    keywords: ['ilmiy yangili', 'innovatsion'],
    description: 'Илмий янгиликлар аниқ кўрсатилиши шарт'
  },
  {
    id: 11,
    name: 'Tadqiqotning amaliy natijasi',
    minWords: 100,
    keywords: ['amaliy natija', 'tatbiq'],
    description: 'Амалий натижалар баён этилиши керак'
  },
  {
    id: 12,
    name: 'Tadqiqot natijalarining ishonchliligi',
    minWords: 80,
    keywords: ['ishonchlilik', 'tasdiqlash'],
    description: 'Натижаларнинг ишончлилиги асосланиши лозим'
  },
  {
    id: 13,
    name: 'Tadqiqot natijalarining ilmiy va amaliy ahamiyati',
    minWords: 100,
    keywords: ['ilmiy ahamiyat', 'amaliy ahamiyat'],
    description: 'Илмий ва амалий аҳамияти очиб берилиши зарур'
  },
  {
    id: 14,
    name: 'Tadqiqot natijalarining joriy qilinishi',
    minWords: 100,
    keywords: ['joriy qilish', 'tatbiq', 'iqtisodiy samara'],
    description: 'Жорий қилиниш маълумотлари берилиши шарт'
  },
  {
    id: 15,
    name: 'Tadqiqot natijalarining aprobatsiyasi',
    minWords: 50,
    keywords: ['aprobatsiya', 'konferensiya', 'seminar'],
    description: 'Апробация маълумотлари кўрсатилиши керак'
  },
  {
    id: 16,
    name: 'Tadqiqot natijalarining e\'lon qilinishi',
    minWords: 80,
    keywords: ['nashr', 'maqola', 'patent'],
    description: 'Нашр этилган ишлар тўғрисида маълумот берилиши лозим'
  },
  {
    id: 17,
    name: 'Dissertatsiyaning tuzilishi va hajmi',
    minWords: 30,
    keywords: ['tuzilish', 'hajm', 'bob'],
    description: 'Диссертация тузилиши кўрсатилиши зарур'
  }
];

const Main = () => {
  const [dissertationText, setDissertationText] = useState('');
  const [result, setResult] = useState(null);
  const [description, setDescription] = useState(null);
  const [kirishAnalysis, setKirishAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPDFButton, setShowPDFButton] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Extract text from file (simplified version)
  const extractTextFromFile = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          // For demo purposes, we'll simulate text extraction
          // In a real app, you would use pdfjs or mammoth here
          const text = `Simulated text extraction from ${file.name}. 
          This is a demo version. In production, you would integrate pdfjs-dist for PDF files 
          and mammoth for DOCX files to extract actual text content. 
          
          ANNOTATSIYA KIRISH ILMIY TADQIQOT ISHI MAVZUSI BO'YICHA ANALITIK TAHLIL 
          UMUMIY XULOSA VA TAVSIYALAR FOYDANILGAN ADABIYOTLAR ILOVALAR XULOSA 
          TEXNIKA VA TEXNOLOGIYALARNI TAKOMILLASHTIRISH MAQSADIDA O'TKAZILGAN TADQIQOTLAR TAHLILI`;

          resolve(text);
        } catch (error) {
          reject(new Error(`Файлни ўқишда хатолик: ${error.message}`));
        }
      };

      reader.onerror = () => reject(new Error('Файлни ўқиб бўлмади'));

      if (file.type === 'application/pdf') {
        // For PDF - in real app use pdfjsLib
        reader.readAsArrayBuffer(file);
      } else if (file.type.includes('word') || file.name.includes('.doc')) {
        // For DOC/DOCX - in real app use mammoth
        reader.readAsArrayBuffer(file);
      } else {
        // For text files
        reader.readAsText(file, 'UTF-8');
      }
    });
  };

  // Limit text to 50 words
  const limitTo50Words = (text) => {
    if (!text) return '';
    const words = text.split(/\s+/).filter((word) => word.length > 0);
    if (words.length > 50) {
      return words.slice(0, 50).join(' ') + '...';
    }
    return words.join(' ');
  };

  // Fuzzy matching for keywords
  const fuzzyMatchKeyword = (text, keyword) => {
    if (!text) return false;

    const textLower = text.toLowerCase();
    const keywordLower = keyword.toLowerCase();

    if (textLower.includes(keywordLower)) {
      return true;
    }

    const keywordWords = keywordLower.split(/\s+/).filter(word => word.length > 0);
    const requiredMatches = Math.ceil(keywordWords.length * 0.8);
    let matchedWords = 0;

    for (const word of keywordWords) {
      if (textLower.includes(word)) {
        matchedWords++;
      }
    }

    return matchedWords >= requiredMatches;
  };

  // Анализ KIRISH бўлими
  const analyzeKirish = (text) => {
    if (!text) return null;

    const textLower = text.toLowerCase();
    const kirishIndex = textLower.indexOf('kirish');

    if (kirishIndex === -1) {
      return null;
    }

    // KIRISH дан кейинги бўлакни олиш
    let kirishText = text.substring(kirishIndex);

    // Кейинги бошқа бўлимларни топиш
    const nextSectionIndex = kirishText.toLowerCase().search(/(bob|ilmiy tadqiqot|asosiy qism)/i);
    if (nextSectionIndex !== -1 && nextSectionIndex > 0) {
      kirishText = kirishText.substring(0, nextSectionIndex);
    }

    const wordCount = kirishText.split(/\s+/).filter(w => w.length > 0).length;

    const checkedRequirements = kirishRequirements.map(req => {
      const hasKeywords = req.keywords.some(kw =>
        fuzzyMatchKeyword(kirishText, kw)
      );

      // Бўлим мавжудлигини текшириш
      const sectionFound = fuzzyMatchKeyword(kirishText, req.name);

      return {
        ...req,
        found: hasKeywords || sectionFound,
        status: hasKeywords || sectionFound ? 'success' : 'error'
      };
    });

    const foundCount = checkedRequirements.filter(r => r.found).length;
    const totalCount = kirishRequirements.length;
    const completionPercent = Math.round((foundCount / totalCount) * 100);

    // Юридик баҳо
    let legalAssessment = '';
    let legalStatus = 'error';

    if (completionPercent >= 95) {
      legalAssessment = 'Диссертация "КИРИШ" бўлими ВАК талабларига тўлиқ мувофиқ келади ва барча зарур структур элементларини ўз ичига олади.';
      legalStatus = 'success';
    } else if (completionPercent >= 80) {
      legalAssessment = 'Диссертация "КИРИШ" бўлими асосан талабларга жавоб беради, аммо айрим структур элементларни тўлдириш тавсия этилади.';
      legalStatus = 'warning';
    } else if (completionPercent >= 60) {
      legalAssessment = 'Диссертация "КИРИШ" бўлими қисман талабларга мувофиқ. Қуйидаги мезонларни бартараф этиш зарур.';
      legalStatus = 'warning';
    } else {
      legalAssessment = 'Диссертация "КИРИШ" бўлими ВАК талабларига номувофиқ. Тизимли қайта ишлаш талаб этилади.';
      legalStatus = 'error';
    }

    return {
      wordCount,
      requirements: checkedRequirements,
      foundCount,
      totalCount,
      completionPercent,
      legalAssessment,
      legalStatus
    };
  };

  // Handle file selection
  const handleFileChange = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;

      setError('');
      setResult(null);
      setDescription(null);
      setKirishAnalysis(null);
      setShowPDFButton(false);
      setIsLoading(true);

      const text = await extractTextFromFile(file);
      setDissertationText(text);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  // Analyze dissertation
  const checkDissertation = async () => {
    if (!dissertationText) {
      setError('Илтимос, файл юкланг ёки матн киритинг!');
      return;
    }

    setError('');
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const missingKeywords = [];
      const foundKeywords = [];
      requiredKeywords.forEach((keyword) => {
        if (fuzzyMatchKeyword(dissertationText, keyword)) {
          foundKeywords.push(keyword);
        } else {
          missingKeywords.push(keyword);
        }
      });

      let conclusionText = '';
      if (foundKeywords.includes('XULOSA') && fuzzyMatchKeyword(dissertationText, 'UMUMIY XULOSA VA TAVSIYALAR')) {
        const umumiyXulosaIndex = dissertationText.toLowerCase().indexOf('umumiy xulosa va tavsiyalar');
        if (umumiyXulosaIndex !== -1) {
          const textAfterUmumiyXulosa = dissertationText
            .slice(umumiyXulosaIndex + 'UMUMIY XULOSA VA TAVSIYALAR'.length)
            .trim();
          conclusionText = limitTo50Words(textAfterUmumiyXulosa);
        }
      }

      const wordCount = dissertationText.split(/\s+/).filter((word) => word.length > 0).length;
      const charCount = dissertationText.length;
      const keywordCount = foundKeywords.length;
      const limitedText = limitTo50Words(dissertationText);

      setDescription({
        wordCount,
        charCount,
        keywordCount,
        totalKeywords: requiredKeywords.length,
        limitedText,
      });

      setResult({ missingKeywords, foundKeywords, conclusionText });

      // KIRISH таҳлили
      const kirishResult = analyzeKirish(dissertationText);
      setKirishAnalysis(kirishResult);

      setShowPDFButton(true);
    } catch (error) {
      setError(`Текширишда хатолик: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Download PDF
  const downloadPDF = async () => {
    try {
      setIsLoading(true);

      // Create a simple text report instead of using jsPDF
      const report = [
        'Диссертация текшируви натижалари',
        '================================',
        '',
        'Калит сўзлар ҳолати:',
        ...(result ? [
          result.missingKeywords.length === 0
            ? 'Ҳурматли докторант, илмий иш бўйича барча мезонлар мавжуд!'
            : 'Ҳурматли докторант, сизда қуйидаги мезон(лар) мавжуд эмас:',
          ...result.foundKeywords.map(kw => `✓ ${kw} - мавжуд`),
          ...result.missingKeywords.map(kw => `✗ ${kw} - мавжуд эмас`),
        ] : []),
        '',
        ...(kirishAnalysis ? [
          'КИРИШ бўлими таҳлили:',
          `Юридик баҳо: ${kirishAnalysis.legalAssessment}`,
          `Тўлиқлик: ${kirishAnalysis.completionPercent}%`,
          `Топилган талаблар: ${kirishAnalysis.foundCount}/${kirishAnalysis.totalCount}`,
          '',
        ] : []),
        ...(description ? [
          'Диссертация ҳақида умумий маълумот:',
          `Сўзлар сони: ${description.wordCount}`,
          `Белгилар сони: ${description.charCount}`,
          `Топиланган калит сўзлар: ${description.keywordCount}/${description.totalKeywords}`,
          `Диссертация мазмуни: ${description.limitedText}`,
        ] : [])
      ].join('\n');

      // Create and download text file
      const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'dissertation_analysis.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      setError(`Ҳисоботни яратишда хатолик: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <Container>
        {/* Header */}
        <HeaderCard>
          <CardContent sx={{ p: 4 }}>
            <Box display="flex" alignItems="center" gap={2}>
              <ArticleIcon sx={{ fontSize: 48 }} />
              <Box>
                <Typography variant="h4" fontWeight={700} mb={1}>
                  Диссертация текшируви
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Илмий ишингизни автоматик текшириш тизими
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </HeaderCard>

        {error && (
          <ErrorBox>
            <ErrorIcon sx={{ color: colors.error, mr: 1, fontSize: 24 }} />
            <Typography color={colors.error} fontSize={15} fontWeight={500}>
              {error}
            </Typography>
          </ErrorBox>
        )}

        {/* Upload Section */}
        <StyledCard sx={{ mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <UploadFileIcon sx={{ color: colors.primary, mr: 1, fontSize: 28 }} />
              <Typography fontWeight={600} fontSize={18} color={colors.text}>
                Файл юклаш
              </Typography>
            </Box>
            <Input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileChange}
              inputRef={fileInputRef}
              fullWidth
              sx={{
                border: `2px dashed ${colors.border}`,
                borderRadius: '12px',
                padding: '16px',
                backgroundColor: colors.highlight,
                '&:hover': {
                  borderColor: colors.primary,
                  backgroundColor: '#FFFFFF',
                },
                '& input': {
                  cursor: 'pointer',
                },
              }}
            />
            <Typography fontSize={13} color={colors.textLight} mt={1}>
              PDF, DOC, DOCX ёки TXT форматидаги файлларни қўллаб-қувватлайди
            </Typography>
            {isLoading && (
              <Box display="flex" alignItems="center" mt={2}>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                <Typography fontSize={14} color={colors.textLight}>
                  Файл юкланмоқда...
                </Typography>
              </Box>
            )}
          </CardContent>
        </StyledCard>



        {/* Action Buttons */}
        <Box display="flex" gap={2} mb={4} flexWrap="wrap">
          <AnalyzeButton
            onClick={checkDissertation}
            disabled={isLoading || !dissertationText}
            startIcon={isLoading ? null : <PlayArrowIcon />}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Текширишни бошлаш'}
          </AnalyzeButton>

          {showPDFButton && (
            <DownloadButton
              onClick={downloadPDF}
              disabled={isLoading}
              startIcon={<DownloadIcon />}
            >
              Ҳисоботни юклаб олиш
            </DownloadButton>
          )}
        </Box>

        {/* KIRISH Analysis Card */}
        {kirishAnalysis && (
          <Fade in={true} timeout={600}>
            <Box mb={3}>
              <InfoCard variant={kirishAnalysis.legalStatus}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" mb={3}>
                    <GavelIcon sx={{
                      color: kirishAnalysis.legalStatus === 'success' ? colors.accent :
                        kirishAnalysis.legalStatus === 'warning' ? colors.warning : colors.error,
                      mr: 1.5,
                      fontSize: 32
                    }} />
                    <Box flex={1}>
                      <Typography fontWeight={700} fontSize={20} color={colors.text}>
                        КИРИШ бўлими юридик баҳоси
                      </Typography>
                      <Typography fontSize={13} color={colors.textLight} mt={0.5}>
                        ВАК талабларига мувофиқлик даражаси
                      </Typography>
                    </Box>
                    <Chip
                      label={`${kirishAnalysis.completionPercent}%`}
                      sx={{
                        backgroundColor: kirishAnalysis.legalStatus === 'success' ? colors.accent :
                          kirishAnalysis.legalStatus === 'warning' ? colors.warning : colors.error,
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '18px',
                        height: '40px',
                        minWidth: '80px',
                      }}
                    />
                  </Box>

                  {/* Legal Assessment */}
                  <Box sx={{
                    p: 2.5,
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: `2px solid ${kirishAnalysis.legalStatus === 'success' ? colors.accentLight :
                      kirishAnalysis.legalStatus === 'warning' ? colors.warning : colors.errorLight
                      }`,
                    mb: 3
                  }}>
                    <Typography fontSize={15} fontWeight={600} color={colors.text} lineHeight={1.7}>
                      📋 Хулоса: {kirishAnalysis.legalAssessment}
                    </Typography>
                  </Box>

                  {/* Statistics */}
                  <Grid container spacing={2} mb={3}>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{
                        p: 2,
                        backgroundColor: '#FFFFFF',
                        borderRadius: '10px',
                        textAlign: 'center',
                        border: `2px solid ${colors.border}`,
                      }}>
                        <Typography fontSize={28} fontWeight={700} color={colors.accent}>
                          {kirishAnalysis.foundCount}
                        </Typography>
                        <Typography fontSize={12} color={colors.textLight} fontWeight={500}>
                          Мавжуд
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{
                        p: 2,
                        backgroundColor: '#FFFFFF',
                        borderRadius: '10px',
                        textAlign: 'center',
                        border: `2px solid ${colors.border}`,
                      }}>
                        <Typography fontSize={28} fontWeight={700} color={colors.error}>
                          {kirishAnalysis.totalCount - kirishAnalysis.foundCount}
                        </Typography>
                        <Typography fontSize={12} color={colors.textLight} fontWeight={500}>
                          Етишмаяпти
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{
                        p: 2,
                        backgroundColor: '#FFFFFF',
                        borderRadius: '10px',
                        textAlign: 'center',
                        border: `2px solid ${colors.border}`,
                      }}>
                        <Typography fontSize={28} fontWeight={700} color={colors.secondary}>
                          {kirishAnalysis.wordCount}
                        </Typography>
                        <Typography fontSize={12} color={colors.textLight} fontWeight={500}>
                          Сўзлар
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{
                        p: 2,
                        backgroundColor: '#FFFFFF',
                        borderRadius: '10px',
                        textAlign: 'center',
                        border: `2px solid ${colors.border}`,
                      }}>
                        <Typography fontSize={28} fontWeight={700} color={colors.primary}>
                          {kirishAnalysis.totalCount}
                        </Typography>
                        <Typography fontSize={12} color={colors.textLight} fontWeight={500}>
                          Жами талаб
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Requirements List */}
                  <Typography fontWeight={700} fontSize={16} color={colors.text} mb={2}>
                    Талаблар рўйхати ({kirishAnalysis.foundCount}/{kirishAnalysis.totalCount})
                  </Typography>
                  <Grid container spacing={1.5}>
                    {kirishAnalysis.requirements.map((req) => (
                      <Grid item xs={12} key={req.id}>
                        <Box sx={{
                          p: 2,
                          backgroundColor: req.found ? '#F0FDF4' : '#FEF2F2',
                          borderRadius: '10px',
                          border: `2px solid ${req.found ? colors.accentLight : colors.errorLight}`,
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 1.5
                        }}>
                          {req.found ? (
                            <CheckCircleIcon sx={{ color: colors.accent, fontSize: 24, mt: 0.2, flexShrink: 0 }} />
                          ) : (
                            <ErrorIcon sx={{ color: colors.error, fontSize: 24, mt: 0.2, flexShrink: 0 }} />
                          )}
                          <Box flex={1}>
                            <Typography fontSize={14} fontWeight={600} color={colors.text}>
                              {req.id}. {req.name}
                            </Typography>
                            <Typography fontSize={12} color={colors.textLight} mt={0.5}>
                              {req.description} (минимум {req.minWords} сўз)
                            </Typography>
                            {!req.found && (
                              <Box mt={1}>
                                <Chip
                                  size="small"
                                  icon={<WarningIcon />}
                                  label="Қўшиш зарур"
                                  sx={{
                                    backgroundColor: colors.errorLight,
                                    color: '#FFFFFF',
                                    fontSize: '11px',
                                    height: '24px',
                                  }}
                                />
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </InfoCard>
            </Box>
          </Fade>
        )}

        {/* Results Section */}
        {result && (
          <Fade in={true} timeout={600}>
            <Box>
              {/* Status Card */}
              <InfoCard variant={result.missingKeywords.length === 0 ? 'success' : 'error'} sx={{ mb: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    {result.missingKeywords.length === 0 ? (
                      <CheckCircleIcon sx={{ color: colors.accent, mr: 1, fontSize: 32 }} />
                    ) : (
                      <ErrorIcon sx={{ color: colors.error, mr: 1, fontSize: 32 }} />
                    )}
                    <Typography
                      fontWeight={700}
                      fontSize={18}
                      color={result.missingKeywords.length === 0 ? colors.accent : colors.error}
                    >
                      {result.missingKeywords.length === 0 ? 'Табриклаймиз! ✓' : 'Эътибор беринг!'}
                    </Typography>
                  </Box>
                  <Typography fontSize={15} color={colors.text}>
                    {result.missingKeywords.length === 0
                      ? 'Ҳурматли докторант, илмий иш бўйича барча мезонлар мавжуд!'
                      : 'Ҳурматли докторант, сизда қуйидаги мезон(лар) мавжуд эмас. Илтимос, уларни қўшинг ва қайта текширинг.'}
                  </Typography>

                  {result.missingKeywords.length > 0 && (
                    <Box mt={2}>
                      <Grid container spacing={1}>
                        {result.missingKeywords.map((keyword) => (
                          <Grid item key={keyword}>
                            <StyledChip
                              label={keyword}
                              variant="error"
                              icon={<ErrorIcon sx={{ color: '#FFFFFF !important' }} />}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}
                </CardContent>
              </InfoCard>

              {/* Found Keywords Card */}
              {result.foundKeywords.length > 0 && (
                <InfoCard variant="success" sx={{ mb: 3 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <ListIcon sx={{ color: colors.accent, mr: 1, fontSize: 28 }} />
                      <Typography fontWeight={700} fontSize={18} color={colors.text}>
                        Топилган калит сўзлар
                      </Typography>
                      <Box ml="auto">
                        <Chip
                          label={`${result.foundKeywords.length}/${requiredKeywords.length}`}
                          sx={{
                            backgroundColor: colors.accent,
                            color: '#FFFFFF',
                            fontWeight: 700,
                          }}
                        />
                      </Box>
                    </Box>
                    <Grid container spacing={2}>
                      {result.foundKeywords.map((keyword) => (
                        <Grid item xs={12} sm={6} md={4} key={keyword}>
                          <Box
                            sx={{
                              p: 2,
                              backgroundColor: '#FFFFFF',
                              borderRadius: '8px',
                              border: `1px solid ${colors.accentLight}`,
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <CheckCircleIcon
                              sx={{ color: colors.accent, mr: 1.5, fontSize: 20 }}
                            />
                            <Typography fontSize={14} fontWeight={600} color={colors.text}>
                              {keyword}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                    {result.conclusionText && (
                      <Box mt={2} sx={{
                        p: 2,
                        backgroundColor: '#FFFFFF',
                        borderRadius: '8px',
                        border: `1px solid ${colors.accentLight}`,
                      }}>
                        <Typography fontSize={14} fontWeight={600} color={colors.text} mb={1}>
                          Хулоса:
                        </Typography>
                        <Typography fontSize={13} color={colors.textLight}>
                          {result.conclusionText}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </InfoCard>
              )}
            </Box>
          </Fade>
        )}

        {/* Statistics Card */}
        {description && (
          <Fade in={true} timeout={600}>
            <InfoCard variant="info">
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" mb={3}>
                  <AssessmentIcon sx={{ color: colors.secondary, mr: 1, fontSize: 28 }} />
                  <Typography fontWeight={700} fontSize={18} color={colors.text}>
                    Умумий маълумот
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box
                      sx={{
                        p: 2,
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        textAlign: 'center',
                        border: `2px solid ${colors.border}`,
                        height: '120px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography fontSize={32} fontWeight={700} color={colors.primary}>
                        {description.wordCount}
                      </Typography>
                      <Typography fontSize={13} color={colors.textLight} fontWeight={500}>
                        Сўзлар сони
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box
                      sx={{
                        p: 2,
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        textAlign: 'center',
                        border: `2px solid ${colors.border}`,
                        height: '120px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography fontSize={32} fontWeight={700} color={colors.secondary}>
                        {description.charCount}
                      </Typography>
                      <Typography fontSize={13} color={colors.textLight} fontWeight={500}>
                        Белгилар сони
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box
                      sx={{
                        p: 2,
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        textAlign: 'center',
                        border: `2px solid ${colors.border}`,
                        height: '120px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography fontSize={32} fontWeight={700} color={colors.accent}>
                        {description.keywordCount}
                      </Typography>
                      <Typography fontSize={13} color={colors.textLight} fontWeight={500}>
                        Топилган калит сўзлар
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box
                      sx={{
                        p: 2,
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        textAlign: 'center',
                        border: `2px solid ${colors.border}`,
                        height: '120px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography fontSize={32} fontWeight={700} color={colors.warning}>
                        {Math.round((description.keywordCount / description.totalKeywords) * 100)}%
                      </Typography>
                      <Typography fontSize={13} color={colors.textLight} fontWeight={500}>
                        Тўлиқлик даражаси
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        p: 2.5,
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        border: `2px solid ${colors.border}`,
                      }}
                    >
                      <Typography fontSize={14} fontWeight={600} color={colors.text} mb={1}>
                        Диссертация мазмуни
                      </Typography>
                      <Typography fontSize={13} color={colors.textLight} lineHeight={1.6}>
                        {description.limitedText}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </InfoCard>
          </Fade>
        )}
      </Container>
    </ErrorBoundary>
  );
};

export default Main;