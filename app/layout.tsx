import type {Metadata} from "next"
import {Inter} from "next/font/google"
import "./globals.css"

const inter = Inter({subsets: ["latin"]})

export const metadata: Metadata = {
    title: "Dependency Pinning Tool Using Semantic Versioning",
    description: "An online tool and helper to correctly pin your software dependencies, versions, packages, releases or modules using semantic versioning.",
}

export default function RootLayout({children,}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>{children}</body>
        </html>
    )
}
