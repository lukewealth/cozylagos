import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { 
  INITIAL_LISTINGS, 
  INITIAL_BOOKINGS, 
  INITIAL_TRANSACTIONS 
} from './data';
import { Listing, Booking, Transaction } from './types';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider, useAuth } from './auth';
import TopNavBar from './components/TopNavBar';
import LandingPage from './components/LandingPage';
import CartDrawer from './components/CartDrawer';
import ExplorerView from './components/ExplorerView';
import ExperienceDetailView from './components/ExperienceDetailView';
import ListingDetailView from './components/ListingDetailView';
import GuestDashboard from './components/GuestDashboard';
import OwnerDashboardView from './components/OwnerDashboardView';
import ListingWizardView from './components/ListingWizardView';
import ConciergeHubView from './components/ConciergeHubView';
import SmartRecommendationsView from './components/SmartRecommendationsView';
import ServiceBundlesView from './components/ServiceBundlesView';
import WhatsAppConcierge from './components/WhatsAppConcierge';
import { useDatabase } from './hooks/useDatabase';
import { seedDatabase, getListingsWithFallback, syncToLocalStorage } from './db';
import UserDashboard from './portals/UserDashboard';
import ServiceProviderDashboard from './portals/ServiceProviderDashboard';
import AdminDashboard from './portals/AdminDashboard';
import SuperAdminDashboard from './portals/SuperAdminDashboard';

function AppContent() {
  const { currentUser, isAuthenticated } = useAuth();

  // Tabs management
  const [activeTab, setActiveTab] = useState<
    'home' | 'explorer' | 'experience' | 'bundles' | 'guest-dashboard' | 'user-dashboard' | 'service-dashboard' | 'admin-dashboard' | 'super-admin-dashboard' | 'overview' | 'listings' | 'calendar' | 'payouts' | 'wizard' | 'concierge-hub' | 'smart-recommendations'
  >('home');
  
  // Search parameters for staying enclaves
  const [searchDestination, setSearchDestination] = useState<string>('');
  
  // Selected single listing for detailed pricing & booking checkout
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  
  // Booking state for WhatsApp integration
  const [bookingContext, setBookingContext] = useState<{
    listing?: Listing;
    checkIn?: string;
    checkOut?: string;
    guests?: number;
    totalAmount?: number;
    bookingId?: string;
    nightlyTotal?: number;
    serviceFee?: number;
    tax?: number;
    grandTotal?: number;
    includeVipDriver?: boolean;
    includeChef?: boolean;
    vipDriverTotal?: number;
    chefTotal?: number;
    cleaningFee?: number;
    totalNights?: number;
  }>({});
  
  // Cart state management
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartCount } = useCart();
  
  // Use database hook for reactivity and persistence
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
  
  // Callback to insert a newly created listing from onboarding wizard
  const handlePublishListing = (newListing: Listing) => {
    addListing(newListing as any);
    setActiveTab('listings'); // return to owner's property list
  };
  
  // Callback to toggle listings status (Active live / Hidden)
  const handleUpdateListingStatus = (id: string, active: boolean) => {
    const listing = listings.find(l => l.id === id);
    if (listing) {
      addListing({ ...listing, isActive: active } as any);
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
  };

  // Callback to update a listing (Fullstack edit)
  const handleUpdateListing = (updatedListing: Listing) => {
    addListing(updatedListing as any);
  };
  
  // Callback to insert a brand new locked booking from guest client area
  const handleConfirmBooking = (bookingData: {
    listingId: string;
    listingTitle: string;
    checkIn: string;
    checkOut: string;
    totalAmount: number;
    guestName: string;
    guestEmail: string;
    guestsCount?: number;
    nightlyTotal?: number;
    serviceFee?: number;
    tax?: number;
    grandTotal?: number;
    includeVipDriver?: boolean;
    includeChef?: boolean;
    vipDriverTotal?: number;
    chefTotal?: number;
    cleaningFee?: number;
    totalNights?: number;
  }) => {
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
  
    // Insert positive referral transaction in owners payments ledger
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      date: bookingData.checkIn.replace(/-/g, '.'),
      reference: `BOOKING_REVENUE_${Math.round(Math.random() * 90000 + 10000)}`,
      description: `Stay: ${bookingData.listingTitle}`,
      type: 'booking_revenue' as any,
      amount: Math.round(bookingData.totalAmount * 0.85), // Owner gets 85% profit cut
      status: 'processed' as any,
      userId: 'system',
      createdAt: new Date().toISOString()
    };
  
    addTransaction(newTx as any);
  };
  
  return (
    <div className="min-h-screen bg-parchment text-charcoal flex flex-col selection:bg-charcoal selection:text-parchment">
      
      {/* Dynamic Unified Header Navigation */}
      <TopNavBar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setSelectedListing(null); // clear single listing details
          setActiveTab(tab);
        }}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />
  
      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* WhatsApp Concierge - Global Floating Button */}
      <WhatsAppConcierge {...bookingContext} />
  
      {/* Main Layout Views Selector */}
      <main className="flex-grow flex flex-col relative">
        <AnimatePresence mode="wait">
          
          {/* A. If traveler has clicked details on a custom residence */}
          {selectedListing ? (
            <React.Fragment key={`detail-${selectedListing.id}`}>
              <ListingDetailView
                listing={selectedListing}
                onBack={() => { setSelectedListing(null); setBookingContext({}); }}
                onConfirmBooking={handleConfirmBooking}
                onUpdateBookingContext={setBookingContext}
              />
            </React.Fragment>
          ) : (
            
            /* B. Standard Multi-Page workspace rendering */
            <div className="flex-grow flex flex-col h-full">
              
               {/* PORTAL GUEST ACCENTS */}
               {activeTab === 'home' && (
                 <React.Fragment key="home">
                   <LandingPage 
                     listings={listings}
                     onSelectListing={(stay) => setSelectedListing(stay)}
                     setActiveTab={setActiveTab}
                   />
                 </React.Fragment>
               )}
  
               {activeTab === 'explorer' && (
                 <React.Fragment key="explorer">
                   <ExplorerView 
                     listings={listings.filter(l => l.isActive)}
                     onSelectListing={(stay) => setSelectedListing(stay)}
                     searchDestination={searchDestination}
                     setSearchDestination={setSearchDestination}
                   />
                 </React.Fragment>
               )}
  
               {activeTab === 'experience' && (
                 <React.Fragment key="experience">
                   <ExperienceDetailView
                     onBackToHome={() => setActiveTab('home')}
                   />
                 </React.Fragment>
               )}

               {activeTab === 'bundles' && (
                 <React.Fragment key="bundles">
                   <ServiceBundlesView />
                 </React.Fragment>
               )}
  
               {activeTab === 'concierge-hub' && (
                 <React.Fragment key="concierge-hub">
                   <ConciergeHubView />
                 </React.Fragment>
               )}
  
               {activeTab === 'smart-recommendations' && (
                 <React.Fragment key="smart-recommendations">
                   <SmartRecommendationsView />
                 </React.Fragment>
               )}
  
               {activeTab === 'guest-dashboard' && (
                 <React.Fragment key="guest-dashboard">
                   <GuestDashboard />
                 </React.Fragment>
               )}
  
               {activeTab === 'user-dashboard' && (
                 <React.Fragment key="user-dashboard">
                   <UserDashboard />
                 </React.Fragment>
               )}
  
               {activeTab === 'service-dashboard' && (
                 <React.Fragment key="service-dashboard">
                   <ServiceProviderDashboard />
                 </React.Fragment>
               )}
  
               {activeTab === 'admin-dashboard' && (
                 <React.Fragment key="admin-dashboard">
                   <AdminDashboard 
                     listings={listings}
                     onToggleStatus={handleToggleStatus}
                     onDeleteListing={handleDeleteListing}
                   />
                 </React.Fragment>
               )}
  
               {activeTab === 'super-admin-dashboard' && (
                 <React.Fragment key="super-admin-dashboard">
                   <SuperAdminDashboard />
                 </React.Fragment>
               )}
  
               {/* PORTAL HOST/SERVICE PROVIDER ACCENTS */}
               {(activeTab === 'overview' || activeTab === 'listings' || activeTab === 'calendar' || activeTab === 'payouts') && (
                 <React.Fragment key="host-dashboard">
                   <OwnerDashboardView 
                     listings={listings}
                     bookings={bookings}
                     transactions={transactions}
                     onAddListingClick={() => setActiveTab('wizard')}
                     onUpdateListingsStatus={handleUpdateListingStatus}
                     onUpdateListing={handleUpdateListing}
                   />
                 </React.Fragment>
               )}
  
               {activeTab === 'wizard' && (
                 <React.Fragment key="wizard">
                   <ListingWizardView 
                     onPublishListing={handlePublishListing}
                     onCancel={() => setActiveTab('listings')}
                   />
                 </React.Fragment>
               )}
              </div>
           )}
        </AnimatePresence>
      </main>
  
      {/* Footer copyright segment */}
      <footer className="h-16 border-t border-charcoal/5 flex items-center justify-between px-6 md:px-12 xl:px-20 text-[9px] text-charcoal/40 uppercase tracking-[0.2em] relative z-20 bg-parchment shrink-0">
        <div>
          &copy; {new Date().getFullYear()} Cozy Lagos Ltd &bull; Victoria Island Suite 416
        </div>
        
        <div className="hidden sm:flex items-center gap-6 font-semibold">
          <span className="text-gold-dark">★ Nigeria Luxury Insulated</span>
          <span className="w-1.5 h-1.5 rounded-full bg-charcoal/20" />
          <a href="#privacy" className="hover:text-charcoal transition-colors">Safety Dossier</a>
          <a href="#terms" className="hover:text-charcoal transition-colors">Guest Protocol</a>
        </div>
      </footer>
    </div>
  );
}
  
export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
