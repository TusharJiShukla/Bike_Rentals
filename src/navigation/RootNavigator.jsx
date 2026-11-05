import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  Compass,
  Bike,
  HelpCircle,
  Users,
  PhoneCall,
} from 'lucide-react-native';

import HomeScreen from '../screens/HomeScreen';
import MotorbikesScreen from '../screens/MotorbikesScreen';
import HowItWorksScreen from '../screens/HowItWorksScreen';
import AboutUsScreen from '../screens/AboutUsScreen';
import ContactScreen from '../screens/ContactScreen';
import BikeDetailsScreen from '../screens/BikeDetailsScreen';
import BookingScreen from '../screens/BookingScreen';
import CustomHeader from '../components/CustomHeader';

import { COLORS } from '../theme/colors';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function BottomTabNavigator({
  user,
  onOpenAuth,
  onOpenWhatsApp,
  onSelectBike,
  onStartBooking,
  onOpenBookModal,
  onShowToast,
}) {
  return (
    <Tab.Navigator
      screenOptions={({ navigation, route }) => ({
        header: () => (
          <CustomHeader
            navigation={navigation}
            user={user}
            onOpenAuth={onOpenAuth}
            onOpenWhatsApp={() => onOpenWhatsApp()}
            onStartBooking={() => onStartBooking && onStartBooking()}
          />
        ),
        tabBarStyle: {
          backgroundColor: COLORS.bgDark,
          borderTopColor: COLORS.borderCard,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 86 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: COLORS.accentCyan,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
      })}
    >
      <Tab.Screen
        name="Home"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <Compass size={22} color={color} />,
        }}
      >
        {(props) => (
          <HomeScreen
            {...props}
            onSelectBike={onSelectBike}
            onStartBooking={onStartBooking}
            onOpenWhatsApp={onOpenWhatsApp}
            onOpenBookModal={onOpenBookModal}
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Motorbikes"
        options={{
          tabBarLabel: 'Fleet',
          tabBarIcon: ({ color, size }) => <Bike size={22} color={color} />,
        }}
      >
        {(props) => (
          <MotorbikesScreen
            {...props}
            onSelectBike={onSelectBike}
            onStartBooking={onStartBooking}
            onOpenBookModal={onOpenBookModal}
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="HowItWorks"
        options={{
          tabBarLabel: 'Guide',
          tabBarIcon: ({ color, size }) => <HelpCircle size={22} color={color} />,
        }}
        component={HowItWorksScreen}
      />

      <Tab.Screen
        name="AboutUs"
        options={{
          tabBarLabel: 'About',
          tabBarIcon: ({ color, size }) => <Users size={22} color={color} />,
        }}
        component={AboutUsScreen}
      />

      <Tab.Screen
        name="Contact"
        options={{
          tabBarLabel: 'Contact',
          tabBarIcon: ({ color, size }) => <PhoneCall size={22} color={color} />,
        }}
      >
        {(props) => (
          <ContactScreen
            {...props}
            onShowToast={onShowToast}
            onOpenWhatsApp={onOpenWhatsApp}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function RootNavigator({
  user,
  onOpenAuth,
  onOpenWhatsApp,
  onOpenQuote,
  onSelectBike,
  onStartBooking,
  onOpenBookModal,
  onShowToast,
}) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: COLORS.bgDark },
      }}
    >
      <Stack.Screen name="MainTabs">
        {(props) => (
          <BottomTabNavigator
            {...props}
            user={user}
            onOpenAuth={onOpenAuth}
            onOpenWhatsApp={onOpenWhatsApp}
            onSelectBike={onSelectBike}
            onStartBooking={onStartBooking}
            onOpenBookModal={onOpenBookModal}
            onShowToast={onShowToast}
          />
        )}
      </Stack.Screen>

      <Stack.Screen
        name="BikeDetails"
        options={({ navigation, route }) => ({
          headerShown: true,
          header: () => (
            <CustomHeader
              navigation={navigation}
              showBack
              title={route?.params?.bike?.name || 'Bike Details'}
              user={user}
              onOpenAuth={onOpenAuth}
              onOpenWhatsApp={() => onOpenWhatsApp(route?.params?.bike)}
            />
          ),
        })}
      >
        {(props) => (
          <BikeDetailsScreen
            {...props}
            onStartBooking={onStartBooking}
            onOpenWhatsApp={onOpenWhatsApp}
            onOpenBookModal={onOpenBookModal}
          />
        )}
      </Stack.Screen>

      <Stack.Screen
        name="Booking"
        options={({ navigation }) => ({
          headerShown: true,
          header: () => (
            <CustomHeader
              navigation={navigation}
              showBack
              title="Reservation"
              user={user}
              onOpenAuth={onOpenAuth}
              onOpenWhatsApp={() => onOpenWhatsApp()}
            />
          ),
        })}
      >
        {(props) => (
          <BookingScreen
            {...props}
            user={user}
            onOpenAuth={onOpenAuth}
            onOpenQuote={onOpenQuote}
            onShowToast={onShowToast}
            onOpenWhatsApp={onOpenWhatsApp}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
