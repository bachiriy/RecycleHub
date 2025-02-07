# RecycleHub

## Project Overview

RecycleHub is a modern web application designed to streamline recycling collection processes by connecting individuals with certified waste collectors.

## Features

### User Management
- User registration and authentication
- Profile management
- Account deletion

### Waste Collection
- Submit recycling collection requests
- Select waste types (plastic, glass, paper, metal)
- Upload waste photos (optional)
- Specify collection address and preferred time slot
- Manage multiple collection requests

### Collector Functionality
- View available collection requests
- Filter requests by city
- Accept, process, and validate collection requests
- Verify waste type and weight
- Take collection photos

### Rewards System
Point allocation based on waste type:
- Plastic: 2 points/kg
- Verre: 1 point/kg
- Paper: 1 point/kg
- Metal: 5 points/kg

Point redemption options:
- 100 points = 50 Dh voucher
- 200 points = 120 Dh voucher
- 500 points = 350 Dh voucher

## Technical Stack

- Framework: Angular 17+
- State Management: NgRx
- Reactive Programming: RxJS/Observables
- Styling: Bootstrap or Tailwind
- Forms: Reactive Forms or Template Driven Forms

## Key Technical Competencies

- Frontend interface development
- State management
- Responsive design
- Dependency injection
- Data validation
- Routing
- Component architecture

## Project Setup

### Prerequisites
- Node.js (v18+)
- Angular CLI 17+

### Installation Steps
```bash
# Clone the repository
git clone https://github.com/bachiriy/RecycleHub.git
cd app  

# Install dependencies
npm i

# Start development server
ng serve

```

### Configuration
1. Ensure `environment.ts` is configured
2. Set up local storage for pre-registered collectors
3. Configure point system parameters

### Angular 17 Specific Notes
- Use standalone components or NgModules
- Leverage built-in control flow
- Utilize new `@defer` directive for lazy loading

## Evaluation Criteria

- Complete frontend implementation
- Clean, structured code
- Responsive and ergonomic interface
- Correct NgRx state management
- Rigorous data validation
- Error handling
- Overall code and project quality

## Deployment

TBD (To be determined during development)

