"use client";

import { useEffect, useState } from "react";
import Blog1 from "@/components/sections/Blog1";
import Blog2 from "@/components/sections/Blog2";
import Blog3 from "@/components/sections/Blog3";
import Blog5 from "@/components/sections/Blog5";
import Contact1 from "@/components/sections/Contact1";
import Services2 from "@/components/sections/Services2";
import Services3 from "@/components/sections/Services3";
import Services5 from "@/components/sections/Services5";
import Project2 from "@/components/sections/Project2";
import Script from "next/script";
import Team1 from "@/components/sections/Team1";
import Content1 from "@/components/sections/Content1";
import Content2 from "@/components/sections/Content2";
import Content3 from "@/components/sections/Content3";

// Common Styles
const CommonStyles = () => (
  <style jsx global>{`
    * {
      box-sizing: border-box;
    }
    
    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', sans-serif;
      width: 100%;
      overflow-x: hidden;
    }
    
    /* Bootstrap-like spacing */
    .py-2 {
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
    }
    
    .px-3 {
      padding-left: 1rem;
      padding-right: 1rem;
    }
    
    .px-4 {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
    }
    
    .ms-2 {
      margin-left: 0.5rem;
    }
    
    .mt-3 {
      margin-top: 1rem;
    }
    
    .my-3 {
      margin-top: 1rem;
      margin-bottom: 1rem;
    }
    
    .mb-2 {
      margin-bottom: 0.5rem;
    }
    
    .mb-3 {
      margin-bottom: 1rem;
    }
    
    .mt-8 {
      margin-top: 3rem;
    }
    
    .rounded-pill {
      border-radius: 50rem;
    }
    
    .rounded-3 {
      border-radius: 0.5rem;
    }
    
    /* Flex utilities */
    .d-flex {
      display: flex;
    }
    
    .align-items-center {
      align-items: center;
    }
    
    .align-items-end {
      align-items: flex-end;
    }
    
    .justify-content-center {
      justify-content: center;
    }
    
    .justify-content-start {
      justify-content: flex-start;
    }
    
    .position-relative {
      position: relative;
    }
    
    .position-absolute {
      position: absolute;
    }
    
    .d-inline-flex {
      display: inline-flex;
    }
    
    /* Background utilities */
    .bg-primary-soft {
      background-color: rgba(99, 66, 236, 0.1);
    }
    
    .border {
      border: 1px solid;
    }
    
    .border-2 {
      border-width: 2px;
    }
    
    .border-white {
      border-color: #fff;
    }
    
    /* Text utilities */
    .fs-7 {
      font-size: 0.875rem;
    }
    
    .fs-5 {
      font-size: 1.25rem;
    }
    
    .fw-bold {
      font-weight: 700;
    }
    
    .fw-medium {
      font-weight: 500;
    }
    
    .text-linear-2 {
      background: linear-gradient(90deg, #6342EC 0%, #BA3FDA 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .ms-2 {
      margin-left: 0.5rem;
    }
    
    .text-uppercase {
      text-transform: uppercase;
    }
    
    .text-primary {
      color: #6342EC;
    }
    
    /* Grid system */
    .container {
      width: 100%;
      padding-right: 15px;
      padding-left: 15px;
      margin-right: auto;
      margin-left: auto;
      max-width: 100%;
    }
    
    @media (min-width: 576px) {
      .container {
        max-width: 540px;
      }
    }
    
    @media (min-width: 768px) {
      .container {
        max-width: 720px;
      }
    }
    
    @media (min-width: 992px) {
      .container {
        max-width: 960px;
      }
    }
    
    @media (min-width: 1200px) {
      .container {
        max-width: 1140px;
      }
    }
    
    .row {
      display: flex;
      flex-wrap: wrap;
      margin-right: -15px;
      margin-left: -15px;
      width: 100%;
    }
    
    .col-lg-4, .col-md-6, .col {
      position: relative;
      width: 100%;
      padding-right: 15px;
      padding-left: 15px;
    }
    
    .col-lg-6 {
      position: relative;
      width: 100%;
      padding-right: 15px;
      padding-left: 15px;
    }
    
    .col-lg-10 {
      position: relative;
      width: 100%;
      padding-right: 15px;
      padding-left: 15px;
    }
    
    .col {
      flex: 1 0 0%;
    }
    
    .me-auto {
      margin-right: auto;
    }
    
    .mx-lg-auto {
      margin-left: auto;
      margin-right: auto;
    }
    
    @media (min-width: 992px) {
      .col-lg-4 {
        flex: 0 0 33.333333%;
        max-width: 33.333333%;
      }
      
      .col-lg-6 {
        flex: 0 0 50%;
        max-width: 50%;
      }
      
      .col-lg-10 {
        flex: 0 0 83.333333%;
        max-width: 83.333333%;
      }
    }
    
    @media (min-width: 768px) {
      .col-md-6 {
        flex: 0 0 50%;
        max-width: 50%;
      }
    }
    
    /* Fix for text sizes */
    .ds-5 {
      font-size: 30px;
      line-height: 1.3;
      font-weight: 700;
    }
    
    .ds-3 {
      font-size: 36px;
      line-height: 1.3;
      font-weight: 700;
    }
    
    /* Fix for section spacing */
    .pt-120 {
      padding-top: 120px;
    }
    
    .pb-80 {
      padding-bottom: 80px;
    }
    
    /* Section padding */
    .py-5 {
      padding: 80px 0;
    }
    
    .section-blog-1, .section-blog-2, .section-blog-6, .section-blog-8, .section-contact-3 {
      padding: 80px 0;
      width: 100%;
      overflow: visible;
      display: block;
    }
    
    /* Text alignment */
    .text-start {
      text-align: left;
    }
    
    .text-center {
      text-align: center;
    }
    
    /* Z-index */
    .z-1 {
      z-index: 1;
    }
    
    .z-0 {
      z-index: 0;
    }
    
    .z-2 {
      z-index: 2;
    }
    
    /* Card styles */
    .card {
      margin-bottom: 1.5rem;
      width: 100%;
      background-color: #fff;
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
      display: block;
    }
    
    .card-body {
      padding: 1.25rem;
      width: 100%;
    }
    
    .card-body p {
      margin-top: 0.5rem;
      margin-bottom: 0;
    }
    
    /* Fix for card images */
    .card img.rounded-3, .card img.rounded-top-3 {
      width: 100%;
      height: auto;
      object-fit: cover;
    }
    
    /* Animation */
    .rotate-center {
      animation: rotate 15s linear infinite;
    }
    
    .rotate-center-rev {
      animation: rotate-rev 15s linear infinite;
    }
    
    @keyframes rotate {
      0% {
        transform: rotate(0);
      }
      100% {
        transform: rotate(360deg);
      }
    }
    
    @keyframes rotate-rev {
      0% {
        transform: rotate(0);
      }
      100% {
        transform: rotate(-360deg);
      }
    }
    
    /* Fix for contact form */
    .section-contact-3 form {
      width: 100%;
      margin-bottom: 2rem;
    }
    
    .section-contact-3 .row {
      display: flex;
      flex-wrap: wrap;
    }
    
    .section-contact-3 .col-lg-6 {
      flex: 0 0 100%;
      max-width: 100%;
    }
    
    @media (min-width: 992px) {
      .section-contact-3 .col-lg-6 {
        flex: 0 0 50%;
        max-width: 50%;
      }
    }
    
    .section-contact-3 .input-group {
      margin-bottom: 1rem;
    }
    
    /* Fix spacing in all sections */
    .section-blog-1 .container, 
    .section-blog-2 .container, 
    .section-blog-6 .container, 
    .section-blog-8 .container, 
    .section-contact-3 .container {
      max-width: 1140px;
      margin-left: auto;
      margin-right: auto;
      padding-left: 15px;
      padding-right: 15px;
    }
    
    /* Proper spacing for article cards */
    .section-blog-1 .card, 
    .section-blog-2 .card, 
    .section-blog-6 .card, 
    .section-blog-8 .card {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .section-blog-1 .card-body, 
    .section-blog-2 .card-body, 
    .section-blog-6 .card-body, 
    .section-blog-8 .card-body {
      flex: 1 1 auto;
    }
    
    /* Swiper fixes */
    .swiper-slide {
      height: auto;
    }
    
    /* Global section fixes */
    section {
      width: 100%;
      overflow: hidden;
      position: relative;
    }
    
    /* Fix for blog badges */
    .bg-primary-soft {
      display: inline-block;
      padding: 0.25rem 0.75rem;
    }
    
    /* Fix for contact form elements */
    .form-check {
      position: relative;
      padding-left: 1.25rem;
      margin-bottom: 1rem;
    }
    
    .form-check-input {
      position: absolute;
      margin-top: 0.25rem;
      margin-left: -1.25rem;
    }
    
    .form-check-label {
      margin-bottom: 0;
    }
    
    .btn {
      display: inline-block;
      font-weight: 500;
      text-align: center;
      vertical-align: middle;
      user-select: none;
      border: 1px solid transparent;
      padding: 0.375rem 0.75rem;
      font-size: 1rem;
      line-height: 1.5;
      border-radius: 0.25rem;
      transition: all 0.15s ease-in-out;
      cursor: pointer;
    }
    
    .bg-primary {
      background-color: #6342EC !important;
    }
    
    .text-white {
      color: #fff !important;
    }
    
    .hover-up:hover {
      transform: translateY(-3px);
    }
    
    /* Fix for social icons layout */
    .socials {
      display: inline-flex;
      align-items: center;
    }
    
    .socials ul {
      display: flex;
      margin: 0;
      padding: 0;
    }
    
    .socials li {
      margin-left: 0.5rem;
      list-style: none;
    }
    
    /* Better heading styles */
    h3, h4, h5, h6 {
      margin-top: 0;
      line-height: 1.2;
    }
    
    h6 {
      font-size: 1rem;
      font-weight: 700;
    }
    
    /* Fix article link positioning */
    .position-absolute.bottom-0.start-0.end-0.top-0 {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
    }
    
    /* Basic form elements */
    .input-group {
      display: flex;
      width: 100%;
    }
    
    .icon-input {
      padding: 0.75rem;
    }
    
    .form-control {
      display: block;
      width: 100%;
      padding: 0.75rem;
      font-size: 1rem;
      line-height: 1.5;
      background-color: #fff;
      border: 1px solid #ced4da;
    }
    
    /* Better spacing for rows */
    .row > * {
      margin-bottom: 1.5rem;
    }
    
    /* Fix for swiper slider */
    .swiper {
      width: 100%;
      overflow: hidden;
    }
    
    /* Fix for ellipses */
    .ellipse-rotate-success, .ellipse-rotate-primary, .ellipse-rotate-info {
      width: 300px;
      height: 300px;
      border-radius: 50%;
      opacity: 0.2;
      position: absolute;
    }
    
    .ellipse-rotate-success {
      background-color: #28a745;
      top: 20%;
      left: 10%;
    }
    
    .ellipse-rotate-primary {
      background-color: #6342EC;
      bottom: 20%;
      right: 10%;
    }
    
    .ellipse-rotate-info {
      background-color: #17a2b8;
      bottom: 30%;
      left: 30%;
    }
    
    /* Additional fixes to ensure proper full-width layout */
    html, body {
      min-height: 100%;
      width: 100%;
      margin: 0;
      padding: 0;
    }
    
    section {
      width: 100vw;
      max-width: 100%;
      margin: 0;
      padding: 80px 0;
      box-sizing: border-box;
    }
    
    img {
      max-width: 100%;
      height: auto;
    }
    
    /* Reset default margins */
    p {
      margin-top: 0;
      margin-bottom: 1rem;
    }
    
    /* Clear floating elements */
    .clearfix::after {
      display: block;
      clear: both;
      content: "";
    }
    
    /* Fix for contact section */
    .section-contact-3 {
      width: 100vw;
      max-width: 100%;
      overflow: hidden;
    }
    
    /* Fix for article cards to use full width */
    .section-blog-1 .col-lg-4, 
    .section-blog-2 .col-lg-4, 
    .section-blog-3 .col-lg-4, 
    .section-blog-5 .col-lg-4,
    .section-blog-6 .col-lg-4, 
    .section-blog-8 .col-lg-4 {
      width: 100%;
      max-width: 100%;
    }
    
    @media (min-width: 992px) {
      .section-blog-1 .col-lg-4, 
      .section-blog-2 .col-lg-4, 
      .section-blog-3 .col-lg-4, 
      .section-blog-5 .col-lg-4,
      .section-blog-6 .col-lg-4, 
      .section-blog-8 .col-lg-4 {
        flex: 0 0 33.333333%;
        max-width: 33.333333%;
      }
    }
    
    /* Fix animation issues for Blog2 */
    .swiper-wrapper {
      display: flex;
      width: 100%;
    }
    
    .swiper-slide {
      height: auto;
      flex-shrink: 0;
      width: 100%;
      position: relative;
    }
    
    @media (min-width: 768px) {
      .swiper-slide {
        width: 48%;
        margin-right: 2%;
      }
    }
    
    /* Fix slide card visibility */
    .swiper .card {
      display: block;
      width: 100%;
      height: 100%;
      background: #fff;
      visibility: visible !important;
      opacity: 1 !important;
    }
    
    /* Fix for Blog2 specific styles */
    .section-blog-2 {
      width: 100vw;
      max-width: 100%;
      overflow: visible;
    }
    
    /* Add animations if missing */
    .bouncing-blobs-container {
      display: none;
    }
    
    /* Fix for swiper slider controls */
    .swiper-button-next,
    .swiper-button-prev {
      position: absolute;
      top: 50%;
      width: 40px;
      height: 40px;
      margin-top: -20px;
      z-index: 10;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #000;
    }
    
    .swiper-button-next {
      right: 10px;
    }
    
    .swiper-button-prev {
      left: 10px;
    }
    
    /* Ensure all blog cards are visible */
    .slider-one {
      overflow: visible;
      padding: 10px;
    }
    
    .card-hover {
      transition: all 0.3s ease;
    }
    
    .card-hover:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    }
    
    /* Fix for IE 11 */
    @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
      .swiper-slide {
        float: left;
        width: 48%;
        margin-right: 2%;
      }
    }
    
    /* Make sure images don't break layout */
    .swiper img, .card img {
      max-width: 100%;
      height: auto;
      object-fit: cover;
    }
    
    /* Specific fixes for Contact1 component */
    .section-contact-3 {
      width: 100%;
      max-width: 100%;
      padding: 80px 0;
      overflow: hidden;
      box-sizing: border-box;
    }
    
    .section-contact-3 .container {
      width: 100%;
      max-width: 1140px;
      margin-left: auto;
      margin-right: auto;
      padding-left: 15px;
      padding-right: 15px;
    }
    
    .section-contact-3 .row {
      display: flex;
      flex-wrap: wrap;
      margin-right: -15px;
      margin-left: -15px;
      width: 100%;
    }
    
    .section-contact-3 .col-lg-6,
    .section-contact-3 .col-lg-10,
    .section-contact-3 .col-md-6,
    .section-contact-3 .col-12 {
      position: relative;
      width: 100%;
      padding-right: 15px;
      padding-left: 15px;
      margin-bottom: 1rem;
    }
    
    .section-contact-3 form {
      width: 100%;
    }
    
    .section-contact-3 .input-group {
      width: 100%;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
    }
    
    .section-contact-3 .form-control {
      flex: 1;
      display: block;
      width: 100%;
      padding: 0.75rem;
      font-size: 1rem;
      line-height: 1.5;
      border: 1px solid #ced4da;
      border-radius: 0.25rem;
    }
    
    .section-contact-3 textarea.form-control {
      height: auto;
      min-height: 100px;
    }
    
    .section-contact-3 .icon-input {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.75rem;
      background-color: #fff;
      border: 1px solid #ced4da;
      border-radius: 0.25rem 0 0 0.25rem;
    }
    
    .section-contact-3 .btn {
      display: inline-block;
      font-weight: 500;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      user-select: none;
      padding: 0.375rem 0.75rem;
      font-size: 1rem;
      line-height: 1.5;
      border-radius: 0.25rem;
      cursor: pointer;
    }
    
    .section-contact-3 .form-check {
      position: relative;
      display: block;
      padding-left: 1.25rem;
      margin-bottom: 0.5rem;
    }
    
    /* Make sure contact and blog components take full width */
    section.section-blog-1,
    section.section-blog-2,
    section.section-blog-3,
    section.section-blog-5,
    section.section-contact-3 {
      width: 100vw;
      max-width: 100%;
      margin: 0;
      padding: 80px 20px;
      box-sizing: border-box;
      overflow-x: hidden;
    }
    
    /* Fix margin spacing for all blog articles */
    .card {
      height: 100%;
      margin-bottom: 2rem;
    }
    
    /* Better responsive behavior */
    @media (max-width: 768px) {
      .section-contact-3 .col-md-6 {
        flex: 0 0 100%;
        max-width: 100%;
      }
      
      .section-contact-3 form {
        margin-bottom: 3rem;
      }
    }
    
    /* Custom spacing for Contact1 elements */
    .section-contact-3 h4,
    .section-contact-3 h6 {
      margin-bottom: 1rem;
    }
    
    .section-contact-3 .ps-lg-6 {
      padding-left: 1.5rem;
    }
    
    @media (min-width: 992px) {
      .section-contact-3 .ps-lg-6 {
        padding-left: 4rem;
      }
    }
    
    .section-contact-3 .ms-8 {
      margin-left: 2rem;
    }
    
    /* Services2 specific styles */
    .section-team-1 {
      width: 100%;
      padding: 80px 0;
      box-sizing: border-box;
      position: relative;
      overflow: hidden;
    }
    
    .card-service {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    
    .icon-flip {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 70px;
      height: 70px;
      margin: 0 auto 20px;
    }
    
    .icon-shape {
      position: relative;
      overflow: hidden;
    }
    
    .icon-xxl {
      width: 70px;
      height: 70px;
    }
    
    .rounded-3 {
      border-radius: 0.5rem;
    }
    
    .shadow-1 {
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }
    
    .rounded-4 {
      border-radius: 1rem;
    }
    
    .mt-6 {
      margin-top: 2.5rem;
    }
    
    .p-2 {
      padding: 0.5rem;
    }
    
    .p-6 {
      padding: 1.5rem;
    }
    
    .hover-up {
      transition: all 0.3s ease;
    }
    
    .hover-up:hover {
      transform: translateY(-5px);
    }
    
    .mb-4 {
      margin-bottom: 1rem;
    }
    
    .mb-6 {
      margin-bottom: 1.5rem;
    }
    
    .me-5 {
      margin-right: 1.25rem;
    }
    
    .my-3 {
      margin-top: 0.75rem;
      margin-bottom: 0.75rem;
    }
    
    .bg-primary-soft {
      background-color: rgba(99, 66, 236, 0.1);
    }
    
    .bg-success-soft {
      background-color: rgba(40, 167, 69, 0.1);
    }
    
    .bg-warning-soft {
      background-color: rgba(255, 193, 7, 0.1);
    }
    
    .bg-info-soft {
      background-color: rgba(23, 162, 184, 0.1);
    }
    
    .bg-danger-soft {
      background-color: rgba(220, 53, 69, 0.1);
    }
    
    .bg-secondary-soft {
      background-color: rgba(108, 117, 125, 0.1);
    }
    
    .fill-primary-soft {
      fill: rgba(99, 66, 236, 0.1);
    }
    
    .btn-gradient {
      background: linear-gradient(90deg, #6342EC 0%, #BA3FDA 100%);
      color: white;
      border: none;
    }
    
    .btn-outline-secondary {
      color: #6c757d;
      border-color: #6c757d;
      background: transparent;
    }
    
    .gap-3 {
      gap: 1rem;
    }
    
    .stroke-white {
      stroke: white;
    }
    
    .stroke-dark {
      stroke: #111827;
    }
    
    .top-0 {
      top: 0;
    }
    
    .start-50 {
      left: 50%;
    }
    
    .translate-middle-x {
      transform: translateX(-50%);
    }
  `}</style>
);

export default function OtherPreview() {
  const [otherData, setOtherData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get query params for preview data
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const otherDataParam = searchParams.get("otherData");

    if (otherDataParam) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(otherDataParam));
        setOtherData(decodedData);
      } catch (error) {
        console.error("Error parsing other data:", error);
      }
    } else {
      // If no data passed, fetch from API
      fetchOtherData();
    }

    setIsLoading(false);

    // Notify parent that preview is ready
    if (window.parent) {
      window.parent.postMessage(
        { type: "PREVIEW_READY", message: "Other preview is ready" },
        "*"
      );
    }
  }, []);

  // Fetch other data from API
  const fetchOtherData = async () => {
    try {
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/other?t=${timestamp}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOtherData(data);
      } else {
        console.error("Error fetching other data:", await response.text());
      }
    } catch (error) {
      console.error("Error fetching other data:", error);
    }
  };

  // Render the appropriate component
  const renderOtherComponent = () => {
    if (!otherData) return <div>Yükleniyor...</div>;

    const activeComponent = otherData.activeOther || "blog1";

    
    switch(activeComponent) {
      case "blog1":
        return <Blog1 previewData={otherData} />;
      case "blog2":
        return <Blog2 previewData={otherData} />;
      case "blog3":
        return <Blog3 previewData={otherData} />;
      case "blog5":
        return <Blog5 previewData={otherData} />;
      case "services2":
        return <Services2 previewData={otherData} />;
      case "services3":
        return <Services3 previewData={otherData} />;
      case "services5":
        return <Services5 previewData={otherData} />;
      case "project2":
        return <Project2 previewData={otherData} />;
      case "team1":
        return <Team1 previewData={otherData} />;
      case "contact1":
        return <Contact1 previewData={otherData} />;
      case "content1":
        return <Content1 previewData={otherData} />;
      case "content2":
        return <Content2 previewData={otherData} />;
      case "content3":
        return <Content3 previewData={otherData} />;
      default:
        return <div>Unknown component type: {activeComponent}</div>;
    }
  };

  return (
    <>
      <CommonStyles />
      <Script
        id="notify-parent"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.onload = function() {
              if (window.parent) {
                window.parent.postMessage(
                  { type: "PREVIEW_UPDATED", message: "Other preview updated" },
                  "*"
                );
              }
            };
          `,
        }}
      />
      {isLoading ? <div>Yükleniyor...</div> : renderOtherComponent()}
    </>
  );
} 