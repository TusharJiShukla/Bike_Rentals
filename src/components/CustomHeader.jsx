import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { Compass, User, ChevronLeft, Globe } from 'lucide-react-native';
import { COLORS, RADIUS } from '../theme/colors';
import { useLanguage } from '../i18n/LanguageContext';

export default function CustomHeader({
  navigation,
  showBack = false,
  title,
  user,
  onOpenAuth,
  onOpenWhatsApp,
  onStartBooking,
}) {
  const { language, toggleLanguage, t, isHindi } = useLanguage();
  const { width } = useWindowDimensions();

  // Responsive: remove/hide the brand name in mobile view (< 600px)
  const showBrandName = width >= 600;

  const handleBookPress = () => {
    // Requirement: In navbar, clicking the booking button directly opens the Fleet (Motorbikes) page!
    if (navigation) {
      navigation.navigate('Motorbikes');
    }
  };

  return (
    <View style={styles.headerWrapper}>
      <View style={[styles.headerContainer, width < 600 && styles.headerContainerMobile]}>
        <View style={styles.headerLeft}>
          {showBack ? (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation?.goBack()}
              activeOpacity={0.7}
            >
              <ChevronLeft size={20} color={COLORS.textPrimary} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.brandContainer}
              onPress={() => navigation?.navigate('Home')}
              activeOpacity={0.8}
            >
              <View style={styles.logoIcon}>
                <Compass size={17} color="#FFFFFF" strokeWidth={2.3} />
              </View>
              {showBrandName && (
                <Text style={styles.brandTitle}>{t('nav.brand', 'THE ROAD EAGLE')}</Text>
              )}
            </TouchableOpacity>
          )}

          {showBack && title && (
            <Text style={styles.screenTitle} numberOfLines={1}>
              {title}
            </Text>
          )}
        </View>

        <View style={[styles.headerRight, width < 600 && styles.headerRightMobile]}>
          {/* Quick Book Action - Directly navigates to Fleet (Motorbikes) page */}
          <TouchableOpacity
            style={[styles.headerBookBtn, width < 420 && styles.headerBookBtnSmall]}
            onPress={handleBookPress}
            activeOpacity={0.8}
          >
            <Text style={styles.headerBookBtnText}>{t('nav.bookNow', 'Book Now')}</Text>
          </TouchableOpacity>

          {/* Language Switcher Toggle next to Login */}
          <TouchableOpacity
            style={styles.langToggleBtn}
            onPress={toggleLanguage}
            activeOpacity={0.8}
            accessibilityLabel="Switch Language"
          >
            <Globe size={14} color="#38BDF8" />
            <Text style={styles.langToggleText}>
              {isHindi ? 'English' : 'हिन्दी'}
            </Text>
          </TouchableOpacity>

          {/* User Account Button */}
          <TouchableOpacity
            style={styles.userButton}
            onPress={onOpenAuth}
            activeOpacity={0.8}
          >
            <User size={15} color={COLORS.accentCyan} />
            <Text style={styles.userButtonText} numberOfLines={1}>
              {user ? user.name.split(' ')[0] : t('nav.login', 'Log In')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: COLORS.bgDark,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderCard,
    alignItems: 'center',
    width: '100%',
  },
  headerContainer: {
    height: Platform.OS === 'ios' ? 58 : 62,
    width: '100%',
    maxWidth: 1240,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  headerContainerMobile: {
    paddingHorizontal: 14,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.bgCardAlt,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  screenTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIcon: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(2, 132, 199, 0.25)',
    borderWidth: 1.5,
    borderColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerRightMobile: {
    gap: 7,
  },
  headerBookBtn: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.4)',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 3,
  },
  headerBookBtnSmall: {
    paddingHorizontal: 12,
  },
  headerBookBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  langToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  langToggleText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '700',
  },
  userButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderCard,
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
  },
  userButtonText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    maxWidth: 90,
  },
});
