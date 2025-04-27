import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Users, Mail, Linkedin, Twitter } from "lucide-react";
import { User } from "lucide-react";

// Updated team members without images
const teamMembers = [
  {
    name: "Tojin Varkey Simson",
    role: "Founder & Lead Developer",
    bio: "Passionate about leveraging technology to improve health outcomes. Specializes in building intuitive interfaces and robust backend systems that help users achieve their wellness goals."
  },
  {
    name: "Jaiby Mariya Joseph",
    role: "Health & Wellness Director",
    bio: "With a background in health sciences and digital technology, focuses on creating evidence-based wellness programs that are accessible and engaging for users of all fitness levels."
  }
];

const features = [
  {
    title: "Holistic Approach",
    description:
      "We integrate physical fitness, nutrition, mental wellbeing, and sleep into one comprehensive platform.",
    icon: "✨",
  },
  {
    title: "Personalized Experience",
    description:
      "Our AI-driven recommendations adapt to your unique health profile and goals.",
    icon: "🎯",
  },
  {
    title: "Data Privacy",
    description:
      "Your health data belongs to you - we use decentralized storage and encryption to keep your information secure.",
    icon: "🔒",
  },
  {
    title: "Community Support",
    description:
      "Connect with like-minded individuals on similar health journeys for motivation and accountability.",
    icon: "👥",
  },
];

export default function AboutUs() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="py-12 text-center"
      >
        <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-none">About Us</Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Reimagining Health & Wellness
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We're on a mission to make holistic health accessible to everyone through
          innovative technology and personalized wellness solutions.
        </p>
      </motion.section>

      <Separator className="my-8" />

      {/* Mission Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="py-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
      >
        <div className="space-y-6">
          <Badge variant="outline" className="mb-2">Our Mission</Badge>
          <h2 className="text-3xl font-bold">Creating a healthier world through technology</h2>
          <p className="text-muted-foreground">
            At Mindful Health Hub, we believe that everyone deserves access to personalized health insights and guidance. 
            Our platform combines cutting-edge technology with evidence-based health practices to provide a comprehensive
            wellness experience that adapts to your unique needs.
          </p>
          <p className="text-muted-foreground">
            We're committed to empowering individuals with the tools, knowledge, and community support needed to 
            achieve their health goals and maintain sustainable wellbeing practices.
          </p>
        </div>
        <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 p-8 rounded-2xl border border-primary/20 backdrop-blur-sm h-[400px] flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="text-6xl">🌱</div>
            <h3 className="text-2xl font-semibold">Nurturing Health</h3>
            <p className="text-muted-foreground max-w-md">
              Like a growing plant, we believe in nurturing health through consistent, 
              mindful practices and a supportive environment.
            </p>
          </div>
        </div>
      </motion.section>

      <Separator className="my-8" />

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="py-12"
      >
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-2">What Sets Us Apart</Badge>
          <h2 className="text-3xl font-bold">Our Core Values</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
            >
              <Card className="h-full border-primary/10 bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all">
                <CardHeader>
                  <div className="text-3xl mb-2">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <Separator className="my-8" />

      {/* Team Section */}
      <div className="py-24 sm:py-32">
        <div className="container px-6 mx-auto">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="inline-flex items-center px-3 py-1 rounded-full bg-health-accent/10 text-health-accent text-sm font-medium mb-4 backdrop-blur-sm border border-health-accent/20"
            >
              <Users className="h-4 w-4 mr-2" /> Our Team
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-4xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80"
            >
              Meet the Innovators
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Our team brings together expertise in health sciences, technology, and design to create a comprehensive health platform that puts you in control.
            </motion.p>
          </div>
          
          <div className="grid gap-12 md:grid-cols-2 mx-auto max-w-4xl">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                viewport={{ once: true }}
                className="flex flex-col p-8 bg-card/30 backdrop-blur-sm rounded-3xl border border-border hover:border-health-primary/20 transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-health-primary/5 to-health-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                
                <div className="h-24 w-24 mx-auto mb-6 flex items-center justify-center bg-health-accent/10 rounded-full relative">
                  <User className="h-12 w-12 text-health-accent/70" />
                  <span className="absolute inset-0 border border-health-accent/20 rounded-full animate-pulse"></span>
                </div>
                
                <h3 className="text-xl font-semibold mb-1 text-center">{member.name}</h3>
                <p className="text-health-primary font-medium text-sm mb-4 text-center">{member.role}</p>
                <p className="text-muted-foreground text-center flex-grow">{member.bio}</p>
                
                <div className="flex justify-center space-x-4 mt-6 pt-6 border-t border-border/50">
                  <Button size="icon" variant="ghost" className="rounded-full h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-health-primary/10">
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="rounded-full h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-health-primary/10">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="rounded-full h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-health-primary/10">
                    <Twitter className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <Separator className="my-8" />

      {/* Join Us Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="py-12 text-center bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-2xl p-8 border border-primary/10"
      >
        <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          Be part of a movement that's redefining health and wellness for the modern age.
          Together, we can build healthier habits and live more fulfilling lives.
        </p>
        <Button size="lg" className="bg-primary hover:bg-primary/90">
          Start Your Journey
        </Button>
      </motion.section>
    </div>
  );
} 