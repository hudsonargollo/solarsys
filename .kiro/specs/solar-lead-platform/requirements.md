# Requirements Document

## Introduction

SolarSys is a next-generation solar lead acquisition platform designed specifically for the Brazilian market. The system replaces traditional CRM-based lead capture with a streamlined, visually-engaging web application that qualifies leads through an intelligent screening process before handoff to sales teams via WhatsApp. The platform must comply with Lei 14.300 regulations and provide transparent, trust-building user experiences through minimalist line art design.

## Glossary

- **SolarSys**: The complete solar lead acquisition platform
- **Simulador**: The multi-step wizard component for lead qualification
- **Lei 14.300**: Brazilian legal framework for distributed generation that affects solar ROI calculations
- **HSP**: Heliometric Index - solar irradiation measurement used for system sizing
- **Custo de Disponibilidade**: Minimum electricity bill floor based on connection type
- **RLS**: Row Level Security - Supabase database security mechanism
- **CEP**: Brazilian postal code format (99999-999)
- **Connection_Type**: Electrical connection classification (Monofásico, Bifásico, Trifásico)
- **BrasilAPI**: External service for Brazilian address lookup via CEP

## Requirements

### Requirement 1

**User Story:** As a potential solar customer, I want to quickly assess my solar viability through an engaging visual interface, so that I can understand if solar energy is right for my home without technical complexity.

#### Acceptance Criteria

1. WHEN a user visits the landing page THEN the SolarSys SHALL display a minimalist line art interface with peach and green color scheme
2. WHEN a user enters the simulador THEN the SolarSys SHALL guide them through location, consumption, and technical fit steps in Brazilian Portuguese
3. WHEN a user provides their CEP THEN the SolarSys SHALL validate the format and fetch address details using BrasilAPI
4. WHEN a user inputs their electricity bill value THEN the SolarSys SHALL calculate estimated system size using HSP data for their location
5. WHEN displaying visual elements THEN the SolarSys SHALL use isometric line art with animated SVG path drawing effects

### Requirement 2

**User Story:** As a solar business owner, I want to automatically qualify leads based on Lei 14.300 regulations, so that my sales team only receives viable prospects.

#### Acceptance Criteria

1. WHEN a user has a monthly bill below R$ 150 THEN the SolarSys SHALL disqualify the lead with appropriate messaging
2. WHEN a user has a monofásico connection with bill below R$ 250 THEN the SolarSys SHALL display viability warnings
3. WHEN a user selects fibrocimento roof type THEN the SolarSys SHALL flag for additional installation costs
4. WHEN a user selects shaded roof conditions THEN the SolarSys SHALL disqualify the lead as physically impossible
5. WHEN calculating system size THEN the SolarSys SHALL apply the formula: Monthly kWh / (HSP × 30 × 0.80)

### Requirement 3

**User Story:** As a potential customer, I want my personal information to be secure while still receiving personalized results, so that I can trust the platform with my data.

#### Acceptance Criteria

1. WHEN a user submits lead information THEN the SolarSys SHALL store data in Supabase with Row Level Security enabled
2. WHEN an anonymous user accesses the database THEN the SolarSys SHALL only allow INSERT operations for new leads
3. WHEN a user views their results THEN the SolarSys SHALL only display data associated with their session ID
4. WHEN storing lead data THEN the SolarSys SHALL include session tracking for attribution and security
5. WHEN handling user sessions THEN the SolarSys SHALL generate unique session IDs stored in localStorage

### Requirement 4

**User Story:** As a sales representative, I want qualified leads delivered via WhatsApp with complete context, so that I can immediately provide relevant information without re-qualifying.

#### Acceptance Criteria

1. WHEN a qualified lead completes the simulador THEN the SolarSys SHALL generate a pre-formatted WhatsApp message with lead details
2. WHEN constructing the WhatsApp message THEN the SolarSys SHALL include name, bill value, roof type, and estimated system size
3. WHEN a user clicks the WhatsApp button THEN the SolarSys SHALL open WhatsApp with the pre-filled message
4. WHEN tracking lead progression THEN the SolarSys SHALL update lead status from 'new' to 'whatsapp_clicked'
5. WHEN formatting the WhatsApp message THEN the SolarSys SHALL use proper line breaks and Brazilian Portuguese labels

### Requirement 5

**User Story:** As a user, I want the interface to feel responsive and engaging through smooth animations, so that the technical process feels approachable and trustworthy.

#### Acceptance Criteria

1. WHEN entering each simulador step THEN the SolarSys SHALL animate SVG illustrations using path drawing effects
2. WHEN transitioning between pages THEN the SolarSys SHALL use slide animations with easeOutCirc timing
3. WHEN hovering over interactive elements THEN the SolarSys SHALL provide physics-based feedback with lift and shadow effects
4. WHEN displaying the energy flow THEN the SolarSys SHALL animate dashed lines in peach color to represent electricity movement
5. WHEN loading illustrations THEN the SolarSys SHALL stagger animations: house structure first, then panels, then sun rays

### Requirement 6

**User Story:** As a business owner, I want to view and manage leads through a simple dashboard, so that I can track the effectiveness of my marketing campaigns.

#### Acceptance Criteria

1. WHEN accessing the admin panel THEN the SolarSys SHALL require Supabase authentication
2. WHEN viewing the leads dashboard THEN the SolarSys SHALL display leads in a table format with key metrics
3. WHEN filtering leads THEN the SolarSys SHALL allow sorting by status, bill value, and creation date
4. WHEN tracking attribution THEN the SolarSys SHALL capture and display UTM parameters from marketing campaigns
5. WHEN managing lead status THEN the SolarSys SHALL allow updating status values through the interface

### Requirement 7

**User Story:** As a developer, I want the application to be fully localized for Brazil, so that users have a native experience while maintaining code standards.

#### Acceptance Criteria

1. WHEN displaying user interface elements THEN the SolarSys SHALL use Brazilian Portuguese for all labels, buttons, and messages
2. WHEN defining URL routes THEN the SolarSys SHALL use Portuguese paths like /simulador and /resultado
3. WHEN writing code THEN the SolarSys SHALL maintain English variable names and function names for industry standards
4. WHEN formatting currency THEN the SolarSys SHALL use Brazilian Real (R$) with comma decimal separators
5. WHEN validating phone numbers THEN the SolarSys SHALL accept Brazilian format with DDD area codes

### Requirement 8

**User Story:** As a system administrator, I want the application to be deployed on edge infrastructure, so that users across Brazil experience fast loading times.

#### Acceptance Criteria

1. WHEN deploying the application THEN the SolarSys SHALL use Cloudflare Pages for global edge distribution
2. WHEN serving static assets THEN the SolarSys SHALL cache illustrations and animations at edge locations
3. WHEN handling dynamic operations THEN the SolarSys SHALL use Cloudflare Functions for API proxying
4. WHEN connecting to the database THEN the SolarSys SHALL use direct Supabase client connections from the frontend
5. WHEN building the application THEN the SolarSys SHALL optimize bundle size for fast initial page loads