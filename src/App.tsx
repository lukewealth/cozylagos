import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { 
  INITIAL_LISTINGS, 
  INITIAL_BOOKINGS, 
  INITIAL_TRANSACTIONS 
} from './data';
import { Listing, Booking, Transaction } from './types';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider, useAuth } from './auth';
import { ToastProvider, useToast } from './components/Toast';
import TopNavBar from './components/TopNavBar';
import LandingPage from './components/LandingPage';
import CartDrawer from './components/CartDrawer';
import ExplorerView from './components/ExplorerView';
import ExploreLagosView from './components/ExploreLagosView';
import VIPServicesView from './components/VIPServicesView';
import ListingDetailView from './components/ListingDetailView';
import CheckoutView from './components/CheckoutView';
import GuestDashboard from './components/GuestDashboard';
import OwnerDashboardView from './components/OwnerDashboardView';
import ListingWizardView from './components/ListingWizardView';
import ConciergeHubView from './components/ConciergeHubView';
import SmartRecommendationsView from './components/SmartRecommendationsView';
import ServiceBundlesView from './components/ServiceBundlesView';
import SignatureExperiencesView from './components/SignatureExperiencesView';
import BusinessLagosView from './components/BusinessLagosView';
import EventsView from './components/EventsView';
import FavoritesView from './components/FavoritesView';
import WhatsAppConcierge from './components/WhatsAppConcierge';
import CookiesAlert from './components/PrivacyPolicy';
import { useDatabase } from './hooks/useDatabase';
import { seedDatabase, getListingsWithFallback, syncToLocalStorage } from './db';
import UserDashboard from './portals/UserDashboard';
import ServiceProviderDashboard from './portals/ServiceProviderDashboard';
import AdminDashboard from './portals/AdminDashboard';
import SuperAdminDashboard from './portals/SuperAdminDashboard';

function AppContent() {
  const { currentUser, isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState<
    'home' | 'explorer' | 'explore-lagos' | 'bundles' | 'signature-experiences' | 'vip-services' | 'business-lagos' | 'events' | 'favorites' | 'guest-dashboard' | 'user-dashboard' | 'service-dashboard' | 'admin-dashboard' | 'super-admin-dashboard' | 'overview' | 'listings' | 'calendar' | 'payouts' | 'wizard' | 'concierge-hub' | 'smart-recommendations' | 'listing-detail'
  >('home');
  
  const [searchDestination, setSearchDestination] = useState<string>('');
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [bookingContext, setBookingContext] = useState<{}>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { cartCount, cart, serviceCart, experienceCart, getGrandTotal, getTotalAmount, getServiceTotal, getExperienceTotal, getTotalItemCount } = useCart();
  const totalCartCount = getTotalItemCount();
  const [showCookies, setShowCookies] = useState(() => {
    return !localStorage.getItem('cozy_lagos_cookies_accepted');
  });
  
  const { data: listings, addRecord: addListing, removeRecord: removeListing } = useDatabase('listings');
  const { data: bookings, addRecord: addBooking } = useDatabase('bookings');
  const { data: transactions, addRecord: addTransaction } = useDatabase('transactions');
  
  useEffect(() => {
    const initDb = async () => {
      await seedDatabase({
        listings: INITIAL_LISTINGS,
        bookings: INITIAL_BOOKINGS,
        transactions: INITIAL_TRANSACTIONS,
        users: [],
        services: [],
        experiences: [],
        chatMessages: []
      });
      await getListingsWithFallback(INITIAL_LISTINGS);
      await syncToLocalStorage();
    };
    initDb();
  }, []);

  const handleTabChange = (tab: any) => {
    setSelectedListing(null);
    setActiveTab(tab);
  };
  
  const handlePublishListing = (newListing: Listing) => {
    addListing(newListing as any);
    setActiveTab('listings');
    addToast({ type: 'success', title: 'Listing Published!', message: 'Your property is now live.' });
  };
  
  const handleUpdateListingStatus = (id: string, active: boolean) => {
    const listing = listings.find(l => l.id === id);
    if (listing) {
      addListing({ ...listing, isActive: active } as any);
      addToast({ type: 'info', title: active ? 'Listing Active' : 'Listing Hidden' });
    }
  };

  const handleToggleStatus = (id: string) => {
    const listing = listings.find(l => l.id === id);
    if (listing) {
      handleUpdateListingStatus(id, !listing.isActive);
    }
  };

  const handleDeleteListing = (id: string) => {
    removeListing(id);
    addToast({ type: 'warning', title: 'Listing Removed' });
  };

  const handleUpdateListing = (updatedListing: Listing) => {
    addListing(updatedListing as any);
    addToast({ type: 'success', title: 'Listing Updated' });
  };
  
  const handleConfirmBooking = (bookingData: any) => {
    const bookingId = `booking-${Date.now()}`;
    const newBooking: Booking = {
      id: bookingId,
      listingId: bookingData.listingId,
      listingTitle: bookingData.listingTitle,
      guestId: 'guest-id',
      guestName: bookingData.guestName,
      guestEmail: bookingData.guestEmail,
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      guestsCount: bookingData.guestsCount || 2,
      status: 'Confirmed' as any,
      totalAmount: bookingData.totalAmount,
      services: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    addBooking(newBooking as any);
    setBookingContext({
      listing: selectedListing || undefined,
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      guests: bookingData.guestsCount || 2,
      totalAmount: bookingData.totalAmount,
      bookingId,
      nightlyTotal: bookingData.nightlyTotal,
      serviceFee: bookingData.serviceFee,
      tax: bookingData.tax,
      grandTotal: bookingData.grandTotal,
      includeVipDriver: bookingData.includeVipDriver,
      includeChef: bookingData.includeChef,
      vipDriverTotal: bookingData.vipDriverTotal,
      chefTotal: bookingData.chefTotal,
      cleaningFee: bookingData.cleaningFee,
      totalNights: bookingData.totalNights,
    });

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      date: bookingData.checkIn.replace(/-/g, '.'),
      reference: `BOOKING_REVENUE_${Math.round(Math.random() * 90000 + 10000)}`,
      description: `Stay: ${bookingData.listingTitle}`,
      type: 'booking_revenue' as any,
      amount: Math.round(bookingData.totalAmount * 0.85),
      status: 'processed' as any,
      userId: 'system',
      createdAt: new Date().toISOString()
    };
  
    addTransaction(newTx as any);
    addToast({ type: 'success', title: 'Booking Confirmed!', message: 'Check WhatsApp for admin confirmation.' });
  };

  const handleAcceptCookies = () => {
    localStorage.setItem('cozy_lagos_cookies_accepted', 'true');
    setShowCookies(false);
  };

  const handleDeclineCookies = () => {
    setShowCookies(false);
  };
  
  return (
    <div className="min-h-screen bg-parchment text-charcoal flex flex-col selection:bg-charcoal selection:text-parchment">
      <TopNavBar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />
  
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onCheckout={() => setIsCheckoutOpen(true)} />
      <WhatsAppConcierge {...bookingContext} />
  
      <main className="flex-grow flex flex-col relative">
        <AnimatePresence mode="wait">
          {isCheckoutOpen ? (
            <motion.div
              key="checkout"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <CheckoutView
                cart={cart}
                serviceCart={serviceCart}
                experienceCart={experienceCart}
                listingTotal={getTotalAmount()}
                serviceTotal={getServiceTotal()}
                experienceTotal={getExperienceTotal()}
                grandTotal={getGrandTotal()}
                onBack={() => setIsCheckoutOpen(false)}
                onConfirm={(bookingData) => {
                  handleConfirmBooking(bookingData);
                  setIsCheckoutOpen(false);
                }}
              />
            </motion.div>
          ) : selectedListing ? (
            <motion.div
              key={`detail-${selectedListing.id}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <ListingDetailView
                listing={selectedListing}
                onBack={() => { setSelectedListing(null); setBookingContext({}); }}
                onConfirmBooking={handleConfirmBooking}
                onUpdateBookingContext={setBookingContext}
              />
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="flex-grow flex flex-col h-full"
            >
              {activeTab === 'home' && (
                <LandingPage listings={listings} onSelectListing={(stay) => setSelectedListing(stay)} setActiveTab={setActiveTab} />
              )}
              {activeTab === 'explorer' && (
                <ExplorerView listings={listings.filter(l => l.isActive)} onSelectListing={(stay) => setSelectedListing(stay)} searchDestination={searchDestination} setSearchDestination={setSearchDestination} />
              )}
              {activeTab === 'explore-lagos' && (
                <ExploreLagosView onNavigateBundles={() => setActiveTab('bundles')} />
              )}
              {activeTab === 'bundles' && <ServiceBundlesView />}
              {activeTab === 'signature-experiences' && <SignatureExperiencesView />}
              {activeTab === 'vip-services' && <VIPServicesView />}
              {activeTab === 'business-lagos' && <BusinessLagosView />}
              {activeTab === 'events' && <EventsView />}
              {activeTab === 'favorites' && <FavoritesView onNavigate={(tab, data) => setActiveTab(tab as any)} />}
              {activeTab === 'concierge-hub' && <ConciergeHubView />}
              {activeTab === 'smart-recommendations' && <SmartRecommendationsView />}
              {activeTab === 'guest-dashboard' && <GuestDashboard />}
              {activeTab === 'user-dashboard' && <UserDashboard />}
              {activeTab === 'service-dashboard' && <ServiceProviderDashboard />}
              {activeTab === 'admin-dashboard' && (
                <AdminDashboard listings={listings} onToggleStatus={handleToggleStatus} onDeleteListing={handleDeleteListing} />
              )}
              {activeTab === 'super-admin-dashboard' && <SuperAdminDashboard />}
              {(activeTab === 'overview' || activeTab === 'listings' || activeTab === 'calendar' || activeTab === 'payouts') && (
                <OwnerDashboardView listings={listings} bookings={bookings} transactions={transactions} onAddListingClick={() => setActiveTab('wizard')} onUpdateListingsStatus={handleUpdateListingStatus} onUpdateListing={handleUpdateListing} />
              )}
              {activeTab === 'wizard' && (
                <ListingWizardView onPublishListing={handlePublishListing} onCancel={() => setActiveTab('listings')} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
  
      <footer className="h-16 border-t border-charcoal/5 flex items-center justify-between px-6 md:px-12 xl:px-20 text-[9px] text-charcoal/40 uppercase tracking-[0.2em] relative z-20 bg-parchment shrink-0">
        <div>&copy; {new Date().getFullYear()} Cozy Lagos Ltd &bull; Victoria Island Suite 416</div>
        <div className="hidden sm:flex items-center gap-6 font-semibold">
          <span className="text-gold-dark">★ Nigeria Luxury Insulated</span>
          <span className="w-1.5 h-1.5 rounded-full bg-charcoal/20" />
          <a href="#privacy" className="hover:text-charcoal transition-colors">Safety Dossier</a>
          <a href="#terms" className="hover:text-charcoal transition-colors">Guest Protocol</a>
        </div>
      </footer>

      <AnimatePresence>
        {showCookies && (
          <CookiesAlert onAccept={handleAcceptCookies} onDecline={handleDeclineCookies} onPreferences={handleAcceptCookies} />
        )}
      </AnimatePresence>
    </div>
  );
}
  
export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}
