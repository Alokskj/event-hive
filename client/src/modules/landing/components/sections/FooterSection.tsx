import React from 'react';
import { Link } from 'react-router';

const footerLinks = {
    Product: [
        { label: 'Features', href: '#features' },
        { label: 'How it works', href: '#how-it-works' },
        { label: 'Pricing', href: '/#pricing' },
        { label: 'Status', href: '/#status' },
    ],
    Resources: [
        { label: 'Docs', href: '/#docs' },
        { label: 'API', href: '/#api' },
        { label: 'Community', href: '/#community' },
        { label: 'Blog', href: '/#blog' },
    ],
    Company: [
        { label: 'About', href: '/#about' },
        { label: 'Careers', href: '/#careers' },
        { label: 'Contact', href: '/#contact' },
        { label: 'Press', href: '/#press' },
    ],
} as const;

const FooterSection = () => (
    <footer className="border-t mt-12">
        <div className="container py-16">
            <div className="grid gap-10 md:grid-cols-5">
                <div className="md:col-span-2 space-y-4">
                    <Link
                        to="/"
                        className="font-bold text-lg bg-gradient-to-r from-primary to-fuchsia-500 bg-clip-text text-transparent"
                    >
                        EventHive
                    </Link>
                    <p className="text-xs md:text-sm text-muted-foreground max-w-xs">
                        All-in-one platform for discovering, hosting & analyzing
                        unforgettable events.
                    </p>
                </div>
                {Object.entries(footerLinks).map(([title, links]) => (
                    <div key={title} className="space-y-3">
                        <h4 className="text-sm font-semibold">{title}</h4>
                        <ul className="space-y-2 text-xs md:text-sm">
                            {links.map((l) => (
                                <li key={l.label}>
                                    <Link
                                        to={l.href}
                                        className="text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-4 border-t pt-6 text-[11px] md:text-xs text-muted-foreground">
                <p>
                    &copy; {new Date().getFullYear()} EventHive. All rights
                    reserved.
                </p>
                <div className="flex gap-4">
                    <Link to="/#privacy" className="hover:text-primary">
                        Privacy
                    </Link>
                    <Link to="/#terms" className="hover:text-primary">
                        Terms
                    </Link>
                    <Link to="/#" className="hover:text-primary">
                        Security
                    </Link>
                </div>
            </div>
        </div>
    </footer>
);

export default FooterSection;
