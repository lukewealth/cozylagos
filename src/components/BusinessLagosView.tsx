import React from 'react';
import { motion } from 'motion/react';
import { Briefcase, Building2, Car, Users, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import { BUSINESS_SERVICES } from '../data-new-sections';

export default function BusinessLagosView() {
  return (
    <div className="flex-grow flex flex-col animate-fade-in-up">
      <section className="relative w-full h-[250px] sm:h-[350px] flex items-center justify-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-charcoal" />
        <div className="relative z-10 w-full max-w-[1440px] px-4 sm:px-6 md:px-12 xl:px-20 mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-3 mb-4"
          >
            <Briefcase className="w-6 h-6 text-gold" />
            <span className="text-gold text-[10px] font-bold tracking-[0.4em] uppercase">
              Corporate Solutions
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl text-parchment leading-tight tracking-tight max-w-3xl"
          >
            Business <span className="italic font-light text-gold">Lagos</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-sans text-xs sm:text-sm text-parchment/70 max-w-xl font-light leading-relaxed mt-4 px-2"
          >
            Premium corporate services for executives and teams. Seamless business travel solutions in Lagos.
          </motion.p>
        </div>
      </section>

      <section className="py-10 sm:py-16 px-4 sm:px-6 md:px-12 xl:px-20 max-w-[1440px] mx-auto w-full">
        <div className="text-center mb-12">
          <span className="text-gold-dark font-bold text-[10px] tracking-[0.25em] uppercase block mb-2">
            Corporate Services
          </span>
          <h2 className="font-serif font-semibold text-2xl sm:text-3xl text-charcoal">
            Everything Your Business Needs
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BUSINESS_SERVICES.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white border border-charcoal/5 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-gold/10 transition-colors">
                <span className="text-2xl">{service.icon}</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-charcoal mb-2">{service.title}</h3>
              <p className="text-sm text-charcoal/60 mb-4 leading-relaxed">{service.description}</p>
              <ul className="space-y-2 mb-6">
                {service.features.slice(0, 4).map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-charcoal/70">
                    <CheckCircle className="w-3.5 h-3.5 text-gold-dark shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between pt-4 border-t border-charcoal/5">
                <div>
                  <span className="text-[9px] font-bold text-charcoal/40 uppercase tracking-widest block">Starting from</span>
                  <span className="font-serif text-lg font-bold text-gold-dark">₦{service.startingPrice.toLocaleString()}</span>
                </div>
                <button className="flex items-center gap-1 px-4 py-2 bg-charcoal text-parchment hover:bg-gold-dark font-bold text-[10px] tracking-widest uppercase rounded-lg transition-all">
                  <span>Inquire</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 bg-slate-900 text-parchment rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
          <div className="relative z-10 max-w-2xl">
            <h3 className="font-serif text-2xl md:text-3xl font-bold mb-4">
              Need a Custom Corporate Solution?
            </h3>
            <p className="text-sm text-parchment/70 mb-6 leading-relaxed">
              We offer tailored packages for companies of all sizes. From single executives to large teams, 
              our dedicated corporate team will design the perfect solution for your Lagos business needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-6 py-3 bg-gold text-charcoal hover:bg-gold-dark font-bold text-xs tracking-widest uppercase rounded-xl transition-all">
                Contact Corporate Team
              </button>
              <button className="px-6 py-3 border border-parchment/30 text-parchment hover:bg-parchment/10 font-bold text-xs tracking-widest uppercase rounded-xl transition-all">
                Download Brochure
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
