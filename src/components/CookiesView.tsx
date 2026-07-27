import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Cookie, Shield, Eye, Settings, CheckCircle, ArrowLeft,
  Info, AlertCircle, RefreshCw
} from 'lucide-react';

interface CookiesViewProps {
  onBack?: () => void;
}

export default function CookiesView({ onBack }: CookiesViewProps) {
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: true,
    marketing: false,
    preferences: true,
  });

  const handleToggle = (key: keyof typeof preferences) => {
    if (key === 'essential') return;
    setPreferences({ ...preferences, [key]: !preferences[key] });
  };

  const handleSave = () => {
    localStorage.setItem('cozy_lagos_cookie_preferences', JSON.stringify(preferences));
    alert('Cookie preferences saved successfully!');
  };

  return (
    <div className="flex-grow flex flex-col bg-parchment">
      <div className="relative bg-charcoal overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-dark/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-dark/5 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 xl:px-20 py-12 sm:py-16">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-parchment/60 hover:text-gold text-sm mb-6 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </button>
          )}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center border border-gold/20">
                <Cookie className="w-6 h-6 text-gold" />
              </div>
              <div>
                <p className="text-[10px] text-gold-light tracking-[0.3em] uppercase font-bold">Cookie Policy</p>
                <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-parchment font-bold">Cookies & Tracking</h1>
              </div>
            </div>
            <p className="text-sm text-parchment/60 max-w-2xl leading-relaxed mt-4">
              This policy explains how Cozy Lagos uses cookies and similar technologies to enhance your browsing experience.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 xl:px-20 py-10 sm:py-14 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-8">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl border border-charcoal/5 p-6 sm:p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                  <Info className="w-5 h-5 text-gold-dark" />
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">What Are Cookies?</h2>
              </div>
              <div className="space-y-4 text-sm text-charcoal/70 leading-relaxed">
                <p>
                  Cookies are small text files that are stored on your device when you visit a website. They help websites remember your preferences and improve your browsing experience.
                </p>
                <p>
                  We use cookies and similar tracking technologies (like web beacons and pixel tags) to:
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-gold-dark shrink-0 mt-0.5" />
                    <span>Keep you logged in and remember your preferences</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-gold-dark shrink-0 mt-0.5" />
                    <span>Understand how you use our website</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-gold-dark shrink-0 mt-0.5" />
                    <span>Improve our services and user experience</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-gold-dark shrink-0 mt-0.5" />
                    <span>Show relevant content and offers</span>
                  </li>
                </ul>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl border border-charcoal/5 p-6 sm:p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                  <Eye className="w-5 h-5 text-gold-dark" />
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">Types of Cookies We Use</h2>
              </div>
              <div className="space-y-4">
                <div className="border border-charcoal/10 rounded-xl overflow-hidden">
                  <div className="bg-green-50 p-4 border-b border-green-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-green-600" />
                        <h3 className="font-bold text-charcoal">Essential Cookies</h3>
                      </div>
                      <span className="text-xs font-bold text-green-600 uppercase">Required</span>
                    </div>
                  </div>
                  <div className="p-4 bg-white">
                    <p className="text-xs text-charcoal/60 mb-3">
                      These cookies are necessary for the website to function properly. They cannot be disabled.
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead className="bg-charcoal/5">
                          <tr>
                            <th className="text-left p-2 font-bold text-charcoal">Cookie</th>
                            <th className="text-left p-2 font-bold text-charcoal">Purpose</th>
                            <th className="text-left p-2 font-bold text-charcoal">Duration</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-charcoal/5">
                          <tr>
                            <td className="p-2 text-charcoal/70 font-mono">session_id</td>
                            <td className="p-2 text-charcoal/60">Authentication</td>
                            <td className="p-2 text-charcoal/60">Session</td>
                          </tr>
                          <tr>
                            <td className="p-2 text-charcoal/70 font-mono">csrf_token</td>
                            <td className="p-2 text-charcoal/60">Security</td>
                            <td className="p-2 text-charcoal/60">Session</td>
                          </tr>
                          <tr>
                            <td className="p-2 text-charcoal/70 font-mono">cart_items</td>
                            <td className="p-2 text-charcoal/60">Shopping cart</td>
                            <td className="p-2 text-charcoal/60">30 days</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="border border-charcoal/10 rounded-xl overflow-hidden">
                  <div className="bg-blue-50 p-4 border-b border-blue-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Eye className="w-5 h-5 text-blue-600" />
                        <h3 className="font-bold text-charcoal">Analytics Cookies</h3>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.analytics}
                          onChange={() => handleToggle('analytics')}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                  <div className="p-4 bg-white">
                    <p className="text-xs text-charcoal/60 mb-3">
                      These cookies help us understand how visitors interact with our website by collecting anonymous information.
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead className="bg-charcoal/5">
                          <tr>
                            <th className="text-left p-2 font-bold text-charcoal">Cookie</th>
                            <th className="text-left p-2 font-bold text-charcoal">Purpose</th>
                            <th className="text-left p-2 font-bold text-charcoal">Duration</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-charcoal/5">
                          <tr>
                            <td className="p-2 text-charcoal/70 font-mono">_ga</td>
                            <td className="p-2 text-charcoal/60">Google Analytics</td>
                            <td className="p-2 text-charcoal/60">2 years</td>
                          </tr>
                          <tr>
                            <td className="p-2 text-charcoal/70 font-mono">_gid</td>
                            <td className="p-2 text-charcoal/60">Google Analytics</td>
                            <td className="p-2 text-charcoal/60">24 hours</td>
                          </tr>
                          <tr>
                            <td className="p-2 text-charcoal/70 font-mono">_fbp</td>
                            <td className="p-2 text-charcoal/60">Facebook Pixel</td>
                            <td className="p-2 text-charcoal/60">3 months</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="border border-charcoal/10 rounded-xl overflow-hidden">
                  <div className="bg-purple-50 p-4 border-b border-purple-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Settings className="w-5 h-5 text-purple-600" />
                        <h3 className="font-bold text-charcoal">Preference Cookies</h3>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.preferences}
                          onChange={() => handleToggle('preferences')}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </div>
                  <div className="p-4 bg-white">
                    <p className="text-xs text-charcoal/60 mb-3">
                      These cookies remember your preferences like language, location, and display settings.
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead className="bg-charcoal/5">
                          <tr>
                            <th className="text-left p-2 font-bold text-charcoal">Cookie</th>
                            <th className="text-left p-2 font-bold text-charcoal">Purpose</th>
                            <th className="text-left p-2 font-bold text-charcoal">Duration</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-charcoal/5">
                          <tr>
                            <td className="p-2 text-charcoal/70 font-mono">language</td>
                            <td className="p-2 text-charcoal/60">Preferred language</td>
                            <td className="p-2 text-charcoal/60">1 year</td>
                          </tr>
                          <tr>
                            <td className="p-2 text-charcoal/70 font-mono">currency</td>
                            <td className="p-2 text-charcoal/60">Currency preference</td>
                            <td className="p-2 text-charcoal/60">1 year</td>
                          </tr>
                          <tr>
                            <td className="p-2 text-charcoal/70 font-mono">theme</td>
                            <td className="p-2 text-charcoal/60">Light/Dark mode</td>
                            <td className="p-2 text-charcoal/60">1 year</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="border border-charcoal/10 rounded-xl overflow-hidden">
                  <div className="bg-orange-50 p-4 border-b border-orange-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-orange-600" />
                        <h3 className="font-bold text-charcoal">Marketing Cookies</h3>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.marketing}
                          onChange={() => handleToggle('marketing')}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-600"></div>
                      </label>
                    </div>
                  </div>
                  <div className="p-4 bg-white">
                    <p className="text-xs text-charcoal/60 mb-3">
                      These cookies track your activity to show relevant advertisements and measure campaign effectiveness.
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead className="bg-charcoal/5">
                          <tr>
                            <th className="text-left p-2 font-bold text-charcoal">Cookie</th>
                            <th className="text-left p-2 font-bold text-charcoal">Purpose</th>
                            <th className="text-left p-2 font-bold text-charcoal">Duration</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-charcoal/5">
                          <tr>
                            <td className="p-2 text-charcoal/70 font-mono">_gcl_au</td>
                            <td className="p-2 text-charcoal/60">Google Ads conversion</td>
                            <td className="p-2 text-charcoal/60">3 months</td>
                          </tr>
                          <tr>
                            <td className="p-2 text-charcoal/70 font-mono">_uetsid</td>
                            <td className="p-2 text-charcoal/60">Bing Ads</td>
                            <td className="p-2 text-charcoal/60">Session</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-2xl border border-charcoal/5 p-6 sm:p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                  <Settings className="w-5 h-5 text-gold-dark" />
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">Manage Your Preferences</h2>
              </div>
              <div className="space-y-4 text-sm text-charcoal/70 leading-relaxed">
                <p>
                  You can control which cookies we use by adjusting your preferences above. Essential cookies cannot be disabled as they are required for the website to function.
                </p>
                <div className="bg-gold/5 border border-gold/20 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-gold-dark shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-charcoal mb-1">Browser Settings</p>
                      <p className="text-xs text-charcoal/60">
                        You can also manage cookies through your browser settings. Most browsers allow you to block or delete cookies. However, blocking essential cookies may affect website functionality.
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleSave}
                  className="w-full py-3 bg-charcoal text-parchment hover:bg-gold-dark rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Save Preferences</span>
                </button>
              </div>
            </motion.section>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-gold/10 to-gold-dark/10 rounded-2xl border border-gold/20 p-6 sticky top-24"
            >
              <h3 className="font-serif text-lg font-bold text-charcoal mb-4">Quick Links</h3>
              <div className="space-y-3">
                <a href="#what-are-cookies" className="flex items-center gap-2 text-sm text-charcoal/60 hover:text-gold-dark transition-colors">
                  <ArrowLeft className="w-3 h-3 rotate-180" />
                  <span>What Are Cookies?</span>
                </a>
                <a href="#types" className="flex items-center gap-2 text-sm text-charcoal/60 hover:text-gold-dark transition-colors">
                  <ArrowLeft className="w-3 h-3 rotate-180" />
                  <span>Types of Cookies</span>
                </a>
                <a href="#manage" className="flex items-center gap-2 text-sm text-charcoal/60 hover:text-gold-dark transition-colors">
                  <ArrowLeft className="w-3 h-3 rotate-180" />
                  <span>Manage Preferences</span>
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl border border-charcoal/5 p-6 shadow-sm"
            >
              <h3 className="font-serif text-lg font-bold text-charcoal mb-4">Need Help?</h3>
              <p className="text-xs text-charcoal/60 mb-4">
                If you have questions about our cookie policy or need assistance managing your preferences, contact us:
              </p>
              <div className="space-y-3 text-sm">
                <a href="mailto:privacy@cozylagos.com" className="flex items-center gap-2 text-charcoal/60 hover:text-gold-dark transition-colors">
                  <span className="text-xs">privacy@cozylagos.com</span>
                </a>
                <a href="tel:+2348064305782" className="flex items-center gap-2 text-charcoal/60 hover:text-gold-dark transition-colors">
                  <span className="text-xs">+234 806 430 5782</span>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="bg-charcoal/5 border-t border-charcoal/10 py-8">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 xl:px-20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-charcoal/50">
            <div className="flex items-center gap-2">
              <Cookie className="w-4 h-4 text-gold" />
              <span>Last updated: July 27, 2026</span>
            </div>
            <div className="flex items-center gap-4">
              <span>&copy; 2026 COZYLAGOS LTD</span>
              <span className="text-gold">NDPR Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
