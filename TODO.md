# ESLint Fixes TODO

## Critical Errors (Fix First)
- [ ] src/app/dashboard/(admin)/faculty/components/faculty-drawer.tsx: Replace `any` with proper type
- [ ] src/app/dashboard/(admin)/faculty/components/faculty-table.tsx: Replace `any` with proper type
- [ ] src/app/dashboard/(admin)/faculty/page.tsx: Replace `any` with proper type
- [ ] src/app/dashboard/(admin)/staff/components/staff-table.tsx: Replace `any` with proper type
- [ ] src/app/dashboard/(admin)/staff/page.tsx: Replace `any` with proper type
- [ ] src/app/dashboard/(admin)/students/components/students-table.tsx: Replace `any` with proper type
- [ ] src/app/dashboard/(admin)/students/page.tsx: Replace `any` with proper type
- [ ] src/app/dashboard/(faculty)/advisees/actions.ts: Replace `any` with proper type
- [ ] src/app/dashboard/(faculty)/advisees/components/advisees-table.tsx: Replace `any` with proper type
- [ ] src/app/dashboard/(faculty)/advisees/page.tsx: Replace `any` with proper type
- [ ] src/app/dashboard/(staff)/announcements/components/announcements-list.tsx: Add missing key prop
- [ ] src/app/dashboard/profile/actions.ts: Replace `any` with proper type, use const

## Warnings (Fix After Errors)
- [ ] src/app/(main)/layout.tsx: Remove unused 'Suspense'
- [ ] src/app/(main)/page.tsx: Remove unused 'SignIn', 'SignOut', 'user'
- [ ] src/app/dashboard/(admin)/faculty/actions.ts: Remove unused 'success'
- [ ] src/app/dashboard/(admin)/faculty/components/columns.tsx: Remove unused 'Link'
- [ ] src/app/dashboard/(admin)/staff/actions.ts: Remove unused 'success', 'da'
- [ ] src/app/dashboard/(admin)/students/components/columns.tsx: Remove unused 'Link'
- [ ] src/app/dashboard/(admin)/students/components/students-table.tsx: Remove unused icon imports
- [ ] src/app/dashboard/(faculty)/advisees/page.tsx: Remove unused 'LoadingState'
- [ ] src/app/dashboard/(staff)/announcements/components/announcements-list.tsx: Remove unused imports

## Verification
- [ ] Re-run ESLint to confirm all issues resolved
