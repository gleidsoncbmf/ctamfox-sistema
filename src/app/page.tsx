import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, Trophy, Users, Wallet } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navigation */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <Link className="flex items-center justify-center font-bold text-xl tracking-tight" href="#">
          <Trophy className="h-6 w-6 mr-2 text-red-600" />
          DOJO<span className="text-red-600">MANAGER</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium hover:text-red-600 transition-colors" href="/login">
            Entrar
          </Link>
          <Link href="/register">
            <Button className="bg-red-600 hover:bg-red-700 text-white">Começar Agora</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-extrabold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Domine a Gestão da sua <span className="text-red-600">Academia</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  A plataforma definitiva para eficiência e controle. Gerencie alunos, finanças e turmas com a precisão de um faixa preta.
                </p>
              </div>
              <div className="space-x-4 pt-4">
                <Link href="/register">
                  <Button size="lg" className="h-12 px-8 text-lg bg-red-600 hover:bg-red-700">
                    Teste Grátis <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg" className="h-12 px-8 text-lg">
                    Demo ao Vivo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Recursos de Impacto</h2>
              <p className="mt-4 text-gray-500 md:text-xl">Tudo o que você precisa para administrar um dojo de sucesso.</p>
            </div>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center p-6 rounded-lg border bg-gray-50 hover:shadow-lg transition-shadow">
                <div className="p-3 bg-red-100 rounded-full">
                  <Users className="h-10 w-10 text-red-600" />
                </div>
                <h3 className="text-xl font-bold">Gestão de Alunos</h3>
                <p className="text-gray-500">Acompanhe frequências, graduações e detalhes dos alunos em um local seguro.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center p-6 rounded-lg border bg-gray-50 hover:shadow-lg transition-shadow">
                <div className="p-3 bg-red-100 rounded-full">
                  <Wallet className="h-10 w-10 text-red-600" />
                </div>
                <h3 className="text-xl font-bold">Controle Financeiro</h3>
                <p className="text-gray-500">Monitore pagamentos, identifique atrasos instantaneamente e mantenha seu fluxo de caixa saudável.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center p-6 rounded-lg border bg-gray-50 hover:shadow-lg transition-shadow">
                <div className="p-3 bg-red-100 rounded-full">
                  <CheckCircle2 className="h-10 w-10 text-red-600" />
                </div>
                <h3 className="text-xl font-bold">Agendamento de Turmas</h3>
                <p className="text-gray-500">Organize modalidades, professores e horários de forma eficiente.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-900 text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Pronto para Evoluir seu Dojo?
              </h2>
              <p className="mx-auto max-w-[600px] text-gray-400 md:text-xl">
                Junte-se a centenas de escolas de artes marciais que estão otimizando suas operações hoje.
              </p>
              <Link href="/register">
                <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white mt-4">
                  Começar Agora
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">© 2026 DojoManager. Todos os direitos reservados.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">Termos de Serviço</Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">Privacidade</Link>
        </nav>
      </footer>
    </div>
  )
}
