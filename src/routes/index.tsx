import SignupForm from '@/features/public/SignupForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: SignupForm,
});
