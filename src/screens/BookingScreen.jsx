import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import {
  Calendar,
  Clock,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  Smartphone,
  ChevronDown,
  Check,
  X,
  FileText,
  AlertTriangle,
} from 'lucide-react-native';
import { BIKES_DATA } from '../data/bikes';
import { COUNTRY_CODES } from '../data/countries';
import { useEffect } from 'react';
import { COLORS, RADIUS, SHADOWS } from '../theme/colors';

const PICKUP_TIMES = [
  '09:00 AM (Hub Opens)',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '02:00 PM',
  '04:00 PM',
];

const RETURN_TIMES = [
  '06:00 PM',
  '07:00 PM',
  '08:00 PM (Hub Closes)',
  '09:00 PM',
  '10:00 PM',
];

export default function BookingScreen({
  route,
  navigation,
  onOpenQuote,
  onShowToast,
  onOpenWhatsApp,
  user,
  onOpenAuth,
}) {
  const selectedBike = route?.params?.bike || BIKES_DATA[0];
  const [step, setStep] = useState(1);

  const { width } = useWindowDimensions();
  const isWide = width >= 900;

  // Form input dates initialized EMPTY - user must pick or enter, or placeholders are visible
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [returnTime, setReturnTime] = useState('');

  // Dropdown modal state for times
  const [activePicker, setActivePicker] = useState(null); // 'pickup' | 'return' | null

  // Rider details - strictly empty by default so inputs hold placeholders only!
  const [riderName, setRiderName] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [riderPhone, setRiderPhone] = useState('');
  const [riderEmail, setRiderEmail] = useState('');
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      setRiderName('');
      setRiderPhone('');
      setRiderEmail('');
      setPickupDate('');
      setPickupTime('');
      setReturnDate('');
      setReturnTime('');
    }
  }, [user]);

  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate rental duration in days
  const rentalDays = useMemo(() => {
    try {
      if (!pickupDate || !returnDate) return 3; // default estimate
      const parse = (str) => {
        if (!str) return null;
        if (str.includes('/')) {
          const parts = str.split('/');
          if (parts.length === 3) {
            return new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
          }
        }
        return new Date(str);
      };
      const d1 = parse(pickupDate);
      const d2 = parse(returnDate);
      if (!d1 || !d2 || isNaN(d1.getTime()) || isNaN(d2.getTime())) return 3;
      const diffMs = Math.abs(d2.getTime() - d1.getTime());
      const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      return days > 0 ? days + 1 : 3;
    } catch {
      return 3;
    }
  }, [pickupDate, returnDate]);

  const rentalTotal = rentalDays * selectedBike.pricePerDay;
  const securityDeposit = selectedBike.deposit || 3000;
  const totalPayable = rentalTotal + securityDeposit;
  const [bookingRefId] = useState(() => 'RDE-' + Math.floor(100000 + Math.random() * 900000));

  const handleContinueToSummary = () => {
    if (!user) {
      if (onOpenAuth) onOpenAuth();
      if (onShowToast) onShowToast('Please log in or sign up first to proceed with booking.');
      return;
    }
    if (!pickupDate || !returnDate) {
      if (onShowToast) onShowToast('Please enter both pickup and return dates.');
      return;
    }
    setStep(2);
  };

  const handleProceedPayment = () => {
    if (!user) {
      if (onOpenAuth) onOpenAuth();
      if (onShowToast) onShowToast('Please log in or sign up first to proceed with booking.');
      return;
    }

    if (!riderName.trim()) {
      if (onShowToast) onShowToast('Please enter rider full name.');
      return;
    }

    const cleanPhone = riderPhone.replace(/\D/g, '');
    if (countryCode === '+91' && cleanPhone.length !== 10) {
      if (onShowToast) onShowToast('Please enter a valid 10-digit mobile number.');
      return;
    } else if (cleanPhone.length < 7) {
      if (onShowToast) onShowToast('Please enter a valid mobile number.');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!riderEmail.trim() || !emailRegex.test(riderEmail.trim())) {
      if (onShowToast) onShowToast('Please enter a valid email address.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(3);
      if (onShowToast) {
        onShowToast(`Booking confirmed! Your reservation ref is #${bookingRefId}`);
      }
    }, 1200);
  };

  const handleDownloadQuote = () => {
    if (onOpenQuote) {
      onOpenQuote({
        refId: bookingRefId,
        pickupDate: pickupDate || 'TBD',
        pickupTime: pickupTime || '10:00 AM',
        returnDate: returnDate || 'TBD',
        returnTime: returnTime || '08:00 PM',
        days: rentalDays,
        rentalCharge: rentalTotal,
        deposit: securityDeposit,
        total: totalPayable,
      });
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.pageInner}>
        {/* ================= STEPPER HEADER ================= */}
        <View style={styles.stepperContainer}>
          <TouchableOpacity
            style={styles.stepItem}
            onPress={() => step > 1 && setStep(1)}
            activeOpacity={step > 1 ? 0.7 : 1}
          >
            <View style={[styles.stepCircle, step >= 1 ? styles.stepCircleActive : styles.stepCircleInactive]}>
              {step > 1 ? (
                <Check size={14} color="#050B14" strokeWidth={3} />
              ) : (
                <Text style={styles.stepCircleNumActive}>1</Text>
              )}
            </View>
            <Text style={[styles.stepText, step === 1 ? styles.stepTextActive : styles.stepTextInactive]}>
              DATE SELECTION
            </Text>
          </TouchableOpacity>

          <View style={[styles.stepDividerLine, step >= 2 && styles.stepDividerLineActive]} />

          <View style={styles.stepItem}>
            <View style={[styles.stepCircle, step >= 2 ? styles.stepCircleActive : styles.stepCircleInactive]}>
              <Text style={step >= 2 ? styles.stepCircleNumActive : styles.stepCircleNumInactive}>2</Text>
            </View>
            <Text style={[styles.stepText, step >= 2 ? styles.stepTextActive : styles.stepTextInactive]}>
              SUMMARY & PAYMENT
            </Text>
          </View>
        </View>

        {/* Guest Warning Banner if not logged in */}
        {!user && (
          <View style={styles.guestAlertBanner}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
              <ShieldCheck size={20} color="#38BDF8" />
              <View style={{ flex: 1 }}>
                <Text style={styles.guestAlertTitle}>Login Required to Reserve</Text>
                <Text style={styles.guestAlertSub}>Please sign in or register to complete your motorbike booking.</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.guestLoginBtn} onPress={onOpenAuth} activeOpacity={0.8}>
              <Text style={styles.guestLoginBtnText}>Log In / Sign Up</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ================= STEP 1 & 2: MAIN TWO-COLUMN CONTENT ================= */}
        {step < 3 && (
          <View style={[styles.mainLayout, isWide ? styles.mainLayoutRow : styles.mainLayoutCol]}>
            {/* LEFT COLUMN: FORM CARD */}
            <View style={[styles.leftColumn, isWide && { flex: 1.25 }]}>
              {step === 1 ? (
                /* STEP 1: DATE & TIME SELECTION */
                <View style={[styles.card, SHADOWS.card]}>
                  <Text style={styles.cardHeading}>When are you riding?</Text>
                  <Text style={styles.cardSubheading}>
                    Select your pickup and return dates to see vehicle availability and exact pricing.
                  </Text>

                  {/* 2x2 Form Inputs Grid */}
                  <View style={styles.formGrid}>
                    {/* Row 1: Pickup Date & Time */}
                    <View style={styles.formRow}>
                      <View style={styles.formFieldCol}>
                        <View style={styles.fieldLabelRow}>
                          <Calendar size={13} color="#94A3B8" />
                          <Text style={styles.fieldLabelText}>PICKUP DATE</Text>
                        </View>
                        <View style={styles.inputBoxWithIcon}>
                          <TextInput
                            style={styles.textInputInside}
                            value={pickupDate}
                            onChangeText={setPickupDate}
                            placeholder="MM/DD/YYYY"
                            placeholderTextColor="#475569"
                          />
                          <Calendar size={16} color="#64748B" />
                        </View>
                      </View>

                      <View style={styles.formFieldCol}>
                        <View style={styles.fieldLabelRow}>
                          <Clock size={13} color="#94A3B8" />
                          <Text style={styles.fieldLabelText}>PICKUP TIME</Text>
                        </View>
                        <TouchableOpacity
                          style={styles.dropdownBox}
                          onPress={() => setActivePicker('pickup')}
                          activeOpacity={0.8}
                        >
                          <Text style={pickupTime ? styles.dropdownValueText : styles.dropdownPlaceholderText} numberOfLines={1}>
                            {pickupTime || 'Select Pickup Time'}
                          </Text>
                          <ChevronDown size={16} color="#64748B" />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Row 2: Return Date & Time */}
                    <View style={styles.formRow}>
                      <View style={styles.formFieldCol}>
                        <View style={styles.fieldLabelRow}>
                          <Calendar size={13} color="#94A3B8" />
                          <Text style={styles.fieldLabelText}>RETURN DATE</Text>
                        </View>
                        <View style={styles.inputBoxWithIcon}>
                          <TextInput
                            style={styles.textInputInside}
                            value={returnDate}
                            onChangeText={setReturnDate}
                            placeholder="MM/DD/YYYY"
                            placeholderTextColor="#475569"
                          />
                          <Calendar size={16} color="#64748B" />
                        </View>
                      </View>

                      <View style={styles.formFieldCol}>
                        <View style={styles.fieldLabelRow}>
                          <Clock size={13} color="#94A3B8" />
                          <Text style={styles.fieldLabelText}>RETURN TIME</Text>
                        </View>
                        <TouchableOpacity
                          style={styles.dropdownBox}
                          onPress={() => setActivePicker('return')}
                          activeOpacity={0.8}
                        >
                          <Text style={returnTime ? styles.dropdownValueText : styles.dropdownPlaceholderText} numberOfLines={1}>
                            {returnTime || 'Select Return Time'}
                          </Text>
                          <ChevronDown size={16} color="#64748B" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                  {/* Pick & Return Time Dropdown Picker List */}
                  {activePicker && (
                    <View style={styles.timeDropdownCard}>
                      <View style={styles.timeDropdownHeader}>
                        <Text style={styles.timeDropdownTitle}>
                          {activePicker === 'pickup' ? 'Select Pickup Time' : 'Select Return Time'}
                        </Text>
                        <TouchableOpacity onPress={() => setActivePicker(null)}>
                          <X size={16} color="#94A3B8" />
                        </TouchableOpacity>
                      </View>
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                        {(activePicker === 'pickup' ? PICKUP_TIMES : RETURN_TIMES).map((t) => (
                          <TouchableOpacity
                            key={t}
                            style={[
                              styles.timeChip,
                              (activePicker === 'pickup' ? pickupTime === t : returnTime === t) && styles.timeChipActive,
                            ]}
                            onPress={() => {
                              if (activePicker === 'pickup') setPickupTime(t);
                              else setReturnTime(t);
                              setActivePicker(null);
                            }}
                          >
                            <Text
                              style={[
                                styles.timeChipText,
                                (activePicker === 'pickup' ? pickupTime === t : returnTime === t) && styles.timeChipTextActive,
                              ]}
                            >
                              {t}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  )}

                  {/* Pickup Hub Info Pill */}
                  <View style={styles.hubInfoPill}>
                    <ShieldCheck size={16} color="#38BDF8" />
                    <Text style={styles.hubInfoText}>
                      Pickup Hub: Central Metro Station Hub (08:00 AM – 09:30 PM)
                    </Text>
                  </View>

                  {/* Continue Button */}
                  <TouchableOpacity
                    style={styles.continueBtn}
                    onPress={handleContinueToSummary}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.continueBtnText}>Continue to Summary & Payment</Text>
                    <ArrowRight size={17} color="#FFFFFF" strokeWidth={2.5} />
                  </TouchableOpacity>
                </View>
              ) : (
                /* STEP 2: RIDER DETAILS & PAYMENT METHOD */
                <View style={[styles.card, SHADOWS.card]}>
                  <Text style={styles.cardHeading}>Rider Information</Text>
                  <Text style={styles.cardSubheading}>
                    Provide active rider contact details for vehicle handover and booking confirmation.
                  </Text>

                  {/* Rider Details - All fields hold placeholders only! */}
                  <View style={{ marginBottom: 14 }}>
                    <Text style={styles.step2Label}>FULL NAME</Text>
                    <TextInput
                      style={styles.step2Input}
                      value={riderName}
                      onChangeText={setRiderName}
                      placeholder="e.g. Rahul Verma"
                      placeholderTextColor="#475569"
                    />
                  </View>

                  <View style={styles.step2Row}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.step2Label}>PHONE NUMBER</Text>
                      <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                        <TouchableOpacity
                          style={styles.countryBtn}
                          onPress={() => setIsCountryModalOpen(true)}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.countryBtnText}>{countryCode}</Text>
                          <ChevronDown size={14} color="#94A3B8" />
                        </TouchableOpacity>
                        <TextInput
                          style={[styles.step2Input, { flex: 1 }]}
                          value={riderPhone}
                          onChangeText={(t) => setRiderPhone(t.replace(/\D/g, ''))}
                          placeholder={countryCode === '+91' ? '10-digit number' : 'Mobile number'}
                          placeholderTextColor="#475569"
                          keyboardType="phone-pad"
                          maxLength={15}
                        />
                      </View>
                    </View>

                    <View style={{ flex: 1.2 }}>
                      <Text style={styles.step2Label}>EMAIL ADDRESS</Text>
                      <TextInput
                        style={styles.step2Input}
                        value={riderEmail}
                        onChangeText={setRiderEmail}
                        placeholder="e.g. rahul@example.com"
                        placeholderTextColor="#475569"
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />
                    </View>
                  </View>

                  {/* Payment Methods */}
                  <View style={{ marginTop: 20 }}>
                    <Text style={styles.step2Label}>PAYMENT METHOD</Text>
                    <View style={styles.paymentMethodsRow}>
                      <TouchableOpacity
                        style={[
                          styles.paymentMethodCard,
                          paymentMethod === 'upi' && styles.paymentMethodCardActive,
                        ]}
                        onPress={() => setPaymentMethod('upi')}
                        activeOpacity={0.8}
                      >
                        <Smartphone size={18} color={paymentMethod === 'upi' ? '#38BDF8' : '#94A3B8'} />
                        <Text style={[styles.paymentMethodText, paymentMethod === 'upi' && styles.paymentMethodTextActive]}>
                          UPI / QR
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.paymentMethodCard,
                          paymentMethod === 'card' && styles.paymentMethodCardActive,
                        ]}
                        onPress={() => setPaymentMethod('card')}
                        activeOpacity={0.8}
                      >
                        <CreditCard size={18} color={paymentMethod === 'card' ? '#38BDF8' : '#94A3B8'} />
                        <Text style={[styles.paymentMethodText, paymentMethod === 'card' && styles.paymentMethodTextActive]}>
                          Credit / Debit
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.paymentMethodCard,
                          paymentMethod === 'pickup' && styles.paymentMethodCardActive,
                        ]}
                        onPress={() => setPaymentMethod('pickup')}
                        activeOpacity={0.8}
                      >
                        <ShieldCheck size={18} color={paymentMethod === 'pickup' ? '#38BDF8' : '#94A3B8'} />
                        <Text style={[styles.paymentMethodText, paymentMethod === 'pickup' && styles.paymentMethodTextActive]}>
                          Pay at Pickup
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Step 2 Action Buttons */}
                  <View style={styles.step2Actions}>
                    <TouchableOpacity
                      style={styles.backBtn}
                      onPress={() => setStep(1)}
                      activeOpacity={0.8}
                    >
                      <ArrowLeft size={16} color="#94A3B8" />
                      <Text style={styles.backBtnText}>Back</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.confirmBtn}
                      onPress={handleProceedPayment}
                      disabled={isProcessing}
                      activeOpacity={0.85}
                    >
                      {isProcessing ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <>
                          <Text style={styles.confirmBtnText}>
                            Confirm & Reserve (₹{totalPayable.toLocaleString('en-IN')})
                          </Text>
                          <ArrowRight size={17} color="#FFFFFF" strokeWidth={2.5} />
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            {/* RIGHT COLUMN: VEHICLE SUMMARY CARD */}
            <View style={[styles.rightColumn, isWide && { flex: 1, maxWidth: 440 }]}>
              <View style={[styles.card, styles.vehicleCard, SHADOWS.card]}>
                {/* Bike Image Container */}
                <View style={styles.bikeImageWrap}>
                  <Image
                    source={selectedBike.imageSource}
                    style={styles.bikeImage}
                    resizeMode="cover"
                  />
                </View>

                {/* Bike Name & Specs */}
                <Text style={styles.bikeName}>{selectedBike.name}</Text>
                <Text style={styles.bikeModel}>
                  {selectedBike.model} • {selectedBike.specs?.displacement || '350 CC'}
                </Text>

                {/* Price Breakdown Line Items */}
                <View style={styles.priceBreakdownWrap}>
                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Rental Fee</Text>
                    <Text style={styles.priceValue}>
                      ₹{selectedBike.pricePerDay.toLocaleString('en-IN')} / day
                    </Text>
                  </View>

                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Security Deposit</Text>
                    <Text style={[styles.priceValue, styles.priceValueCyan]}>
                      ₹{securityDeposit.toLocaleString('en-IN')}*
                    </Text>
                  </View>

                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>Rental Duration</Text>
                    <Text style={styles.priceValue}>{rentalDays} Days</Text>
                  </View>

                  <View style={[styles.priceRow, styles.totalRow]}>
                    <Text style={styles.totalLabel}>Total Payable</Text>
                    <Text style={styles.totalValue}>₹{totalPayable.toLocaleString('en-IN')}</Text>
                  </View>
                </View>

                {/* Refund Assurance Note */}
                <View style={styles.refundNoteBox}>
                  <ShieldCheck size={16} color="#34D399" />
                  <Text style={styles.refundNoteText}>
                    100% Refundable Security Deposit credited back within 24-48h of return.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* ================= STEP 3: CONFIRMATION SUCCESS SCREEN ================= */}
        {step === 3 && (
          <View style={[styles.card, styles.successCard, SHADOWS.card]}>
            <View style={styles.successIconCircle}>
              <Check size={36} color="#FFFFFF" strokeWidth={3} />
            </View>

            <Text style={styles.successHeading}>Booking Confirmed!</Text>
            <Text style={styles.successSubheading}>
              Your machine is reserved. A confirmation SMS and WhatsApp message have been sent with pickup hub directions.
            </Text>

            <View style={styles.refCodeBox}>
              <Text style={styles.refCodeLabel}>RESERVATION REFERENCE ID</Text>
              <Text style={styles.refCodeValue}>#{bookingRefId}</Text>
            </View>

            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryItemLabel}>RESERVED BIKE</Text>
                <Text style={styles.summaryItemValue}>{selectedBike.name}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryItemLabel}>PICKUP DATE</Text>
                <Text style={styles.summaryItemValue}>{pickupDate || 'Scheduled'}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryItemLabel}>RIDER NAME</Text>
                <Text style={styles.summaryItemValue}>{riderName || 'Rider'}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryItemLabel}>AMOUNT PAYABLE</Text>
                <Text style={[styles.summaryItemValue, { color: '#38BDF8' }]}>₹{totalPayable.toLocaleString('en-IN')}</Text>
              </View>
            </View>

            <View style={styles.successActions}>
              <TouchableOpacity
                style={styles.downloadQuoteBtn}
                onPress={handleDownloadQuote}
                activeOpacity={0.8}
              >
                <FileText size={16} color="#38BDF8" />
                <Text style={styles.downloadQuoteBtnText}>Download Official Estimate / Quote</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.returnHomeBtn}
                onPress={() => navigation?.navigate('Home')}
                activeOpacity={0.8}
              >
                <Text style={styles.returnHomeBtnText}>Back to Home Fleet</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Country Code Modal */}
      <Modal
        visible={isCountryModalOpen}
        animationType="fade"
        transparent
        onRequestClose={() => setIsCountryModalOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setIsCountryModalOpen(false)}
        >
          <View style={styles.countryModalCard}>
            <View style={styles.countryModalHeader}>
              <Text style={styles.countryModalTitle}>Select Country Code</Text>
              <TouchableOpacity onPress={() => setIsCountryModalOpen(false)}>
                <X size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={COUNTRY_CODES}
              keyExtractor={(item) => item.code + item.country}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.countryItem}
                  onPress={() => {
                    setCountryCode(item.code);
                    setIsCountryModalOpen(false);
                  }}
                >
                  <Text style={styles.countryFlag}>{item.flag}</Text>
                  <Text style={styles.countryName}>{item.country}</Text>
                  <Text style={styles.countryDialCode}>{item.code}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  contentContainer: {
    paddingBottom: 60,
  },
  pageInner: {
    width: '100%',
    maxWidth: 1200,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    backgroundColor: '#0284C7',
  },
  stepCircleInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  stepCircleNumActive: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  stepCircleNumInactive: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
  },
  stepText: {
    fontSize: 12,
    letterSpacing: 0.8,
  },
  stepTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  stepTextInactive: {
    color: '#64748B',
    fontWeight: '600',
  },
  stepDividerLine: {
    width: 60,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 16,
  },
  stepDividerLineActive: {
    backgroundColor: '#0284C7',
  },
  guestAlertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(2, 132, 199, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.35)',
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 20,
    gap: 14,
    flexWrap: 'wrap',
  },
  guestAlertTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  guestAlertSub: {
    color: '#94A3B8',
    fontSize: 12.5,
  },
  guestLoginBtn: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
  },
  guestLoginBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12.5,
  },
  mainLayout: {
    width: '100%',
    gap: 24,
  },
  mainLayoutRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  mainLayoutCol: {
    flexDirection: 'column',
  },
  leftColumn: {
    width: '100%',
  },
  rightColumn: {
    width: '100%',
  },
  card: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderCard,
    borderRadius: RADIUS.xl,
    padding: 24,
  },
  cardHeading: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  cardSubheading: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 19,
    marginBottom: 20,
  },
  formGrid: {
    gap: 14,
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
    gap: 14,
    flexWrap: 'wrap',
  },
  formFieldCol: {
    flex: 1,
    minWidth: 220,
    gap: 6,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  fieldLabelText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSecondary,
    letterSpacing: 0.8,
  },
  inputBoxWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCardAlt,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    height: 46,
  },
  textInputInside: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 13.5,
    height: '100%',
  },
  dropdownBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.bgCardAlt,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    height: 46,
  },
  dropdownValueText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    flex: 1,
  },
  dropdownPlaceholderText: {
    color: '#475569',
    fontSize: 13,
    flex: 1,
  },
  timeDropdownCard: {
    backgroundColor: '#1E293B',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.35)',
    padding: 12,
    marginBottom: 16,
  },
  timeDropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  timeDropdownTitle: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '800',
  },
  timeChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: RADIUS.full,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  timeChipActive: {
    backgroundColor: '#0284C7',
    borderColor: '#38BDF8',
  },
  timeChipText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  timeChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  hubInfoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(2, 132, 199, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
    borderRadius: RADIUS.md,
    padding: 12,
    marginBottom: 22,
  },
  hubInfoText: {
    color: '#E2E8F0',
    fontSize: 12.5,
  },
  continueBtn: {
    backgroundColor: '#0284C7',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.5)',
    borderRadius: RADIUS.full,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  continueBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  step2Label: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSecondary,
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  step2Input: {
    backgroundColor: COLORS.bgCardAlt,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    height: 46,
    color: COLORS.textPrimary,
    fontSize: 13.5,
  },
  step2Row: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  countryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.bgCardAlt,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: RADIUS.md,
    paddingHorizontal: 10,
    height: 46,
  },
  countryBtnText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  paymentMethodsRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  paymentMethodCard: {
    flex: 1,
    minWidth: 110,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.bgCardAlt,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: RADIUS.md,
    paddingVertical: 12,
  },
  paymentMethodCardActive: {
    borderColor: '#38BDF8',
    backgroundColor: 'rgba(2, 132, 199, 0.15)',
  },
  paymentMethodText: {
    color: '#94A3B8',
    fontSize: 12.5,
    fontWeight: '600',
  },
  paymentMethodTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  step2Actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 24,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: RADIUS.full,
  },
  backBtnText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '700',
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: '#0284C7',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.4)',
    borderRadius: RADIUS.full,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
  },
  vehicleCard: {
    padding: 20,
  },
  bikeImageWrap: {
    height: 180,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: 14,
    backgroundColor: COLORS.bgCardAlt,
  },
  bikeImage: {
    width: '100%',
    height: '100%',
  },
  bikeName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  bikeModel: {
    fontSize: 12.5,
    color: COLORS.textSecondary,
    marginBottom: 14,
  },
  priceBreakdownWrap: {
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: 14,
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  priceValue: {
    fontSize: 13.5,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  priceValueCyan: {
    color: '#38BDF8',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 10,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#38BDF8',
  },
  refundNoteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    borderRadius: RADIUS.md,
    padding: 10,
  },
  refundNoteText: {
    color: '#A7F3D0',
    fontSize: 11.5,
    flex: 1,
  },
  successCard: {
    maxWidth: 620,
    alignSelf: 'center',
    alignItems: 'center',
    paddingVertical: 36,
  },
  successIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 6,
  },
  successHeading: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  successSubheading: {
    fontSize: 13.5,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
    maxWidth: 500,
  },
  refCodeBox: {
    backgroundColor: 'rgba(2, 132, 199, 0.15)',
    borderWidth: 1,
    borderColor: '#0284C7',
    borderRadius: RADIUS.lg,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  refCodeLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: 1,
    marginBottom: 3,
  },
  refCodeValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  summaryGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    backgroundColor: COLORS.bgCardAlt,
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 24,
  },
  summaryItem: {
    width: '47%',
    padding: 8,
  },
  summaryItemLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 3,
  },
  summaryItemValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  successActions: {
    width: '100%',
    gap: 12,
  },
  downloadQuoteBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.4)',
    borderRadius: RADIUS.full,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  downloadQuoteBtnText: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '700',
  },
  returnHomeBtn: {
    backgroundColor: '#0284C7',
    borderRadius: RADIUS.full,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  returnHomeBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(5, 11, 20, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  countryModalCard: {
    width: '100%',
    maxWidth: 400,
    maxHeight: 460,
    backgroundColor: '#0F172A',
    borderRadius: RADIUS.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  countryModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  countryModalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    gap: 10,
  },
  countryFlag: {
    fontSize: 18,
  },
  countryName: {
    flex: 1,
    color: '#E2E8F0',
    fontSize: 13,
  },
  countryDialCode: {
    color: '#38BDF8',
    fontWeight: '700',
    fontSize: 13,
  },
});
