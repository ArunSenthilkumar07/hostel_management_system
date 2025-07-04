"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Building2, GraduationCap, Heart, Microscope, Users, Shield, Clock, Award } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 2)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const hostelBlocks = [
    {
      name: "Engineering",
      icon: Building2,
      type: "Co-Ed",
      description: "Boys & Girls allowed",
      students: 150,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      link: "/login-selection",
      features: ["AC Rooms", "WiFi", "Study Hall", "Lab Access"],
    },
    {
      name: "Pharmacy",
      icon: GraduationCap,
      type: "Co-Ed",
      description: "Boys & Girls allowed",
      students: 80,
      color: "bg-gradient-to-br from-green-500 to-green-600",
      link: "/login-selection",
      features: ["Research Lab", "Library", "AC Rooms", "WiFi"],
    },
    {
      name: "Allied Science",
      icon: Microscope,
      type: "Co-Ed",
      description: "Boys & Girls allowed",
      students: 60,
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      link: "/login-selection",
      features: ["Lab Access", "AC Rooms", "Study Area", "WiFi"],
    },
    {
      name: "Nursing",
      icon: Heart,
      type: "Girls Only",
      description: "Girls only hostel",
      students: 45,
      color: "bg-gradient-to-br from-pink-500 to-pink-600",
      link: "/login-girls",
      features: ["Medical Lab", "AC Rooms", "Garden View", "WiFi"],
    },
  ]

  const features = [
    {
      icon: Users,
      title: "Student Management",
      description: "Complete student lifecycle management with real-time updates",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Shield,
      title: "Secure & Safe",
      description: "24/7 security with CCTV monitoring and secure access control",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      description: "Instant notifications and live tracking of all hostel activities",
      color: "from-purple-500 to-violet-500",
    },
    {
      icon: Award,
      title: "Quality Assurance",
      description: "Regular maintenance, cleanliness checks, and quality food service",
      color: "from-orange-500 to-red-500",
    },
  ]

  const campusImages = [
    {
      src: "/campus-main.png",
      alt: "Sri Shanmugha Educational Institutions Main Campus",
      title: "Modern Educational Infrastructure",
      description: "State-of-the-art facilities with contemporary architecture",
    },
    {
      src: "/campus-hostels.png",
      alt: "Campus Hostel Blocks with Gardens",
      title: "Beautiful Hostel Campus",
      description: "Well-maintained hostel blocks with lush green gardens and modern amenities",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Image
                  src="/logo.jpeg"
                  alt="Sri Shanmugha Educational Institutions"
                  width={50}
                  height={50}
                  className="rounded-lg shadow-md"
                />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Sri Shanmugha</h1>
                <p className="text-sm text-gray-600">Educational Institutions</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <Link href="/login-selection">
                <Button variant="outline" className="hover:scale-105 transition-transform">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105 transition-all">
                  Register
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Campus Images */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-full">
            {campusImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  currentSlide === index ? "opacity-30" : "opacity-0"
                }`}
              >
                <Image
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 to-indigo-900/30"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div
            className={`transform transition-all duration-1000 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6">
              Smart Hostel{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Management
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
              Experience the future of hostel living with our comprehensive management system. Seamlessly handle room
              allocations, attendance tracking, complaints, and much more with real-time updates.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link href="/login-selection">
                <Button
                  size="lg"
                  className="px-8 py-4 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all shadow-lg"
                >
                  Get Started Today
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 text-lg border-2 hover:bg-gray-50 transform hover:scale-105 transition-all"
                >
                  Register Now
                </Button>
              </Link>
            </div>
          </div>

          {/* Campus Image Info */}
          <div className="mt-12 bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-xl max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{campusImages[currentSlide].title}</h3>
            <p className="text-gray-600">{campusImages[currentSlide].description}</p>
          </div>
        </div>

        {/* Floating Animation Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-indigo-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-20 w-12 h-12 bg-purple-200 rounded-full opacity-20 animate-ping"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Our Hostel Management?</h2>
            <p className="text-xl text-gray-600">Advanced features designed for modern hostel living</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-gray-50"
              >
                <CardContent className="p-8 text-center">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Hostel Blocks */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Hostel Blocks</h2>
            <p className="text-xl text-gray-600">Choose your department to access the management portal</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {hostelBlocks.map((block, index) => (
              <Card
                key={block.name}
                className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border-0 overflow-hidden"
              >
                <CardContent className="p-0">
                  <div className={`${block.color} p-8 text-center text-white relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <block.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{block.name}</h3>
                      <p className="text-white/90 mb-1">{block.description}</p>
                      <p className="text-sm font-medium text-white/80 mb-2">{block.type}</p>
                      <p className="text-sm text-white/80">{block.students} Students</p>
                    </div>
                  </div>
                  <div className="p-6 bg-white">
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Features:</h4>
                      <div className="flex flex-wrap gap-1">
                        {block.features.map((feature, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Link href={block.link}>
                      <Button className="w-full group-hover:scale-105 transition-transform">
                        {block.name === "Nursing" ? "Girls Portal" : "Access Portal"}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-4xl font-bold mb-2 group-hover:scale-110 transition-transform">335+</div>
              <div className="text-blue-100">Happy Students</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold mb-2 group-hover:scale-110 transition-transform">4</div>
              <div className="text-blue-100">Hostel Blocks</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold mb-2 group-hover:scale-110 transition-transform">24/7</div>
              <div className="text-blue-100">Support Available</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold mb-2 group-hover:scale-110 transition-transform">100%</div>
              <div className="text-blue-100">Digital Management</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Image
                  src="/logo.jpeg"
                  alt="Sri Shanmugha Educational Institutions"
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
                <div>
                  <h3 className="font-bold">Sri Shanmugha</h3>
                  <p className="text-sm text-gray-400">Educational Institutions</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Providing quality education and comfortable hostel facilities for students across various disciplines.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/login-selection" className="hover:text-white transition-colors">
                    Student Login
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-white transition-colors">
                    Registration
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <div className="space-y-2 text-gray-400">
                <p>📍 Chennai, Tamil Nadu</p>
                <p>📞 +91 9876543210</p>
                <p>✉️ info@shanmugha.edu</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 Sri Shanmugha Educational Institutions. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
