import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  ScrollView,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { X, ShieldCheck, Mail, Calendar, AlertTriangle, ArrowRight, ChevronDown } from 'lucide-react-native';
import { COLORS, RADIUS, SHADOWS } from '../theme/colors';

function GoogleIcon({ size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
      />
      <Path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <Path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
      />
      <Path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </Svg>
  );
}

// Generate Day, Month, Year arrays
const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
const MONTHS = [
  { value: '01', label: 'Jan (01)' },
  { value: '02', label: 'Feb (02)' },
  { value: '03', label: 'Mar (03)' },
  { value: '04', label: 'Apr (04)' },
  { value: '05', label: 'May (05)' },
  { value: '06', label: 'Jun (06)' },
  { value: '07', label: 'Jul (07)' },
  { value: '08', label: 'Aug (08)' },
  { value: '09', label: 'Sep (09)' },
  { value: '10', label: 'Oct (10)' },
  { value: '11', label: 'Nov (11)' },
  { value: '12', label: 'Dec (12)' },
];

const currentYear = new Date().getFullYear();
// Rider years from currentYear - 100 up to currentYear - 14
const YEARS = Array.from({ length: 75 }, (_, i) => String(currentYear - 16 - i));

export default function AuthModal({
  visible,
  onClose,
  onLogin,
  user,
}) {
  const [activeTab, setActiveTab] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  // Structured Date of Birth Selection
  const [dobDay, setDobDay] = useState('');
  const [dobMonth, setDobMonth] = useState('');
  const [dobYear, setDobYear] = useState('');
  const [activeDobPicker, setActiveDobPicker] = useState(null); // 'day' | 'month' | 'year' | null

  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  // Reset all fields
  const resetAllFields = () => {
    setEmail('');
    setName('');
    setDobDay('');
    setDobMonth('');
    setDobYear('');
    setActiveDobPicker(null);
    setOtp('');
    setOtpSent(false);
    setErrorMsg('');
    setInfoMsg('');
    setActiveTab('signin');
  };

  const resetOtpOnly = () => {
    setOtp('');
    setOtpSent(false);
    setErrorMsg('');
    setInfoMsg('');
  };

  useEffect(() => {
    if (!user) {
      resetAllFields();
    }
  }, [user]);

  useEffect(() => {
    resetOtpOnly();
    if (!visible && !user) {
      resetAllFields();
    }
  }, [visible, user]);

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    resetOtpOnly();
  };

  // Exact age calculation logic from Day, Month, Year
  const calculateAge = (d, m, y) => {
    if (!d || !m || !y) return 0;
    const today = new Date();
    const birthDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const validateEmail = (emailStr) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(emailStr || '').trim().toLowerCase());
  };

  const handleSendCode = () => {
    setErrorMsg('');
    setOtp('');

    if (!email || !validateEmail(email)) {
      setErrorMsg('Please enter a valid email address (e.g. name@example.com)');
      return;
    }

    if (activeTab === 'signup') {
      if (!name.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }

      if (!dobDay || !dobMonth || !dobYear) {
        setErrorMsg('Please select Day, Month and Year of your Date of Birth.');
        return;
      }

      const riderAge = calculateAge(dobDay, dobMonth, dobYear);

      if (riderAge < 18) {
        setErrorMsg(`Underage (${riderAge} yrs): Registration is strictly restricted to riders aged 18+ with a valid license.`);
        return;
      }
    }

    setOtpSent(true);
    setInfoMsg(`Verification code sent to ${email}! (Demo Code: 1234)`);
  };

  const handleVerifyAndSubmit = () => {
    setErrorMsg('');
    const submittedOtp = (otp || '').trim();
    // Prompt removal after single submission!
    setOtp('');

    if (!submittedOtp || submittedOtp.length < 4) {
      setErrorMsg('Please enter the 4-digit verification code.');
      return;
    }

    if (submittedOtp !== '1234') {
      setErrorMsg('Invalid OTP code! Please enter 1234.');
      return;
    }

    const formattedDob = dobDay && dobMonth && dobYear ? `${dobYear}-${dobMonth}-${dobDay}` : '';

    let newUser = null;
    if (activeTab === 'signin') {
      newUser = {
        name: email.split('@')[0],
        email: email.trim(),
        loginMethod: 'email',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      };
    } else {
      newUser = {
        name: name.trim(),
        email: email.trim(),
        dob: formattedDob,
        loginMethod: 'email',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      };
    }

    resetAllFields();
    if (onLogin) onLogin(newUser);
    if (onClose) onClose();
  };

  const handleGoogleLogin = () => {
    const googleUser = {
      name: 'Google Rider',
      email: 'rider.google@gmail.com',
      dob: '1998-05-12',
      loginMethod: 'google',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    };
    resetAllFields();
    if (onLogin) onLogin(googleUser);
    if (onClose) onClose();
  };

  const handleSignOut = () => {
    resetAllFields();
    if (onLogin) onLogin(null);
    if (onClose) onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.modalCard, SHADOWS.card]}>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <X size={18} color="#94A3B8" />
              </TouchableOpacity>

              <ScrollView showsVerticalScrollIndicator={false}>
                {user ? (
                  /* Logged-In User Profile View */
                  <View style={styles.profileContainer}>
                    <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
                    <Text style={styles.welcomeText}>Logged In</Text>
                    <Text style={styles.userNameText}>{user.name}</Text>
                    <Text style={styles.userEmailText}>{user.email}</Text>

                    <View style={styles.verifiedBadge}>
                      <ShieldCheck size={16} color={COLORS.statusAvailable} />
                      <Text style={styles.verifiedBadgeText}>18+ Verified Rider Account</Text>
                    </View>

                    <TouchableOpacity
                      style={styles.signOutBtn}
                      onPress={handleSignOut}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.signOutText}>Sign Out</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  /* Auth Form View */
                  <View>
                    {/* Sign In vs Sign Up Tabs */}
                    <View style={styles.tabBar}>
                      <TouchableOpacity
                        style={[styles.tabItem, activeTab === 'signin' && styles.tabItemActive]}
                        onPress={() => handleTabSwitch('signin')}
                      >
                        <Text style={[styles.tabText, activeTab === 'signin' && styles.tabTextActive]}>
                          Sign In
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.tabItem, activeTab === 'signup' && styles.tabItemActive]}
                        onPress={() => handleTabSwitch('signup')}
                      >
                        <Text style={[styles.tabText, activeTab === 'signup' && styles.tabTextActive]}>
                          Sign Up (18+)
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.modalTitle}>
                      {activeTab === 'signup' ? 'Create 18+ Rider Account' : 'Welcome to The Road Eagle'}
                    </Text>
                    <Text style={styles.modalSubtitle}>
                      {activeTab === 'signup'
                        ? 'Select Day, Month & Year of Birth. Age will be strictly verified before booking.'
                        : 'Quick passwordless sign in via Email OTP.'}
                    </Text>

                    {errorMsg ? (
                      <View style={styles.errorBox}>
                        <AlertTriangle size={16} color={COLORS.accentRed} />
                        <Text style={styles.errorText}>{errorMsg}</Text>
                      </View>
                    ) : null}

                    {infoMsg && !otpSent ? (
                      <View style={styles.infoBox}>
                        <Text style={styles.infoText}>{infoMsg}</Text>
                      </View>
                    ) : null}

                    {!otpSent ? (
                      /* Form: Name, Email, DOB Selectors */
                      <View>
                        {activeTab === 'signup' && (
                          <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>FULL NAME</Text>
                            <TextInput
                              style={styles.textInput}
                              placeholder="e.g. Rahul Verma"
                              placeholderTextColor="#475569"
                              value={name}
                              onChangeText={setName}
                            />
                          </View>
                        )}

                        <View style={styles.inputGroup}>
                          <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
                          <TextInput
                            style={styles.textInput}
                            placeholder="e.g. rahul@example.com"
                            placeholderTextColor="#475569"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                          />
                        </View>

                        {activeTab === 'signup' && (
                          <View style={styles.inputGroup}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                              <Calendar size={14} color="#38BDF8" />
                              <Text style={styles.inputLabel}>DATE OF BIRTH (18+ MANDATORY)</Text>
                            </View>

                            {/* 3 Separate Dropdown Selectors for Day, Month, Year */}
                            <View style={styles.dobSelectorsRow}>
                              {/* Day Selector */}
                              <TouchableOpacity
                                style={[styles.dobSelectBox, activeDobPicker === 'day' && styles.dobSelectBoxActive]}
                                onPress={() => setActiveDobPicker(activeDobPicker === 'day' ? null : 'day')}
                                activeOpacity={0.8}
                              >
                                <Text style={dobDay ? styles.dobValueText : styles.dobPlaceholderText}>
                                  {dobDay ? `Day ${dobDay}` : 'Day'}
                                </Text>
                                <ChevronDown size={14} color="#94A3B8" />
                              </TouchableOpacity>

                              {/* Month Selector */}
                              <TouchableOpacity
                                style={[styles.dobSelectBox, activeDobPicker === 'month' && styles.dobSelectBoxActive, { flex: 1.3 }]}
                                onPress={() => setActiveDobPicker(activeDobPicker === 'month' ? null : 'month')}
                                activeOpacity={0.8}
                              >
                                <Text style={dobMonth ? styles.dobValueText : styles.dobPlaceholderText}>
                                  {dobMonth ? MONTHS.find(m => m.value === dobMonth)?.label || dobMonth : 'Month'}
                                </Text>
                                <ChevronDown size={14} color="#94A3B8" />
                              </TouchableOpacity>

                              {/* Year Selector */}
                              <TouchableOpacity
                                style={[styles.dobSelectBox, activeDobPicker === 'year' && styles.dobSelectBoxActive, { flex: 1.2 }]}
                                onPress={() => setActiveDobPicker(activeDobPicker === 'year' ? null : 'year')}
                                activeOpacity={0.8}
                              >
                                <Text style={dobYear ? styles.dobValueText : styles.dobPlaceholderText}>
                                  {dobYear || 'Year'}
                                </Text>
                                <ChevronDown size={14} color="#94A3B8" />
                              </TouchableOpacity>
                            </View>

                            {/* Expanded Selection List inside Modal */}
                            {activeDobPicker === 'day' && (
                              <View style={styles.pickerDropdownContainer}>
                                <Text style={styles.pickerDropdownHeader}>Select Birth Day</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, paddingVertical: 4 }}>
                                  {DAYS.map((d) => (
                                    <TouchableOpacity
                                      key={d}
                                      style={[styles.pickerItemChip, dobDay === d && styles.pickerItemChipActive]}
                                      onPress={() => {
                                        setDobDay(d);
                                        setActiveDobPicker(dobMonth ? (dobYear ? null : 'year') : 'month');
                                      }}
                                    >
                                      <Text style={[styles.pickerItemText, dobDay === d && styles.pickerItemTextActive]}>{d}</Text>
                                    </TouchableOpacity>
                                  ))}
                                </ScrollView>
                              </View>
                            )}

                            {activeDobPicker === 'month' && (
                              <View style={styles.pickerDropdownContainer}>
                                <Text style={styles.pickerDropdownHeader}>Select Birth Month</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, paddingVertical: 4 }}>
                                  {MONTHS.map((m) => (
                                    <TouchableOpacity
                                      key={m.value}
                                      style={[styles.pickerItemChip, dobMonth === m.value && styles.pickerItemChipActive]}
                                      onPress={() => {
                                        setDobMonth(m.value);
                                        setActiveDobPicker(dobYear ? null : 'year');
                                      }}
                                    >
                                      <Text style={[styles.pickerItemText, dobMonth === m.value && styles.pickerItemTextActive]}>{m.label}</Text>
                                    </TouchableOpacity>
                                  ))}
                                </ScrollView>
                              </View>
                            )}

                            {activeDobPicker === 'year' && (
                              <View style={styles.pickerDropdownContainer}>
                                <Text style={styles.pickerDropdownHeader}>Select Birth Year</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, paddingVertical: 4 }}>
                                  {YEARS.map((y) => (
                                    <TouchableOpacity
                                      key={y}
                                      style={[styles.pickerItemChip, dobYear === y && styles.pickerItemChipActive]}
                                      onPress={() => {
                                        setDobYear(y);
                                        setActiveDobPicker(null);
                                      }}
                                    >
                                      <Text style={[styles.pickerItemText, dobYear === y && styles.pickerItemTextActive]}>{y}</Text>
                                    </TouchableOpacity>
                                  ))}
                                </ScrollView>
                              </View>
                            )}

                            <Text style={styles.dobHelper}>
                              Age must be strictly 18 or above to rent and drive motorbikes.
                            </Text>
                          </View>
                        )}

                        <TouchableOpacity
                          style={styles.submitBtn}
                          onPress={handleSendCode}
                          activeOpacity={0.85}
                        >
                          <Text style={styles.submitBtnText}>
                            {activeTab === 'signup' ? 'Verify Age & Send OTP' : 'Send Email OTP'}
                          </Text>
                          <ArrowRight size={16} color="#FFFFFF" />
                        </TouchableOpacity>

                        <View style={styles.dividerRow}>
                          <View style={styles.dividerLine} />
                          <Text style={styles.dividerText}>OR</Text>
                          <View style={styles.dividerLine} />
                        </View>

                        <TouchableOpacity
                          style={styles.googleBtn}
                          onPress={handleGoogleLogin}
                          activeOpacity={0.85}
                        >
                          <GoogleIcon size={18} />
                          <Text style={styles.googleBtnText}>Continue with Google</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      /* OTP Verification Screen */
                      <View>
                        <View style={styles.otpBanner}>
                          <Text style={styles.otpBannerText}>
                            18+ Verified! OTP sent to <Text style={{ fontWeight: '800' }}>{email}</Text>
                          </Text>
                        </View>

                        <View style={styles.inputGroup}>
                          <Text style={styles.inputLabel}>ENTER 4-DIGIT EMAIL OTP</Text>
                          <TextInput
                            style={[styles.textInput, styles.otpInput]}
                            placeholder="• • • •"
                            placeholderTextColor="#475569"
                            value={otp}
                            onChangeText={(t) => setOtp(t.replace(/\D/g, '').slice(0, 4))}
                            keyboardType="number-pad"
                            maxLength={4}
                            autoFocus
                          />
                        </View>

                        <View style={styles.otpLinksRow}>
                          <TouchableOpacity onPress={() => setOtp('1234')}>
                            <Text style={styles.otpDemoLink}>Fill Demo Code (1234)</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => resetOtpOnly()}>
                            <Text style={styles.otpChangeLink}>Change Email</Text>
                          </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                          style={styles.submitBtn}
                          onPress={handleVerifyAndSubmit}
                          activeOpacity={0.85}
                        >
                          <Text style={styles.submitBtnText}>Verify OTP & Continue</Text>
                          <ArrowRight size={16} color="#FFFFFF" />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 11, 20, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#0F172A',
    borderRadius: RADIUS.xl,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    right: 16,
    top: 16,
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: RADIUS.full,
    padding: 4,
    marginBottom: 20,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: RADIUS.full,
  },
  tabItemActive: {
    backgroundColor: '#0284C7',
  },
  tabText: {
    color: COLORS.textSecondary,
    fontWeight: '700',
    fontSize: 13,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 18,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(225, 29, 72, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(225, 29, 72, 0.35)',
    borderRadius: RADIUS.md,
    padding: 10,
    marginBottom: 14,
  },
  errorText: {
    color: '#FDA4AF',
    fontSize: 12.5,
    flex: 1,
  },
  infoBox: {
    backgroundColor: 'rgba(2, 132, 199, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.35)',
    borderRadius: RADIUS.md,
    padding: 10,
    marginBottom: 14,
  },
  infoText: {
    color: '#38BDF8',
    fontSize: 12.5,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSecondary,
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  textInput: {
    height: 46,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    color: COLORS.textPrimary,
    fontSize: 13.5,
  },
  dobSelectorsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dobSelectBox: {
    flex: 1,
    height: 46,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: RADIUS.md,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dobSelectBoxActive: {
    borderColor: '#38BDF8',
    backgroundColor: 'rgba(2, 132, 199, 0.15)',
  },
  dobValueText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  dobPlaceholderText: {
    color: '#475569',
    fontSize: 13,
  },
  pickerDropdownContainer: {
    backgroundColor: '#1E293B',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.35)',
    padding: 10,
    marginTop: 8,
  },
  pickerDropdownHeader: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  pickerItemChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  pickerItemChipActive: {
    backgroundColor: '#0284C7',
    borderColor: '#38BDF8',
  },
  pickerItemText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '600',
  },
  pickerItemTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  dobHelper: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 5,
  },
  submitBtn: {
    height: 46,
    backgroundColor: '#0284C7',
    borderRadius: RADIUS.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dividerText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '700',
    marginHorizontal: 12,
  },
  googleBtn: {
    height: 46,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: RADIUS.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  googleBtnText: {
    color: COLORS.textPrimary,
    fontWeight: '600',
    fontSize: 13,
  },
  otpBanner: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.35)',
    borderRadius: RADIUS.md,
    padding: 10,
    marginBottom: 14,
    alignItems: 'center',
  },
  otpBannerText: {
    color: '#34D399',
    fontSize: 13,
    fontWeight: '600',
  },
  otpInput: {
    textAlign: 'center',
    letterSpacing: 12,
    fontSize: 20,
    fontWeight: '800',
  },
  otpLinksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 16,
  },
  otpDemoLink: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '600',
  },
  otpChangeLink: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  profileContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  avatarImage: {
    width: 68,
    height: 68,
    borderRadius: 34,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#38BDF8',
  },
  welcomeText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  userNameText: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  userEmailText: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: 14,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    marginBottom: 20,
  },
  verifiedBadgeText: {
    color: '#34D399',
    fontSize: 12,
    fontWeight: '600',
  },
  signOutBtn: {
    width: '100%',
    height: 44,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.5)',
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutText: {
    color: '#EF4444',
    fontWeight: '700',
    fontSize: 14,
  },
});
