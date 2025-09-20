import { createReducer } from "@reduxjs/toolkit";
import { getFeatures, updateFeatures } from "../actions/featuresActions";

interface FeaturesState {
  features: any;
  loading: boolean;
  error: string | null;
  success?: boolean;
  message?: string;
}

const initialState: FeaturesState = {
  features: {
    activeFeature: "features1",
    features1: {
      badge: {
        visible: true,
        label: "Our Features",
        text: "",
        backgroundColor: "",
        labelTextColor: "#6342EC"
      },
      title: {
        part1: "1, we are creating a",
        part2: "Bright Future.",
        part3: "Join us.",
        part3TextColor: "#6342EC"
      },
      images: {
        img1: "/assets/imgs/features-1/img-1.png",
        img2: "/assets/imgs/features-1/img-2.png",
        img3: "/assets/imgs/features-1/img-3.png",
        bgEllipse: "/assets/imgs/features-1/bg-ellipse.png",
        starLg: "/assets/imgs/features-1/star-lg.png",
        starMd: "/assets/imgs/features-1/star-md.png",
        dots: "/assets/imgs/features-1/dots.png"
      },
      features: [
        {
          icon: "/assets/imgs/features-1/icon-1.svg",
          title: "Work organization",
          description: "A business consultant provides expert advice and guidance to businesses on various aspects.",
          backgroundColor: "",
          titleColor: "",
          descriptionColor: "",
          iconBackgroundColor: ""
        },
        {
          icon: "/assets/imgs/features-1/icon-2.svg",
          title: "Strategy Development",
          description: "Business consultants play a crucial role by offering expert advice and guidance to companies",
          backgroundColor: "",
          titleColor: "",
          descriptionColor: "",
          iconBackgroundColor: ""
        },
        {
          icon: "/assets/imgs/features-1/icon-3.svg",
          title: "Data analytics",
          description: "Consultants provide invaluable expertise to businesses, assisting them with strategic advice",
          backgroundColor: "",
          titleColor: "",
          descriptionColor: "",
          iconBackgroundColor: ""
        },
        {
          icon: "/assets/imgs/features-1/icon-4.svg",
          title: "Business Intelligence",
          description: "Through their deep understanding of industry trends and best practices, consultants empower organizations",
          backgroundColor: "",
          titleColor: "",
          descriptionColor: "",
          iconBackgroundColor: ""
        }
      ],
      videoId: "gXFATcwrO-U"
    },
    features4: {
      badge: {
        visible: true,
        label: "What we offers",
        backgroundColor: "",
        labelTextColor: "#6342EC",
        icon: "/assets/imgs/features-1/dots.png"
      },
      title: {
        part1: "Professional",
        part2: "UltraHD Video Conferencing",
        part3: "Platform",
        part2TextColor: ""
      },
      features: [
        {
          icon: "/assets/imgs/features-4/icon-1.svg",
          title: "Unified Communications",
          description: "Promptly solve urgent work issues! Create personal and group chats that allow for exchanging messages not only during conferences but also outside of them.",
          backgroundColor: "",
          titleColor: "",
          descriptionColor: "",
          iconColor: ""
        },
        {
          icon: "/assets/imgs/features-4/icon-2.svg",
          title: "Team Messenger",
          description: "Promptly solve urgent work issues! Create personal and group chats that allow for exchanging messages not only during conferences but also outside of them.",
          backgroundColor: "",
          titleColor: "",
          descriptionColor: "",
          iconColor: ""
        },
        {
          icon: "/assets/imgs/features-4/icon-3.svg",
          title: "Telephony and PBX",
          description: "Promptly solve urgent work issues! Create personal and group chats that allow for exchanging messages not only during conferences but also outside of them.",
          backgroundColor: "",
          titleColor: "",
          descriptionColor: "",
          iconColor: ""
        },
        {
          icon: "/assets/imgs/features-4/icon-4.svg",
          title: "Smart Meeting",
          description: "Promptly solve urgent work issues! Create personal and group chats that allow for exchanging messages not only during conferences but also outside of them.",
          backgroundColor: "",
          titleColor: "",
          descriptionColor: "",
          iconColor: ""
        }
      ],
      buttons: {
        primary: {
          visible: true,
          text: "Get Free Quote",
          link: "#",
          backgroundColor: "",
          textColor: "#FFFFFF",
          iconColor: "#FFFFFF"
        },
        secondary: {
          visible: true,
          text: "How We Work",
          link: "#",
          textColor: ""
        }
      },
      backgroundColor: ""
    },
    features5: {
      title: "Innovative Solutions for Modern Business",
      titleColor: "",
      description: "",
      descriptionColor: "",
      backgroundColor: "",
      sections: [
        {
          id: "section1",
          visible: true,
          position: 1,
          image: "/assets/imgs/features-5/img-1.png",
          imagePosition: "left",
          backgroundColor: "",
          title: {
            part1: "All that's necessary for",
            part2: "effective team effort.",
            part3: "Join us.",
            part2Color: "",
            part3Color: "#6342EC"
          },
          description: "Provide your team with top-tier group mentoring programs and exceptional professional benefits.",
          descriptionColor: ""
        },
        {
          id: "section2",
          visible: true,
          position: 2,
          image: "/assets/imgs/features-5/img-2.png",
          imagePosition: "right",
          backgroundColor: "",
          title: {
            part1: "Experience the",
            part2: "cutting-edge",
            part3: "capabilities",
            part2Color: ""
          },
          description: "Provide your team with top-tier group mentoring programs and exceptional professional benefits.",
          descriptionColor: ""
        }
      ]
    },
    features8: {
      title: "Core values",
      description: "We break down barriers so teams can focus on what matters – working together to create products their customers love.",
      values: [
        {
          title: "Customers First",
          description: "Our company exists to help merchants sell more. We make every decision and measure every outcome based on how well it serves our customers.",
          icon: "/assets/imgs/features-2/tick.svg"
        },
        {
          title: "Think Big",
          description: "Our company exists to help merchants sell more. We make every decision and measure every outcome based on how well it serves our customers.",
          icon: "/assets/imgs/features-2/tick.svg"
        },
        {
          title: "Make a Difference",
          description: "Our company exists to help merchants sell more. We make every decision and measure every outcome based on how well it serves our customers.",
          icon: "/assets/imgs/features-2/tick.svg"
        },
        {
          title: "Act With Integrity",
          description: "Our company exists to help merchants sell more. We make every decision and measure every outcome based on how well it serves our customers.",
          icon: "/assets/imgs/features-2/tick.svg"
        },
        {
          title: "Do the right thing",
          description: "Our company exists to help merchants sell more. We make every decision and measure every outcome based on how well it serves our customers.",
          icon: "/assets/imgs/features-2/tick.svg"
        },
        {
          title: "Stronger united",
          description: "Our company exists to help merchants sell more. We make every decision and measure every outcome based on how well it serves our customers.",
          icon: "/assets/imgs/features-2/tick.svg"
        }
      ],
      starIcon: "/assets/imgs/features-8/icon-star.svg",
      backgroundColor: "",
      titleColor: "#FFFFFF",
      descriptionColor: "#FFFFFF",
      valuesTitleColor: "#FFFFFF",
      valuesDescriptionColor: "#FFFFFF"
    },
    features10: {
      backgroundColor: "",
      backgroundImage: "/assets/imgs/feature-10/bg-line.png",
      features: [
        {
          icon: "/assets/imgs/features-1/icon-1.svg",
          title: "Best Solutions",
          description: "delivering exceptional results and Innovation solutons maximizing your success.",
          backgroundColor: "",
          titleColor: "",
          descriptionColor: "",
          iconBackgroundColor: ""
        },
        {
          icon: "/assets/imgs/features-1/icon-2.svg",
          title: "Secure payment",
          description: "We ensure your transactions are safe with advanced encryption and secure payment options.",
          backgroundColor: "",
          titleColor: "",
          descriptionColor: "",
          iconBackgroundColor: ""
        },
        {
          icon: "/assets/imgs/features-1/icon-3.svg",
          title: "Save Money",
          description: "Enjoy competitive pricing, exclusive discounts, promotions to maximize your savings.",
          backgroundColor: "",
          titleColor: "",
          descriptionColor: "",
          iconBackgroundColor: ""
        },
        {
          icon: "/assets/imgs/features-1/icon-4.svg",
          title: "Quick Support",
          description: "Our dedicated support team offers prompt assistance through live chat, email, and phone.",
          backgroundColor: "",
          titleColor: "",
          descriptionColor: "",
          iconBackgroundColor: ""
        }
      ]
    }
  },
  loading: false,
  error: null,
};

// Helper function to handle features5 section updates
const handleFeatures5Update = (state: FeaturesState, payload: any) => {
  
  // If direct backgroundColor update
  if (payload.features5.backgroundColor !== undefined) {
    state.features.features5.backgroundColor = payload.features5.backgroundColor;
  }
  
  // Handle title updates
  if (payload.features5.title !== undefined) {
    state.features.features5.title = payload.features5.title;
  }
  
  if (payload.features5.titleColor !== undefined) {
    state.features.features5.titleColor = payload.features5.titleColor;
  }
  
  // Handle description updates
  if (payload.features5.description !== undefined) {
    state.features.features5.description = payload.features5.description;
  }
  
  if (payload.features5.descriptionColor !== undefined) {
    state.features.features5.descriptionColor = payload.features5.descriptionColor;
  }
  
  // Handle sections operations
  if (payload.features5.sections) {
    const sections = payload.features5.sections;
    
    // Handle special operation object format
    if (sections.operation) {
      const { operation, section, sectionId, order } = sections;
            
      // Different operations based on the operation type
      switch (operation) {
        case 'add':
          if (section) {
            const newSection = {
              ...section,
              id: `section${Date.now()}`,
              position: state.features.features5.sections.length + 1,
              visible: true
            };
            state.features.features5.sections.push(newSection);
          }
          break;
          
        case 'update':
          if (section && section.id) {
            const index = state.features.features5.sections.findIndex(
              (s: any) => s.id === section.id
            );
            if (index !== -1) {
              // Update only the provided properties
              state.features.features5.sections[index] = {
                ...state.features.features5.sections[index],
                ...section
              };
            }
          }
          break;
          
        case 'remove':
          if (sectionId) {
            state.features.features5.sections = state.features.features5.sections.filter(
              (s: any) => s.id !== sectionId
            );
          }
          break;
          
        case 'reorder':
          if (order && Array.isArray(order)) {
            // Reorder sections based on the provided order
            const newSections: any[] = [];
            order.forEach((id, index) => {
              const section = state.features.features5.sections.find((s: any) => s.id === id);
              if (section) {
                newSections.push({
                  ...section,
                  position: index + 1
                });
              }
            });
            state.features.features5.sections = newSections;
          }
          break;
      }
    } 
    // Direct array update
    else if (Array.isArray(sections)) {
      state.features.features5.sections = sections;
    }
  }
  
  return state;
};

export const featuresReducer = createReducer(initialState, (builder) => {
  builder
    // Get Features
    .addCase(getFeatures.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getFeatures.fulfilled, (state, action) => {
      state.loading = false;
      state.features = action.payload;
      state.error = null;
    })
    .addCase(getFeatures.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    
    // Update Features
    .addCase(updateFeatures.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateFeatures.fulfilled, (state, action) => {
      
      // Handle features5 specific updates
      if (action.payload?.features5) {
        handleFeatures5Update(state, action.payload);
      } else {
        // For other features or complete payload replacements
        state.features = action.payload;
      }
      
      state.loading = false;
      state.success = true;
      state.message = "Features başarıyla güncellendi";
      state.error = null;
    })
    .addCase(updateFeatures.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.success = false;
    });
});

export default featuresReducer; 