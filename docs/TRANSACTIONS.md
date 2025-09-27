# Transactions Management System

## Overview
The transactions page provides comprehensive management of all platform deposits and withdrawals with a nested tab structure for efficient organization and filtering.

## Features

### Main Tab Structure
- **Deposits**: View and manage all deposit transactions
- **Withdrawals**: View and manage all withdrawal transactions

### Sub-Tab Structure (within each main tab)
- **Pending**: Transactions awaiting approval
- **Approved**: Successfully processed transactions
- **Rejected**: Declined transactions

### Transaction Statistics Cards
- **Pending Deposits**: Live count of pending deposit transactions
- **Pending Withdrawals**: Live count of pending withdrawal transactions  
- **Approved Today**: Count of transactions approved today
- **Rejected Today**: Count of transactions rejected today

### Data Table Features
- **Search**: Full-text search across transaction IDs
- **Sorting**: Click column headers to sort data
- **Pagination**: Configurable rows per page (10, 20, 30, 40, 50)
- **Row Selection**: Multi-select transactions for bulk actions
- **Filtering**: Filter by transaction status automatically based on active tab

### Transaction Actions
For pending transactions:
- **View Details**: Opens detailed transaction information
- **Approve**: Mark transaction as approved
- **Reject**: Mark transaction as rejected

### Data Display
- **Transaction ID**: Last 8 characters in uppercase
- **User**: User ID (last 8 characters in uppercase)
- **Amount**: Transaction amount with token symbol
- **Method**: Token type (USDT, BTC, ETH, etc.)
- **Date**: Formatted date and time
- **Reference**: Abbreviated wallet address (first 6 + last 4 characters)
- **Status**: Color-coded badges (Green=Approved, Orange=Pending, Red=Rejected)

## API Integration
- **Endpoint**: `/api/v1/deposits`
- **Authentication**: JWT token required
- **Response**: Array of transaction objects with metadata

## File Structure
```
app/dashboard/transactions/
├── page.tsx              # Main transactions page with nested tabs
├── demo-data.ts          # Sample data for testing
app/actions/
├── transactions.ts       # Server actions for data fetching
components/
├── transactions-data-table.tsx    # Data table component
├── transaction-stats-cards.tsx    # Statistics cards component
```

## Navigation
The transactions page is accessible via the sidebar navigation under "Transactions" with a credit card icon.

## Responsive Design
- Mobile-friendly responsive layout
- Collapsible sidebar on smaller screens
- Optimized table scrolling on mobile devices

## Color Theme
Consistent with the app's gold and black theme:
- Active tabs: Gold background (`app-gold-100`)
- Buttons: Gold hover states
- Cards: Dark gray background (`bg-gray-900`)
- Text: White primary text with muted secondary text