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
  ListItemIcon,
  TextField,
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
import TextFieldsIcon from '@mui/icons-material/TextFields';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import { jsPDF } from 'jspdf';

// Initialize pdf.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

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
    transform: 'translateY(-4px) rotateX(2deg) rotateY(2deg)',
    perspective: '1000px',
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
      transform: 'translateY(-4px) rotateX(2deg) rotateY(2deg)',
      boxShadow: `0 8px 20px ${colorScheme.border}40`,
      perspective: '1000px',
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
    transform: 'scale(1.05)',
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
    transform: 'scale(1.05)',
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
    backgroundColor: colors.accentLight,
    color: '#FFFFFF',
  }),
  ...(variant === 'error' && {
    backgroundColor: colors.errorLight,
    color: '#FFFFFF',
  }),
}));

// Error Boundary Component
class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
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
  'TEXNIKA VA TEXNOLOGIYALARNI TAKOMILLASHTIRISH MAQSADIDA O‘TKAZILGAN TADQIQOTLAR TAHLILI',
];

const Main = () => {
  const [dissertationText, setDissertationText] = useState('');
  const [result, setResult] = useState(null);
  const [description, setDescription] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPDFButton, setShowPDFButton] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Extract text from PDF
  const extractTextFromPDF = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let text = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item) => item.str).join(' ') + ' ';
      }
      return text;
    } catch (error) {
      throw new Error(`PDF файлни ўқишда хатолик: ${error.message} `);
    }
  };

  // Extract text from DOCX
  const extractTextFromDOCX = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    } catch (error) {
      throw new Error(`DOCX файлни ўқишда хатолик: ${error.message} `);
    }
  };

  // Limit text to 50 words
  const limitTo50Words = (text) => {
    const words = text.split(/\s+/).filter((word) => word.length > 0);
    if (words.length > 50) {
      return words.slice(0, 50).join(' ') + '...';
    }
    return words.join(' ');
  };

  // Fuzzy matching for keywords
  const fuzzyMatchKeyword = (text, keyword) => {
    const textLower = text.toLowerCase();
    const keywordLower = keyword.toLowerCase();

    // Exact match
    if (textLower.includes(keywordLower)) {
      return true;
    }

    // Partial match: check if 80% of keyword words are present
    const keywordWords = keywordLower.split(/\s+/).filter(word => word.length > 0);
    const requiredMatches = Math.ceil(keywordWords.length * 0.8); // 80% of words
    let matchedWords = 0;

    for (const word of keywordWords) {
      if (textLower.includes(word)) {
        matchedWords++;
      }
    }

    return matchedWords >= requiredMatches;
  };

  // Handle file selection
  const handleFileChange = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;

      setError('');
      setResult(null);
      setDescription(null);
      setShowPDFButton(false);

      let text = '';
      if (file.type === 'application/pdf') {
        text = await extractTextFromPDF(file);
      } else if (
        file.type === 'application/msword' ||
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        text = await extractTextFromDOCX(file);
      } else {
        setError('Фақат PDF ёки DOC/DOCX файллар қўллаб-қувватланади!');
        return;
      }
      setDissertationText(text);
    } catch (error) {
      setError(error.message);
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
      await new Promise((resolve) => setTimeout(resolve, 500));

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
      setShowPDFButton(true);
    } catch (error) {
      setError(`Текширишда хатолик: ${error.message} `);
    } finally {
      setIsLoading(false);
    }
  };

  // Download PDF
  const downloadPDF = async () => {
    try {
      setIsLoading(true);
      const doc = new jsPDF();
      let y = 20;

      doc.setFontSize(16);
      doc.text('Dissertatsiya Tekshiruvi Natijalari', 20, y);
      y += 10;

      doc.setFontSize(12);
      doc.text('Kalit so\'zlar holati:', 20, y);
      y += 10;
      if (result) {
        const resultText = result.missingKeywords.length === 0
          ? 'Hurmatli doktorant, ilmiy ish bo\'yicha barcha mezonlar mavjud!'
          : 'Hurmatli doktorant, sizda ushbu mezon(lar) bo\'yicha ilmiy ish dissertatsiyada mavjud emas, bartaraf etib qayta urinib ko\'ring!';
        doc.text(resultText, 20, y);
        y += 10;

        result.foundKeywords.forEach((kw) => {
          doc.text(`${kw} - mavjud`, 20, y);
          if (kw === 'XULOSA' && result.conclusionText) {
            y += 7;
            doc.text(`Xulosa: ${result.conclusionText} `, 20, y);
          }
          y += 7;
        });

        result.missingKeywords.forEach((kw) => {
          doc.text(`${kw} - mavjud emas`, 20, y);
          y += 7;
        });
      }

      y += 10;
      doc.text('Dissertatsiya haqida umumiy ma\'lumot:', 20, y);
      y += 10;
      if (description) {
        doc.text(`So\'zlar soni: ${description.wordCount} `, 20, y);
        y += 7;
        doc.text(`Belgilar soni: ${description.charCount} `, 20, y);
        y += 7;
        doc.text(`Topilgan kalit so\'zlar soni: ${description.keywordCount}/${description.totalKeywords}`, 20, y);
        y += 7;
        doc.text(`Dissertatsiya mazmuni: ${description.limitedText}`, 20, y);
      }

      doc.save('dissertation_analysis.pdf');
    } catch (error) {
      setError(`PDF файлни яратишда хатолик: ${error.message}`);
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
                <Typography variant="h4" fontWeight={700} mb={1} sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}>
                  Диссертация текшируви
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, fontFamily: '"Inter", "Roboto", sans-serif' }}>
                  Илмий ишингизни автоматик текшириш тизими
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </HeaderCard>

        {error && (
          <ErrorBox>
            <ErrorIcon sx={{ color: colors.error, mr: 1, fontSize: 24 }} />
            <Typography color={colors.error} fontSize={15} fontWeight={500} sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}>
              {error}
            </Typography>
          </ErrorBox>
        )}

        {/* Upload Section */}
        <StyledCard sx={{ mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <UploadFileIcon sx={{ color: colors.primary, mr: 1, fontSize: 28 }} />
              <Typography fontWeight={600} fontSize={18} color={colors.text} sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}>
                Файл юклаш
              </Typography>
            </Box>
            <Input
              type="file"
              accept=".pdf,.doc,.docx"
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
                '&:focus-within': {
                  borderColor: colors.primary,
                },
              }}
            />
            <Typography fontSize={13} color={colors.textLight} mt={1} sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}>
              PDF, DOC ёки DOCX форматидаги файлларни қўллаб-қувватлайди
            </Typography>
          </CardContent>
        </StyledCard>

        {/* Text Editor Section */}
        {dissertationText && (
          <StyledCard sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" mb={2}>
                <TextFieldsIcon sx={{ color: colors.secondary, mr: 1, fontSize: 28 }} />
                <Typography fontWeight={600} fontSize={18} color={colors.text} sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}>
                  Матн таҳрирлаш
                </Typography>
              </Box>
              <TextField
                multiline
                rows={8}
                value={dissertationText}
                onChange={(e) => setDissertationText(e.target.value)}
                fullWidth
                variant="outlined"
                placeholder="Матн автоматик юкланди..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: colors.background,
                    '& fieldset': {
                      borderColor: colors.border,
                      borderWidth: '2px',
                    },
                    '&:hover fieldset': {
                      borderColor: colors.secondary,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: colors.secondary,
                    },
                  },
                  '& .MuiInputBase-input': {
                    fontFamily: '"Inter", "Roboto", sans-serif',
                    color: colors.text,
                  },
                }}
              />
            </CardContent>
          </StyledCard>
        )}

        {/* Action Buttons */}
        <Box display="flex" gap={2} mb={4}>
          <AnalyzeButton
            onClick={checkDissertation}
            disabled={isLoading}
            startIcon={isLoading ? null : <PlayArrowIcon />}
            fullWidth
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Текширишни бошлаш'}
          </AnalyzeButton>

          {showPDFButton && (
            <DownloadButton
              onClick={downloadPDF}
              disabled={isLoading}
              startIcon={<DownloadIcon />}
              sx={{ minWidth: '200px' }}
            >
              PDF юклаб олиш
            </DownloadButton>
          )}
        </Box>

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
                      sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}
                    >
                      {result.missingKeywords.length === 0 ? 'Табриклаймиз! ✓' : 'Эътибор беринг!'}
                    </Typography>
                  </Box>
                  <Typography fontSize={15} color={colors.text} sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}>
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
                      <Typography fontWeight={700} fontSize={18} color={colors.text} sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}>
                        Топилган калит сўзлар
                      </Typography>
                      <Box ml="auto">
                        <Chip
                          label={`${result.foundKeywords.length}/${requiredKeywords.length}`}
                          sx={{
                            backgroundColor: colors.accent,
                            color: '#FFFFFF',
                            fontWeight: 700,
                            fontFamily: '"Inter", "Roboto", sans-serif',
                          }}
                        />
                      </Box>
                    </Box>
                    <Grid container spacing={2}>
                      {result.foundKeywords.map((keyword) => (
                        <Grid item xs={12} key={keyword}>
                          <Box
                            sx={{
                              p: 2,
                              backgroundColor: '#FFFFFF',
                              borderRadius: '8px',
                              border: `1px solid ${colors.accentLight}`,
                              display: 'flex',
                              alignItems: 'flex-start',
                            }}
                          >
                            <CheckCircleIcon
                              sx={{ color: colors.accent, mr: 1.5, mt: 0.3, fontSize: 20 }}
                            />
                            <Box flex={1}>
                              <Typography fontSize={14} fontWeight={600} color={colors.text} sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}>
                                {keyword}
                              </Typography>
                              {keyword === 'XULOSA' && result.conclusionText && (
                                <Typography fontSize={13} color={colors.textLight} mt={1} sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}>
                                  <strong>Хулоса:</strong> {result.conclusionText}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
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
                  <Typography fontWeight={700} fontSize={18} color={colors.text} sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}>
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
                      <Typography fontSize={32} fontWeight={700} color={colors.primary} sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}>
                        {description.wordCount}
                      </Typography>
                      <Typography fontSize={13} color={colors.textLight} fontWeight={500} sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}>
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
                      <Typography fontSize={32} fontWeight={700} color={colors.secondary} sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}>
                        {description.charCount}
                      </Typography>
                      <Typography fontSize={13} color={colors.textLight} fontWeight={500} sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}>
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
                      <Typography fontSize={32} fontWeight={700} color={colors.accent} sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}>
                        {description.keywordCount}
                      </Typography>
                      <Typography fontSize={13} color={colors.textLight} fontWeight={500} sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}>
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
                      <Typography fontSize={32} fontWeight={700} color={colors.warning} sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}>
                        {Math.round((description.keywordCount / description.totalKeywords) * 100)}%
                      </Typography>
                      <Typography fontSize={13} color={colors.textLight} fontWeight={500} sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}>
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
                      <Typography fontSize={14} fontWeight={600} color={colors.text} mb={1} sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}>
                        Диссертация мазмуни
                      </Typography>
                      <Typography fontSize={13} color={colors.textLight} lineHeight={1.6} sx={{ fontFamily: '"Inter", "Roboto", sans-serif' }}>
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