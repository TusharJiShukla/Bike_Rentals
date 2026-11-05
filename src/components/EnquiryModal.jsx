import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Linking,
  Platform,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import {
  X,
  Send,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  Phone,
  User,
  MessageSquare,
  Check,
} from 'lucide-react-native';
import { BIKES_DATA } from '../data/bikes';
import { COLORS, RADIUS, SHADOWS } from '../theme/colors';
import { useLanguage } from '../i18n/LanguageContext';
import CalendarPickerModal from './CalendarPickerModal';
import PhoneInput from './PhoneInput';
import { validatePhone } from '../utils/validation';

function WhatsAppSvgIcon({ size = 20, color = '#FFFFFF' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.16C10.57 20.16 9.12 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.8 7.37 7.5 3.67 12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.05 20.16ZM16.57 14.39C16.32 14.27 15.1 13.67 14.88 13.58C14.65 13.5 14.49 13.46 14.32 13.7C14.16 13.95 13.69 14.51 13.54 14.67C13.4 14.84 13.25 14.86 13 14.74C12.75 14.61 11.95 14.35 11 13.5C10.26 12.84 9.76 12.03 9.61 11.78C9.47 11.54 9.6 11.4 9.72 11.28C9.83 11.17 9.97 10.99 10.09 10.85C10.22 10.71 10.26 10.61 10.34 10.45C10.42 10.28 10.38 10.14 10.32 10.02C10.26 9.9 9.77 8.7 9.57 8.21C9.37 7.73 9.17 7.79 9.02 7.78C8.88 7.78 8.71 7.77 8.55 7.77C8.38 7.77 8.12 7.83 7.89 8.08C7.67 8.32 7.03 8.92 7.03 10.14C7.03 11.36 7.92 12.54 8.04 12.7C8.16 12.87 9.79 15.37 12.28 16.44C12.87 16.7 13.33 16.85 13.69 16.97C14.29 17.16 14.83 17.13 15.26 17.07C15.74 17 16.74 16.47 16.95 15.89C17.15 15.3 17.15 14.8 17.09 14.7C17.03 14.6 16.82 14.51 16.57 14.39Z" />
    </Svg>
  );
}

export default function EnquiryModal({
  visible,
  onClose,
  selectedBike,
  onShowToast,
}) {
  const { t, isHindi } = useLanguage();

  const [bikeId, setBikeId] = useState(selectedBike?.id || BIKES_DATA[0].id);
  const [fullName, setFullName] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Calendar picker state
  const [calendarTarget, setCalendarTarget] = useState(null); // 'start' | 'end' | null

  useEffect(() => {
    if (selectedBike) {
      setBikeId(selectedBike.id);
    }
  }, [selectedBike]);

  useEffect(() => {
    if (!visible) {
      setFullName('');
      setPhone('');
      setPhoneError('');
      setStartDate('');
      setEndDate('');
      setMessage('');
      setSubmitted(false);
      setCalendarTarget(null);
    }
  }, [visible]);

  const currentBike = BIKES_DATA.find((b) => b.id === bikeId) || BIKES_DATA[0];

  const handleWhatsAppRedirect = () => {
    // Validate phone number with Country Code and 10 digits
    const phoneCheck = validatePhone(phone, countryCode);
    if (!phoneCheck.isValid) {
      setPhoneError(isHindi ? phoneCheck.errorHi : phoneCheck.error);
      if (onShowToast) onShowToast(isHindi ? phoneCheck.errorHi : phoneCheck.error);
      return;
    }
    setPhoneError('');

    const formattedPhone = `${countryCode} ${phone}`;
    const text = encodeURIComponent(
      `Hello The Road Eagle! I would like to enquire about renting the ${currentBike.name} (${currentBike.model}).\n` +
      `Dates: ${startDate || 'Flexible'} to ${endDate || 'Flexible'}\n` +
      `My Name: ${fullName || 'Rider'}\n` +
      `Phone: ${formattedPhone}\n` +
      (message ? `Note: ${message}` : '')
    );
    Linking.openURL(`https://wa.me/919876543210?text=${text}`).catch(() => {});
    if (onShowToast) onShowToast(isHindi ? `${currentBike.name} के लिए व्हाट्सएप खुल रहा है!` : `Opening WhatsApp concierge for ${currentBike.name}!`);
    onClose();
  };

  const handleSubmit = () => {
    // Validate phone number with Country Code and 10 digits
    const phoneCheck = validatePhone(phone, countryCode);
    if (!phoneCheck.isValid) {
      setPhoneError(isHindi ? phoneCheck.errorHi : phoneCheck.error);
      if (onShowToast) onShowToast(isHindi ? phoneCheck.errorHi : phoneCheck.error);
      return;
    }
    setPhoneError('');

    setSubmitted(true);
    if (onShowToast) {
      onShowToast(
        isHindi
          ? `${currentBike.name} के लिए पूछताछ प्राप्त हुई! हमारी टीम जल्द ही आपसे संपर्क करेगी।`
          : `Enquiry received for ${currentBike.name}! Our concierge will connect with you shortly.`
      );
    }
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2200);
  };

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.backdrop} />
          </TouchableWithoutFeedback>

          <View style={[styles.modalCard, SHADOWS.card]}>
            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onClose}
              activeOpacity={0.7}
              accessibilityLabel="Close"
            >
              <X size={18} color="#94A3B8" />
            </TouchableOpacity>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {/* Header with WhatsApp Luxury Pill */}
              <View style={styles.header}>
                <View style={styles.waIconCircle}>
                  <WhatsAppSvgIcon size={26} color="#FFFFFF" />
                </View>
                <Text style={styles.title}>
                  {t('enquiry.conciergeTitle', 'WhatsApp Concierge')}
                </Text>
                <Text style={styles.subtitle}>
                  {t('enquiry.conciergeSubtitle', 'Direct instant assistance & custom rental quotes with our team')}
                </Text>
                <View style={styles.supportBadge}>
                  <View style={styles.pulseDot} />
                  <Text style={styles.supportBadgeText}>
                    {t('enquiry.verifiedSupport', '+91 98765 43210 • 24/7 Verified Support')}
                  </Text>
                </View>
              </View>

              {submitted ? (
                <View style={styles.submittedWrap}>
                  <View style={styles.checkCircle}>
                    <CheckCircle2 size={40} color="#10B981" />
                  </View>
                  <Text style={styles.submittedTitle}>
                    {t('enquiry.submittedTitle', 'Enquiry Submitted!')}
                  </Text>
                  <Text style={styles.submittedSubtitle}>
                    {t('enquiry.submittedSub', 'We have received your enquiry for')} <Text style={{ fontWeight: '800', color: '#FFFFFF' }}>{currentBike.name}</Text>.
                  </Text>
                </View>
              ) : (
                <View style={styles.form}>
                  {/* Machine Selector Section */}
                  <View style={styles.sectionWrap}>
                    <View style={styles.sectionHeaderRow}>
                      <Text style={styles.sectionLabel}>
                        {t('enquiry.chooseMotorcycle', 'CHOOSE MOTORCYCLE')}
                      </Text>
                      <Text style={styles.sectionHint}>
                        {t('enquiry.selected', 'Selected')}: {currentBike.name}
                      </Text>
                    </View>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.bikeChipsContent}
                    >
                      {BIKES_DATA.map((b) => {
                        const active = b.id === bikeId;
                        return (
                          <TouchableOpacity
                            key={b.id}
                            style={[styles.bikeChip, active && styles.bikeChipActive]}
                            onPress={() => setBikeId(b.id)}
                            activeOpacity={0.8}
                          >
                            <View style={styles.chipTopRow}>
                              {active && <Check size={12} color="#10B981" style={{ marginRight: 4 }} />}
                              <Text style={[styles.bikeChipText, active && styles.bikeChipTextActive]}>
                                {b.name}
                              </Text>
                            </View>
                            <Text style={[styles.bikeChipPrice, active && styles.bikeChipPriceActive]}>
                              ₹{b.pricePerDay.toLocaleString()}/day
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  </View>

                  {/* Rider Inputs with Clean Placeholders Only */}
                  <View style={styles.inputsGrid}>
                    <View style={styles.inputGroup}>
                      <View style={styles.labelRow}>
                        <User size={13} color="#94A3B8" />
                        <Text style={styles.label}>
                          {t('enquiry.fullName', 'FULL NAME')}
                        </Text>
                      </View>
                      <TextInput
                        style={styles.input}
                        placeholder={t('enquiry.fullNamePlaceholder', 'Enter your full name')}
                        placeholderTextColor="#475569"
                        value={fullName}
                        onChangeText={setFullName}
                      />
                    </View>

                    {/* Unified PhoneInput with Country Code & 10-Digit Validation */}
                    <View style={styles.inputGroup}>
                      <View style={styles.labelRow}>
                        <Phone size={13} color="#94A3B8" />
                        <Text style={styles.label}>
                          {t('enquiry.phone', 'WHATSAPP PHONE NUMBER')}
                        </Text>
                      </View>
                      <PhoneInput
                        countryCode={countryCode}
                        onCountryCodeChange={(code) => {
                          setCountryCode(code);
                          setPhoneError('');
                        }}
                        value={phone}
                        onChangeText={(num) => {
                          setPhone(num);
                          if (phoneError) setPhoneError('');
                        }}
                        placeholder={t('enquiry.phonePlaceholder', '10-digit mobile number')}
                        error={phoneError}
                      />
                    </View>

                    {/* Dates Row - Interactive Calendar Picker */}
                    <View style={styles.datesRow}>
                      <View style={[styles.inputGroup, { flex: 1 }]}>
                        <View style={styles.labelRow}>
                          <Calendar size={13} color="#94A3B8" />
                          <Text style={styles.label}>
                            {t('enquiry.startDate', 'START DATE')}
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={styles.datePickerBtn}
                          onPress={() => setCalendarTarget('start')}
                          activeOpacity={0.8}
                        >
                          <Text
                            style={startDate ? styles.datePickerValueText : styles.datePickerPlaceholderText}
                            numberOfLines={1}
                          >
                            {startDate || 'YYYY-MM-DD'}
                          </Text>
                          <Calendar size={15} color="#38BDF8" />
                        </TouchableOpacity>
                      </View>

                      <View style={[styles.inputGroup, { flex: 1 }]}>
                        <View style={styles.labelRow}>
                          <Calendar size={13} color="#94A3B8" />
                          <Text style={styles.label}>
                            {t('enquiry.endDate', 'RETURN DATE')}
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={styles.datePickerBtn}
                          onPress={() => setCalendarTarget('end')}
                          activeOpacity={0.8}
                        >
                          <Text
                            style={endDate ? styles.datePickerValueText : styles.datePickerPlaceholderText}
                            numberOfLines={1}
                          >
                            {endDate || 'YYYY-MM-DD'}
                          </Text>
                          <Calendar size={15} color="#38BDF8" />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Message Field */}
                    <View style={styles.inputGroup}>
                      <View style={styles.labelRow}>
                        <MessageSquare size={13} color="#94A3B8" />
                        <Text style={styles.label}>
                          {t('enquiry.specialReq', 'SPECIAL REQUIREMENTS (OPTIONAL)')}
                        </Text>
                      </View>
                      <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder={t('enquiry.specialReqPlaceholder', 'Need extra helmet, doorstep delivery, or custom touring advice...')}
                        placeholderTextColor="#475569"
                        multiline
                        numberOfLines={3}
                        value={message}
                        onChangeText={setMessage}
                      />
                    </View>
                  </View>

                  {/* Actions Container - Properly Sized Buttons */}
                  <View style={styles.actionContainer}>
                    {/* WhatsApp Primary CTA Button - Refined Luxury Green */}
                    <TouchableOpacity
                      style={styles.whatsAppBtn}
                      onPress={handleWhatsAppRedirect}
                      activeOpacity={0.85}
                    >
                      <WhatsAppSvgIcon size={19} color="#FFFFFF" />
                      <Text style={styles.whatsAppBtnText}>
                        {t('enquiry.sendWhatsApp', 'Send Enquiry on WhatsApp')}
                      </Text>
                    </TouchableOpacity>

                    {/* Secondary Direct Submit Button - Elegant Understated Outline */}
                    <TouchableOpacity
                      style={styles.submitBtn}
                      onPress={handleSubmit}
                      activeOpacity={0.8}
                    >
                      <Send size={14} color="#38BDF8" />
                      <Text style={styles.submitBtnText}>
                        {t('enquiry.requestCallback', 'Request Callback Instead')}
                      </Text>
                    </TouchableOpacity>

                    {/* Trust Badge */}
                    <View style={styles.trustFooter}>
                      <ShieldCheck size={13} color="#10B981" />
                      <Text style={styles.trustText}>
                        {t('enquiry.trustFooter', 'Instant response • Zero spam • Verified Road Eagle fleet')}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Calendar Picker Modal */}
      <CalendarPickerModal
        visible={calendarTarget !== null}
        onClose={() => setCalendarTarget(null)}
        initialDate={calendarTarget === 'start' ? startDate : endDate}
        minDate={calendarTarget === 'end' && startDate ? startDate : undefined}
        title={
          calendarTarget === 'start'
            ? t('calendar.selectPickupDate', 'Select Pickup Date')
            : t('calendar.selectReturnDate', 'Select Return Date')
        }
        onSelectDate={(dateStr) => {
          if (calendarTarget === 'start') {
            setStartDate(dateStr);
            if (endDate && endDate < dateStr) setEndDate('');
          } else {
            setEndDate(dateStr);
          }
          setCalendarTarget(null);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 11, 20, 0.82)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalCard: {
    backgroundColor: '#0C1322',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 22,
    width: '94%',
    maxWidth: 500,
    maxHeight: '90%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.65,
    shadowRadius: 30,
    elevation: 12,
  },
  scrollContent: {
    paddingBottom: 4,
  },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 18,
    paddingTop: 2,
  },
  waIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'rgba(167, 243, 208, 0.45)',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    maxWidth: 380,
    lineHeight: 17,
    marginBottom: 8,
  },
  supportBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  supportBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#34D399',
    letterSpacing: 0.2,
  },
  form: {
    gap: 14,
  },
  sectionWrap: {
    marginBottom: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: 0.8,
  },
  sectionHint: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#94A3B8',
  },
  bikeChipsContent: {
    gap: 8,
    paddingVertical: 2,
  },
  bikeChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.09)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    alignItems: 'flex-start',
  },
  bikeChipActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.14)',
    borderColor: '#10B981',
  },
  chipTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bikeChipText: {
    fontSize: 12,
    color: '#CBD5E1',
    fontWeight: '700',
  },
  bikeChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  bikeChipPrice: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  bikeChipPriceActive: {
    color: '#34D399',
    fontWeight: '700',
  },
  inputsGrid: {
    gap: 12,
  },
  inputGroup: {
    gap: 5,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.6,
  },
  input: {
    backgroundColor: '#111A2E',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.09)',
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    height: 42,
    color: '#FFFFFF',
    fontSize: 13,
  },
  datePickerBtn: {
    backgroundColor: '#111A2E',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.09)',
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  datePickerValueText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  datePickerPlaceholderText: {
    color: '#475569',
    fontSize: 13,
  },
  textArea: {
    height: 68,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  datesRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionContainer: {
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  whatsAppBtn: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: RADIUS.full,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: '100%',
    maxWidth: 360,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  whatsAppBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  submitBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    borderRadius: RADIUS.full,
    paddingVertical: 10,
    paddingHorizontal: 16,
    width: '100%',
    maxWidth: 360,
  },
  submitBtnText: {
    color: '#38BDF8',
    fontSize: 12.5,
    fontWeight: '700',
  },
  trustFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  trustText: {
    fontSize: 10.5,
    color: '#64748B',
  },
  submittedWrap: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 10,
  },
  checkCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
    marginBottom: 4,
  },
  submittedTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  submittedSubtitle: {
    fontSize: 12.5,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 16,
  },
});
