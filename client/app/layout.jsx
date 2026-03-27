import ThemeRegistry from '@/theme/ThemeRegistry';
import { AuthProvider } from '@/store/AuthContext';

export const metadata = {
  title: 'BuildMyRide',
  description: 'Build and customize your dream car in 3D or modify car photos with AI',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
