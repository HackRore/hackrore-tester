import { Github, Youtube, Mail, FileText, Phone, Shield, Cpu, Cloud } from "lucide-react"

export function SiteFooter() {
    return (
        <footer className="border-t border-white/5 bg-slate-950/50 backdrop-blur-xl mt-auto relative z-10">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

                    {/* Brand & Bio */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                <Shield className="h-5 w-5 text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                                HackRore's Tester Suite
                            </h3>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                            Certified IT Hardware Technician & Cyber Security Aspirant.
                            Specializing in diagnostics, OS deployment, and network security.
                            Securing the digital frontier, one packet at a time.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <a href="https://github.com/HackRore" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-900/50 border border-white/5 hover:bg-white/5 hover:text-blue-400 transition-colors">
                                <Github className="h-4 w-4" />
                            </a>
                            <a href="https://youtube.com/@CyberTechX_ravin" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-900/50 border border-white/5 hover:bg-white/5 hover:text-red-400 transition-colors">
                                <Youtube className="h-4 w-4" />
                            </a>
                            <a href="https://ravinwebtech.web.app/resources/resume/CS_HackRore_Resume.pdf" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-900/50 border border-white/5 hover:bg-white/5 hover:text-emerald-400 transition-colors">
                                <FileText className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Skills/Tags */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Core Competencies</h4>
                        <div className="flex flex-wrap gap-2">
                            {["Penetration Testing", "Hardware Diagnostics", "Network Defense", "Python Automation", "AWS Cloud", "Packet Analysis"].map((tech) => (
                                <span key={tech} className="px-3 py-1 rounded-full text-xs font-medium bg-slate-900/50 border border-white/5 text-slate-400 hover:border-blue-500/30 hover:text-blue-300 transition-colors cursor-default">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Contact</h4>
                        <div className="space-y-3">
                            <a href="mailto:HackRore@gmail.com" className="flex items-center gap-3 text-sm text-slate-400 hover:text-white transition-colors group">
                                <Mail className="h-4 w-4 text-blue-500/50 group-hover:text-blue-400" />
                                HackRore@gmail.com
                            </a>
                            <div className="flex items-center gap-3 text-sm text-slate-400 group">
                                <Phone className="h-4 w-4 text-emerald-500/50 group-hover:text-emerald-400" />
                                +91 9322026193
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-400 group">
                                <Cloud className="h-4 w-4 text-purple-500/50 group-hover:text-purple-400" />
                                Built with CyberTechX
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 font-mono">
                    <p>© 2026 HackRore's Tester Suite. All rights reserved.</p>
                    <p className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        System Operational
                    </p>
                </div>
            </div>
        </footer>
    )
}
