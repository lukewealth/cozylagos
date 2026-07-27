# Firebase Optimization Guide for CozyLagos

## Current Status
- **Project ID**: cozylagos-90da0
- **Project Number**: 6332475718
- **Auth Domain**: cozylagos-90da0.firebaseapp.com

## 🔧 Optimizations Implemented

### 1. Authentication Persistence
- **Changed**: From `browserLocalPersistence` to `indexedDBLocalPersistence`
- **Benefit**: Better performance and reliability across tabs
- **Fallback**: Automatically falls back to localStorage if IndexedDB is not available

### 2. Firestore Optimization
- **Enabled**: Multi-tab IndexedDB persistence
- **Benefit**: Offline support and faster data access
- **Performance**: Reduces network calls by caching data locally

### 3. Analytics Optimization
- **Added**: Lazy loading with `isSupported()` check
- **Benefit**: Only loads analytics in supported browsers
- **Tracking**: Added `app_initialized` event

### 4. Error Handling
- **Improved**: Detailed error messages for all auth operations
- **User-friendly**: Clear messages for common errors
- **Debugging**: Better console logging for troubleshooting

### 5. Security Rules
- **Firestore**: Role-based access control implemented
- **Storage**: File size and type restrictions
- **Authentication**: Secure user data access patterns

## 🎨 Branding Updates Required

### OAuth Consent Screen (Google Cloud Console)
1. Visit: https://console.cloud.google.com/apis/credentials/consent?project=cozylagos-90da0
2. Update the following:
   - **App name**: CozyLagos
   - **User support email**: support@cozylagos.com
   - **App logo**: Upload your logo
   - **App domain**: https://cozylagos.com
   - **Developer contact email**: admin@cozylagos.com
   - **Privacy policy**: https://cozylagos.com/privacy
   - **Terms of service**: https://cozylagos.com/terms

### Firebase Authentication Providers
1. Visit: https://console.firebase.google.com/project/cozylagos-90da0/authentication/providers
2. For each provider (Google, Apple):
   - Update **Public name** to: CozyLagos
   - Update **Support email** to: support@cozylagos.com

### Authorized Domains
1. Visit: https://console.firebase.google.com/project/cozylagos-90da0/authentication/settings
2. Add authorized domains:
   - cozylagos.com
   - www.cozylagos.com
   - cozylagos-90da0.web.app (default)
   - cozylagos-90da0.firebaseapp.com (default)

## 🚀 Performance Optimizations

### 1. Image Optimization
- Use WebP/AVIF formats where supported
- Implement lazy loading for images
- Use Firebase Storage with CDN

### 2. Firestore Queries
- Always use indexed queries
- Limit result sets with `.limit()`
- Use composite indexes for complex queries

### 3. Caching Strategy
- IndexedDB persistence enabled
- Local storage for user preferences
- Service worker for offline support

### 4. Bundle Size
- Tree-shaking enabled
- Dynamic imports for large components
- Code splitting implemented

## 🔒 Security Best Practices

### 1. Authentication
- Email verification enabled
- Strong password requirements
- Multi-factor authentication (recommended)
- Session management with IndexedDB persistence

### 2. Data Validation
- Client-side validation before API calls
- Server-side validation in Firestore rules
- Input sanitization for user data

### 3. Rate Limiting
- Implement rate limiting on auth endpoints
- Use Firebase Functions for custom rate limiting
- Monitor for suspicious activity

## 📊 Monitoring & Analytics

### 1. Firebase Analytics Events
```javascript
// Track key user actions
analytics.logEvent('login', { method: 'google' });
analytics.logEvent('booking_created', { 
  property_id: 'xxx',
  value: 50000 
});
analytics.logEvent('purchase', { 
  transaction_id: 'xxx',
  value: 100000 
});
```

### 2. Performance Monitoring
- Enable Firebase Performance Monitoring
- Track page load times
- Monitor API response times
- Track error rates

### 3. Crash Reporting
- Enable Firebase Crashlytics
- Track and fix crashes quickly
- Monitor app stability

## 🔄 Deployment Checklist

### Before Deploy
- [ ] Run `npm run build` - ensure no errors
- [ ] Run `npm run lint` - fix all linting issues
- [ ] Run `npm run test:run` - all tests passing
- [ ] Update Firebase rules if changed
- [ ] Check bundle size

### Deploy Commands
```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Storage rules
firebase deploy --only storage

# Deploy Hosting
firebase deploy --only hosting

# Deploy all
firebase deploy
```

### After Deploy
- [ ] Test authentication flow
- [ ] Verify Firestore access
- [ ] Check storage uploads
- [ ] Monitor analytics events
- [ ] Check error logs

## 📱 Mobile Optimization

### 1. PWA Support
- Add manifest.json
- Implement service worker
- Enable offline mode

### 2. Touch Interactions
- Optimize button sizes (min 44x44px)
- Add haptic feedback
- Smooth scrolling

### 3. Performance
- Lazy load images
- Optimize bundle size
- Use CDN for assets

## 🎯 Next Steps

1. **Update Branding**: Follow the branding updates section above
2. **Deploy Rules**: Run `firebase deploy --only firestore:rules,storage`
3. **Test Auth**: Verify Google and Apple login work correctly
4. **Monitor**: Set up Firebase Performance Monitoring
5. **Optimize**: Continue optimizing based on analytics data

## 📞 Support

For Firebase-related issues:
- Firebase Documentation: https://firebase.google.com/docs
- Firebase Support: https://firebase.google.com/support
- Stack Overflow: Tag questions with `firebase`

For CozyLagos-specific issues:
- Check console logs for errors
- Review Firebase Console for configuration
- Verify security rules are deployed
