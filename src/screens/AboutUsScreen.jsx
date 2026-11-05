import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  Award,
  Heart,
  Wrench,
  ShieldCheck,
  Bike,
  ArrowRight,
  Compass,
} from 'lucide-react-native';
import { IMAGES } from '../assets/images';
import { COLORS, RADIUS, SHADOWS } from '../theme/colors';

export default function AboutUsScreen({ navigation }) {
  const values = [
    {
      title: 'Affordability',
      desc: 'Premium motorcycles and scooters at competitive, transparent day rates with zero hidden charges.',
      icon: Award,
    },
    {
      title: 'Unmatched Satisfaction',
      desc: 'Dedicated concierge team focused on making your road adventure effortless and memorable.',
      icon: Heart,
    },
    {
      title: 'Mechanical Precision',
      desc: 'In-house certified mechanics performing rigorous 24-point inspections on every vehicle before departure.',
      icon: Wrench,
    },
    {
      title: 'Rider Safety First',
      desc: 'Complimentary certified helmets, comprehensive insurance coverage, and 24/7 roadside assistance.',
      icon: ShieldCheck,
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.centerContainer}>
        {/* Header Title */}
        <View style={styles.header}>
          <Text style={styles.pretitle}>ABOUT THE ROAD EAGLE</Text>
          <Text style={styles.title}>Redefining Two-Wheeled Freedom</Text>
          <Text style={styles.subtitle}>
            Born out of a genuine obsession with motorcycling and exploration. We are building India's most dependable, rider-centric motorcycle rental fleet.
          </Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>50+</Text>
            <Text style={styles.statLabel}>PREMIUM FLEET</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>10K+</Text>
            <Text style={styles.statLabel}>HAPPY RIDERS</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>4.9★</Text>
            <Text style={styles.statLabel}>GOOGLE RATING</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>24/7</Text>
            <Text style={styles.statLabel}>ON-ROAD SUPPORT</Text>
          </View>
        </View>

        {/* Story Card */}
        <View style={styles.storyCard}>
          <Image
            source={IMAGES['workshop']}
            style={styles.storyImg}
            resizeMode="cover"
          />
          <View style={styles.storyContent}>
            <Text style={styles.storyPretitle}>OUR FOUNDATION</Text>
            <Text style={styles.storyTitle}>No Shortcuts. No Surprises.</Text>
            <Text style={styles.storyText}>
              Too many bike rentals in India deliver poorly maintained, noisy machines with uncommunicated charges and withheld security deposits. The Road Eagle was founded to change this completely.{'\n\n'}
              Every cruiser, commuter, and superbike in our garage is company-owned, rigorously inspected by certified mechanics, and cleaned prior to handover. We believe renting a machine should feel as trustworthy and exciting as taking delivery of your own showroom bike.
            </Text>
          </View>
        </View>

        {/* Values 2x2 Grid (Proper Columns) */}
        <View style={styles.valuesSection}>
          <Text style={styles.sectionTitle}>What Sets Us Apart</Text>
          <Text style={styles.sectionSubtitle}>
            Our core operating principles built around trust, transparency, and mechanical excellence.
          </Text>

          <View style={styles.valuesGrid}>
            {values.map((v, i) => {
              const IconComp = v.icon;
              return (
                <View key={i} style={styles.valueCard}>
                  <View style={styles.valueIconCircle}>
                    <IconComp size={22} color={COLORS.accentCyan} />
                  </View>
                  <Text style={styles.valueTitle}>{v.title}</Text>
                  <Text style={styles.valueDesc}>{v.desc}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Browse Fleet Button - Sober Sapphire Blue & Centered */}
        <View style={styles.ctaBtnWrapper}>
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() => navigation?.navigate('Motorbikes')}
            activeOpacity={0.8}
          >
            <Bike size={18} color="#FFFFFF" />
            <Text style={styles.ctaBtnText}>Browse Available Fleet</Text>
            <ArrowRight size={16} color="#FFFFFF" />
          </TouchableOpacity>
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
    color: '#FFFFFF',
    marginBottom: 10,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
    maxWidth: 700,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderCard,
    borderRadius: RADIUS.lg,
    padding: 20,
    marginBottom: 32,
  },
  statBox: {
    flex: 1,
    minWidth: 120,
    alignItems: 'center',
    paddingVertical: 10,
  },
  statNum: {
    fontSize: 30,
    fontWeight: '900',
    color: '#38BDF8',
  },
  statLabel: {
    fontSize: 10.5,
    color: COLORS.textSecondary,
    fontWeight: '700',
    marginTop: 4,
    letterSpacing: 0.8,
  },
  storyCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderCard,
    overflow: 'hidden',
    marginBottom: 36,
  },
  storyImg: {
    width: '100%',
    height: 240,
  },
  storyContent: {
    padding: 24,
  },
  storyPretitle: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  storyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  storyText: {
    fontSize: 13.5,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  valuesSection: {
    marginBottom: 36,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 13.5,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  valuesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  valueCard: {
    flex: 1,
    minWidth: 260,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderCard,
    borderRadius: RADIUS.lg,
    padding: 22,
  },
  valueIconCircle: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(2, 132, 199, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  valueTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  valueDesc: {
    fontSize: 12.5,
    color: COLORS.textSecondary,
    lineHeight: 19,
  },
  ctaBtnWrapper: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  ctaBtn: {
    backgroundColor: '#0284C7',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.4)',
    borderRadius: RADIUS.full,
    paddingVertical: 12,
    paddingHorizontal: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  ctaBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
