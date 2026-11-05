import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Star, Zap, Fuel, Cog, ArrowRight } from 'lucide-react-native';
import { COLORS, RADIUS, SHADOWS } from '../theme/colors';

export default function BikeCard({
  bike,
  onSelectBike,
  onOpenBookModal,
  onStartBooking,
  style,
  compact = false,
}) {
  const isLimited = bike.statusBadge === 'LIMITED';

  return (
    <View style={[styles.card, SHADOWS.card, compact && styles.cardCompact, style]}>
      {/* Top Image Container */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => onSelectBike(bike)}
        style={[styles.imageContainer, compact && styles.imageContainerCompact]}
      >
        <Image
          source={bike.imageSource}
          style={styles.bikeImage}
          resizeMode="cover"
        />

        {/* Dark elegant gradient vignette */}
        <View style={styles.imageOverlay} />

        {/* Top Floating Badges */}
        <View style={styles.badgeRow}>
          {bike.badge ? (
            <View style={[styles.primaryBadge, compact && styles.badgeCompact]}>
              <Text style={[styles.primaryBadgeText, compact && styles.badgeTextCompact]}>
                {bike.badge}
              </Text>
            </View>
          ) : <View />}

          <View
            style={[
              styles.statusBadge,
              compact && styles.badgeCompact,
              { backgroundColor: isLimited ? 'rgba(245, 158, 11, 0.9)' : 'rgba(16, 185, 129, 0.9)' },
            ]}
          >
            <Text style={[styles.statusBadgeText, compact && styles.badgeTextCompact]}>
              {bike.statusBadge || 'AVAILABLE'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Card Content */}
      <View style={[styles.content, compact && styles.contentCompact]}>
        <View style={styles.titleRow}>
          <Text style={[styles.bikeName, compact && styles.bikeNameCompact]} numberOfLines={1}>
            {bike.name}
          </Text>
        </View>

        <Text style={[styles.bikeModel, compact && styles.bikeModelCompact]} numberOfLines={1}>
          {bike.model}
        </Text>

        {/* Rating and Reviews */}
        <View style={[styles.ratingRow, compact && styles.ratingRowCompact]}>
          <View style={styles.stars}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={compact ? 12 : 13}
                color={COLORS.accentCyan}
                fill={COLORS.accentCyan}
              />
            ))}
          </View>
          <Text style={[styles.ratingNumber, compact && styles.ratingNumberCompact]}>
            {bike.rating}
          </Text>
          <Text style={[styles.reviewCount, compact && styles.reviewCountCompact]}>
            ({bike.reviewsCount})
          </Text>
        </View>

        {/* Feature Spec Pills */}
        <View style={[styles.specsRow, compact && styles.specsRowCompact]}>
          {bike.specs?.displacement ? (
            <View style={[styles.specPill, compact && styles.specPillCompact]}>
              <Zap size={compact ? 10 : 12} color={COLORS.accentCyan} />
              <Text style={[styles.specText, compact && styles.specTextCompact]}>
                {bike.specs.displacement}
              </Text>
            </View>
          ) : null}

          {bike.specs?.transmission ? (
            <View style={[styles.specPill, compact && styles.specPillCompact]}>
              <Cog size={compact ? 10 : 12} color={COLORS.accentCyan} />
              <Text style={[styles.specText, compact && styles.specTextCompact]}>
                {bike.specs.transmission.includes('Auto') ? 'Auto' : 'Manual'}
              </Text>
            </View>
          ) : null}

          {bike.specs?.mileage ? (
            <View style={[styles.specPill, compact && styles.specPillCompact]}>
              <Fuel size={compact ? 10 : 12} color={COLORS.accentCyan} />
              <Text style={[styles.specText, compact && styles.specTextCompact]}>
                {bike.specs.mileage}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Pricing & Booking CTA Footer */}
        <View style={[styles.footerRow, compact && styles.footerRowCompact]}>
          <View style={[styles.priceBlock, compact && styles.priceBlockCompact]}>
            <View style={styles.priceRow}>
              <Text style={[styles.fromLabel, compact && styles.fromLabelCompact]}>from </Text>
              <Text style={[styles.priceValue, compact && styles.priceValueCompact]}>
                ₹{bike.pricePerDay.toLocaleString('en-IN')}
              </Text>
              <Text style={[styles.perDayLabel, compact && styles.perDayLabelCompact]}>/day</Text>
            </View>
            <Text style={[styles.inrSubtext, compact && styles.inrSubtextCompact]}>
              Deposit ₹{bike.deposit.toLocaleString('en-IN')}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.bookBtn, compact && styles.bookBtnCompact]}
            onPress={() => {
              if (onStartBooking) {
                onStartBooking(bike);
              } else if (onSelectBike) {
                onSelectBike(bike);
              }
            }}
            activeOpacity={0.8}
          >
            <Text style={[styles.bookBtnText, compact && styles.bookBtnTextCompact]}>
              Book
            </Text>
            <ArrowRight size={compact ? 12 : 14} color="#FFFFFF" strokeWidth={2.2} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.borderCard,
    marginBottom: 20,
    overflow: 'hidden',
  },
  cardCompact: {
    borderRadius: RADIUS.md,
  },
  imageContainer: {
    height: 180,
    width: '100%',
    position: 'relative',
    backgroundColor: COLORS.bgCardAlt,
  },
  imageContainerCompact: {
    height: 140,
  },
  bikeImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(7, 14, 27, 0.15)',
  },
  badgeRow: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },
  badgeCompact: {
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  badgeTextCompact: {
    fontSize: 9,
  },
  primaryBadge: {
    backgroundColor: 'rgba(7, 14, 27, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.6)',
    borderRadius: RADIUS.full,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  primaryBadgeText: {
    color: '#38BDF8',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  statusBadge: {
    borderRadius: RADIUS.full,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  statusBadgeText: {
    color: '#050B14',
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  content: {
    padding: 16,
  },
  contentCompact: {
    padding: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  bikeName: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  bikeNameCompact: {
    fontSize: 14,
  },
  bikeModel: {
    fontSize: 12.5,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  bikeModelCompact: {
    fontSize: 11,
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
  },
  ratingRowCompact: {
    marginBottom: 8,
    gap: 4,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingNumber: {
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  ratingNumberCompact: {
    fontSize: 11,
  },
  reviewCount: {
    fontSize: 11.5,
    color: COLORS.textMuted,
  },
  reviewCountCompact: {
    fontSize: 10,
  },
  specsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14,
    flexWrap: 'wrap',
  },
  specsRowCompact: {
    gap: 4,
    marginBottom: 10,
  },
  specPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.bgCardAlt,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  specPillCompact: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 3,
  },
  specText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  specTextCompact: {
    fontSize: 9.5,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: 12,
  },
  footerRowCompact: {
    paddingTop: 8,
  },
  priceBlock: {},
  priceBlockCompact: {},
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  fromLabel: {
    fontSize: 11.5,
    color: COLORS.textSecondary,
  },
  fromLabelCompact: {
    fontSize: 10,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#38BDF8', // Luxury high-contrast cyan/sky price
  },
  priceValueCompact: {
    fontSize: 16,
  },
  perDayLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  perDayLabelCompact: {
    fontSize: 9.5,
  },
  inrSubtext: {
    fontSize: 10.5,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  inrSubtextCompact: {
    fontSize: 9.5,
    marginTop: 1,
  },
  // Sober, elegant sapphire blue gradient button (no neon bright red)
  bookBtn: {
    backgroundColor: '#0284C7',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.4)',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 3,
  },
  bookBtnCompact: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },
  bookBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  bookBtnTextCompact: {
    fontSize: 11.5,
  },
});
