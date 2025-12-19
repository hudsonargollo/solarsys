# Implementation Plan

- [x] 1. Set up project foundation and design system
  - Initialize Cloudflare Pages project with Vite + React + TypeScript
  - Configure Tailwind CSS with SolarSys color tokens (peach #FF9E80, green #2E7D32)
  - Install and configure Shadcn UI components
  - Set up Framer Motion for animations
  - Create basic project structure with localized routes (/simulador, /resultado, /painel)
  - _Requirements: 8.1, 7.2_

- [x] 1.1 Write property test for interface localization
  - **Property 19: Interface localization**
  - **Validates: Requirements 7.1**

- [x] 2. Create visual design system and SVG illustrations
  - Design isometric line art SVG components (house, panels, sun, inverter)
  - Implement SVG path drawing animations with Framer Motion
  - Create reusable animation components for path drawing effects
  - Build responsive layout system with minimalist aesthetic
  - _Requirements: 1.1, 1.5, 5.1_

- [x] 2.1 Write property test for SVG animation behavior
  - **Property 4: SVG animation behavior**
  - **Validates: Requirements 1.5, 5.1, 5.5**

- [x] 2.2 Write property test for page transition animations
  - **Property 12: Page transition animations**
  - **Validates: Requirements 5.2**

- [x] 2.3 Write property test for interactive element feedback
  - **Property 13: Interactive element feedback**
  - **Validates: Requirements 5.3**

- [x] 3. Implement Supabase backend and security
  - Set up Supabase project and configure PostgreSQL database
  - Create leads table with proper schema and constraints
  - Create HSP reference data table for Brazilian states
  - Implement Row Level Security (RLS) policies for anonymous and authenticated users
  - Configure Supabase client for direct frontend connections
  - _Requirements: 3.1, 3.2, 3.3_

- [x] 3.1 Write property test for secure data storage with session isolation
  - **Property 6: Secure data storage with session isolation**
  - **Validates: Requirements 3.1, 3.3, 3.4**

- [x] 3.2 Write property test for anonymous database permissions
  - **Property 7: Anonymous database permissions**
  - **Validates: Requirements 3.2**

- [x] 3.3 Write property test for session management
  - **Property 8: Session management**
  - **Validates: Requirements 3.5**

- [x] 4. Build core simulador state management
  - Implement Zustand store for global simulador state
  - Create session ID generation and localStorage persistence
  - Build form validation with React Hook Form
  - Implement step navigation and progress tracking
  - _Requirements: 1.2, 3.5_

- [x] 4.1 Write property test for simulador step progression and localization
  - **Property 1: Simulador step progression and localization**
  - **Validates: Requirements 1.2**

- [x] 5. Implement CEP validation and address lookup
  - Create BrasilAPI integration service
  - Build CEP input component with format validation (99999-999)
  - Implement Cloudflare Function for API proxying
  - Add error handling for API timeouts and invalid responses
  - _Requirements: 1.3_

- [x] 5.1 Write property test for CEP validation and address lookup
  - **Property 2: CEP validation and address lookup**
  - **Validates: Requirements 1.3**

- [x] 6. Build lead qualification engine
  - Implement system size calculation algorithm using HSP data
  - Create qualification rules based on Lei 14.300 regulations
  - Build disqualification logic for low bills and unsuitable roofs
  - Add warning system for edge cases (monofásico + low bills)
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 6.1 Write property test for system size calculation accuracy
  - **Property 3: System size calculation accuracy**
  - **Validates: Requirements 1.4, 2.5**

- [x] 6.2 Write property test for lead qualification rules



  - **Property 5: Lead qualification rules**
  - **Validates: Requirements 2.2**

- [x] 7. Implement WhatsApp integration
  - Create WhatsApp message generation service
  - Build dynamic URL construction with lead data
  - Implement click tracking and status updates
  - Add proper Brazilian Portuguese message formatting
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 7.1 Write property test for WhatsApp message generation
  - **Property 9: WhatsApp message generation**
  - **Validates: Requirements 4.1, 4.2, 4.5**

- [x] 7.2 Write property test for WhatsApp URL generation





  - **Property 10: WhatsApp URL generation**
  - **Validates: Requirements 4.3**

- [x] 7.3 Write property test for lead status tracking









  - **Property 11: Lead status tracking**
  - **Validates: Requirements 4.4**



- [x] 8. Create simulador step form components



  - Build location step form with CEP input and address display
  - Implement consumption step with bill value input and connection type selector
  - Build technical fit step with roof type selector
  - Create contact information capture form with validation
  - Integrate forms with simulador state management
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 9. Build results and handoff page

  - Create results display with system recommendations and qualification results
  - Implement savings calculations and visualizations using WhatsApp service
  - Build WhatsApp handoff button with pre-filled message generation
  - Add session-based data retrieval for personalized results from database
  - Integrate with qualification engine for lead processing and status updates
  - Handle disqualified leads with appropriate messaging
  - _Requirements: 4.1, 4.3, 2.1, 2.2, 2.3, 2.4_

- [x] 9.1 Implement UTM parameter tracking



  - Add UTM parameter capture from URL query parameters
  - Store UTM data with lead information in database
  - Ensure UTM tracking works across page navigation
  - _Requirements: 6.4_

- [x] 10. Checkpoint - Ensure all core functionality tests pass


  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Implement admin dashboard


  - Create Supabase authentication for admin access with login/logout
  - Build leads table component with data fetching from getAllLeads
  - Implement filtering and sorting capabilities for leads table
  - Add UTM parameter capture and display in lead details
  - Create lead status management interface with updateLeadStatus integration
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 11.1 Write property test for admin authentication


  - **Property 14: Admin authentication**
  - **Validates: Requirements 6.1**

- [x] 11.2 Write property test for dashboard lead display


  - **Property 15: Dashboard lead display**
  - **Validates: Requirements 6.2**

- [x] 11.3 Write property test for lead filtering and sorting


  - **Property 16: Lead filtering and sorting**
  - **Validates: Requirements 6.3**

- [x] 11.4 Write property test for UTM parameter tracking

  - **Property 17: UTM parameter tracking**
  - **Validates: Requirements 6.4**

- [x] 11.5 Write property test for admin status management


  - **Property 18: Admin status management**
  - **Validates: Requirements 6.5**

- [x] 12. Enhance localization and formatting



  - Review and complete Brazilian Portuguese translations for all UI text
  - Implement Brazilian currency formatting in results page (R$ with comma separators)
  - Create phone number validation component for Brazilian format with DDD
  - Ensure all user-facing content uses proper Portuguese (already partially implemented)
  - _Requirements: 7.1, 7.4, 7.5_

- [x] 12.1 Write property test for currency formatting


  - **Property 20: Currency formatting**
  - **Validates: Requirements 7.4**

- [x] 12.2 Write property test for phone number validation


  - **Property 21: Phone number validation**
  - **Validates: Requirements 7.5**

- [x] 13. Add comprehensive error handling and edge cases


  - Implement comprehensive input validation with localized error messages in forms
  - Add API error handling with user-friendly fallbacks for BrasilAPI and Supabase
  - Create business logic error handling for disqualified leads in results page
  - Implement security error handling for RLS violations and session timeouts
  - Add loading states and error boundaries for better UX
  - _Requirements: All error scenarios from design document_

- [x] 14. Performance optimization and deployment preparation


  - Optimize bundle size for fast loading with code splitting
  - Configure production environment variables for Supabase
  - Set up build optimization for Cloudflare Pages deployment
  - Implement lazy loading for non-critical components
  - Add performance monitoring and error tracking setup
  - _Requirements: 8.1, 8.2_

- [x] 15. Final checkpoint - Complete system testing



  - Ensure all tests pass, ask the user if questions arise.