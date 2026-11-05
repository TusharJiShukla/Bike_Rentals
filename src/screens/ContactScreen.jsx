import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
} from 'lucide-react-native';
import { BIKES_DATA } from '../data/bikes';
import { COLORS, RADIUS, SHADOWS } from '../theme/colors';

export default function ContactScreen({ onShowToast, onOpenWhatsApp }) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedBikeId, setSelectedBikeId] = useState(BIKES_DATA[0].id);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    if (onShowToast) {
      onShowToast(`Thank you, ${fullName || 'Rider'}! Your enquiry has been received.`);
    }
    setTimeout(() => {
      setSubmitted(false);
      setFullName('');
      setPhone('');
      setEmail('');
      setMessage('');
    }, 3000);
  };

  const handleOpenMaps = () => {
    Linking.openURL('https://maps.google.com/?q=123+Rider+Avenue+Sector+5').catch(() => {});
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.centerContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.pretitle}>GET IN TOUCH</Text>
          <Text style={styles.title}>Contact The Road Eagle</Text>
          <Text style={styles.subtitle}>
            Have questions about machines, security deposits, or outstation tours? Reach out via WhatsApp or visit our central pickup hub.
          </Text>
        </View>

        {/* 2-Column Responsive Layout on Web */}
        <View style={styles.mainLayout}>
          {/* Left Column: Contact Cards */}
          <View style={styles.leftColumn}>
            {/* Direct Call & WhatsApp Action Cards */}
            <View style={styles.actionCardsRow}>
              <TouchableOpacity
                style={styles.quickActionCard}
                onPress={() => Linking.openURL('tel:+919876543210')}
                activeOpacity={0.8}
              >
                <View style={[styles.actionIconCircle, { backgroundColor: 'rgba(2, 132, 199, 0.2)' }]}>
                  <Phone size={20} color="#38BDF8" />
                </View>
                <Text style={styles.actionCardTitle}>Instant Call</Text>
                <Text style={styles.actionCardSub}>+91 98765 43210</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickActionCard}
                onPress={onOpenWhatsApp}
                activeOpacity={0.8}
              >
                <View style={[styles.actionIconCircle, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                  <MessageCircle size={20} color="#10B981" />
                </View>
                <Text style={styles.actionCardTitle}>WhatsApp Concierge</Text>
                <Text style={styles.actionCardSub}>Live chat 24/7</Text>
              </TouchableOpacity>
            </View>

            {/* Hub Details Card */}
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.infoIconCircle}>
                  <MapPin size={20} color={COLORS.accentCyan} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoTitle}>Main Garage & Hub</Text>
                  <Text style={styles.infoText}>
                    Plot 42, Speed Lane, Near Central Metro Station, Sector 18, Gurugram / Delhi NCR - 122001
                  </Text>
                  <TouchableOpacity onPress={handleOpenMaps} style={{ marginTop: 6 }}>
                    <Text style={styles.mapLink}>Open in Google Maps →</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.infoDivider} />

              <View style={styles.infoRow}>
                <View style={styles.infoIconCircle}>
                  <Clock size={20} color={COLORS.accentCyan} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoTitle}>Operating Hours</Text>
                  <Text style={styles.infoText}>Monday – Sunday: 08:00 AM – 09:30 PM</Text>
                  <Text style={styles.infoSubtext}>Emergency roadside assistance operates 24/7</Text>
                </View>
              </View>

              <View style={styles.infoDivider} />

              <View style={styles.infoRow}>
                <View style={styles.infoIconCircle}>
                  <Mail size={20} color={COLORS.accentCyan} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoTitle}>Email Enquiries</Text>
                  <Text style={styles.infoText}>support@theroadeagle.com</Text>
                  <Text style={styles.infoSubtext}>Response within 2 hours</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Right Column: Enquiry Form */}
          <View style={styles.rightColumn}>
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Send an Instant Enquiry</Text>
              <Text style={styles.formSubtitle}>
                Leave your details below and our concierge team will reach out with availability & best tariff.
              </Text>

              {submitted ? (
                <View style={styles.successBox}>
                  <CheckCircle2 size={36} color={COLORS.statusAvailable} />
                  <Text style={styles.successTitle}>Enquiry Submitted!</Text>
                  <Text style={styles.successText}>
                    Our team will call or WhatsApp you on {phone || 'your number'} shortly.
                  </Text>
                </View>
              ) : (
                <View style={styles.formFields}>
                  <View style={styles.formGroup}>
                    <Text style={styles.label}>FULL NAME</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. Rahul Verma"
                      placeholderTextColor={COLORS.textMuted}
                      value={fullName}
                      onChangeText={setFullName}
                    />
                  </View>

                  <View style={styles.formRow}>
                    <View style={[styles.formGroup, { flex: 1 }]}>
                      <Text style={styles.label}>MOBILE NUMBER</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="10-digit number"
                        placeholderTextColor={COLORS.textMuted}
                        keyboardType="phone-pad"
                        value={phone}
                        onChangeText={setPhone}
                      />
                    </View>

                    <View style={[styles.formGroup, { flex: 1 }]}>
                      <Text style={styles.label}>EMAIL ADDRESS</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="rider@example.com"
                        placeholderTextColor={COLORS.textMuted}
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                      />
                    </View>
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.label}>SELECT MOTORBIKE OF INTEREST</Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.bikePillsRow}
                    >
                      {BIKES_DATA.map((b) => {
                        const isSelected = selectedBikeId === b.id;
                        return (
                          <TouchableOpacity
                            key={b.id}
                            style={[styles.bikePill, isSelected && styles.bikePillActive]}
                            onPress={() => setSelectedBikeId(b.id)}
                            activeOpacity={0.7}
                          >
                            <Text style={[styles.bikePillText, isSelected && styles.bikePillTextActive]}>
                              {b.name}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.label}>SPECIAL REQUIREMENTS / TRIP DETAILS (OPTIONAL)</Text>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      placeholder="e.g. Need extra helmet, planning weekend trip to Rishikesh..."
                      placeholderTextColor={COLORS.textMuted}
                      multiline
                      numberOfLines={3}
                      value={message}
                      onChangeText={setMessage}
                    />
                  </View>

                  <TouchableOpacity
                    style={styles.submitBtn}
                    onPress={handleSubmit}
                    activeOpacity={0.8}
                  >
                    <Send size={16} color="#FFFFFF" />
                    <Text style={styles.submitBtnText}>Submit Rental Enquiry</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  contentContainer: {
    paddingBottom: 50,
  },
  centerContainer: {
    width: '100%',
    maxWidth: 1200,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  header: {
    marginBottom: 28,
  },
  pretitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: 1.4,
    marginBottom: 6,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
    maxWidth: 700,
  },
  mainLayout: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
  },
  leftColumn: {
    flex: 1,
    minWidth: 320,
    gap: 20,
  },
  rightColumn: {
    flex: 1.2,
    minWidth: 320,
  },
  actionCardsRow: {
    flexDirection: 'row',
    gap: 14,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderCard,
    borderRadius: RADIUS.lg,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconCircle: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  actionCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 3,
  },
  actionCardSub: {
    fontSize: 12,
    color: '#38BDF8',
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderCard,
    borderRadius: RADIUS.lg,
    padding: 24,
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  infoIconCircle: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(2, 132, 199, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 19,
  },
  infoSubtext: {
    fontSize: 11.5,
    color: COLORS.textMuted,
    marginTop: 3,
  },
  mapLink: {
    fontSize: 12.5,
    color: '#38BDF8',
    fontWeight: '700',
  },
  infoDivider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
  },
  formCard: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderCard,
    borderRadius: RADIUS.lg,
    padding: 26,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  formSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 19,
    marginBottom: 20,
  },
  formFields: {
    gap: 14,
  },
  formGroup: {
    gap: 6,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textSecondary,
    letterSpacing: 0.8,
  },
  input: {
    backgroundColor: COLORS.bgCardAlt,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    paddingVertical: 11,
    color: COLORS.textPrimary,
    fontSize: 13.5,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  bikePillsRow: {
    gap: 8,
    paddingVertical: 2,
  },
  bikePill: {
    backgroundColor: COLORS.bgCardAlt,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: RADIUS.full,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  bikePillActive: {
    backgroundColor: '#0284C7',
    borderColor: '#38BDF8',
  },
  bikePillText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  bikePillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  submitBtn: {
    backgroundColor: '#0284C7',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.4)',
    borderRadius: RADIUS.full,
    paddingVertical: 13,
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
    fontSize: 14,
    fontWeight: '700',
  },
  successBox: {
    alignItems: 'center',
    paddingVertical: 36,
    gap: 10,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  successText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
