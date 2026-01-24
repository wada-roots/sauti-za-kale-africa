import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import AuthorsDashboard from "./pages/AuthorsDashboard";
import Stories from "./pages/Stories";
import UbuntuVoices from "./pages/UbuntuVoices";
import Poetry from "./pages/Poetry";
import SubmitContent from "./pages/SubmitContent";
import MedicinalPlants from "./pages/MedicinalPlants";
import HeritageMap from "./pages/HeritageMap";
import Heroes from "./pages/Heroes";
import LearningHub from "./pages/LearningHub";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import ForTeachers from "./pages/ForTeachers";
import Researchers from "./pages/Researchers";
import NotFound from "./pages/NotFound";
import Abagusii from "./pages/tribes/Abagusii";
import Akamba from "./pages/tribes/Akamba";
import Kalenjin from "./pages/tribes/Kalenjin";
import Maasai from "./pages/tribes/Maasai";
import Articles from "./pages/Articles";
import DownloadScope from "./pages/DownloadScope";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import ContentReview from "./pages/admin/ContentReview";
import UserManagement from "./pages/admin/UserManagement";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      
      <Sonner />
<BrowserRouter>
  <ScrollToTop /> {/* This ensures the page scrolls to top on route change */}
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/home" element={<HomePage />} />
    <Route path="/auth" element={<AuthPage />} />
    <Route path="/authors-dashboard" element={<AuthorsDashboard />} />
    <Route path="/submit-content" element={<SubmitContent />} />
    <Route path="/stories" element={<Stories />} />
    <Route path="/ubuntu-voices" element={<UbuntuVoices />} />
    <Route path="/poetry" element={<Poetry />} />
    <Route path="/medicinal-plants" element={<MedicinalPlants />} />
    <Route path="/heritage-map" element={<HeritageMap />} />
    <Route path="/heroes" element={<Heroes />} />
    <Route path="/learning-hub" element={<LearningHub />} />
    <Route path="/about-us" element={<AboutUs />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/for-teachers" element={<ForTeachers />} />
    <Route path="/researchers" element={<Researchers />} />
    <Route path="/articles" element={<Articles />} />
    <Route path="/tribes/abagusii" element={<Abagusii />} />
    <Route path="/tribes/akamba" element={<Akamba />} />
    <Route path="/tribes/kalenjin" element={<Kalenjin />} />
    <Route path="/tribes/maasai" element={<Maasai />} />
    <Route path="/download-scope" element={<DownloadScope />} />

    {/* Admin Routes */}
    <Route path="/admin/login" element={<AdminLoginPage />} />
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<AdminDashboard />} />
      <Route path="content-review" element={<ContentReview />} />
      <Route path="users" element={<UserManagement />} />
      <Route path="settings" element={<AdminSettings />} />
    </Route>

    {/* Catch-all */}
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>

    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
