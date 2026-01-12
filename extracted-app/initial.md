# Requirements
## Summary
CollabSync Pro is an Industry-Academia Collaboration Portal connecting universities with corporate partners to co-develop R&D projects, manage intellectual property, and facilitate talent recruitment. The platform features AI-powered matchmaking to align academic research expertise with industry challenges, streamlines the collaboration lifecycle from proposal to commercialization, and includes milestone tracking, revenue-sharing models, and compliance frameworks. Key roles include University Researchers, Corporate Partners, and Platform Administrators who manage partnerships, projects, IP rights, and recruitment opportunities.

## Use cases
- **Project Discovery and Matchmaking**
  1) Corporate partner browses available university research projects or posts industry challenges
  2) AI-powered system suggests relevant matches based on expertise, past collaborations, and research areas
  3) Corporate partner reviews university profiles, research portfolios, and success metrics
  4) Corporate partner initiates collaboration request with project brief and budget range
  5) University receives notification and reviews partnership opportunity

- **Collaboration Proposal and Agreement**
  1) University and corporate partner negotiate project scope, deliverables, and timelines in shared workspace
  2) System generates draft agreement template with IP rights, revenue sharing, and milestone definitions
  3) Both parties review legal and compliance requirements
  4) Parties finalize and digitally sign the collaboration agreement
  5) Project is officially created with funding allocation and team assignments

- **Project Execution and Milestone Tracking**
  1) Project team accesses secure collaborative workspace with document sharing and communication tools
  2) Team members update project progress, upload deliverables, and log research findings
  3) System tracks milestones and sends automated reminders for upcoming deadlines
  4) Stakeholders monitor project health through dashboards showing budget utilization and timeline adherence
  5) IP disclosures are documented with automatic categorization and protection workflows

- **Talent Recruitment and Showcase**
  1) University highlights student talent and research contributions within project portfolios
  2) Corporate partner browses talent profiles filtered by skills, project involvement, and academic performance
  3) Corporate partner marks candidates of interest and requests interviews
  4) University facilitates introductions and tracks recruitment outcomes
  5) Successful placements are recorded for university metrics and partner satisfaction

- **IP Management and Commercialization**
  1) Research team files IP disclosure through platform with invention details and contributors
  2) System assigns IP ownership based on collaboration agreement terms
  3) Legal team reviews and initiates patent or licensing processes
  4) Platform tracks IP portfolio value and licensing opportunities
  5) Revenue from commercialization is distributed according to predefined sharing models

## Plan
### Project Discovery and Matchmaking
1. [x] Generate database schema with tables for universities, corporate_partners, research_projects, industry_challenges, collaboration_requests, expertise_areas, and matchmaking_scores with sample data
2. [x] Create main application shell with navigation sidebar including Dashboard, Projects, Partners, Matchmaking, and Profile sections
3. [x] Build project discovery page with filterable grid of research projects showing title, university, expertise areas, funding needs, and TRL level
4. [x] Implement industry challenges board where corporate partners can post problems with description, budget range, timeline, and required expertise
5. [x] Create AI matchmaking results view displaying scored matches between projects and challenges with compatibility percentage and reasoning
6. [x] Add research project detail modal showing full description, team members, past publications, success metrics, and collaboration history
7. [x] Build university profile cards with research strengths, available resources, past partnerships, and success rate statistics
8. [x] Implement collaboration request form allowing corporate partners to initiate partnership with project brief, budget, and timeline inputs
9. [x] Create notifications system showing pending collaboration requests for universities

### Collaboration Proposal and Agreement
1. [x] Build shared negotiation workspace with split view showing project scope editor and terms discussion thread
2. [x] Create agreement template generator that populates IP rights, revenue sharing percentages, milestone definitions, and compliance clauses based on partnership type
3. [x] Implement legal requirements checklist with university policies and corporate compliance frameworks
4. [] Add agreement review interface with version comparison and comment annotation features
5. [] Build digital signature workflow with approval status tracking for both parties
6. [] Create finalized project creation flow that captures funding allocation, team member assignments, and kickoff date
7. [] Generate automated project charter document with all agreed terms and stakeholder information

### Project Execution and Milestone Tracking
1. [x] Build secure project workspace with tabs for Overview, Documents, Team, Milestones, and IP Disclosures
2. [x] Create document repository with upload, version control, folder organization, and permission settings
3. [x] Implement project progress tracker with status updates timeline and activity feed
4. [x] Build milestone management interface with Gantt chart visualization, completion checkboxes, and deliverable uploads
5. [x] Create project dashboard showing KPIs: budget utilization percentage, timeline adherence, milestone completion rate, and team activity metrics
6. [x] Add automated reminder system that sends notifications 7 days and 1 day before milestone deadlines
7. [x] Implement IP disclosure form with fields for invention title, description, contributors, potential applications, and prior art references
8. [x] Create IP tracking table showing all disclosures with categorization, protection status, and assigned legal team member

### Talent Recruitment and Showcase
1. [x] Build student talent showcase page within university profiles displaying student cards with photos, skills, research involvement, and academic achievements
2. [x] Create talent filtering system with multi-select filters for technical skills, research areas, degree level, and availability
3. [x] Implement detailed student profile view showing project contributions, publications, presentations, and recommendation quotes
4. [x] Add candidate interest marking feature allowing corporate partners to save and organize potential recruits
5. [x] Build interview request workflow with scheduling integration and status tracking
6. [] Create recruitment pipeline dashboard for universities showing number of students showcased, interview requests, and successful placements
7. [] Implement recruitment outcome recording with hire date, position, and partner satisfaction rating

### IP Management and Commercialization
1. [x] Create comprehensive IP disclosure submission form with multi-step wizard capturing invention details, innovation description, contributors with percentage ownership, and commercial potential assessment
2. [x] Build IP ownership calculator that automatically assigns rights based on collaboration agreement terms and contributor roles
3. [x] Implement IP portfolio dashboard showing all registered IP with status categories: Disclosed, Under Review, Patent Pending, Patented, Licensed
4. [x] Create patent/licensing process tracker with workflow stages and assigned legal team responsibilities
5. [x] Add licensing opportunity marketplace where IP can be showcased to potential licensees with anonymized descriptions
6. [x] Build revenue distribution calculator showing commercialization income splits according to agreement terms
7. [x] Implement financial tracking for IP-related revenue with transaction history and payment status for all stakeholders
