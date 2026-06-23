import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { 
  INITIAL_LISTINGS, 
  INITIAL_BOOKINGS, 
  INITIAL_TRANSACTIONS 
} from './data';
import { Listing, Booking, Transaction } from './types';
import { CartProvider, useCart } from './context/CartContext';
import TopNavBar from './components/TopNavBar';
import LandingPage from './components/LandingPage';
import CartDrawer from './components/CartDrawer';
import LagosCruiseView from './components/LagosCruiseView';
import ExplorerView from './components/ExplorerView';
import ExperienceDetailView from './components/ExperienceDetailView';
import ListingDetailView from './components/ListingDetailView';
import GuestDashboard from './components/GuestDashboard';
import OwnerDashboardView from './components/OwnerDashboardView';
import ListingWizardView from './components/ListingWizardView';
import ConciergeHubView from './components/ConciergeHubView';
import SmartRecommendationsView from './components/SmartRecommendationsView';
import { useDatabase } from './hooks/useDatabase';
import { seedDatabase } from './db';
import UserDashboard from './portals/UserDashboard';
import ServiceProviderDashboard from './portals/ServiceProviderDashboard';
import AdminDashboard from './portals/AdminDashboard';
import SuperAdminDashboard from './portals/SuperAdminDashboard';

function AppContent() {
  // Master Portals: expanded to include all requested roles
  const [portal, setPortal] = useState<'guest' | 'user' | 'service_provider' | 'admin' | 'super_admin'>('guest');
  
  // Tabs management
  const [activeTab, setActiveTab] = useState<
    'home' | 'lagos-cruise' | 'explorer' | 'experience' | 'guest-dashboard' | 'user-dashboard' | 'service-dashboard' | 'admin-dashboard' | 'super-admin-dashboard' | 'overview' | 'listings' | 'calendar' | 'payouts' | 'wizard' | 'concierge-hub' | 'smart-recommendations'
  >('home');
  
  // Search parameters for staying enclaves
  const [searchDestination, setSearchDestination] = useState<string>('');
  
  // Selected single listing for detailed pricing & booking checkout
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  
  // Cart state management
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartCount } = useCart();
  
  // Use database hook for reactivity and persistence
  const { data: listings, addRecord: addListing } = useDatabase('listings');
  const { data: bookings, addRecord: addBooking } = useDatabase('bookings');
  const { data: transactions, addRecord: addTransaction } = useDatabase('transactions');
  
  // Initialize database with seed data if empty
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
  
  // Callback to insert a brand new locked booking from guest client area
  const handleConfirmBooking = (bookingData: {
    listingId: string;
    listingTitle: string;
    checkIn: string;
    checkOut: string;
    totalAmount: number;
    guestName: string;
    guestEmail: string;
  }) => {
    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      listingId: bookingData.listingId,
      listingTitle: bookingData.listingTitle,
      guestId: 'guest-id',
      guestName: bookingData.guestName,
      guestEmail: bookingData.guestEmail,
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      guestsCount: 2,
      status: 'Confirmed' as any,
      totalAmount: bookingData.totalAmount,
      services: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    addBooking(newBooking as any);
  
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
        portal={portal as any}
        setPortal={setPortal as any}
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
 
      {/* Main Layout Views Selector */}
      <main className="flex-grow flex flex-col relative">
        <AnimatePresence mode="wait">
          
          {/* A. If traveler has clicked details on a custom residence */}
          {selectedListing ? (
            <React.Fragment key={`detail-${selectedListing.id}`}>
              <ListingDetailView
                listing={selectedListing}
                onBack={() => setSelectedListing(null)}
                onConfirmBooking={handleConfirmBooking}
              />
            </React.Fragment>
          ) : (
            
            /* B. Standard Multi-Page workspace rendering */
            <div className="flex-grow flex flex-col h-full">
              
               {/* PORTAL GUEST ACCENTS */}
               {activeTab === 'home' && (
                 <React.Fragment key="home">
                   <LandingPage 
                     onSelectListing={(stay) => setSelectedListing(stay)}
                     setActiveTab={setActiveTab}
                   />
                 </React.Fragment>
               )}
 
               {activeTab === 'lagos-cruise' && (
                 <React.Fragment key="lagos-cruise">
                   <LagosCruiseView 
                     listings={listings.filter(l => l.isActive)}
                     onSelectListing={(stay) => setSelectedListing(stay)}
                     setSearchDestination={setSearchDestination}
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
                   <AdminDashboard />
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
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
