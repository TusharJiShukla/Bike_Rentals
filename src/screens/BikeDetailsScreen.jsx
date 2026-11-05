import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import {
  Star,
  CheckCircle2,
  ShieldCheck,
  MessageCircle,
  ArrowRight,
  FileText,
  Clock,
} from 'lucide-react-native';
import { BIKES_DATA } from '../data/bikes';
import { COLORS, RADIUS, SHADOWS } from '../theme/colors';

const { width } = Dimensions.get('window');

export default function BikeDetailsScreen({
  route,
  navigation,
  onStartBooking,
  onOpenWhatsApp,
  onOpenBookModal,
}) {
  const bike = route?.params?.bike || BIKES_DATA[0];
  const gallery = bike.gallerySources || [bike.imageSource];
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const similarBikes = BIKES_DATA.filter((b) => b.id !== bike.id).slice(0, 3);

  return (
    <View style={styles.screenWrapper}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* ================= GALLERY ================= */}
        <View style={styles.galleryContainer}>
          <Image
            source={gallery[activeImageIndex] || bike.imageSource}
            style={styles.mainImage}
            resizeMode="cover"
          />

          {/* Badges on image */}
          <View style={styles.imageBadges}>
            <View style={styles.badgePrimary}>
              <Text style={styles.badgePrimaryText}>{bike.badge || 'PREMIUM'}</Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    bike.statusBadge === 'LIMITED'
                      ? COLORS.statusLimited
                      : COLORS.statusAvailable,
                },
              ]}
            >
              <Text style={styles.statusBadgeText}>
                {bike.statusBadge || 'AVAILABLE'}
              </Text>
            </View>
          </View>
        </View>

        {/* Thumbnail Selector */}
        {gallery.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbsScroll}
          >
            {gallery.map((img, idx) => {
              const isActive = activeImageIndex === idx;
              return (
                <TouchableOpacity
                  key={idx}
                  style={[styles.thumbWrap, isActive && styles.thumbWrapActive]}
                  onPress={() => setActiveImageIndex(idx)}
                  activeOpacity={0.8}
                >
                  <Image source={img} style={styles.thumbImage} resizeMode="cover" />
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {/* ================= BIKE OVERVIEW ================= */}
        <View style={styles.infoSection}>
          <Text style={styles.bikeName}>{bike.name}</Text>
          <Text style={styles.bikeModel}>{bike.model}</Text>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <View style={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} color={COLORS.accentCyan} fill={COLORS.accentCyan} />
              ))}
            </View>
            <Text style={styles.ratingScore}>{bike.rating}</Text>
            <Text style={styles.reviewCount}>({bike.reviewsCount} verified reviews)</Text>
          </View>

          {/* Price Card */}
          <View style={styles.priceCard}>
            <View style={styles.priceHeader}>
              <View>
                <View style={styles.priceAmountRow}>
                  <Text style={styles.fromLabel}>from</Text>
                  <Text style={styles.priceNumber}>
                    ${Math.round(bike.pricePerDay / 50)}
                  </Text>
                  <Text style={styles.perDayLabel}>/ day</Text>
                </View>
                <Text style={styles.inrSubtitle}>
                  ₹{bike.pricePerDay.toLocaleString()} INR / day
                </Text>
              </View>

              <View style={styles.depositPill}>
                <Text style={styles.depositPillText}>
                  Refundable Deposit: ₹{bike.deposit.toLocaleString()}*
                </Text>
              </View>
            </View>

            <View style={styles.availabilityBanner}>
              <CheckCircle2 size={16} color={COLORS.statusAvailable} />
              <Text style={styles.availabilityText}>
                {bike.availability || 'Available for immediate pickup'}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.bookBtn, SHADOWS.glowRed]}
              onPress={() => {
                if (onStartBooking) {
                  onStartBooking(bike);
                } else if (onOpenBookModal) {
                  onOpenBookModal(bike);
                }
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.bookBtnText}>Book This Bike</Text>
              <ArrowRight size={16} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.whatsAppBtn}
              onPress={() => onOpenWhatsApp(bike)}
              activeOpacity={0.8}
            >
              <MessageCircle size={18} color="#050B14" />
              <Text style={styles.whatsAppBtnText}>WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ================= SPECS GRID ================= */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Technical Specifications</Text>

          <View style={styles.specsGrid}>
            <View style={styles.specBox}>
              <Text style={styles.specKey}>Displacement</Text>
              <Text style={styles.specVal}>{bike.specs?.displacement || '350 CC'}</Text>
            </View>
            <View style={styles.specBox}>
              <Text style={styles.specKey}>Max Power</Text>
              <Text style={styles.specVal}>{bike.specs?.power || '20.2 BHP'}</Text>
            </View>
            <View style={styles.specBox}>
              <Text style={styles.specKey}>Transmission</Text>
              <Text style={styles.specVal}>{bike.specs?.transmission || 'Manual'}</Text>
            </View>
            <View style={styles.specBox}>
              <Text style={styles.specKey}>Fuel System</Text>
              <Text style={styles.specVal}>{bike.specs?.fuelSystem || 'EFI'}</Text>
            </View>
            <View style={styles.specBox}>
              <Text style={styles.specKey}>Tank Capacity</Text>
              <Text style={styles.specVal}>{bike.specs?.tankCapacity || '15 L'}</Text>
            </View>
            <View style={styles.specBox}>
              <Text style={styles.specKey}>Mileage</Text>
              <Text style={styles.specVal}>{bike.specs?.mileage || '40 kmpl'}</Text>
            </View>
            <View style={styles.specBox}>
              <Text style={styles.specKey}>Braking</Text>
              <Text style={styles.specVal}>{bike.specs?.braking || 'ABS'}</Text>
            </View>
            <View style={styles.specBox}>
              <Text style={styles.specKey}>Kerb Weight</Text>
              <Text style={styles.specVal}>{bike.specs?.weight || '190 kg'}</Text>
            </View>
          </View>
        </View>

        {/* ================= FEATURES LIST ================= */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Features & Highlights</Text>
          <View style={styles.featuresList}>
            {(bike.features || []).map((feat, idx) => (
              <View key={idx} style={styles.featureRow}>
                <CheckCircle2 size={16} color={COLORS.accentCyan} />
                <Text style={styles.featureText}>{feat}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ================= RENTAL GUIDELINES ================= */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rental Terms & Requirements</Text>

          <View style={styles.guidelinesList}>
            <View style={styles.guidelineCard}>
              <View style={styles.guidelineHeader}>
                <Clock size={16} color={COLORS.accentCyan} />
                <Text style={styles.guidelineTitle}>Rental Duration</Text>
              </View>
              <Text style={styles.guidelineDesc}>{bike.guidelines?.duration}</Text>
            </View>

            <View style={styles.guidelineCard}>
              <View style={styles.guidelineHeader}>
                <FileText size={16} color={COLORS.accentCyan} />
                <Text style={styles.guidelineTitle}>Required Documents</Text>
              </View>
              <Text style={styles.guidelineDesc}>{bike.guidelines?.documents}</Text>
            </View>

            <View style={styles.guidelineCard}>
              <View style={styles.guidelineHeader}>
                <ShieldCheck size={16} color={COLORS.accentCyan} />
                <Text style={styles.guidelineTitle}>Security Deposit Policy</Text>
              </View>
              <Text style={styles.guidelineDesc}>{bike.guidelines?.deposit}</Text>
            </View>
          </View>
        </View>

        {/* ================= SIMILAR BIKES ================= */}
        <View style={[styles.section, { marginBottom: 30 }]}>
          <Text style={styles.sectionTitle}>You Might Also Like</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.similarScroll}
          >
            {similarBikes.map((sb) => (
              <TouchableOpacity
                key={sb.id}
                style={[styles.similarCard, SHADOWS.card]}
                onPress={() => navigation.push('BikeDetails', { bike: sb })}
                activeOpacity={0.8}
              >
                <Image source={sb.imageSource} style={styles.similarImg} />
                <View style={styles.similarContent}>
                  <Text style={styles.similarName} numberOfLines={1}>
                    {sb.name}
                  </Text>
                  <Text style={styles.similarPrice}>
                    ₹{sb.pricePerDay.toLocaleString()}/day
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* ================= STICKY BOTTOM BAR ================= */}
      <View style={styles.stickyBottomBar}>
        <View>
          <Text style={styles.stickyPriceLabel}>Daily Rental</Text>
          <Text style={styles.stickyPriceValue}>
            ₹{bike.pricePerDay.toLocaleString()}
            <Text style={{ fontSize: 12, color: COLORS.textMuted }}> /day</Text>
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.stickyBookBtn, SHADOWS.glowRed]}
          onPress={() => {
            if (onStartBooking) {
              onStartBooking(bike);
            } else if (onOpenBookModal) {
              onOpenBookModal(bike);
            }
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.stickyBookBtnText}>Book this bike</Text>
          <ArrowRight size={16} color="#FFFFFF" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 90,
  },
  galleryContainer: {
    width: '100%',
    height: 250,
    position: 'relative',
    backgroundColor: COLORS.bgCard,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  imageBadges: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  badgePrimary: {
    backgroundColor: 'rgba(8, 12, 20, 0.85)',
    borderWidth: 1,
    borderColor: COLORS.accentCyan,
    borderRadius: RADIUS.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  badgePrimaryText: {
    color: COLORS.accentCyan,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  statusBadge: {
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusBadgeText: {
    color: '#050B14',
    fontSize: 10,
    fontWeight: '800',
  },
  thumbsScroll: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  thumbWrap: {
    width: 64,
    height: 48,
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbWrapActive: {
    borderColor: COLORS.accentCyan,
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  infoSection: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderCard,
  },
  bikeName: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  bikeModel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingScore: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  reviewCount: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  priceCard: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderCard,
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 16,
  },
  priceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  priceAmountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  fromLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  priceNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.accentRed,
  },
  perDayLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  inrSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  depositPill: {
    backgroundColor: COLORS.bgCardAlt,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
  },
  depositPillText: {
    fontSize: 11,
    color: COLORS.accentCyan,
    fontWeight: '600',
  },
  availabilityBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: RADIUS.md,
    padding: 10,
  },
  availabilityText: {
    color: COLORS.statusAvailable,
    fontSize: 12,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  bookBtn: {
    flex: 1.6,
    backgroundColor: COLORS.accentRed,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: RADIUS.full,
  },
  bookBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  whatsAppBtn: {
    flex: 1,
    backgroundColor: COLORS.whatsappGreen,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: RADIUS.full,
  },
  whatsAppBtnText: {
    color: '#050B14',
    fontSize: 14,
    fontWeight: '700',
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 14,
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  specBox: {
    width: (width - 50) / 2,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderCard,
    borderRadius: RADIUS.md,
    padding: 12,
  },
  specKey: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  specVal: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  featuresList: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderCard,
    borderRadius: RADIUS.md,
    padding: 16,
    gap: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    flex: 1,
  },
  guidelinesList: {
    gap: 10,
  },
  guidelineCard: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderCard,
    borderRadius: RADIUS.md,
    padding: 14,
  },
  guidelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  guidelineTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  guidelineDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  similarScroll: {
    gap: 12,
  },
  similarCard: {
    width: 160,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderCard,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  similarImg: {
    width: '100%',
    height: 100,
  },
  similarContent: {
    padding: 10,
  },
  similarName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  similarPrice: {
    fontSize: 12,
    color: COLORS.accentCyan,
    fontWeight: '600',
  },
  stickyBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.bgCard,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderCard,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === 'ios' ? 18 : 12,
  },
  stickyPriceLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  stickyPriceValue: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.accentRed,
  },
  stickyBookBtn: {
    backgroundColor: COLORS.accentRed,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: RADIUS.full,
  },
  stickyBookBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
