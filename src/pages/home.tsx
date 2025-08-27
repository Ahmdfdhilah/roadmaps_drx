import Roadmap from "../components/roadmap"
import logo from '../assets/logo.png';

export function Home() {
    return (
        <main className="min-h-screen bg-background p-4 md:p-8 overflow-hidden">
            <div className="max-w-6xl mx-auto flex flex-col items-center">
                {/* Logo */}
                <img
                    src={logo}
                    alt="Logo"
                    className="w-50 lg:w-60"
                />

                {/* Judul */}
                <h1 className="text-primary text-4xl md:text-5xl font-extrabold text-center max-w-2xl leading-tight">
                    Roadmap
                </h1>

                <Roadmap />
            </div>
        </main>
    )
}

export default Home
