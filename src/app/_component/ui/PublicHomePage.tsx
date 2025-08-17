import React, { useState, useEffect } from "react";
import {
  Shield,
  Search,
  FileText,
  CheckCircle,
  Car,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Star,
  Lock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import DriveLaw from "../images/drivelaw-icon";

export default function PublicHomepage() {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: Search,
      title: "Instant Lookup",
      description:
        "Find your traffic violations instantly with our secure search system.",
    },
    {
      icon: FileText,
      title: "Clear Documentation",
      description:
        "Access detailed, easy-to-understand documentation of all traffic offenses.",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description:
        "Your data is protected with enterprise-grade security and 99.9% uptime.",
    },
  ];

  const stats = [
    { number: "500K+", label: "Cases Processed" },
    { number: "99.9%", label: "System Uptime" },
    { number: "24/7", label: "Support Available" },
    { number: "50+", label: "Cities Covered" },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-[#0A2540]">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <DriveLaw />
              <span className="text-xl font-semibold">DriveLaw</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="hover:text-[#0052CC]">
                Features
              </a>
              <a href="#about" className="hover:text-[#0052CC]">
                About
              </a>
              <a href="#contact" className="hover:text-[#0052CC]">
                Contact
              </a>
              <button
                onClick={() => router.push("/login")}
                className="bg-[#0052CC] text-white px-5 py-2 rounded-md hover:bg-[#003D99] transition"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-[#0A2540] text-white py-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-sm uppercase tracking-wide mb-4">
            Trusted by 50+ Government Agencies
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Traffic Violations Made Simple
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
            Access, understand, and manage traffic violations with transparency.
            Our system ensures every citizen has clear access to their driving
            record.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push("/login")}
              className="bg-[#0052CC] px-6 py-3 text-white rounded-md hover:bg-[#003D99] transition"
            >
              Check Your Record
              <ChevronRight className="inline-block ml-2 h-5 w-5" />
            </button>
            <button className="border border-white px-6 py-3 rounded-md hover:bg-white hover:text-[#0A2540] transition">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <div key={i}>
              <div className="text-3xl font-bold text-[#0052CC]">
                {stat.number}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose DriveLaw?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Built for transparency, designed for accessibility, trusted by
              millions.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
                >
                  <div className="bg-[#0052CC] p-3 rounded-md w-fit mb-4">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="bg-gray-50 py-20 border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="mb-4 flex justify-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-6 w-6 text-yellow-500" />
            ))}
          </div>
          <blockquote className="text-xl italic mb-4">
            &quot;DriveLaw has revolutionized how we handle traffic violations.
            The transparency and ease of use have significantly improved citizen
            satisfaction.&quot;
          </blockquote>
          <div className="text-gray-600">
            — Chief Traffic Officer, Metropolitan Police Department
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center bg-white border-t border-gray-200">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          Join thousands of citizens who trust DriveLaw for transparent
          access to their driving records.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="bg-[#0052CC] px-8 py-3 text-white rounded-md hover:bg-[#003D99] transition"
        >
          Access Your Record Now
          <ChevronRight className="inline-block ml-2 h-5 w-5" />
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A2540] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Car className="h-6 w-6" />
              <span className="text-lg font-semibold">DriveLaw</span>
            </div>
            <p className="text-gray-300 mb-4">
              Making traffic violation management transparent, accessible, and
              user-friendly for everyone.
            </p>
            <div className="flex space-x-4 text-gray-300 text-sm">
              <div className="flex items-center">
                <Lock className="h-4 w-4 mr-1" /> SSL Secured
              </div>
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-1" /> Privacy Protected
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#">Features</a>
              </li>
              <li>
                <a href="#">About</a>
              </li>
              <li>
                <a href="#">Support</a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Contact</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2" /> 1-800-TRAFFIC
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2" /> support@trafficwatch.gov
              </li>
              <li className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" /> Available Nationwide
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
          &copy; 2025 DriveLaw. All rights reserved. | Privacy Policy |
          Terms of Service
        </div>
      </footer>
    </div>
  );
}
