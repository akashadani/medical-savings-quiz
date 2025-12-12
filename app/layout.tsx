import type { Metadata } from 'next';
import { QuizProvider } from '@/lib/quizContext';
import LogRocketInit from '@/components/LogRocketInit';
import FacebookPixelInit from '@/components/FacebookPixelInit';
import GoogleTagInit from '@/components/GoogleTagInit';
import './globals.css';

export const metadata: Metadata = {
  title: 'Find Out How Much You\'re Leaving on the Table - Baby Bill Relief',
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
        <GoogleTagInit />
        <LogRocketInit />
        <FacebookPixelInit />
        <QuizProvider>{children}</QuizProvider>
      </body>
    </html>
  );
}
