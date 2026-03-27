import Link from "next/link";
import { Terminal, Sparkles, Bot, ArrowRight, FileJson, CheckCircle } from "lucide-react";

export default function GetStarted() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">

      <div className="mb-12 text-center">
        <div className="text-xs font-mono text-violet-400 mb-4">FRED Protocol</div>
        <h1 className="text-4xl font-bold text-zinc-50 mb-4">How do you want to implement FRED?</h1>
        <p className="text-lg text-zinc-400">Pick the option that fits your situation. All three produce the same result: a valid <code className="text-violet-400 font-mono text-base">fred.json</code>.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-5 mb-16">

        {/* Developer */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-7 flex flex-col">
          <Terminal className="text-zinc-400 mb-5" size={28} />
          <h2 className="text-xl font-semibold text-zinc-100 mb-2">Developer</h2>
          <p className="text-sm text-zinc-400 mb-6 leading-relaxed flex-1">
            Add fred.json to your project directly. Full control over every field. Best for teams who want to version-control their FRED file alongside code.
          </p>
          <div className="space-y-2 mb-6">
            {["Read the spec (5 min)", "Create fred.json in your project", "Validate with our tool", "Deploy to /.well-known/fred.json"].map((step, i) => (
              <div key={step} className="flex items-center gap-2 text-sm text-zinc-400">
                <span className="font-mono text-xs text-zinc-600 w-4">{i + 1}.</span>
                {step}
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Link
              href="https://github.com/bboxfred/fred-protocol/blob/main/fred-spec.md"
              target="_blank"
              className="flex items-center justify-between w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              Read the spec <ArrowRight size={14} />
            </Link>
            <Link
              href="/validate"
              className="flex items-center justify-between w-full border border-zinc-700 hover:border-zinc-500 text-zinc-300 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              Validate your JSON <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Non-Technical — highlighted */}
        <div className="bg-zinc-900 border-2 border-violet-700/60 rounded-xl p-7 flex flex-col relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-xs font-medium px-3 py-1 rounded-full">
            Recommended · No code needed
          </div>
          <Sparkles className="text-violet-400 mb-5" size={28} />
          <h2 className="text-xl font-semibold text-zinc-100 mb-2">Non-Technical</h2>
          <p className="text-sm text-zinc-400 mb-6 leading-relaxed flex-1">
            Fill in a form. We generate and host your fred.json for free on our servers. No FTP, no code editor, no terminal. Just answer 5 questions.
          </p>
          <div className="space-y-2 mb-6">
            {["Fill in 5 fields (2 minutes)", "We generate your fred.json", "Verify via email", "Goes live instantly at hungryhuman.co/fredprotocol/f/yourdomain"].map((step, i) => (
              <div key={step} className="flex items-center gap-2 text-sm text-zinc-400">
                <span className="font-mono text-xs text-violet-500 w-4">{i + 1}.</span>
                {step}
              </div>
            ))}
          </div>
          <Link
            href="/claim"
            className="flex items-center justify-between w-full bg-violet-600 hover:bg-violet-500 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
          >
            Claim my FRED → <ArrowRight size={14} />
          </Link>
          <p className="text-xs text-zinc-500 text-center mt-3">100% free. No account required. Apache 2.0.</p>
        </div>

        {/* Claude Code */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-7 flex flex-col">
          <Bot className="text-zinc-400 mb-5" size={28} />
          <h2 className="text-xl font-semibold text-zinc-100 mb-2">Claude Code</h2>
          <p className="text-sm text-zinc-400 mb-6 leading-relaxed flex-1">
            Install the FRED skill once as a Claude Code plugin. From then on, every time you deploy a project, Claude will detect it and offer to add fred.json automatically.
          </p>
          <div className="space-y-2 mb-6">
            {["Install plugin (one command)", "Works with any framework", "Auto-detects deployments", "No manual steps ever again"].map((step, i) => (
              <div key={step} className="flex items-center gap-2 text-sm text-zinc-400">
                <span className="font-mono text-xs text-zinc-600 w-4">{i + 1}.</span>
                {step}
              </div>
            ))}
          </div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 font-mono text-xs text-zinc-400 mb-3">
            <div className="text-zinc-600 mb-1"># One-time install</div>
            <div>git clone github.com/freddylim/</div>
            <div>fred-protocol</div>
            <div>cp -r fred-protocol/claude-skill \</div>
            <div className="text-violet-400 ml-2">~/.claude/plugins/fred-protocol</div>
          </div>
          <Link
            href="https://github.com/bboxfred/fred-protocol/tree/main/claude-skill"
            target="_blank"
            className="flex items-center justify-between w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            View on GitHub <ArrowRight size={14} />
          </Link>
        </div>

      </div>

      {/* Claude Code deep-dive */}
      <section className="mb-16">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Bot className="text-violet-400" size={24} />
            <h2 className="text-xl font-semibold text-zinc-100">How the Claude Code auto-detection works</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-sm text-zinc-300 leading-relaxed mb-4">
                The FRED plugin uses a <strong className="text-zinc-100">PostToolUse hook</strong> — a built-in Claude Code feature
                that fires after every terminal command. The hook watches for deployment-related commands.
              </p>
              <p className="text-sm text-zinc-300 leading-relaxed mb-4">
                When it detects a deploy, it checks if the project already has a <code className="text-violet-400 font-mono text-xs">fred.json</code>.
                If not, Claude will offer to create one based on your project. You approve or skip — nothing happens automatically.
              </p>

              <div className="text-xs font-medium text-zinc-500 mb-3 mt-6">Commands that trigger auto-detection:</div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "vercel deploy",
                  "vercel --prod",
                  "git push",
                  "netlify deploy",
                  "npm publish",
                  "npx create-next-app",
                ].map((cmd) => (
                  <div key={cmd} className="flex items-center gap-2 text-xs">
                    <CheckCircle size={11} className="text-emerald-500 shrink-0" />
                    <code className="font-mono text-zinc-400">{cmd}</code>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-medium text-zinc-500 mb-3">What happens step by step:</div>
              <div className="space-y-3">
                {[
                  { step: "You deploy", desc: "Run `vercel deploy`, `git push`, or any supported command in Claude Code." },
                  { step: "Hook fires", desc: "The PostToolUse hook detects the deployment command and scans your project." },
                  { step: "Checks for fred.json", desc: "Looks in .well-known/fred.json, public/fred.json, and root fred.json." },
                  { step: "Claude suggests", desc: "If missing, injects a context message. Claude offers to generate one for you." },
                  { step: "You approve", desc: "Review the generated fred.json. Accept, edit, or skip. You're always in control." },
                ].map(({ step, desc }, i) => (
                  <div key={step} className="flex gap-3">
                    <div className="shrink-0 w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                      <span className="text-xs font-mono text-zinc-400">{i + 1}</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-zinc-200">{step}</div>
                      <div className="text-xs text-zinc-500 leading-relaxed">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Developer quick-start */}
      <section className="mb-16">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <FileJson className="text-violet-400" size={24} />
            <h2 className="text-xl font-semibold text-zinc-100">Developer quick-start</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-medium text-zinc-300 mb-3">Minimal fred.json (Level 1)</h3>
              <p className="text-xs text-zinc-500 mb-3">This is all you need. 4 fields. Takes 30 seconds.</p>
              <pre className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-xs font-mono text-zinc-300 overflow-x-auto leading-relaxed">
{`{
  "fred": "0.1",
  "identity": {
    "name": "Your Name",
    "type": "product",
    "description": "What you do",
    "url": "https://yourdomain.com"
  }
}`}
              </pre>
            </div>

            <div>
              <h3 className="text-sm font-medium text-zinc-300 mb-3">Where to place it</h3>
              <div className="space-y-3">
                {[
                  { framework: "Next.js", path: "public/.well-known/fred.json" },
                  { framework: "Vite / React", path: "public/.well-known/fred.json" },
                  { framework: "Static site", path: ".well-known/fred.json" },
                  { framework: "Express / API", path: "Serve at GET /.well-known/fred.json" },
                  { framework: "Any platform", path: "Anywhere → we host it for you at /claim" },
                ].map(({ framework, path }) => (
                  <div key={framework} className="flex items-start gap-3 text-sm">
                    <span className="text-zinc-500 shrink-0 w-28 font-mono text-xs">{framework}</span>
                    <code className="text-zinc-300 font-mono text-xs">{path}</code>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-medium text-zinc-300 mb-2">Validate it</h3>
                <p className="text-xs text-zinc-500 mb-2">Paste your JSON into our validator to check conformance level and catch errors.</p>
                <Link href="/validate" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
                  Open validator →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conformance levels */}
      <section className="mb-16">
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">Conformance levels</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              level: "L1",
              name: "Basic",
              color: "text-zinc-400 border-zinc-700 bg-zinc-900",
              desc: "Identity only. Name, type, description, URL. Enough to be discovered.",
              fields: "fred + identity",
            },
            {
              level: "L2",
              name: "Interactive",
              color: "text-blue-300 border-blue-800/60 bg-blue-950/20",
              desc: "Adds capabilities and interaction protocols. Agents can now do things.",
              fields: "+ capabilities + interaction.protocols",
            },
            {
              level: "L3",
              name: "Complete",
              color: "text-violet-300 border-violet-800/60 bg-violet-950/20",
              desc: "Trust verification and agent policy. Full production readiness.",
              fields: "+ trust.verification + policy.agent_policy",
            },
          ].map(({ level, name, color, desc, fields }) => (
            <div key={level} className={`border rounded-xl p-5 ${color}`}>
              <div className="font-mono font-bold text-2xl mb-1">{level}</div>
              <div className="font-medium text-sm mb-2">{name}</div>
              <p className="text-xs leading-relaxed opacity-70 mb-3">{desc}</p>
              <div className="font-mono text-xs opacity-50">{fields}</div>
            </div>
          ))}
        </div>
      </section>

      <p className="text-center text-sm text-zinc-500">
        Not sure which to pick? Start with the middle option.{" "}
        <Link href="/litepaper" className="text-zinc-400 hover:text-zinc-200 transition-colors underline underline-offset-2">
          Read the litepaper first
        </Link>{" "}
        if you want more context.
      </p>

    </div>
  );
}
