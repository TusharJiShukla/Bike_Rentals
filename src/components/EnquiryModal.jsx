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
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { X, Send, CheckCircle2, ShieldCheck, Calendar, Phone, User, MessageSquare } from 'lucide-react-native';
import { BIKES_DATA } from '../data/bikes';
import { COLORS, RADIUS, SHADOWS } from '../theme/colors';

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
  const [bikeId, setBikeId] = useState(selectedBike?.id || BIKES_DATA[0].id);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (selectedBike) {
      setBikeId(selectedBike.id);
    }
  }, [selectedBike]);

  useEffect(() => {
    if (!visible) {
      setFullName('');
      setPhone('');
      setStartDate('');
      setEndDate('');
      setMessage('');
      setSubmitted(false);
    }
  }, [visible]);

  const currentBike = BIKES_DATA.find((b) => b.id === bikeId) || BIKES_DATA[0];

  const handleWhatsAppRedirect = () => {
    const text = encodeURIComponent(
      `Hello The Road Eagle! I would like to enquire about renting the ${currentBike.name} (${currentBike.model}).\n` +
      `Dates: ${startDate || 'Flexible'} to ${endDate || 'Flexible'}\n` +
      `My Name: ${fullName || 'Rider'}\n` +
      `Phone: ${phone || 'Not provided'}\n` +
      (message ? `Note: ${message}` : '')
    );
    Linking.openURL(`https://wa.me/919876543210?text=${text}`).catch(() => {});
    if (onShowToast) onShowToast(`Opening WhatsApp concierge for ${currentBike.name}!`);
    onClose();
  };

  const handleSubmit = () => {
    setSubmitted(true);
    if (onShowToast) {
      onShowToast(`Enquiry received for ${currentBike.name}! Our concierge will connect with you shortly.`);
    }
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2200);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.modalCard, SHADOWS.card]}>
              {/* Close Button */}
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <X size={18} color="#94A3B8" />
              </TouchableOpacity>

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header with WhatsApp Luxury Pill */}
                <View style={styles.header}>
                  <View style={styles.waIconCircle}>
                    <WhatsAppSvgIcon size={26} color="#FFFFFF" />
                  </View>
                  <Text style={styles.title}>WhatsApp Concierge</Text>
                  <Text style={styles.subtitle}>
                    Instant verified response from our 24/7 fleet team (+91 98765 43210)
                  </Text>
                </View>

                {submitted ? (
                  <View style={styles.submittedWrap}>
                    <View style={styles.checkCircle}>
                      <CheckCircle2 size={42} color="#10B981" />
                    </View>
                    <Text style={styles.submittedTitle}>Enquiry Submitted!</Text>
                    <Text style={styles.submittedSubtitle}>
                      We have received your enquiry for <Text style={{ fontWeight: '800', color: '#FFFFFF' }}>{currentBike.name}</Text>. Our concierge representative will connect with you right away.
                    </Text>
                  </View>
                ) : (
                  <View style={styles.form}>
                    {/* Machine Selector Section */}
                    <View style={styles.sectionWrap}>
                      <Text style={styles.sectionLabel}>SELECTED MOTORBIKE</Text>
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
                              <Text style={[styles.bikeChipText, active && styles.bikeChipTextActive]}>
                                {b.name}
                              </Text>
                              <Text style={[styles.bikeChipPrice, active && styles.bikeChipPriceActive]}>
                                ₹{b.pricePerDay}/day
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </ScrollView>
                    </View>

                    {/* Rider Inputs with Clean Placeholders Only */}
                    <View style={styles.inputGroup}>
                      <View style={styles.labelRow}>
                        <User size={13} color="#94A3B8" />
                        <Text style={styles.label}>FULL NAME</Text>
                      </View>
                      <TextInput
                        style={styles.input}
                        placeholder="e.g. Rahul Verma"
                        placeholderTextColor="#475569"
                        value={fullName}
                        onChangeText={setFullName}
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <View style={styles.labelRow}>
                        <Phone size={13} color="#94A3B8" />
                        <Text style={styles.label}>CONTACT PHONE NUMBER</Text>
                      </View>
                      <TextInput
                        style={styles.input}
                        placeholder="10-digit mobile number"
                        placeholderTextColor="#475569"
                        keyboardType="phone-pad"
                        value={phone}
                        onChangeText={setPhone}
                        maxLength={15}
                      />
                    </View>

                    {/* Dates Row */}
                    <View style={styles.datesRow}>
                      <View style={[styles.inputGroup, { flex: 1 }]}>
                        <View style={styles.labelRow}>
                          <Calendar size={13} color="#94A3B8" />
                          <Text style={styles.label}>START DATE</Text>
                        </View>
                        <TextInput
                          style={styles.input}
                          placeholder="MM/DD/YYYY"
                          placeholderTextColor="#475569"
                          value={startDate}
                          onChangeText={setStartDate}
                        />
                      </View>

                      <View style={[styles.inputGroup, { flex: 1 }]}>
                        <View style={styles.labelRow}>
                          <Calendar size={13} color="#94A3B8" />
                          <Text style={styles.label}>END DATE</Text>
                        </View>
                        <TextInput
                          style={styles.input}
                          placeholder="MM/DD/YYYY"
                          placeholderTextColor="#475569"
                          value={endDate}
                          onChangeText={setEndDate}
                        />
                      </View>
                    </View>

                    <View style={styles.inputGroup}>
                      <View style={styles.labelRow}>
                        <MessageSquare size={13} color="#94A3B8" />
                        <Text style={styles.label}>SPECIAL REQUIREMENTS (OPTIONAL)</Text>
                      </View>
                      <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Need extra helmet, doorstep delivery, or custom touring advice..."
                        placeholderTextColor="#475569"
                        multiline
                        numberOfLines={3}
                        value={message}
                        onChangeText={setMessage}
                      />
                    </View>

                    {/* WhatsApp Primary CTA Button - Refined Luxury Green */}
                    <TouchableOpacity
                      style={styles.whatsAppBtn}
                      onPress={handleWhatsAppRedirect}
                      activeOpacity={0.85}
                    >
                      <WhatsAppSvgIcon size={19} color="#FFFFFF" />
                      <Text style={styles.whatsAppBtnText}>Chat Directly on WhatsApp</Text>
                    </TouchableOpacity>

                    {/* Secondary Direct Submit Button - Elegant Outline */}
                    <TouchableOpacity
                      style={styles.submitBtn}
                      onPress={handleSubmit}
                      activeOpacity={0.8}
                    >
                      <Send size={15} color="#38BDF8" />
                      <Text style={styles.submitBtnText}>Submit Callback Request</Text>
                    </TouchableOpacity>
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
    backgroundColor: '#0F172A',
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    padding: 24,
    width: '100%',
    maxWidth: 480,
    maxHeight: '92%',
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 10,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 4,
  },
  waIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'rgba(167, 243, 208, 0.4)',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12.5,
    color: '#94A3B8',
    textAlign: 'center',
    maxWidth: 360,
    lineHeight: 18,
  },
  form: {
    gap: 14,
  },
  sectionWrap: {
    marginBottom: 4,
  },
  sectionLabel: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: 1,
    marginBottom: 8,
  },
  bikeChipsContent: {
    gap: 8,
    paddingVertical: 2,
  },
  bikeChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  bikeChipActive: {
    backgroundColor: 'rgba(2, 132, 199, 0.2)',
    borderColor: '#38BDF8',
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
    color: '#38BDF8',
    fontWeight: '600',
  },
  inputGroup: {
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    height: 44,
    color: '#FFFFFF',
    fontSize: 13,
  },
  textArea: {
    height: 72,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  datesRow: {
    flexDirection: 'row',
    gap: 12,
  },
  whatsAppBtn: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    borderRadius: RADIUS.full,
    paddingVertical: 13,
    marginTop: 8,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 4,
  },
  whatsAppBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  submitBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.35)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: RADIUS.full,
    paddingVertical: 12,
  },
  submitBtnText: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '700',
  },
  submittedWrap: {
    alignItems: 'center',
    paddingVertical: 36,
    gap: 12,
  },
  checkCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
    marginBottom: 4,
  },
  submittedTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  submittedSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
});
