import type { Metadata } from 'next';
import './globals.css';
import { RoleProvider } from '@/context/RoleContext';
import { ChatProvider } from '@/context/ChatContext';
import { ScopeBanner } from '@/components/layout/ScopeBanner';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { FloatingChatbot } from '@/components/chatbot/FloatingChatbot';

export const metadata: Metadata = {
  title: 'LANDGOV PUNE — AI-Powered Land Governance Platform',
  description: 'National Digital Platform for Research, Policy Innovation, and Evidence-Based Land Governance (SIH26019 Prototype: Pune District)',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
        <RoleProvider>
          <ChatProvider>
            <ScopeBanner />
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
              <Sidebar />
              <main className="flex-1 overflow-y-auto min-h-[calc(100vh-6.5rem)] bg-slate-50/70 p-4 sm:p-6 lg:p-8">
                {children}
              </main>
            </div>
            <FloatingChatbot />
          </ChatProvider>
        </RoleProvider>
      </body>
    </html>
  );
}