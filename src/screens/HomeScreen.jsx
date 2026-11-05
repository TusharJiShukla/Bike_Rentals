import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  Bike,
  Tag,
  Headphones,
  CalendarCheck,
  ArrowRight,
  MessageCircle,
  Star,
  ShieldCheck,
  Plus,
  Minus,
  Award,
  ChevronLeft,
  ChevronRight,
  Compass,
} from 'lucide-react-native';
import { BIKES_DATA, CATEGORIES_DATA, FAQS_DATA, TESTIMONIALS_DATA } from '../data/bikes';
import { IMAGES } from '../assets/images';
import { COLORS, RADIUS, SHADOWS } from '../theme/colors';
import BikeCard from '../components/BikeCard';

const { width } = Dimensions.get('window');

export default function HomeScreen({
  navigation,
  onSelectBike,
  onStartBooking,
  onOpenWhatsApp,
  onOpenBookModal,
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const carouselScrollRef = useRef(null);
  const [carouselOffset, setCarouselOffset] = useState(0);

  const toggleFaq = (idx) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  const handleScrollCarousel = (direction) => {
    const cardStep = 306; // 290 card width + 16 gap
    const nextX = direction === 'left'
      ? Math.max(0, carouselOffset - cardStep)
      : carouselOffset + cardStep;
    carouselScrollRef.current?.scrollTo({ x: nextX, animated: true });
    setCarouselOffset(nextX);
  };

  const filteredBikes = BIKES_DATA.filter((b) => {
    if (selectedCategory === 'all') return true;
    return b.categoryKey === selectedCategory;
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* ================= HERO SECTION (Centered & Contained) ================= */}
      <View style={styles.heroSection}>
        <Image
          source={IMAGES['hero-bike']}
          style={styles.heroBgImage}
          resizeMode="cover"
        />
        <View style={styles.heroOverlay} />

        <View style={styles.heroContainer}>
          <View style={styles.heroTagBadge}>
            <Compass size={13} color="#38BDF8" style={{ marginRight: 6 }} />
            <Text style={styles.heroTagText}>THEROADEAGLE.COM</Text>
          </View>

          <Text style={styles.heroTitle}>
            Your Ride, Your Route,{'\n'}
            <Text style={styles.heroTitleCyan}>Your Freedom.</Text>
          </Text>

          <Text style={styles.heroSubtitle}>
            Discover the city on two wheels. Find the perfect machine for your journey, from agile urban scooters to highway cruisers and superbikes.
          </Text>

          <View style={styles.heroButtons}>
            {/* Explore Bikes button - navigates directly to Motorbikes fleet screen */}
            <TouchableOpacity
              style={styles.btnPrimary}
              onPress={() => {
                navigation.navigate('Motorbikes');
              }}
              activeOpacity={0.8}
            >
              <Bike size={17} color="#FFFFFF" />
              <Text style={styles.btnPrimaryText}>Explore Bikes</Text>
            </TouchableOpacity>

            {/* WhatsApp Enquiry button - luxury styling */}
            <TouchableOpacity
              style={styles.btnWhatsAppDark}
              onPress={onOpenWhatsApp}
              activeOpacity={0.8}
            >
              <MessageCircle size={17} color="#10B981" />
              <Text style={styles.btnWhatsAppDarkText}>WhatsApp Enquiry</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ================= FEATURE STRIP (Centered on all screen sizes) ================= */}
      <View style={styles.featureStrip}>
        <View style={styles.centerContainer}>
          <View style={styles.featureStripCenteredWrap}>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Bike size={16} color={COLORS.accentCyan} />
              </View>
              <Text style={styles.featureTitle}>Multiple Bike Options</Text>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Tag size={16} color={COLORS.accentCyan} />
              </View>
              <Text style={styles.featureTitle}>Transparent Pricing</Text>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Headphones size={16} color={COLORS.accentCyan} />
              </View>
              <Text style={styles.featureTitle}>Customer Assistance</Text>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <CalendarCheck size={16} color={COLORS.accentCyan} />
              </View>
              <Text style={styles.featureTitle}>Easy Enquiries</Text>
            </View>
          </View>
        </View>
      </View>

      {/* ================= PHILOSOPHY STATEMENT ================= */}
      <View style={styles.philosophySection}>
        <View style={styles.centerContainer}>
          <Text style={styles.philosophyQuote}>
            "Renting a motorcycle shouldn't feel like a leap of faith. We exist to provide transparent pricing, factory-maintained machines, and complete peace of mind."
          </Text>
          <Text style={styles.philosophyAuthor}>— The Road Eagle Guarantee</Text>
        </View>
      </View>

      {/* ================= CURATED FLEET SECTION ================= */}
      <View style={styles.fleetSection}>
        <View style={styles.centerContainer}>
          <View style={styles.fleetHeaderRow}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={styles.sectionPretitle}>CURATED LINEUP</Text>
              <Text style={styles.sectionTitle}>Featured Motorbikes</Text>
              <Text style={styles.sectionSubtitle}>
                Hand-picked machines ready for immediate adventure and daily convenience.
              </Text>
            </View>

            {/* Carousel Navigation Arrows */}
            <View style={styles.carouselArrows}>
              <TouchableOpacity
                style={styles.carouselArrowBtn}
                onPress={() => handleScrollCarousel('left')}
                activeOpacity={0.7}
                accessibilityLabel="Previous bikes"
              >
                <ChevronLeft size={18} color={COLORS.accentCyan} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.carouselArrowBtn}
                onPress={() => handleScrollCarousel('right')}
                activeOpacity={0.7}
                accessibilityLabel="Next bikes"
              >
                <ChevronRight size={18} color={COLORS.accentCyan} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Category Filter Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryPillsScroll}
          >
            {CATEGORIES_DATA.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.categoryPill, isActive && styles.categoryPillActive]}
                  onPress={() => {
                    setSelectedCategory(cat.id);
                    carouselScrollRef.current?.scrollTo({ x: 0, animated: true });
                    setCarouselOffset(0);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.categoryPillText, isActive && styles.categoryPillTextActive]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Horizontal Carousel of Bike Cards */}
          <View style={styles.carouselWrapper}>
            <ScrollView
              ref={carouselScrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carouselContent}
              onScroll={(e) => setCarouselOffset(e.nativeEvent.contentOffset.x)}
              scrollEventThrottle={16}
            >
              {filteredBikes.map((bike) => (
                <BikeCard
                  key={bike.id}
                  bike={bike}
                  onSelectBike={(b) => {
                    if (onSelectBike) onSelectBike(b);
                    navigation.navigate('BikeDetails', { bike: b });
                  }}
                  onStartBooking={onStartBooking}
                  onOpenBookModal={onOpenBookModal}
                  style={styles.carouselCard}
                />
              ))}

              {filteredBikes.length === 0 && (
                <View style={styles.carouselEmpty}>
                  <Text style={styles.carouselEmptyText}>No motorbikes found in this category.</Text>
                </View>
              )}
            </ScrollView>
          </View>

          {/* View All Bikes CTA - compact & elegant */}
          <View style={styles.viewAllBtnWrapper}>
            <TouchableOpacity
              style={styles.viewAllBtn}
              onPress={() => navigation.navigate('Motorbikes')}
              activeOpacity={0.8}
            >
              <Text style={styles.viewAllBtnText}>View Complete 50+ Fleet ({filteredBikes.length} available)</Text>
              <ArrowRight size={15} color="#38BDF8" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ================= WHY CHOOSE US (Proper 4-Column Grid on Web) ================= */}
      <View style={styles.whySection}>
        <View style={styles.centerContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionPretitle}>WHY THE ROAD EAGLE</Text>
            <Text style={styles.sectionTitle}>Built for Serious Riders</Text>
          </View>

          <View style={styles.whyGrid}>
            <View style={styles.whyCard}>
              <View style={styles.whyIconCircle}>
                <ShieldCheck size={22} color={COLORS.accentCyan} />
              </View>
              <Text style={styles.whyCardTitle}>24-Point Inspection</Text>
              <Text style={styles.whyCardDesc}>
                Every machine undergoes meticulous fluid, brake, and tyre checks before handover.
              </Text>
            </View>

            <View style={styles.whyCard}>
              <View style={styles.whyIconCircle}>
                <Tag size={22} color={COLORS.accentCyan} />
              </View>
              <Text style={styles.whyCardTitle}>Zero Hidden Fees</Text>
              <Text style={styles.whyCardDesc}>
                Clear daily rates with 100% refundable security deposit returned within 24-48 hours.
              </Text>
            </View>

            <View style={styles.whyCard}>
              <View style={styles.whyIconCircle}>
                <Headphones size={22} color={COLORS.accentCyan} />
              </View>
              <Text style={styles.whyCardTitle}>24/7 Roadside Assistance</Text>
              <Text style={styles.whyCardDesc}>
                Flat tyre? Emergency support? Our rapid breakdown van is always one phone call away.
              </Text>
            </View>

            <View style={styles.whyCard}>
              <View style={styles.whyIconCircle}>
                <Award size={22} color={COLORS.accentCyan} />
              </View>
              <Text style={styles.whyCardTitle}>Complimentary Gear</Text>
              <Text style={styles.whyCardDesc}>
                Sanitized ISI/DOT certified helmet and phone mounts provided with every booking.
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* ================= CUSTOMER REVIEWS ================= */}
      <View style={styles.reviewsSection}>
        <View style={styles.centerContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionPretitle}>VERIFIED FEEDBACK</Text>
            <Text style={styles.sectionTitle}>Loved by Riders</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.reviewsScroll}
          >
            {TESTIMONIALS_DATA.map((t, idx) => (
              <View key={idx} style={[styles.reviewCard, SHADOWS.card]}>
                <View style={styles.reviewHeader}>
                  <Image source={{ uri: t.avatar }} style={styles.reviewerAvatar} />
                  <View>
                    <Text style={styles.reviewerName}>{t.name}</Text>
                    <Text style={styles.reviewerCity}>{t.city}</Text>
                  </View>
                </View>

                <View style={styles.reviewStars}>
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={13} color={COLORS.accentCyan} fill={COLORS.accentCyan} />
                  ))}
                </View>

                <Text style={styles.reviewText}>"{t.review}"</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* ================= FAQS ACCORDION ================= */}
      <View style={styles.faqSection}>
        <View style={styles.centerContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionPretitle}>COMMON QUERIES</Text>
            <Text style={styles.sectionTitle}>Frequently Asked</Text>
          </View>

          <View style={styles.faqList}>
            {FAQS_DATA.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.faqCard, isOpen && styles.faqCardOpen]}
                  onPress={() => toggleFaq(index)}
                  activeOpacity={0.8}
                >
                  <View style={styles.faqHeader}>
                    <Text style={[styles.faqQuestion, isOpen && styles.faqQuestionActive]}>
                      {faq.question}
                    </Text>
                    {isOpen ? (
                      <Minus size={18} color={COLORS.accentCyan} />
                    ) : (
                      <Plus size={18} color={COLORS.textSecondary} />
                    )}
                  </View>

                  {isOpen && (
                    <Text style={styles.faqAnswer}>{faq.answer}</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>

      {/* ================= BOTTOM LUXURY CTA BANNER (Centered & Contained) ================= */}
      <View style={styles.ctaBannerSection}>
        <View style={styles.centerContainer}>
          <View style={styles.ctaBanner}>
            <Text style={styles.ctaBannerTitle}>Ready to Hit the Open Road?</Text>
            <Text style={styles.ctaBannerSubtitle}>
              Reserve your dream machine today or chat with our team on WhatsApp for instant confirmation.
            </Text>
            <View style={styles.ctaBannerBtns}>
              <TouchableOpacity
                style={styles.ctaPrimaryBtn}
                onPress={() => navigation.navigate('Motorbikes')}
                activeOpacity={0.8}
              >
                <Bike size={17} color="#FFFFFF" />
                <Text style={styles.ctaPrimaryBtnText}>Browse Entire Fleet</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.ctaWhatsAppBtn}
                onPress={onOpenWhatsApp}
                activeOpacity={0.8}
              >
                <MessageCircle size={17} color="#FFFFFF" />
                <Text style={styles.ctaWhatsAppBtnText}>WhatsApp Concierge</Text>
              </TouchableOpacity>
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
    maxWidth: 1240,
    alignSelf: 'center',
    paddingHorizontal: 20,
  },
  heroSection: {
    height: 520,
    width: '100%',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroBgImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(7, 14, 27, 0.82)',
  },
  heroContainer: {
    zIndex: 2,
    width: '100%',
    maxWidth: 1240,
    paddingHorizontal: 24,
    alignItems: 'flex-start',
  },
  heroTagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(2, 132, 199, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.4)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
    marginBottom: 18,
  },
  heroTagText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: 38,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 46,
    marginBottom: 14,
    maxWidth: 680,
  },
  heroTitleCyan: {
    color: '#38BDF8',
  },
  heroSubtitle: {
    fontSize: 14.5,
    color: '#94A3B8',
    lineHeight: 22,
    marginBottom: 26,
    maxWidth: 580,
  },
  heroButtons: {
    flexDirection: 'row',
    gap: 14,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  btnPrimary: {
    backgroundColor: '#0284C7',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.5)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: RADIUS.full,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  btnWhatsAppDark: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.35)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: RADIUS.full,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  btnWhatsAppDarkText: {
    color: '#34D399',
    fontSize: 14,
    fontWeight: '700',
  },
  featureStrip: {
    backgroundColor: COLORS.bgCard,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.borderCard,
    paddingVertical: 16,
  },
  featureStripCenteredWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.bgCardAlt,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(2, 132, 199, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  philosophySection: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  philosophyQuote: {
    fontSize: 15,
    fontStyle: 'italic',
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 25,
    marginBottom: 10,
    maxWidth: 720,
    alignSelf: 'center',
  },
  philosophyAuthor: {
    fontSize: 12,
    color: '#38BDF8',
    fontWeight: '700',
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  fleetSection: {
    marginBottom: 44,
  },
  sectionHeader: {
    marginBottom: 24,
  },
  sectionPretitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: 1.4,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  sectionSubtitle: {
    fontSize: 13.5,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  categoryPillsScroll: {
    gap: 8,
    marginBottom: 22,
  },
  categoryPill: {
    backgroundColor: COLORS.bgCardAlt,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  categoryPillActive: {
    backgroundColor: '#0284C7',
    borderColor: '#38BDF8',
  },
  categoryPillText: {
    color: COLORS.textSecondary,
    fontSize: 12.5,
    fontWeight: '600',
  },
  categoryPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  fleetHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  carouselArrows: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  carouselArrowBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.bgCardAlt,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselWrapper: {
    marginBottom: 20,
  },
  carouselContent: {
    gap: 16,
    paddingVertical: 6,
  },
  carouselCard: {
    width: 290,
    marginBottom: 0,
  },
  carouselEmpty: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderCard,
    borderRadius: RADIUS.lg,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    width: 280,
  },
  carouselEmptyText: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  viewAllBtnWrapper: {
    alignItems: 'center',
    marginTop: 8,
  },
  viewAllBtn: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.4)',
    borderRadius: RADIUS.full,
    paddingVertical: 11,
    paddingHorizontal: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    maxWidth: 420,
  },
  viewAllBtnText: {
    color: '#38BDF8',
    fontSize: 13.5,
    fontWeight: '700',
  },
  whySection: {
    marginBottom: 48,
  },
  whyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  whyCard: {
    flex: 1,
    minWidth: 240,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderCard,
    borderRadius: RADIUS.lg,
    padding: 22,
  },
  whyIconCircle: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(2, 132, 199, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  whyCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  whyCardDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  reviewsSection: {
    marginBottom: 48,
  },
  reviewsScroll: {
    gap: 16,
    paddingVertical: 4,
  },
  reviewCard: {
    width: 320,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderCard,
    padding: 20,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  reviewerAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1.5,
    borderColor: '#0284C7',
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  reviewerCity: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 10,
  },
  reviewText: {
    fontSize: 12.5,
    color: COLORS.textSecondary,
    lineHeight: 19,
    fontStyle: 'italic',
  },
  faqSection: {
    marginBottom: 48,
  },
  faqList: {
    gap: 12,
  },
  faqCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderCard,
    padding: 18,
  },
  faqCardOpen: {
    borderColor: 'rgba(56, 189, 248, 0.5)',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 14.5,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: 12,
  },
  faqQuestionActive: {
    color: '#38BDF8',
  },
  faqAnswer: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 21,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: 12,
  },
  ctaBannerSection: {
    marginBottom: 30,
  },
  ctaBanner: {
    backgroundColor: '#0D1526',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    borderRadius: RADIUS.xl,
    paddingVertical: 36,
    paddingHorizontal: 28,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 8,
  },
  ctaBannerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.4,
  },
  ctaBannerSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 24,
    maxWidth: 600,
  },
  ctaBannerBtns: {
    flexDirection: 'row',
    gap: 14,
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaPrimaryBtn: {
    backgroundColor: '#0284C7',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.5)',
    borderRadius: RADIUS.full,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  ctaPrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
  },
  ctaWhatsAppBtn: {
    backgroundColor: '#10B981', // Professional emerald green
    borderRadius: RADIUS.full,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  ctaWhatsAppBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
  },
});
