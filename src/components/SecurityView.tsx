import React from 'react';
import { motion } from 'motion/react';
import {
  Shield, Lock, Eye, Server, Database, AlertTriangle,
  CheckCircle, ArrowLeft, Award, Globe, Zap, Key
} from 'lucide-react';

interface SecurityViewProps {
  onBack?: () => void;
}

export default function SecurityView({ onBack }: SecurityViewProps) {
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
                <Shield className="w-6 h-6 text-gold" />
              </div>
              <div>
                <p className="text-[10px] text-gold-light tracking-[0.3em] uppercase font-bold">Your Safety Matters</p>
                <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-parchment font-bold">Security</h1>
              </div>
            </div>
            <p className="text-sm text-parchment/60 max-w-2xl leading-relaxed mt-4">
              At Cozy Lagos, we take security seriously. We implement industry-leading measures to protect your data and ensure safe transactions.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 xl:px-20 py-10 sm:py-14 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl border border-charcoal/5 p-6 sm:p-8 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Lock className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">Data Encryption</h2>
            </div>
            <div className="space-y-4 text-sm text-charcoal/70 leading-relaxed">
              <p>All data transmitted between your browser and our servers is encrypted using industry-standard protocols:</p>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-charcoal">256-bit SSL/TLS Encryption</p>
                    <p className="text-[11px] text-charcoal/60">All data in transit is encrypted with AES-256</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-charcoal">HTTPS Only</p>
                    <p className="text-[11px] text-charcoal/60">All pages use secure HTTPS connections</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-charcoal">Certificate Pinning</p>
                    <p className="text-[11px] text-charcoal/60">Prevents man-in-the-middle attacks</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl border border-charcoal/5 p-6 sm:p-8 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Database className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">Data Storage</h2>
            </div>
            <div className="space-y-4 text-sm text-charcoal/70 leading-relaxed">
              <p>Your data is stored securely with multiple layers of protection:</p>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-charcoal">Encrypted at Rest</p>
                    <p className="text-[11px] text-charcoal/60">All stored data is encrypted with AES-256</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-charcoal">Access Controls</p>
                    <p className="text-[11px] text-charcoal/60">Role-based access with multi-factor authentication</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-charcoal">Regular Backups</p>
                    <p className="text-[11px] text-charcoal/60">Automated backups with disaster recovery</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl border border-charcoal/5 p-6 sm:p-8 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Key className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">Payment Security</h2>
            </div>
            <div className="space-y-4 text-sm text-charcoal/70 leading-relaxed">
              <p>We use PCI-DSS compliant payment processors to ensure your financial data is safe:</p>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <CheckCircle className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-charcoal">PCI-DSS Compliant</p>
                    <p className="text-[11px] text-charcoal/60">Meets Payment Card Industry standards</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <CheckCircle className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-charcoal">Tokenization</p>
                    <p className="text-[11px] text-charcoal/60">Card details are never stored on our servers</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <CheckCircle className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-charcoal">Fraud Detection</p>
                    <p className="text-[11px] text-charcoal/60">AI-powered fraud prevention systems</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-2xl border border-charcoal/5 p-6 sm:p-8 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <Eye className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">Monitoring & Audits</h2>
            </div>
            <div className="space-y-4 text-sm text-charcoal/70 leading-relaxed">
              <p>We continuously monitor our systems and conduct regular security audits:</p>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                  <CheckCircle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-charcoal">24/7 Monitoring</p>
                    <p className="text-[11px] text-charcoal/60">Real-time threat detection and response</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                  <CheckCircle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-charcoal">Penetration Testing</p>
                    <p className="text-[11px] text-charcoal/60">Regular security testing by independent experts</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
                  <CheckCircle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-charcoal">Compliance Audits</p>
                    <p className="text-[11px] text-charcoal/60">Annual audits for NDPR and PCI-DSS compliance</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-charcoal to-charcoal/90 rounded-2xl p-6 sm:p-8 text-parchment"
        >
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-8 h-8 text-gold" />
            <h2 className="font-serif text-2xl sm:text-3xl font-bold">Security Certifications</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-parchment/5 rounded-xl p-4 border border-parchment/10">
              <Shield className="w-6 h-6 text-gold mb-2" />
              <h3 className="font-bold text-sm mb-1">NDPR Compliant</h3>
              <p className="text-xs text-parchment/60">Nigeria Data Protection Regulation</p>
            </div>
            <div className="bg-parchment/5 rounded-xl p-4 border border-parchment/10">
              <Lock className="w-6 h-6 text-gold mb-2" />
              <h3 className="font-bold text-sm mb-1">PCI-DSS</h3>
              <p className="text-xs text-parchment/60">Payment Card Industry Standard</p>
            </div>
            <div className="bg-parchment/5 rounded-xl p-4 border border-parchment/10">
              <Globe className="w-6 h-6 text-gold mb-2" />
              <h3 className="font-bold text-sm mb-1">ISO 27001</h3>
              <p className="text-xs text-parchment/60">Information Security Management</p>
            </div>
            <div className="bg-parchment/5 rounded-xl p-4 border border-parchment/10">
              <Zap className="w-6 h-6 text-gold mb-2" />
              <h3 className="font-bold text-sm mb-1">SOC 2 Type II</h3>
              <p className="text-xs text-parchment/60">Service Organization Control</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl border border-charcoal/5 p-6 sm:p-8 shadow-sm mt-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-gold-dark" />
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">Report a Security Issue</h2>
          </div>
          <div className="space-y-4 text-sm text-charcoal/70 leading-relaxed">
            <p>
              If you discover a security vulnerability or have concerns about your data, please report it immediately:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="p-4 bg-parchment/50 rounded-xl border border-charcoal/5">
                <p className="text-xs font-bold text-charcoal uppercase tracking-wider mb-2">Email</p>
                <a href="mailto:security@cozylagos.com" className="text-sm text-charcoal/60 hover:text-gold-dark transition-colors">
                  security@cozylagos.com
                </a>
              </div>
              <div className="p-4 bg-parchment/50 rounded-xl border border-charcoal/5">
                <p className="text-xs font-bold text-charcoal uppercase tracking-wider mb-2">Phone</p>
                <a href="tel:+2348064305782" className="text-sm text-charcoal/60 hover:text-gold-dark transition-colors">
                  +234 806 430 5782
                </a>
              </div>
            </div>
            <p className="text-xs text-charcoal/50 mt-4">
              We appreciate responsible disclosure and will work with you to resolve any issues promptly.
            </p>
          </div>
        </motion.div>
      </div>

      <div className="bg-charcoal/5 border-t border-charcoal/10 py-8">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 xl:px-20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-charcoal/50">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-gold" />
              <span>Your security is our priority</span>
            </div>
            <div className="flex items-center gap-4">
              <span>&copy; 2026 COZYLAGOS LTD</span>
              <span className="text-gold">Secured & Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
