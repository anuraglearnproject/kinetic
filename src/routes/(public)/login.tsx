import LoginForm from '@/features/public/LoginForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(public)/login')({
    component: LoginForm,
});