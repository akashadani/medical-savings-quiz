import type { Metadata } from 'next';
import { QuizProvider } from '@/lib/quizContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'Find Out How Much You\'re Leaving on the Table - BillRelief',
  description:
    'Most parents overpay on medical bills by $2,000-$15,000. Answer a few questions to discover your potential savings.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QuizProvider>{children}</QuizProvider>
      </body>
    </html>
  );
}
