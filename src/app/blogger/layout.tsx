import BloggerSidebar from '@/components/blogger/Sidebar'
import Header from '@/components/admin/Header'

export default function BloggerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <BloggerSidebar />
      <Header />
      <main className="ml-64 pt-16">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
