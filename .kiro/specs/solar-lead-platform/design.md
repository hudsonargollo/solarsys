# SolarSys Design Document

## Overview

SolarSys is a modern, edge-first web application that transforms solar lead acquisition through visual storytelling and intelligent qualification. The system employs a "Graphics First" philosophy, using minimalist line art and smooth animations to guide users through a multi-step qualification process. Built on Cloudflare Pages with Supabase backend, the platform delivers sub-second performance across Brazil while maintaining strict data security through Row Level Security.

The core innovation lies in the seamless integration of Brazilian regulatory logic (Lei 14.300) with an engaging user interface that reduces cognitive load and builds trust through transparency. The system automatically qualifies leads based on consumption patterns, connection types, and roof characteristics before facilitating handoff to sales teams via pre-formatted WhatsApp messages.

## Architecture

### High-Level System Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Cloudflare    │    │   React SPA      │    │   Supabase      │
│   Pages + CDN   │◄──►│   (Frontend)     │◄──►│   PostgreSQL    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Edge Functions  │    │ Framer Motion    │    │ Row Level       │
│ (API Proxying)  │    │ (Animations)     │    │ Security (RLS)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │
         ▼
┌─────────────────┐
│   BrasilAPI     │
│ (CEP Lookup)    │
└─────────────────┘
```

### Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Library**: Shadcn UI components with Tailwind CSS
- **Animation**: Framer Motion for SVG animations and page transitions
- **State Management**: Zustand for global state and React Hook Form for form handling
- **Deployment**: Cloudflare Pages with automatic CI/CD
- **Backend**: Supabase (PostgreSQL with built-in auth and real-time features)
- **Edge Computing**: Cloudflare Functions for API proxying and dynamic logic

### Deployment Architecture

The application follows a serverless, edge-first architecture:

1. **Static Assets**: React SPA bundled and distributed via Cloudflare's global CDN
2. **Dynamic Logic**: Cloudflare Functions handle API proxying (BrasilAPI) and PDF generation
3. **Database**: Direct client-to-database connections using Supabase client with RLS security
4. **Authentication**: Supabase Auth for admin access, anonymous sessions for public users
5. **Domain**: Production deployment at `solarsys.clubemkt.digital`

## Components and Interfaces

### Core Components

#### 1. Simulador (Multi-Step Wizard)
```typescript
interface SimuladorState {
  currentStep: number;
  leadData: LeadData;
  sessionId: string;
  isValid: boolean;
}

interface LeadData {
  zipCode: string;
  city: string;
  state: string;
  billValue: number;
  connectionType: 'mono' | 'bi' | 'tri';
  roofType: 'clay' | 'metal' | 'fiber' | 'slab';
  name: string;
  whatsapp: string;
  email: string;
}
```

#### 2. Qualification Engine
```typescript
interface QualificationResult {
  isQualified: boolean;
  disqualificationReason?: string;
  warnings: string[];
  systemSizeKwp: number;
  estimatedSavings: number;
  packageType: 'small' | 'medium' | 'large';
}

interface QualificationEngine {
  qualify(leadData: LeadData): QualificationResult;
  calculateSystemSize(billValue: number, hsp: number): number;
  getHSP(state: string): number;
}
```

#### 3. Animation System
```typescript
interface AnimationConfig {
  pathDrawing: {
    duration: number;
    stagger: number;
    easing: string;
  };
  pageTransitions: {
    enter: MotionProps;
    exit: MotionProps;
  };
  microInteractions: {
    hover: MotionProps;
    tap: MotionProps;
  };
}
```

### External Integrations

#### BrasilAPI Integration
```typescript
interface AddressLookup {
  cep: string;
  city: string;
  state: string;
  district: string;
}

interface BrasilAPIService {
  lookupAddress(cep: string): Promise<AddressLookup>;
}
```

#### WhatsApp Integration
```typescript
interface WhatsAppMessage {
  phone: string;
  text: string;
  url: string;
}

interface WhatsAppService {
  generateMessage(leadData: LeadData, qualification: QualificationResult): WhatsAppMessage;
}
```

## Data Models

### Database Schema

#### Leads Table
```sql
CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  status text DEFAULT 'new' CHECK (status IN ('new', 'qualified', 'whatsapp_clicked', 'contacted')),
  name text NOT NULL,
  whatsapp text NOT NULL,
  email text,
  zip_code text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  bill_value numeric NOT NULL,
  connection_type text NOT NULL CHECK (connection_type IN ('mono', 'bi', 'tri')),
  roof_type text NOT NULL CHECK (roof_type IN ('clay', 'metal', 'fiber', 'slab')),
  system_size_kwp numeric,
  est_savings numeric,
  session_id uuid NOT NULL,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  disqualification_reason text,
  warnings text[]
);
```

#### HSP Reference Table
```sql
CREATE TABLE public.hsp_data (
  state text PRIMARY KEY,
  hsp_value numeric NOT NULL,
  region text NOT NULL
);
```

### Row Level Security Policies

```sql
-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert leads
CREATE POLICY "Allow public insert" ON leads
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow users to read only their own session data
CREATE POLICY "Allow session-based read" ON leads
  FOR SELECT TO anon
  USING (session_id::text = current_setting('request.headers', true)::json->>'x-session-id');

-- Allow authenticated users (admin) to read all
CREATE POLICY "Allow admin read all" ON leads
  FOR SELECT TO authenticated
  USING (true);
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

<function_calls>
<invoke name="prework">
<parameter name="featureName">solar-lead-platform

### Property Reflection

After reviewing all properties identified in the prework analysis, several areas of redundancy have been identified:

**Redundant Properties:**
- Properties 4.1 and 4.2 both test WhatsApp message content - these can be combined into a single comprehensive property
- Properties 3.1 and 3.4 both test data storage with session tracking - these overlap significantly
- Properties 5.1 and 5.5 both test SVG animations - the staggered animation property encompasses the basic animation property

**Consolidated Properties:**
- WhatsApp message generation properties combined into one comprehensive test
- Data storage properties merged to test both security and session tracking together
- Animation properties consolidated to focus on the most comprehensive behaviors

Property 1: Simulador step progression and localization
*For any* user progressing through the simulador, all step labels, buttons, and messages should be displayed in Brazilian Portuguese and steps should be presented in the correct sequence (location → consumption → technical fit → contact)
**Validates: Requirements 1.2**

Property 2: CEP validation and address lookup
*For any* valid Brazilian CEP format (99999-999), the system should accept the input and successfully fetch address details, while rejecting invalid formats
**Validates: Requirements 1.3**

Property 3: System size calculation accuracy
*For any* valid bill value and location, the calculated system size should equal: Monthly kWh / (HSP × 30 × 0.80) where HSP is determined by the user's state
**Validates: Requirements 1.4, 2.5**

Property 4: SVG animation behavior
*For any* simulador step with illustrations, SVG elements should animate with path drawing effects and proper staggering (house structure first, then panels, then sun rays)
**Validates: Requirements 1.5, 5.1, 5.5**

Property 5: Lead qualification rules
*For any* user with monofásico connection and bill below R$ 250, the system should display viability warnings while still allowing progression
**Validates: Requirements 2.2**

Property 6: Secure data storage with session isolation
*For any* submitted lead data, the system should store it in Supabase with RLS enabled and include a unique session ID, ensuring users can only access their own session data
**Validates: Requirements 3.1, 3.3, 3.4**

Property 7: Anonymous database permissions
*For any* anonymous user, the system should allow INSERT operations for new leads but prevent SELECT operations on other users' data
**Validates: Requirements 3.2**

Property 8: Session management
*For any* user session, the system should generate a unique session ID and store it in localStorage for the duration of the session
**Validates: Requirements 3.5**

Property 9: WhatsApp message generation
*For any* qualified lead, the generated WhatsApp message should include name, bill value, roof type, and estimated system size with proper Brazilian Portuguese labels and line breaks
**Validates: Requirements 4.1, 4.2, 4.5**

Property 10: WhatsApp URL generation
*For any* user clicking the WhatsApp button, the system should generate a valid WhatsApp URL with the pre-filled message content
**Validates: Requirements 4.3**

Property 11: Lead status tracking
*For any* user interaction with the WhatsApp button, the system should update the lead status from 'new' to 'whatsapp_clicked' in the database
**Validates: Requirements 4.4**

Property 12: Page transition animations
*For any* page navigation, the system should use slide animations with easeOutCirc timing function
**Validates: Requirements 5.2**

Property 13: Interactive element feedback
*For any* hoverable interactive element, the system should provide physics-based feedback with lift and shadow effects on hover
**Validates: Requirements 5.3**

Property 14: Admin authentication
*For any* attempt to access the admin panel, the system should require valid Supabase authentication
**Validates: Requirements 6.1**

Property 15: Dashboard lead display
*For any* authenticated admin user, the dashboard should display all leads in a table format with key metrics (name, bill value, status, creation date)
**Validates: Requirements 6.2**

Property 16: Lead filtering and sorting
*For any* admin user on the dashboard, the system should allow sorting leads by status, bill value, and creation date
**Validates: Requirements 6.3**

Property 17: UTM parameter tracking
*For any* user arriving with UTM parameters in the URL, the system should capture and store these parameters with the lead data
**Validates: Requirements 6.4**

Property 18: Admin status management
*For any* admin user, the system should allow updating lead status values through the dashboard interface
**Validates: Requirements 6.5**

Property 19: Interface localization
*For any* user-facing interface element, all text should be displayed in Brazilian Portuguese
**Validates: Requirements 7.1**

Property 20: Currency formatting
*For any* currency value displayed, the system should use Brazilian Real (R$) format with comma decimal separators
**Validates: Requirements 7.4**

Property 21: Phone number validation
*For any* phone number input, the system should accept valid Brazilian format with DDD area codes and reject invalid formats
**Validates: Requirements 7.5**

## Error Handling

### Input Validation Errors
- **Invalid CEP Format**: Display localized error message "CEP deve ter o formato 99999-999"
- **Invalid Phone Number**: Display "Número deve incluir DDD (ex: 11999999999)"
- **Empty Required Fields**: Highlight field with red border and show "Campo obrigatório"

### API Integration Errors
- **BrasilAPI Timeout**: Fallback to manual city/state selection with message "Não foi possível localizar automaticamente. Selecione manualmente."
- **Supabase Connection Error**: Display "Erro de conexão. Tente novamente em alguns instantes."

### Business Logic Errors
- **Disqualified Leads**: Show empathetic message "Solar pode não ser viável para seu perfil atual. Entre em contato para outras opções."
- **Calculation Errors**: Log error and show generic message "Erro no cálculo. Nossa equipe foi notificada."

### Security Errors
- **RLS Policy Violation**: Log security event and return generic error to prevent information disclosure
- **Session Timeout**: Clear localStorage and redirect to start of simulador

## Testing Strategy

### Dual Testing Approach

The SolarSys platform will employ both unit testing and property-based testing to ensure comprehensive coverage:

**Unit Tests** will verify:
- Specific examples of business logic (e.g., exact qualification scenarios)
- Integration points between components
- Error handling for known edge cases
- UI component rendering with specific props

**Property-Based Tests** will verify:
- Universal properties that should hold across all inputs
- Mathematical calculations with random valid inputs
- Security policies with various user scenarios
- Animation behaviors across different screen sizes

### Property-Based Testing Framework

**Framework**: Fast-check for TypeScript/JavaScript property-based testing
**Configuration**: Minimum 100 iterations per property test to ensure statistical confidence
**Tagging**: Each property-based test must include a comment with the format: `**Feature: solar-lead-platform, Property {number}: {property_text}**`

### Testing Implementation Requirements

1. **Single Property Implementation**: Each correctness property must be implemented by exactly one property-based test
2. **Requirement Traceability**: Each test must reference the specific requirement it validates using the format: `**Validates: Requirements X.Y**`
3. **Generator Strategy**: Write intelligent generators that constrain inputs to valid ranges (e.g., CEP format, Brazilian phone numbers, valid bill amounts)
4. **Real Data Testing**: Avoid mocks where possible to test actual functionality
5. **Performance Boundaries**: Property tests should complete within reasonable time limits even with 100+ iterations

### Test Categories

#### Core Business Logic Tests
- Lead qualification algorithm with various bill amounts and connection types
- System size calculations across different Brazilian states (HSP variations)
- WhatsApp message formatting with different lead data combinations

#### Security and Data Integrity Tests
- RLS policy enforcement with different session scenarios
- Session ID uniqueness and persistence
- Anonymous user permission boundaries

#### UI and Animation Tests
- SVG path animation properties across different illustration types
- Page transition consistency across different routes
- Responsive behavior across various screen sizes

#### Integration Tests
- BrasilAPI integration with various CEP formats
- Supabase client operations with different data payloads
- End-to-end simulador flow with realistic user journeys